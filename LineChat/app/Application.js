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
