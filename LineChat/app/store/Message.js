Ext.define('LineChat.store.Message', {
    extend: 'Ext.data.Store',

    alias: 'store.message',

    fields: [
        'replyToken',
        'eventType',
        'timestamp',
        'sourceType',
        'sourceUserId', 
        'messageId', 
        'messageType', 
        'messageText',
        {
            name : 'message'
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
