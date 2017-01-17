Ext.define('LineChat.store.Contact', {
    extend: 'Ext.data.Store',

    alias: 'store.contact',

    fields: [
        'id',
        'contact_id',
        'userId',
        'displayName',
        'pictureUrl',
        'statusMessage',
        'message',
        'active',
        {name : 'createtime', type:'int'},
        {name : 'updatetime', type:'int'},
        {name : 'unread', type:'int'},
        {
            name: 'joinDatetime',
            convert: function (value, record) {
                console.log(record.get('createtime'),new Date(record.get('createtime')))
                return new Date(record.get('createtime'));
            },
            depends: [ 'createtime' ]
        },
        {
            name: 'talkDatetime',
            convert: function (value, record) {
                return new Date(record.get('updatetime'));
        },
            depends: [ 'updatetime' ]
        }
    ],
    autoLoad : false,
    proxy: {
         type: 'ajax',
         url: '/listContactRoom',
         reader: {
             type: 'json'
         }
    }
});
