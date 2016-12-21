Ext.define('LineChat.view.main.MessageList', {
    extend: 'Ext.grid.Panel',
    xtype: 'messagelist',
    scrollable : true,
    height : 200,
    requires: [
        'LineChat.store.Message'
    ],

    title: 'Message',

    store: 'Message',

    columns: [
        { text: 'messageId',  dataIndex: 'messageId' },
        { text: 'messageText', dataIndex: 'messageText', flex: 1 },
        { text: 'eventType', dataIndex: 'eventType', flex: 1 }
    ]
});
