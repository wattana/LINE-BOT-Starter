Ext.define('LineChat.view.main.MessageChat', {
    extend: 'Ext.grid.Panel',
    xtype: 'messagechat',
    scrollable : true,
    requires: [
        'LineChat.store.Message'
    ],

    store: 'Message',
    hideHeaders: true,
    disableSelection: false,
    columnLines: false,
    rowLines : true,
    selType: 'checkboxmodel',
    syncRowHeight: true,
    numFromEdgexx : 10000,
    scrollToBottom : true,

    initComponent: function() {
        var me = this;
        var meMessageTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item" style="float:right">',
                '<div class="chat-datetime--alt">{date:this.formatDate} <br/> {requestNumber}</div>',
                '<div class="bubble bubble--alt">',
                    '<div class="chat-message">',
                        '<span>{messageText:this.getContent}</span>',
                        //'<tpl if="attachmentId == \'\' || attachmentId==null">',
                        //'<tpl else>',
                        //    ' <a class="item-link" href="DownloadFile.ashx?attachmentId={attachmentId}">{fileName} </a>',
                        //'</tpl>',
                    '</div>',
                '</div>',
                '<div style="position:absolute;bottom:5px;right: 2px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
            '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });
        var messageTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item">',
                '<div style="position:absolute;bottom:5px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
                '<div class="bubble">',
                    '<span>{messageText:this.getContent}</span>',
                '</div>',
                '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',
            '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var meStickerTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item" style="float:right">',
                '<div class="chat-datetime--alt">{date:this.formatDate}</div>',
                '<div style="padding:0px 60px;">',
                    '<img src="http://dl.stickershop.line.naver.jp/products/0/0/100/{packageId}/PC/stickers/{stickerId}.png">',
                '</div>',
                '<div style="position:absolute;bottom:5px;right: 2px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
            '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var stickerTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item">',
                '<div style="position:absolute;bottom:5px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
                '<div style="float:left;margin-left:55px;">',
                    '<img src="http://dl.stickershop.line.naver.jp/products/0/0/100/{packageId}/PC/stickers/{stickerId}.png">',
                '</div>',
                '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',
            '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var imageTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item">',
                '<div style="position:absolute;bottom:5px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
                '<div style="float:left;margin-left:55px;">',
                    '<div><img src="{.:this.getBaseUrl}content/images/{roomId}/{messageId}.png" width="200px"></div>',
                    '<a href="{.:this.getBaseUrl}content/images/{roomId}/{messageId}.png" target="_blank">Open</a>',
                '</div>',
                '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',
            '</div>',
            {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var meImageTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item" style="float:right;position:relative">',
                '<div class="chat-datetime--alt">{date:this.formatDate}<br/>{requestNumber}</div>',
                '<div style="padding:0px 60px;">',
                    '<img id="{timestamp}" src="{.:this.getBaseUrl}{filePath}{fileName}" width="200px">',
                    '<div style="width:100px;height:100px;position:absolute;top:30%;left:30%" class="file-picker__progress" id="file-picker__progress_{timestamp}"></div>',
                '</div>',
                '<a href="{.:this.getBaseUrl}{filePath}{fileName}" target="_blank">Open</a>',
                '<div style="position:absolute;bottom:5px;right: 2px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
            '</div>',
            {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var audioTpl = Ext.create('Ext.XTemplate',
         '<div class="chat-item">',
            '<div style="position:absolute;bottom:5px;color:gray">',
                '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                    '<i class="fa fa-user fa-2x"></i>',
                '<tpl else>',
                    '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                '</tpl>',
                '<div class="chat-by-name" style>{lineName}</div>',
            '</div>',
            '<div class="bubble">',
                '<audio controls>',
                    '<source src="{.:this.getBaseUrl}content/audios/{roomId}/{messageId}.mp4" type="audio/mpeg">',
                    'Your browser does not support the audio element.',
                '</audio>',
            '</div>',
            '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',
        '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });
        var meAudioTpl = Ext.create('Ext.XTemplate',
         '<div class="chat-item" style="float:right;position:relative">',
            '<div class="chat-datetime--alt">{date:this.formatDate}<br/>{requestNumber}</div>',
            '<div class="bubble  bubble--alt">',
                '<audio id="audio_{timestamp}" controls>',
                    '<source id="{timestamp}" src="{.:this.getBaseUrl}{filePath}{fileName}" type="audio/mpeg">',
                    'Your browser does not support the audio element.',
                '</audio>',
                '<div style="width:100px;height:100px;position:absolute;top:30%;left:30%" class="file-picker__progress" id="file-picker__progress_{timestamp}"></div>',
            '</div>',
            '<div style="position:absolute;bottom:5px;right: 2px;color:gray">',
                '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                    '<i class="fa fa-user fa-2x"></i>',
                '<tpl else>',
                    '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                '</tpl>',
                '<div class="chat-by-name" style>{lineName}</div>',
            '</div>',
        '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var videoTpl = Ext.create('Ext.XTemplate',
         '<div class="chat-item">',
            '<div style="position:absolute;bottom:5px;color:gray">',
                '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                    '<i class="fa fa-user fa-2x"></i>',
                '<tpl else>',
                    '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                '</tpl>',
                '<div class="chat-by-name" style>{lineName}</div>',
            '</div>',
            '<div style="float:left;margin-left:55px;">',
                '<video controls width="250px" height="250px">',
                    '<source src="{.:this.getBaseUrl}content/videos/{roomId}/{messageId}.mp4" type="video/mp4">',
                    'Your browser does not support the <code>video</code> element.',
                '</video>',
            '</div>',
            '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',            
        '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var meVideoTpl = Ext.create('Ext.XTemplate',
         '<div class="chat-item"  style="float:right;position:relative">',
            '<div class="chat-datetime--alt">{date:this.formatDate}<br/>{requestNumber}</div>',
            '<div style="padding:0px 60px;">',
                '<video id="video_{timestamp}" controls width="250px" height="250px">',
                    '<source id="{timestamp}" src="{.:this.getBaseUrl}{filePath}{fileName}" type="video/mp4">',
                    'Your browser does not support the <code>video</code> element.',
                '</video>',
                '<div style="width:100px;height:100px;position:absolute;top:30%;left:30%" class="file-picker__progress" id="file-picker__progress_{timestamp}"></div>',
            '</div>',
            '<div style="position:absolute;bottom:5px;right: 2px;color:gray">',
                '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                    '<i class="fa fa-user fa-2x"></i>',
                '<tpl else>',
                    '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                '</tpl>',
                '<div class="chat-by-name" style>{lineName}</div>',
            '</div>',
        '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var locationTpl = Ext.create('Ext.XTemplate',
         '<div class="chat-item">',
            '<div style="position:absolute;bottom:5px;color:gray">',
                '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                    '<i class="fa fa-user fa-2x"></i>',
                '<tpl else>',
                    '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                '</tpl>',
                '<div class="chat-by-name" style>{lineName}</div>',
            '</div>',
            '<div class="bubble">',
                '<i class="fa fa-flag" aria-hidden="true" style="float:left; color:red"></i>',
                '<div>',
                    '<a style ="text-decoration:none" href="http://maps.google.com/maps?q=loc:{latitude},{longitude}" target="_blank">&nbsp; {title} <br/> {address}</a>',
                '</div>',
            '</div>',
            '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',            
        '</div>',
        {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });
        var fileTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item">',
                '<div style="position:absolute;bottom:5px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
                '<div class="bubble">',
                    '<i class="fa fa-file-archive-o" aria-hidden="true" style="float:left;font-size: 18px;font-weight: bold;color: brown;"></i>',
                    '<a style ="text-decoration:none" href="{.:this.getBaseUrl}{filePath}{fileName}" target="_blank">&nbsp; {fileName}</a>',
                '</div>',
            '<div class="chat-datetime">{date:this.formatDate}<br/>{requestNumber}</div>',
            '</div>',
            {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        var meTemplateTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-item" style="float:right;position:relative">',
                '<div class="chat-datetime--alt">{date:this.formatDate}<br/>{requestNumber}</div>',
                '<div class="bubble bubble--alt">',
                    '<div style="width:100px;height:100px;position:absolute;top:40%;left:30%" class="file-picker__progress" id="file-picker__progress_{timestamp}"></div>',
                    '<i class="fa fa-file-archive-o" aria-hidden="true" style="float:left;font-size: 18px;font-weight: bold;color: brown;"></i>',
                    '<a style ="text-decoration:none" href="{.:this.getBaseUrl}{filePath}{fileName}" target="_blank">&nbsp; {fileName}</a><br/><br/>',
                '</div>',
                '<div style="position:absolute;bottom:5px;right: 2px;color:gray">',
                    '<tpl if="pictureUrl == \'\' || pictureUrl==null">',
                        '<i class="fa fa-user fa-2x"></i>',
                    '<tpl else>',
                        '<img src="{pictureUrl}/small" height=32 width=32 title="{lineName}">',
                    '</tpl>',
                    '<div class="chat-by-name" style>{lineName}</div>',
                '</div>',
            '</div>',
            {
            getBaseUrl : me.getBaseUrl,
            getContent: me.getContent,
            formatDate: me.formatDate
        });

        me.viewConfig = {
            stripeRows: false,
            preserveScrollOnRefresh: false,
            enableTextSelection: true,
            //trackOver: false,
            listeners: {
                refresh: function (view) {
                    if (me.scrollToBottom) {
                        //me.getView().scrollBy(0, 999999, true);
                        //me.getView().focusRow(me.getStore().getCount()-1,1000);
                        //var me = this;
                        if (me.bufferedRenderer) {
                            Ext.defer(function () {
                                if (view.getStore().getCount() > 0) {
                                    view.bufferedRenderer.scrollTo(view.getStore().getCount() - 1,
                                    {
                                        animate:true,
                                        callback : function (item) {
                                            view.focusRow(view.getStore().getCount()-1,1500)
                                        }
                                    });
                                }
                            }, 500)
                        } else {
                            view.focusRow(view.getStore().getCount()-1,500)
                        }
                    }
                }
            }
        },
        me.columns = [{
            header: 'message', dataIndex: 'message', flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                //console.log(record)
                metaData.style = 'white-space: normal;'
                if (record.get("replyToken") == '') {
                    if (record.get("messageType") == 'sticker') {
                        return meStickerTpl.apply(record.data)
                    } else if (record.get("messageType") == 'image') {
                        return meImageTpl.apply(record.data)
                    } else if (record.get("messageType") == 'audio') {
                        return meAudioTpl.apply(record.data)
                    } else if (record.get("messageType") == 'video') {
                        return meVideoTpl.apply(record.data)
                    } else if (record.get("messageType") == 'template') {
                        return meTemplateTpl.apply(record.data)
                    }
                    return meMessageTpl.apply(record.data)
                }
                if (record.get("messageType") == 'sticker') {
                    return stickerTpl.apply(record.data)
                } else if (record.get("messageType") == 'image') {
                    return imageTpl.apply(record.data)
                } else if (record.get("messageType") == 'audio') {
                    return audioTpl.apply(record.data)
                } else if (record.get("messageType") == 'video') {
                    return videoTpl.apply(record.data)
                } else if (record.get("messageType") == 'location') {
                    return locationTpl.apply(record.data)
                } else if (record.get("messageType") == 'file') {
                    return fileTpl.apply(record.data)
                }

                return messageTpl.apply(record.data)
            }
        }]

        me.callParent();
    },
    
    getBaseUrl : function() {
        return LineChat.app.baseURL
    },
    formatDate: function (v) {
        if (v === undefined || v === null) return '';
        if (LineChat.app.info.currentYear != v.getFullYear()){
            return Ext.Date.format(v, "d/m/Y H:i")
        } else if(LineChat.app.info.currentMonth != v.getMonth()){
            return Ext.Date.format(v, "d,M H:i")
        } else if(LineChat.app.info.currentDay == v.getDate()){
            return Ext.Date.format(v, "H:i")
        } else {
            return Ext.Date.format(v, "d,M H:i")
        }
    },
    getContent: function (v) {
        //if (v == END_CHAT_SIGNAL) return "<font color=blue>Exit chat ...</font>"
        return v === undefined || v === null ? '' : v.replace(/\n/g, '<br/>');
    }
});
