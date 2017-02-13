Ext.define('LineChat.store.User', {
    extend: 'Ext.data.Store',

    alias: 'store.user',

    fields: [
        'id',
        'userId',
        'displayName',
        'pictureUrl',
        'statusMessage',
        'message',
        'active',
        {name : 'createtime', type:'int'},
        {name : 'updatetime', type:'int'},
        {name : 'join_date', type:'int'},
        {name : 'unread', type:'int'},
        {
            name: 'joinDatetime',
            convert: function (value, record) {
                //console.log(record.get('createtime'),new Date(record.get('createtime')))
                return new Date(record.get('join_date'));
            },
            depends: [ 'join_date' ]
        },
        {
            name: 'talkDatetime',
            convert: function (value, record) {
                return new Date(record.get('join_date'));
        },
            depends: [ 'join_date' ]
        }
    ],
    autoLoad : false,
    proxy: {
         type: 'ajax',
         url: '/listLineContact',
         reader: {
             type: 'json'
         }
    }
});
