/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('LineChat.Application', {
    extend: 'Ext.app.Application',
    
    name: 'LineChat',

    stores: [
        "Contact","Room", "Message", "ContactTree"
    ],
    glyphFontFamily: 'Pictos',

    
    init : function ( app) {
        var roomStore = this.getStore('Room');
        var contactStore = this.getStore('Contact');
        var contactTreeStore = this.getStore('ContactTree');
        app.baseURL = "";
        if (Ext.manifest['env']=='development') {
            socketUrl = "localhost:3000"
            roomStore.getProxy().setUrl("http://localhost:3000/listRoom")
            contactStore.getProxy().setUrl("http://localhost:3000/listContactRoom")
            contactTreeStore.getProxy().setUrl("http://localhost:3000/listContactTree")
            this.getStore('Message').getProxy().setUrl("http://localhost:3000/listMessage")
            app.baseURL = "http://localhost:3000/";
        }
        roomStore.load();
        contactStore.load();
        contactTreeStore.load();
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
