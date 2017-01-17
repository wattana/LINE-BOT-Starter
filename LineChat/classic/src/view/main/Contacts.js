Ext.define('LineChat.view.main.Contacts', {
    extend: 'Ext.grid.Panel',
    xtype: 'contacts',
    scrollable : true,
    height : 200,
    requires: [
        'LineChat.store.Contact'
    ],

    title: 'Contact',
    hideHeaders: true,
    store: 'Contact',
    initComponent: function() {
        var me = this;
        var talkerWithTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item">',
                '<div class="chat-message" style="padding:3px;float:right">',
                    '<div style="float:left;margin-right: 1px;color:{[this.statusColor(values.waitFlag,values.talkDatetime)]}">',
                        '<i class="fa fa-comment fa-lg"></i>',
                    '</div>',
                    '<div class="chat-datetime">{[this.elapsed(values.waitFlag,values.talkDatetime,values.joinDatetime)]}</div>',
                '</div>',
                '<div class="chat-message" style="padding:3px;">',
                    '<span class="chat-by-name" style="margin-right: 2px">{displayName}</span>',
                    '<tpl if="unread &gt; 0">',
                        '<span class="chat-by-name" style="margin-right: 2px">({unread})</span>',
                    '</tpl>',
                '</div>',
            '</div>',
            {
                statusColor: function (waitFlag, talkDatetime) {
                    if (waitFlag == '1') {
                        return 'gray'
                    } else {
                        var minutes = Ext.Date.getElapsed(talkDatetime) / 60000
                        if (minutes <= 3) {
                            return "green"
                        } else if (minutes <= 5) {
                            return "orange"
                        }
                    }
                    return 'red'
                },
                elapsed: function (waitFlag, talkDatetime, joinDatetime) {
                    if (waitFlag == '1') {
                        return 'Wait'
                    }
                    var seconds = Math.floor(Ext.Date.getElapsed(talkDatetime || joinDatetime) / 1000)

                    var interval = Math.floor(seconds / 31536000);

                    if (interval >= 1) {
                        return interval + " years ago";
                    }
                    interval = Math.floor(seconds / 2592000);
                    if (interval >= 1) {
                        return interval + " months ago";
                    }
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        return interval + " days ago";
                    }
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        return interval + " hours ago";
                    }
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        return interval + " minutes ago";
                    }
                    if (interval == 0) return "Now";
                    return Math.floor(seconds) + " seconds ago";
                }
            }
        );
        me.columns = [
            { 
                text: 'messageId',  dataIndex: 'displayName', flex: 1,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return talkerWithTpl.apply(record.data)
                }
            }
        ]
         me.callParent();
    },

    listeners: {
        select: 'contactTalkingWith'
    }
    
});
