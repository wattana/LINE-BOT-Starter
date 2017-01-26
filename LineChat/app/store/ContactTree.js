Ext.define('LineChat.store.ContactTree', {
    extend: 'Ext.data.TreeStore',

    alias: 'store.contact-tree',
    fields: [{
        name: 'displayName',
        type: 'string'
    }],
    proxy: {
        type: 'ajax',
        url: '/listContactTree'
    },
    folderSort: true,
    autoLoad : false

});
