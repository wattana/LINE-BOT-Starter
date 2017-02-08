/**
 * This view is an example list of people.
 */
Ext.define('LineChat.view.main.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',

    requires: [
        'LineChat.store.Request'
    ],

    title: 'Request',

    store: {
        type: 'request'
    },

    columns: [
        { text: 'request_no',  dataIndex: 'request_number' },
        { text: 'open_date', dataIndex: 'open_date' },
        { text: 'request_detail', dataIndex: 'request_detail', flex: 1 }
    ],

    listeners: {
        select: 'onItemSelected'
    }
});
