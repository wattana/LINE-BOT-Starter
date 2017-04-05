Ext.define('LineChat.store.Room', {
    extend: 'Ext.data.Store',

    alias: 'store.room',
    sorters: [{
         property: 'updatetime',
         direction: 'DESC'
    }],
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
    autoLoad : false,
    proxy: {
         type: 'ajax',
         url: '/listRoom',
         reader: {
             type: 'json'
         }
    }
});
