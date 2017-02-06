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
    autoLoad : false,
    proxy: {
         type: 'ajax',
         url: '/listMessage',
         reader: {
             type: 'json'
         }
    }
});
