Ext.define('LineChat.store.Message', {
    extend: 'Ext.data.Store',

    alias: 'store.message',

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
        'pictureUrl',
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
         direction: 'ASC'
     }],
    autoLoad : false,
    pageSize : 100,
    proxy: {
         type: 'ajax',
         url: '/listMessage',
         reader: {
             type: 'json',
             rootProperty: 'data'
         }
    }
});
