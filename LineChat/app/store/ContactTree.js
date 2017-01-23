Ext.define('LineChat.store.ContactTree', {
    extend: 'Ext.data.TreeStore',

    alias: 'store.contact-tree',
    fields: [{
        name: 'displayName',
        type: 'string'
    }],
    proxy: {
        type: 'ajax',
        url: 'http://localhost:3000/listContactTree'
    },
    folderSort: true,
    autoLoad : false

});
