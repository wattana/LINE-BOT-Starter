/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('LineChat.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'LineChat.view.main.MainController',
        'LineChat.view.main.MainModel',
        'LineChat.view.main.List',
        'LineChat.view.main.MessageList',
        'LineChat.view.main.UserList',
        'LineChat.view.main.MessageChat'
    ],
    layout: 'border',

    controller: 'main',
    viewModel: 'main',

    initComponent: function() {
        var me = this;
        var sticker1 = [];
        for (i=1;i<=17;i++) sticker1.push([1,i])
        sticker1.push([1,21])
        for (i=100;i<=139;i++) sticker1.push([1,i])
        for (i=401;i<=430;i++) sticker1.push([1,i])
        
        var sticker2 = [];
        for (i=18;i<=20;i++) sticker2.push([2,i])
        for (i=22;i<=47;i++) sticker2.push([2,i])
        for (i=140;i<=179;i++) sticker2.push([2,i])
        for (i=501;i<=527;i++) sticker2.push([2,i])

        var sticker3 = [];
        for (i=180;i<=259;i++) sticker3.push([3,i])

        var sticker4 = [];
        for (i=260;i<=307;i++) sticker4.push([4,i])
        for (i=601;i<=632;i++) sticker4.push([4,i])

        var sticketTpl= [
            '<tpl for=".">',
                '<div class="dataview-multisort-item">',
                    '<img src="http://dl.stickershop.line.naver.jp/products/0/0/100/{packageId}/PC/stickers/{stickerId}_key.png" />',
                '</div>',
            '</tpl>'
        ];

        var west = Ext.create("Ext.tab.Panel",{
            region : 'west',
            width : 520,
            ui: 'navigation',
            tabBarHeaderPosition: 1,
            titleRotation: 0,
            tabRotation: 0,

            header: {
                layout: {
                    align: 'stretchmax'
                },
                title: {
                    bind: {
                        text: '{name}'
                    },
                    flex: 0,
                    style : {
                        fontSizex:'20px',
                        padding : 0,
                        marginLeft: '2px'
                    }
                },
                iconCls: 'fa-th-list'
            },

            tabBar: {
                flex: 2,
                layout: {
                    align: 'stretch',
                    overflowHandler: 'none'
                }
            },

            responsiveConfig: {
                tall: {
                    headerPosition: 'left'
                },
                wide: {
                    headerPosition: 'left'
                }
            },
            headerPosition: 'bottom',

            defaults: {
                bodyPadding: 2,
                scrollable: true,                
                tabConfig: {
                    plugins: 'responsive',
                    responsiveConfig: {
                        wide: {
                            iconAlign: 'top',
                            textAlign: 'center'
                        },
                        tall: {
                            iconAlign: 'top',
                            textAlign: 'center',
                            width: 120
                        }
                    }
                }
            },
            items: [{
                title: 'Contact',
                iconCls: 'fa-users',
                layout: 'fit',
                items: [{
                    xtype: 'contacts'
                }]
            }, {
                title: 'Chat',
                xtype : 'panel',
                iconCls: 'fa-weixin',//fa-home',
                layout: 'fit',
                items: [{
                    xtype: 'roomlist'
                }]
            }, {
                title: 'Users',
                iconCls: 'fa-user',
                layout: 'fit',
                items: [{
                    xtype: 'userlist'
                }]
            }, {
                titles: 'Settings',
                iconCls: 'fa-cog',
                items : {
                    title : 'Settings',
                    items : {
                        padding : 150,
                        html: '<a href="https://line.me/R/ti/p/%40bmq9116z" target="_blank"><img height="36" border="0" alt="เพิ่มเพื่อน" src="https://scdn.line-apps.com/n/line_add_friends/btn/en.png"></a>'
                    }
                }
            }] 
        });

        var center  = Ext.create("Ext.panel.Panel",{
            region: 'center',
            layout: {
                type: 'vbox',
                padding: 1,
                align: 'stretch'
            },
            items: [{
                title: 'Message',
                xtype : 'form',
                reference : 'roomInfoForm',
                layout: 'hbox',
                bodyStyle: {
                    background: '#eeeeee'
                },
                bodyPadding : 2,
                items: [{
                    xtype: 'image',
                    name: 'picture',
                    width: 42,
                    height: 42,
                    srcx: 'DisplayImage.ashx?imageName=NO_USER_MAGE.png'
                }, {
                    xtype: 'displayfield',
                    flex : 1,
                    name : 'displayName',
                    margin: '0 0 0 6',
                    value: ''
                },{
                    xtype: 'displayfield',
                    labelAlign : 'right',
                    hidden : true,
                    fieldLabel: 'Talk Time',
                    name: 'talktime',
                    value :""
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'userId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'talkerId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'agentId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'contactId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'pictureUrl'
                }]
            }, {
                xtype : 'messagechat',
                flex: 1
            },{
                xtype: 'form',
                name : 'sendMessageForm',
                reference : 'sendMessageForm',
                //flex: 1,
                listeners: {
                    afterrenderx: function (form, options) {
                        this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                            enter: function () {
                                form.up("panel").down("button[action=search]").fireEvent('click');
                            },
                            scope: this
                        });
                    }
                },
                bodyPadding: 2,
                border: false,
                frame : false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype : 'tabpanel',
                    reference : 'helper',
                    height : 230,
                    hidden: true,
                    items : [{
                        title : 'ช่วยเหลือ',
                        layout: 'fit',
                        items : [{
                            xtype: 'dataview',
                            tpl: [
                                '<tpl for=".">',
                                    '<div class="dataview-multisort-item">',
                                        '<img src="/resources/images/{thumb}" />',
                                        '<h3>{name}</h3>',
                                    '</div>',
                                '</tpl>'
                            ],
                            scrollable : true,
                            
                            itemSelector: 'div.dataview-multisort-item',
                            store: Ext.create('Ext.data.Store', {
                                sortOnLoad: true,
                                fields: ['name', 'thumb', 'url', 'type'],
                                proxy: {
                                    type: 'ajax',
                                    url : 'data/sencha-touch-examples.json',
                                    reader: {
                                        type: 'json',
                                        rootProperty: ''
                                    }
                                },
                                data : [
                                    {
                                        name: 'Address',
                                        thumb: 'address.png',
                                        url: 'kitchensink',
                                        type: 'Application'
                                    },
                                    {
                                        name: 'Promotion',
                                        thumb: 'promotion.png',
                                        url: 'twitter',
                                        type: 'Application'
                                    },
                                    {
                                        name: 'News',
                                        thumb: 'news.png',
                                        url: 'kiva',
                                        type: 'Application'
                                    }
                                ]
                            }),
                            listeners : {
                                itemclick : 'onHelpItemClick'
                            }
                        }]
                    },{
                        icon:'http://dl.stickershop.line.naver.jp/products/0/0/100/1/PC/tab_on.png',
                        layout: 'fit',
                        items : [{
                            xtype: 'dataview',
                            tpl: sticketTpl,
                            scrollable : true,
                            itemSelector: 'div.dataview-multisort-item',
                            store: Ext.create('Ext.data.ArrayStore', {
                                sortOnLoad: true,
                                fields: ['packageId', 'stickerId'],
                                data : sticker1
                            }),
                            listeners : {
                                itemclick : 'onStickerClick'
                            }
                        }]
                    },{
                        icon:'http://dl.stickershop.line.naver.jp/products/0/0/100/2/PC/tab_off.png',
                        layout: 'fit',
                        items : [{
                            xtype: 'dataview',
                            tpl: sticketTpl,
                            scrollable : true,
                            itemSelector: 'div.dataview-multisort-item',
                            store: Ext.create('Ext.data.ArrayStore', {
                                sortOnLoad: true,
                                fields: ['packageId', 'stickerId'],
                                data : sticker2
                            }),
                            listeners : {
                                itemclick : 'onStickerClick'
                            }
                        }]
                    },{
                        icon:'http://dl.stickershop.line.naver.jp/products/0/0/100/3/PC/tab_off.png',
                        layout: 'fit',
                        items : [{
                            xtype: 'dataview',
                            tpl: sticketTpl,
                            scrollable : true,
                            itemSelector: 'div.dataview-multisort-item',
                            store: Ext.create('Ext.data.ArrayStore', {
                                sortOnLoad: true,
                                fields: ['packageId', 'stickerId'],
                                data : sticker3
                            }),
                            listeners : {
                                itemclick : 'onStickerClick'
                            }
                        }]
                    },{
                        icon:'http://dl.stickershop.line.naver.jp/products/0/0/100/4/PC/tab_off.png',
                        layout: 'fit',
                        items : [{
                            xtype: 'dataview',
                            tpl: sticketTpl,
                            scrollable : true,
                            itemSelector: 'div.dataview-multisort-item',
                            store: Ext.create('Ext.data.ArrayStore', {
                                sortOnLoad: true,
                                fields: ['packageId', 'stickerId'],
                                data : sticker4
                            }),
                            listeners : {
                                itemclick : 'onStickerClick'
                            }
                        }]
                    }]
                },{
                    layout: 'hbox',
                    items : [{
                        xtype: 'textarea',
                        stylex: {
                            width: '100%',
                            height: '15px'
                        },
                        columnWidth: 1,
                        emptyText : 'Please enter message.',
                        flex : 1,
                        grow: true,
                        growMin: 90,
                        growMax: 200,
                        growAppend: '-',
                        name: 'message',
                        colspan: 2
                    }, {
                        xtype: 'button',
                        text: 'ส่งข้อความ',
                        scale : 'medium',
                        action : 'sendMessage',
                        style: {
                            marginLeft: '5px',
                            marginBottom: '5px'
                        },
                        formBind: true,
                        hidden : true,
                        handler : 'onSendBtnClick'
                    }, {
                        xtype: 'button',
                        scale : 'medium',
                        text: 'Send',
                        action : 'sendContactMessage',
                        style: {
                            marginLeft: '5px',
                            marginBottom: '5px'
                        },
                        formBind: true,
                        hidden : true,
                        handler : 'onSendContactBtnClick'
                    }, {
                        xtype: 'button',
                        scale : 'medium',
                        action : 'sticket',
                        style: {
                            marginLeft: '2px',
                            marginBottom: '5px',
                            backgroundColor : 'white'
                        },
                        frame: false,
                        border: false,
                        iconCls : 'icon-sticker',
                        enableToggle : true,
                        toggleHandler : 'onStickerBtnClick' 
                    }, {
                        xtype : 'component',
                        width : 40,
                        height: 40,
                        html : ['<span style="padding:10px;font-size: 20px;" class="btn btn-success fileinput-button">',
                                    '<i class="fa fa-upload"></i>',
                                    '<span> </span>',
                                    '<input id="fileupload" type="file" name="upload" multiple>',
                                '</span>'
                            ].join(""),
                        listeners : {
                            afterrender : function () {
                                /*jslint unparam: true */
                                /*global window, $ */
                                $(function () {
                                    'use strict';
                                    // Change this to the location of your server-side upload handler:
                                    var url = window.location.hostname === 'blueimp.github.io' ?
                                                '//jquery-file-upload.appspot.com/' : 'upload';
                                    $('#fileupload').fileupload({
                                        //url: "http://localhost:3000/"+url,
                                        url : url,
                                        dataType: 'json',
                                        done: function (e, data) {
                                            console.log("data",data)
                                            /*
                                            $.each(data.result.files, function (index, file) {
                                                $('<p/>').text(file.name).appendTo('#files');
                                            });
                                            */
                                        },
                                        progressall: function (e, data) {
                                            console.log("progressall",data.loaded , data.total)
                                            /*
                                            var progress = parseInt(data.loaded / data.total * 100, 10);
                                            $('#progress .progress-bar').css(
                                                'width',
                                                progress + '%'
                                            );
                                            */
                                        }
                                    }).prop('disabled', !$.support.fileInput)
                                        .parent().addClass($.support.fileInput ? undefined : 'disabled');
                                });
                            }
                        }    
                    }]

                }]
            }]
        })
        me.items = [west , center]

        me.callParent();
    }
});
