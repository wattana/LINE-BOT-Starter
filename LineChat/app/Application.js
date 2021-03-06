/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('LineChat.Application', {
    extend: 'Ext.app.Application',
    
    name: 'LineChat',

    stores: [
        "Contact","Room", "Message", "ContactTree","Request", "User"
    ],
    glyphFontFamily: 'Pictos',

    
    init : function ( app) {
        var me = this;
        app.isEn = true;
        //this.mainView = "LineChat.view.main.MessagePanel"
        //return;
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {}));
        var params = Ext.urlDecode(window.location.search.substring(1));
        console.log("params Application",params)
        /*
        if (params.page == 'listMessageByContactId') {
            me.listMessageByContactId(params);
        }
        */
        app.baseParams = params;

        var roomStore = this.getStore('Room');
        var contactStore = this.getStore('Contact');
        var contactTreeStore = this.getStore('ContactTree');
        var requestStore = this.getStore('Request');
        var userStore = this.getStore('User');
        app.baseURL = "";
        if (Ext.manifest['env']=='development') {
            socketUrl = "localhost:3000"
            roomStore.getProxy().setUrl("http://localhost:3000/listRoom")
            contactStore.getProxy().setUrl("http://localhost:3000/listContactRoom")
            contactTreeStore.getProxy().setUrl("http://localhost:3000/listContactTree")
            requestStore.getProxy().setUrl("http://localhost:3000/listRequest")
            userStore.getProxy().setUrl("http://localhost:3000/listLineContact")
            this.getStore('Message').getProxy().setUrl("http://localhost:3000/listMessage")
            app.baseURL = "http://localhost:3000/";
        }
        if (params.page == 'listMessageByContactId') {
        } else {
            roomStore.load({
                callback : function (records) {
                    var unread = 0;
                    for (var i=0; i<records.length;i++) {
                        unread += records[i].get("unread")
                    }
                    var tabBar =  me.getMainView().down("tabpanel[region=west]").getTabBar()
                    tabBar.down("tab[text=Chat]").setBadgeText(unread)
                }
                
            });
            contactStore.load();
            contactTreeStore.load();
            userStore.load();
            /*
            requestStore.load({
                callback : function (records) {
                    console.log('requestStore',records)
                }
            });
            */
        }
    },

    launch: function () {
        var me = this;
        var baseURL = LineChat.app.baseURL;
    	LineChat.app.env = {
            BASE_URL : baseURL
    	}
        LineChat.app.showMask();
        Ext.Ajax.request({
			headers: { 'Content-Type': 'application/json','Accept': 'application/json' },
            withCredentials : true,
            jsonData : {
                1 : 1
            },
            url: LineChat.app.env.BASE_URL+"base/appInfo",
            success: function (response, opts) {
            	var result = Ext.decode(response.responseText);
                var today = new Date(result.today);
                LineChat.app.info = {
                    today : today,
                    currentYear : today.getFullYear(),
                    currentMonth : today.getMonth(),
                    currentDay : today.getDate(),
                    agentId : result.line_id,
                    agentName : result.line_name
                };
                /*
            	LineChat.app.env.TODAY = Ext.Date.parse(result.today,"d/m/Y");
                LineChat.app.BASE_REPORT_URL = result.serverReportUrl;
                LineChat.app.PAGE_SIZE = Ext.state.Manager.get("pageSize") || 10;
                LineChat.app.info = result;
                LineChat.app.userTypeId = result.user.masUser.userTypeId 
                LineChat.app.info.now = Ext.Date.parse(result.now,"d/m/Y H:i:s");
                startup();
                */
                //console.log(LineChat.app.info)
                var messagePanel = me.getMainView().down("form[reference=roomInfoForm]")
                if (messagePanel) {
                    //console.log(messagePanel)
                    messagePanel.getHeader().add([{
                        xtype : 'label',
                        style : {
                            color : 'white'
                        },
                        text : result.line_name
                    }])
                }
            	LineChat.app.hideMask();
            },
            failure: LineChat.app.failureHandler
        });
    },

    showMask : function (msg) {
        Ext.getBody().mask(msg || "Please wait...");
    },
    hideMask: function () {
        Ext.getBody().unmask();
    },

    failureHandler: function (response, opts) {
        LineChat.app.hideMask();
        console.log('failureHandler', response.status)
        //Ext.Msg.alert("Error", response.statusText+"-"+response.raw);
        if (response.status == 401) {
            window.location = LineChat.app.baseURL+"login.html"
        } else {
            var msg = '';
            if (response.statusText == "communication failure") {
                msg = LineChat.app.isEn ? "Can't Connect to Server (connection refuse)" : 'ไม่สามารถติดต่อ Server ได้ (connection refuse)';
            } else if (response.statusText == "transaction aborted") {
                msg = LineChat.app.isEn ? "Can't Connect to Server (timeout)" : 'ไม่สามารถติดต่อ Server ได้ (timeout)';
            } else if (response.statusText == "OK"){
                var json = Ext.JSON.decode(response.responseText)
                msg = json.message || json.msg
            }  else if (response.raw){
                msg = response.raw.message || response.raw.msg
            } else if (response.statusText == "") {
                try {
                    var json = Ext.decode( response.responseText, true )
                    if (json &&  json.msg) msg = json.msg
                } catch (ex) {
                    msg = LineChat.app.isEn ? "Can't Connect to Server (connection refuse or communication failure)" : 'ไม่สามารถติดต่อ Server ได้ (connection refuse or communication failure)';
                }
            } else {
                var json = Ext.decode( response.responseText, true )
                if (json &&  json.msg) msg = json.msg
            }
            if (!msg) {
                msg = response.statusText;
            }
            Ext.Msg.alert("Error", msg);
            //LineChat.app.msgAlert("Error", msg, response.responseText)
        }
        
    },

    onLoadPictureError : function() {
        var targetEl = event.target || event.srcElement;
        var roomId = targetEl.getAttribute("roomId");
        console.log("onLoadPictureError",targetEl.getAttribute("roomId"))
        Ext.Ajax.request({
			headers: { 'Content-Type': 'application/json','Accept': 'application/json' },
            withCredentials : true,
            params : {
                roomId : roomId
            },
            method : 'GET',
            url: LineChat.app.env.BASE_URL+"updateProfile",
            success: function (response, opts) {
            	var result = Ext.decode(response.responseText);
                console.log(result)
                if (result.pictureUrl) {
                    targetEl.src = result.pictureUrl+"/small"
                    //console.log("record",Ext.getStore("Room").findRecord("id",roomId))
                    Ext.getStore("Room").findRecord("id",roomId).set({
                        pictureUrl : result.pictureUrl
                    })
                }
            },
            failure: LineChat.app.failureHandler
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    listMessageByContactId: function (params) {
        var me = this;
        var userId = params.userId;
        var agentId = params.agentId;
        var contactId = params.contactId;
        var roomId = params.id
        

        var win = 
        Ext.create('Ext.window.Window', {
            title: 'ข้อความทั้งหมด',
            layout : {
                type : 'vbox',
                align : 'stretch',
                pack: 'start'
            },
            width : 800,
            height : 500,
            maximized : true,
            maximizable : true,
            items: [{ 
                xtype : 'messagechat',
                selType : 'rowmodel',
                store : {
                    type :'buffered',
                    fields: [
                        'replyToken',
                        'eventType',
                        {
                            name : 'timestamp',
                            type : 'int'
                        },
                        'sourceType',
                        'sourceUserId', 
                        'messageId', 
                        'messageType', 
                        'messageText',
                        {
                            name : 'message'
                        },
                        {
                            name : 'date',
                            convert: function (value, record) {
                                return new Date(record.get("timestamp"));
                            }
                        },
                        'info'
                    ],
                    sorters: [{
                        property: 'timestamp',
                        direction: 'DESC'
                    }],
                    autoLoad : false,
                    pageSize : 25,
                    proxy: {
                        type: 'ajax',
                        url: LineChat.app.baseURL+'listMessage',
                        reader: {
                            type: 'json',
                            rootProperty: 'data'
                        }
                    }
                },
                flex : 1,
                scrollToBottom : false,
                listeners : {
                    viewready : function (grid) {
                        if (userId) {
                            grid.getStore().getProxy().setExtraParam("roomId", roomId)
                            grid.getStore().getProxy().setExtraParam("contactId", null)
                        } else {
                            grid.getStore().getProxy().setExtraParam("roomId", null)
                            grid.getStore().getProxy().setExtraParam("contactId", contactId)                            
                        }
                        grid.getStore().load({
                            callback: function (records, operation, success) {
                            }
                        })
                    },
                    selectionchangexx :  function( sm , selected , eOpts ) {
                        var btn = win.down("button[reference=createRequestBtn]")
                        var selection = sm.getSelection()
                        if (selected.length)
                            btn.setText("ออกใบงาน ("+sm.getSelection().length+")")
                        else
                            btn.setText("ออกใบงาน")
                        btn.setDisabled(selection == 0) 
                    }
                }
            }]
        }).show();
        
    }
});
