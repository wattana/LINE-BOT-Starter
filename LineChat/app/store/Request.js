Ext.define('LineChat.store.Request', {
    extend: 'Ext.data.Store',

    alias: 'store.request',

    fields: [
        'request_id',
        'request_number',
        'contact_id',
        {
            name: 'request_detail',
            convertxx: function (value, record) {
                console.log(value)
                return value.replace("\n","<br/>")
            }
        }
    ],
    autoLoad : false,
    proxy: {
         type: 'ajax',
         url: '/listRequest',
         urlx : 'http://localhost:3000/listRequest',
         reader: {
             type: 'json'
         }
    }
});
