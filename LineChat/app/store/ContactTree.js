Ext.define('LineChat.store.ContactTree', {
    extend: 'Ext.data.TreeStore',

    alias: 'store.contact-tree',
    fields: [
        {
            name: 'displayName',
            type: 'string'
        },
        {name : 'createtime', type:'int'},
        {name : 'updatetime', type:'int'},
        {name : 'unread', type:'int'},
        {
            name: 'joinDatetime',
            convert: function (value, record) {
                //console.log(record.get('createtime'),new Date(record.get('createtime')))
                return record.get('createtime') ? new Date(record.get('createtime')):null;
            },
            depends: [ 'createtime' ]
        },
        {
            name: 'talkDatetime',
            convert: function (value, record) {
                return record.get('updatetime') ? new Date(record.get('updatetime')):null;
        },
            depends: [ 'updatetime' ]
        }        
    ],
    proxy: {
        type: 'ajax',
        url: '/listContactTree'
    },
    folderSort: true,
    autoLoad : false

});
