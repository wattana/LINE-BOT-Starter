Ext.define('LineChat.view.main.MessageChat', {
    extend: 'Ext.grid.Panel',
    xtype: 'messagechat',
    scrollable : true,
    requires: [
        'LineChat.store.Message'
    ],

    store: 'Message',
    hideHeaders: true,
    disableSelection: true,
    columnLines: false,
    rowLines : false,

    initComponent: function() {
        var me = this;
        var meMessageTpl = Ext.create('Ext.XTemplate',
            '<div class="bubble bubble--alt" style="float:right">',
                '<div class="chat-message">',
                    '<span>{messageText:this.getContent}</span>',
                    //'<tpl if="attachmentId == \'\' || attachmentId==null">',
                    //'<tpl else>',
                    //    ' <a class="item-link" href="DownloadFile.ashx?attachmentId={attachmentId}">{fileName} </a>',
                    //'</tpl>',
                    '<div class="comment-by">{date:this.formatDate}</div>',
                '</div>',
            '</div>',
        {
            getContent: function (v) {
                //if (v == END_CHAT_SIGNAL) return "<font color=blue>Exit chat ...</font>"
                return v === undefined || v === null ? '' : v.replace(/\n/g, '<br/>');
            },
            formatDate: function (v) {
                return v === undefined || v === null ? '' : Ext.Date.format(v, "d/m/X H:i:s");
            }
        });
        var messageTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item">',
            /*
                '<div style="display:none;float:left;padding:5px;margin-right: 8px;color:gray">',
                    '<tpl if="messageId == \'\' || messageId==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="DisplayImage.ashx?agentId={talkerId}&imageName={messageId}" height=32 width=32 title="{createBy}">',
                    '</tpl>',
                    '<span class="chat-by-name" style="padding:4px;margin-right: 2px">{talker} </span>',
                '</div>',
                */
                '<div class="bubble">',
                    '<span>{messageText:this.getContent}</span>',
                    //'<tpl if="attachmentId == \'\' || attachmentId==null">',
                    //'<tpl else>',
                    //    ' <a class="item-link" target="_blank" href="DownloadFile.ashx?attachmentId={attachmentId}">{fileName} </a>',
                    //'</tpl>',
                    '<div class="comment-by">{date:this.formatDate}</div>',
                '</div>',
            '</div>',
        {
            getContent: function (v) {
                //if (v == END_CHAT_SIGNAL) return "<font color=blue>Exit chat ...</font>"
                return v === undefined || v === null ? '' : v.replace(/\n/g, '<br/>');
            },
            formatDate: function (v) {
                return v === undefined || v === null ? '' : Ext.Date.format(v, "d/m/X H:i:s");
            }
        });
        me.viewConfig = {
            stripeRows: false,
            preserveScrollOnRefresh: true,
            enableTextSelection: true,
            trackOver: false,
            listeners: {
                refresh: function () {
                    var me = this;
                    Ext.defer(function () {
                        if (me.getStore().getCount() > 0) me.bufferedRenderer.scrollTo(me.getStore().getCount() - 1);
                    }, 500)
                }
            }
        },
        me.columns = [{
            header: 'message', dataIndex: 'message', flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                console.log(record)
                metaData.style = 'white-space: normal;'
                if (record.get("replyToken") == '') {
                    return meMessageTpl.apply(record.data)
                }
                return messageTpl.apply(record.data)
            }
        }]
        me.callParent();
    }
});
