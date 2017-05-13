var socialminer = socialminer || {};

/**
 * This class provides a wrapper around the SocialMiner customer-side chat REST APIs.
 */
socialminer.chat = function(lineContact,socialMinerBaseUrl, chatFeedRefUrl)
{
    var request = require('request');
    var parseString = require('xml2js').parseString;

    var contact, cookie, chatUrl, feedRefUrl, go = false, pollHandle = null, lastEventId = 0, eventListeners = [];
    var messages = [];
    var messageCount = 0;
    var eventStatus = null;

    chatUrl = socialMinerBaseUrl + "/ccp/chat/";
    feedRefUrl = chatFeedRefUrl;
    contact = lineContact;

    /**
     * Process the set of chat events carried in the given eventXmlStr
     *
     * @param eventXmlStr string containing the set of XML chat events
     */
    processPoll = function (eventXmlStr)
    {
        //console.log("processPoll",eventXmlStr)
        var i, chatEvents, eventId, event, events = [];
        parseString(eventXmlStr, {trim: true, explicitArray : true},function (err, result) {
            //console.dir(result)
            chatEvents = result.chatEvents;
            for (var key in chatEvents) {
                //console.log('key->',key)
                if (chatEvents.hasOwnProperty(key)) {
                    for ( i = 0 ; i < chatEvents[key].length ; i++ )
                    {
                        event = chatEvents[key][i];
                        event.type = key;
                        //console.log(" event type -> " + event.type);
                        //console.log(" event id -> " + event.id);
                        //console.log(" event body -> " + event.body);
                        events.push(event);
                        eventId = parseInt(event.id);
                        if (event.status) eventStatus = event.status
                        if ( event.body )
                        {
                            event.body = socialminer.utils.decodeString(event.body[0]);
                        }
                        if (eventId > lastEventId)
                        {
                            lastEventId = eventId;
                        }
                    }
                }
            }
            
            //console.log('envents',eventId, events)
            processEvents(events);
            notify(events);
        })
    },

    /**
     * Notify all event listeners of the given set of events.
     *
     * @param events the list of events to notify listeners of.
     */
    notify = function(events)
    {
        var i;
        if (events.length > 0)
        {
            console.log("Notify Events: " + JSON.stringify(events));
            for (i = 0; i < eventListeners.length; i++)
            {
                eventListeners[i](events ,me);
            }
        }
    },

    /**
     * Poll for new events every 5 seconds.
     */
    poll = function ()
    {
        console.log('poll', eventStatus, chatUrl+ "?eventid=" + lastEventId,feedRefUrl)
        
        request.get({
            url: chatUrl + "?eventid=" + lastEventId,
            headers: {
                'Cookie' : cookie
            }
        },function(error, response, body){
            if (error) {
                // retried 4 times.
                console.log(error)
                notify(
                [{
                    id: lastEventId + 1,
                    type: "StatusEvent",
                    status: "chat_finished_error",
                    detail: "Server connection temporarily lost. Please try again later."
                }]);
            } else {
                //console.log(body);
                processPoll(body);
                if (go == true)
                {
                    pollHandle = setTimeout(function() { poll(); }, 5000);
                }
            }

        });
    };

    processEvents = function(events)
    {
        var i, endChat;
        for ( i = 0 ; i < events.length ; i++ )
        {
            //console.log("Processing event" + JSON.stringify(events[i]));

            if ( events[i].type == "StatusEvent" )
            {
                endChat = processStatusEvent(events[i]);
            }
            else if ( events[i].type == "PresenceEvent" )
            {
                endChat = processPresenceEvent(events[i]);
            }
            else if ( events[i].type == "MessageEvent" )
            {
                processMessageEvent(events[i]);
            }

            if ( endChat == true )
            {
                stopPolling();
                break;
            }
        }
    }

    processStatusEvent = function(event)
    {
        var endChat = false;

        if ( event.status == "chat_ok" )
        {
            console.log("Chatting with " + event.from);
        }
        else if ( event.status == "chat_issue" )
        {
            console.log(event.detail);
        }
        else if ( event.status == "chat_request_rejected_by_agent" )
        {
            console.log("Sorry, all customer care representatives are busy. Please try back at a later time.");
        }
        else if ( event.status == "chat_timedout_waiting_for_agent" )
        {
            console.log("All customer care representatives are busy assisting other clients. Please continue to wait or try again later.");
        }
        else
        {
            console.log(event.detail);
            endChat = true;
        }

        return endChat;
    };

    processPresenceEvent = function (event)
    {
        var endChat = false;
        if ( event.status == "joined" )
        {
            console.log("Chatting with " + event.from);
            for (var i = 0; i < messages.length; i++)
            {
                sendMessage(messages[i]);
            }
            messages.splice(0,messages.length)
        }
        else if ( event.status == "left" )
        {
            console.log(event.from + " has left");
            endChat = messageCount == 0;
        }

        return endChat;
    }

    processMessageEvent = function (event)
    {
        var messageId;
        if ( event.body != "" )
        {
            messageId = "message" + messageCount++;
            //console.log(messageId,event.body)
            /*
            $("#messages").append(
                            "<a id=\"" + messageId + "\" href=\"#\" class=\"list-group-item\">" +
                            "<h5 class=\"list-group-item-heading\">" + event.from + "</h5>" +
                            "<p class=\"list-group-item-text\">" + socialminer.utils.trim(event.body) + "</p>" +
                            "</a>");
            $("#" + messageId)[0].scrollIntoView();
            */
        }
    }  

    sendMessage = function(message) {
        request.put({
            url: chatUrl,
            body: '<Message>' +
                    '<body>' + message + '</body>' +
                '</Message>',
            headers: {
                'Content-Type': 'application/xml',
                'Cookie' : cookie
            }
        }, function(error, response, body){
            if (error) {
                // retried 4 times.
            }
            if (!error) {
                console.log(body);
            }
        });
    }

    /**
     * Stop polling for events.
    */
    stopPolling = function ()
    {
        go = false;
        eventStatus = null;
        if ( pollHandle != null )
        {
            clearTimeout(pollHandle);
            pollHandle = null;
        }
    }

    var me = {
        contact : contact,
        initiate: function (success, error)
        {
            var i, contactXml;
            console.log("initiate",contact, chatUrl,contactXml)

            contactXml = "<SocialContact>";
            contactXml += "<feedRefURL>" + feedRefUrl + "</feedRefURL>";
            contactXml += "<author>" + contact.author + "</author>";
            contactXml += "<title>" + contact.title + "</title>";
            contactXml += "<extensionFields>";
            for (i = 0; i < contact.extensionFields.length; i++)
            {
                if ((contact.extensionFields[i].value && (contact.extensionFields[i].value.length > 0)))
                {
                    contactXml += "<extensionField><name>" + contact.extensionFields[i].name + "</name><value>" + contact.extensionFields[i].value + "</value></extensionField>";
                }
            }
            contactXml += "</extensionFields>";
            contactXml += "</SocialContact>";
            //console.log("initiate",chatUrl,contactXml)
            request.post({
                url: chatUrl,
                body : contactXml,
                headers: {'Content-Type': 'application/xml'}
            },
            function (err, response, body) {
                //console.log('statusCode', response.statusCode);
                if (err) {
                    error.call(this,me, err, response, body);
                } else {
                    cookie = response.headers['set-cookie'].join("; ");
                    success.call(this,me, err, response, body);
                }
            });
        },

        addMessage : function (message) {
            if (eventStatus == 'joined') {
                sendMessage(message)
            } else {
                messages.push(message)
            }
        },

        /**
         * Listen for chat events.
         *
         * @param callback a callback function that takes an array as a parameter. This array will contain combinations
         * of the following objects:
         *   { type: StatusEvent, id: eventId, status: chat_finished_error|chat_issue|chat_ok, detail: eventDetails }
         *   { type: PresenceEvent, id: eventId, from: user, status: joined|left }
         *   { type: MessageEvent, id: eventId, from: user, body: messageText }
         */
        addEventListener: function (callback)
        {
            eventListeners[eventListeners.length] = callback;
        },

        startPolling: function ()
        {
            go = true;
            poll();
        },

        /**
         * Stop polling for events.
         */
        stopPolling: stopPolling
    }
    return me;
}

