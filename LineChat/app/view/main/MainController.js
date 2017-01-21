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
        console.log('addMessage',chatMessage)
        var chatRecord ;
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
                chatRecord = grid.getStore().add(chatMessage)
                grid.getView().focusRow(grid.getStore().getCount()-1,500);
                //grid.getView().focusRow(grid.getStore().getCount()-1);
                //grid.getSelectionModel().select(grid.getStore().getAt(grid.getStore().getCount()-1))
            } else {
                roomRecord.set("unread", roomRecord.get("unread")+1);        
            }
        }
        if (chatMessage.contactId) {
            console.log('wat',chatMessage.contactId)
            var tmp = me.addContactMessage(chatMessage);
            if (tmp) chatRecord = tmp;
        }
        return chatRecord;
    },

    addContactMessage: function (chatMessage) {
        var me = this;
        var chatRecord ;
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
            chatRecord = grid.getStore().add(chatMessage)
            grid.getView().focusRow(grid.getStore().getCount()-1,500);
        } else {
            roomRecord.set("unread", roomRecord.get("unread")+1);        
        }
        return chatRecord
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
    },

    uploadHandler : function () {
        var me = this;

        var roomInfo = this.getView().getReferences().roomInfoForm;
        /*jslint unparam: true */
        /*global window, $ */
        $(function () {
            'use strict';
            // Change this to the location of your server-side upload handler:
            var url = window.location.hostname === 'blueimp.github.io' ?
                        '//jquery-file-upload.appspot.com/' : 'upload';
            $('#fileupload').fileupload({
                //url: "http://localhost:3000/"+url,
                url : url,
                dataType: 'json',
                add: function (e, data) {
                    //console.log('this add upload',$(this))
                    //console.log('add upload',data)
                    if (data.files && data.files[0]) {
                        //console.log(data.files[0])
                        var messageType = null;
                        if (data.files[0].type.indexOf("image") != -1 ) {
                            messageType = 'image';
                        } else if (data.files[0].type.indexOf("video") != -1 ) {
                            messageType = 'video';
                        } else if (data.files[0].type.indexOf("audio") != -1 ) { 
                            messageType = 'audio';
                        }
                        if (!messageType) {
                            Ext.Msg.alert('Error', 'Not support file type.');
                            return;
                        }
                        var time = Date.now()
                        var roomId = roomInfo.down("hidden[name=id]").getValue()
                        var toTalkerId = roomInfo.down("hidden[name=userId]").getValue()
                        var contactId = roomInfo.down("hidden[name=contactId]").getValue()
                        if (toTalkerId) {
                            data.url = LineChat.app.baseURL+'upload'
                        } else {
                            data.url = LineChat.app.baseURL+'contactUpload',
                            Ext.Msg.alert('Error', 'Not support file from contact');
                            return;
                        }

                        me.uploadMessage = {
                            roomId : roomId,
                            replyToken: "",
                            type : 'message',
                            upload : true,
                            messageType : messageType,
                            timestamp : time,//messageEv.timestamp ,
                            sourceType : "agent" ,
                            sourceUserId : toTalkerId ,
                            contactId : contactId ,
                            "source": {
                                "type": "agent",
                                "userId": toTalkerId
                            },
                            message : {
                                id : 0 ,
                                "type": messageType
                            }
                        }
                        me.currentRecord = me.addMessage(me.uploadMessage)[0];
                        console.log('me.currentRecord',me.currentRecord)
                        $("#file-picker__progress_"+me.uploadMessage.timestamp).circleProgress({
                            value: 0,
                            size: 80,
                            fill: {
                                gradient: ["red", "orange"]
                            }
                        });
                        if (messageType == 'image') {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                $('#'+time).attr('src', e.target.result);
                            }
                            reader.readAsDataURL(data.files[0]);
                        }
                        data.formData = roomInfo.getValues()
                        data.submit();
                    }
                },
                done: function (e, data) {
                    console.log("data",data)
                     var hideMask = function () {
                        console.log("destroy","#file-picker__progress_"+me.uploadMessage.timestamp)
                        Ext.get("file-picker__progress_"+me.uploadMessage.timestamp).destroy()
                        var message = data.result.message
                        if (message.message.type == 'audio') {
                            var src = LineChat.app.baseURL+message.message.filePath+message.message.fileName
                            $('#'+me.uploadMessage.timestamp).attr('src', src);
                            $('#audio_'+me.uploadMessage.timestamp).load();
                        } else if (message.message.type == 'video') {
                            var src = LineChat.app.baseURL+message.message.filePath+message.message.fileName
                            $('#'+me.uploadMessage.timestamp).attr('src', src);                        
                            $('#video_'+me.uploadMessage.timestamp).load();
                        }
                        me.currentRecord.set({
                            upload : false,
                            "fileName" : message.message.fileName,
                            "filePath" : message.message.filePath,
                            "originalFileName" : message.message.originalFileName
                        })
                    };
                    Ext.defer(hideMask, 2000);
                    
                    /*
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo('#files');
                    });
                    */
                },
                progressall: function (e, data) {
                    console.log("progressall",data.loaded , data.total,data.loaded / data.total)
                    $("#file-picker__progress_"+me.uploadMessage.timestamp).circleProgress({
                        value: data.loaded / data.total
                    });
                    /*
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );
                    */
                }
            }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        });
    }

});
