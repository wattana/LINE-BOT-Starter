/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('LineChat.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    init: function() {
        var me = this;
        console.log('init controller')
        var socketUrl = null;
        if (Ext.manifest['env']=='development') {
            socketUrl = "localhost:3000"
        }
        var socket = io(socketUrl);
        this.socket = socket;
        socket.on('newroom', function (data) {
            console.log("newroom",data);
            socket.emit('my other event', { my: 'data' });
            me.addChatRoom(data)
        });
        socket.on('message', function (data) {
            console.log('message', data);
            me.addMessage(data)
        });
        socket.on('contactMessage', function (data) {
            console.log('contact message', data);
            me.addContactMessage(data)
        });
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    onRoomItemClick : function ( view , record , item , index , e , eOpts )  {

    },

    talkingWith: function (view, record, item, index, e, options) {
        if (e && e.getTarget('div.x-delete-btn')) return;
        var roomInfo = this.getView().getReferences().roomInfoForm;
        var sendMessageForm = this.getReferences().sendMessageForm;

        console.log(record)
        roomInfo.loadRecord(record);
        roomInfo.down("image[name=picture]").setSrc(record.get("pictureUrl")+"/small");
        sendMessageForm.down("button[action=sendMessage]").show()
        sendMessageForm.down("button[action=sendContactMessage]").hide()
        
        var grid = this.getView().down('messagechat')
        grid.getStore().getProxy().setExtraParam("contactId", null)
        grid.getStore().getProxy().setExtraParam("roomId", record.get('id'))
        grid.getStore().load({
            callback: function (records, operation, success) {
                //if (grid.getStore().getCount() > 0) grid.view.bufferedRenderer.scrollTo(grid.getStore().getCount());
                grid.getStore().suspendAutoSync();
                Ext.each(records, function (record) {
                    if (record.get("readFlag") == '0') record.set("readFlag", '1')
                })
                grid.getStore().sync();
                grid.getStore().resumeAutoSync();
            }
        })
        
    },

    contactTalkingWith: function (view, record, item, index, e, options) {
        if (e && e.getTarget('div.x-delete-btn')) return;
        var roomInfo = this.getView().getReferences().roomInfoForm;
        var sendMessageForm = this.getReferences().sendMessageForm;

        console.log('contactTalkingWith',record)
        roomInfo.loadRecord(record);
        roomInfo.down("image[name=picture]").setSrc(null);
        sendMessageForm.down("button[action=sendMessage]").hide()
        sendMessageForm.down("button[action=sendContactMessage]").show()

        
        var grid = this.getView().down('messagechat')
        grid.getStore().getProxy().setExtraParam("roomId", null)
        grid.getStore().getProxy().setExtraParam("contactId", record.get('contactId'))
        grid.getStore().load({
            callback: function (records, operation, success) {
                //if (grid.getStore().getCount() > 0) grid.view.bufferedRenderer.scrollTo(grid.getStore().getCount());
                grid.getStore().suspendAutoSync();
                Ext.each(records, function (record) {
                    if (record.get("readFlag") == '0') record.set("readFlag", '1')
                })
                grid.getStore().sync();
                grid.getStore().resumeAutoSync();
            }
        })
        
    },

    addChatRoom: function (chatMessage) {
        var me = this;
        //console.log(chatMessage)
        var grid = this.getView().down('roomlist')
        grid.getStore().insert(0, chatMessage)
        
        var contactGrid = this.getView().down('contacts')
        if (chatMessage.contactId && contactGrid.getStore().find("contactId",chatMessage.contactId) == -1) {
            var tmp = {}
            Ext.apply(tmp,chatMessage)
            tmp.displayName = chatMessage.contactName
            contactGrid.getStore().insert(0, tmp)
        }

    },

    onSendBtnClick: function (btn) {
        var me = this;
        var sendMessageForm = this.getReferences().sendMessageForm;
        var field = sendMessageForm.down("textarea[name=message]");
        var roomInfo = this.getView().getReferences().roomInfoForm;

        this.sendMessage(roomInfo.down("hidden[name=id]").getValue(),
                    roomInfo.down("hidden[name=agentId]").getValue(),
                    roomInfo.down("hidden[name=userId]").getValue(),
                    roomInfo.down("hidden[name=contactId]").getValue(),
                    field.getValue(),null,
                    function () {
                        field.reset()
                    });
    },

    sendMessage: function (roomId, fromTalkerId, toTalkerId, contactId, message, attachmentId , callback) {
        var me = this;
        me.socket.emit('pushMessage',
        {
            roomId : roomId,
            replyToken: "",
            type : "message",
            timestamp : Date.now(),//messageEv.timestamp ,
            sourceType : "agent" ,
            sourceUserId : toTalkerId ,
            contactId : contactId ,
            "source": {
                "type": "agent",
                "userId": toTalkerId
            },
            message : {
                id : 0 ,
                type: "text" , 
                text: message
            }
        });
        if (callback) callback.call();
    },

    onSendContactBtnClick: function (btn) {
        var me = this;
        var sendMessageForm = this.getReferences().sendMessageForm;
        var field = sendMessageForm.down("textarea[name=message]");
        var roomInfo = this.getView().getReferences().roomInfoForm;

        this.sendContactMessage(
                    roomInfo.down("hidden[name=agentId]").getValue(),
                    roomInfo.down("hidden[name=contactId]").getValue(),
                    field.getValue(),null,
                    function () {
                        field.reset()
                    });
    },

    sendContactMessage: function (fromTalkerId, contactId, message, attachmentId , callback) {
        var me = this;
        me.socket.emit('pushContactMessage',
        {
            roomId : 0,
            replyToken: "",
            type : "message",
            timestamp : Date.now(),//messageEv.timestamp ,
            sourceType : "agent" ,
            sourceUserId : contactId ,
            contactId : contactId ,
            "source": {
                "type": "agent",
                "userId": contactId
            },
            message : {
                id : 0 ,
                type: "text" , 
                text: message
            }
        });
        if (callback) callback.call();
    },

    addMessage: function (chatMessage) {
        var me = this;
        //console.log(chatMessage)
        var roomInfo = this.getView().getReferences().roomInfoForm;
        var chatRoomGrid = this.getView().down('roomlist')
        var roomRecord = chatRoomGrid.getStore().findRecord("userId", chatMessage.sourceUserId)
        if (roomRecord) {
            var grid = this.getView().down('messagechat')
            var updatetime = new Date(parseInt(chatMessage.timestamp));
            roomRecord.set("updatetime", chatMessage.timestamp)
            roomRecord.set("talkDatetime", updatetime)
            roomRecord.set("message", chatMessage.messageText)
            //console.log('roomRecord',roomRecord)

            if (roomRecord.get("id") == roomInfo.down("hidden[name=id]").getValue()) {
                grid.getStore().add(chatMessage)
                grid.getView().focusRow(grid.getStore().getCount()-1);
            } else {
                roomRecord.set("unread", roomRecord.get("unread")+1);        
            }
        }
        if (chatMessage.contactId) {
            console.log('wat',chatMessage.contactId)
            me.addContactMessage(chatMessage);
        }
    },

    addContactMessage: function (chatMessage) {
        var me = this;
        //console.log(chatMessage)
        var roomInfo = this.getView().getReferences().roomInfoForm;
        var chatRoomGrid = this.getView().down('contacts')
        var roomRecord = chatRoomGrid.getStore().findRecord("contactId", chatMessage.contactId)
        var grid = this.getView().down('messagechat')
        var updatetime = new Date(parseInt(chatMessage.timestamp));
        roomRecord.set("updatetime", chatMessage.timestamp)
        roomRecord.set("talkDatetime", updatetime)
        roomRecord.set("message", chatMessage.messageText)
        //console.log('roomRecord',roomRecord)

        if (roomRecord.get("contactId") == roomInfo.down("hidden[name=contactId]").getValue()) {
            grid.getStore().add(chatMessage)
            grid.getView().focusRow(grid.getStore().getCount()-1);
        } else {
            roomRecord.set("unread", roomRecord.get("unread")+1);        
        }
    },
        
    onHelpItemClick : function ( view , record , item , index , e , eOpts ){
        //console.log("record",record)
        var me = this;
        var roomInfo = this.getView().getReferences().roomInfoForm;
        this.sendMessage(roomInfo.down("hidden[name=id]").getValue(),
                    roomInfo.down("hidden[name=agentId]").getValue(),
                    roomInfo.down("hidden[name=userId]").getValue(),
                    record.get("name"));
    },

    onStickerClick : function ( view , record , item , index , e , eOpts ){
        console.log("record",record)
        var me = this;
        var roomInfo = this.getView().getReferences().roomInfoForm;
        var roomId = roomInfo.down("hidden[name=id]").getValue()
        var toTalkerId = roomInfo.down("hidden[name=userId]").getValue()
        var contactId = roomInfo.down("hidden[name=contactId]").getValue()
        me.socket.emit('pushMessage',
        {
            roomId : roomId,
            replyToken: "",
            type : "message",
            timestamp : Date.now(),//messageEv.timestamp ,
            sourceType : "agent" ,
            sourceUserId : toTalkerId ,
            contactId : contactId ,
            "source": {
                "type": "agent",
                "userId": toTalkerId
            },
            message : {
                id : 0 ,
                "type": "sticker",
                "packageId": record.get("packageId"),
                "stickerId": record.get("stickerId")
            }
        });
    },

    onStickerBtnClick : function(btn , state) {
        this.getReferences().helper.setVisible(state)
    }

});
