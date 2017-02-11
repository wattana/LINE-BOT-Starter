/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('LineChat.Application', {
    extend: 'Ext.app.Application',
    
    name: 'LineChat',

    stores: [
        "Contact","Room", "Message", "ContactTree","Request"
    ],
    glyphFontFamily: 'Pictos',

    
    init : function ( app) {
        var roomStore = this.getStore('Room');
        var contactStore = this.getStore('Contact');
        var contactTreeStore = this.getStore('ContactTree');
        var requestStore = this.getStore('Request');
        app.baseURL = "";
        if (Ext.manifest['env']=='development') {
            socketUrl = "localhost:3000"
            roomStore.getProxy().setUrl("http://localhost:3000/listRoom")
            contactStore.getProxy().setUrl("http://localhost:3000/listContactRoom")
            contactTreeStore.getProxy().setUrl("http://localhost:3000/listContactTree")
            requestStore.getProxy().setUrl("http://localhost:3000/listRequest")
            this.getStore('Message').getProxy().setUrl("http://localhost:3000/listMessage")
            app.baseURL = "http://localhost:3000/";
        }
        roomStore.load();
        contactStore.load();
        contactTreeStore.load();
        /*
        requestStore.load({
            callback : function (records) {
                console.log('requestStore',records)
            }
        });
        */
        
        var today = new Date();
        app.info = {
            today : today,
            currentYear : today.getFullYear(),
            currentMonth : today.getMonth(),
            currentDay : today.getDay(),
            agentId : "AB30D036-5F28-44B4-9138-59A09DC49A5A",
            agentName : "Agent1"
        };

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
                /*
            	DssWeb.app.env.TODAY = Ext.Date.parse(result.today,"d/m/Y");
                DssWeb.app.BASE_REPORT_URL = result.serverReportUrl;
                DssWeb.app.PAGE_SIZE = Ext.state.Manager.get("pageSize") || 10;
                DssWeb.app.info = result;
                DssWeb.app.userTypeId = result.user.masUser.userTypeId 
                DssWeb.app.info.now = Ext.Date.parse(result.now,"d/m/Y H:i:s");
                startup();
                */
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

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