socialminer.utils = socialminer.utils || {};

/**
 * Log the given message to the console if the console is defined
 */
socialminer.utils.log = function(message)
{
    if ( console && console.log )
    {
        console.log(message);
    }
}

/**
 * Decode a string carried in a MessageEvent body field.
 *
 * @param str the string to be decoded
 * @returns the decoded string
 */
socialminer.utils.decodeString = function(str)
{
    str = decodeURIComponent(str.replace(/\+/g,  " "));
    str = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\'/g,'&#x27;').replace(/\//g,'&#x2f;');

    return str;
}

/**
 * This method ensures that the output String has only
 * valid XML unicode characters as specified by the
 * XML 1.0 standard. For reference, please see
 * <a href="http://www.w3.org/TR/xml/#charsets">the
 * standard</a>. This method will return an empty
 * String if the input is null or empty.
 *
 * @param in The String whose non-valid characters we want to remove.
 * @return The in String, stripped of non-valid characters.
 */
socialminer.utils.stripNonValidXMLCharacters = function(text)
{
    var out = []; // Used to hold the output.
    if (!text  || text === '')
        return '';

    for ( var i = 0; i < text.length; i++) {
        var current = text.charCodeAt(i);
        if ((current == 0x9) ||
            (current == 0xA) ||
            (current == 0xD) ||
            ((current >= 0x20) && (current <= 0xD7FF)) ||
            ((current >= 0xE000) && (current <= 0xFFFD)) ||
            ((current >= 0x10000) && (current <= 0x10FFFF)))
            out.push(text.charAt(i));
    }
    return out.join("");
}

/**
 * Returns true if the given string is blank; false otherwise
 */
socialminer.utils.isBlank = function(s)
{
    return !s || (s.replace(/\s/g, '').length === 0);
}

/**
 * trim leading and trailing spaces from the given string.
 */
socialminer.utils.trim = function(s)
{
    if ( !s )
    {
        return "";
    }

    return s.replace(/^\s+|\s+$/g, '');
}

exports.Chat = socialminer.chat