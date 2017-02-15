Ext.define('LineChat.view.main.UserList', {
    extend: 'Ext.grid.Panel',
    xtype: 'userlist',
    scrollable : true,
    height : 200,
    requires: [
        'LineChat.store.Room'
    ],

    title: 'User',
    hideHeaders: true,
    store: 'User',
    controller: 'userlist',

    initComponent: function() {
        var me = this;
        var talkerWithTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-room-item ">',
                '<div class="chat-message" style="padding:3px;float:right">',
                    '<div style="float:left;margin-right: 1px;color:{[this.statusColor(values.waitFlag,values.talkDatetime)]}">',
                        '<i class="fa fa-comment fa-lg"></i>',
                    '</div>',
                    '<div class="chat-datetime">{[this.elapsed(values.waitFlag,values.talkDatetime,values.joinDatetime)]}</div>',
                '</div>',
                '<div class="chat-message" style="padding:3px;">',
                    '<div style="float:left;margin-right: 8px;color:gray">',
                        '<img src="{pictureUrl}/small" title="{displayName}">',
                    '</div>',
                    '<span class="chat-by-name" style="margin-right: 2px">{line_name}</span>',
                    '<tpl if="unread &gt; 0">',
                        '<span class="chat-by-name" style="margin-right: 2px">({unread})</span>',
                    '</tpl>',
                    '<div class="chat-message">',
                        '<span class="chat-by-name" style="margin-right: 2px">{statusMessage} </span>',
                    '</div>',
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
        var talkerTpl = Ext.create('Ext.XTemplate',
        '<div class="chat-room-item ">',                
            '<div style="float:left;margin-right: 8px;color:gray">',
                '<tpl if="imgUrl == \'\'">',
                    '<i class="fa fa-user fa-2x"></i>',
                '<tpl else>',
                    '<img src="{pictureUrl}/small" title="{createBy}">',
                '</tpl>',
            '</div>',
            '<div class="chat-message">',
                '<span class="chat-by-name" style="margin-right: 2px">{displayName} </span>',
            '</div>',
        '</div>');

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
        rowclick: 'onItemSelected'
    }
    
});
