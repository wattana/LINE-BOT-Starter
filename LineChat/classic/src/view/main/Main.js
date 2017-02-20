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
                        marginLeft: '5px'
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
                    xtype: 'contact-tree',
                    glyph: 'xf0c0@FontAwesome'
                }]
            }, {
                title: 'Request',
                layout: 'fit',
                hidden : true,
                items: [{
                    xtype: 'mainlist',
                    store : 'Request',
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        store: 'Request', // same store GridPanel is using
                        dock: 'bottom',
                        displayInfo: true
                    }]
                }]            
            }, {
                title: 'Contact',
                hidden : true,
                iconCls: 'fa-users',
                layout: 'fit',
                items: [{
                    xtype: 'contacts'
                }]
            },{
                title: 'Chat',
                xtype : 'panel',
                iconCls: 'fa-weixin',//fa-home',
                layout: 'fit',
                items: [{
                    glyph: 'xf0e6@FontAwesome',
                    xtype: 'roomlist'
                }]
            }, {
                title: 'Dummy',
                iconCls: 'fa-user',
                layout: 'fit',
                items: [{
                    glyph: 'xf007@FontAwesome',
                    title: 'Dummy user',
                    xtype: 'userlist'
                }]
            }, {
                title: 'More',
                iconCls: 'fa-ellipsis-h',//'fa-cog',
                layout : 'fit',
                items : {
                    title : 'More',
                    glyph: 'xf141@FontAwesome',
                    layout: {
                        type: 'vbox',
                        align : 'center',
                        pack : 'center'
                    },
                    defaults : {
                        scale:'medium',
                        width : 130,
                        margin: '0 0 10 0'
                    },
                    items : [{
                        //padding : 150,
                        xtype : 'component',
                        //text : 'test'
                        width : 130,
                        height : 36,
                        //icon : 'https://scdn.line-apps.com/n/line_add_friends/btn/en.png',
                        html: '<a href="https://line.me/R/ti/p/%40bmq9116z" target="_blank"><img height="36" border="0" alt="เพิ่มเพื่อน" src="https://scdn.line-apps.com/n/line_add_friends/btn/en.png"></a>'
                    },{
                        xtype : 'button',
                        text : 'logout',
                        glyph: 'xf08b@FontAwesome',
                        handler : function () {
                            location = LineChat.app.baseURL+"login/logout"
                        }
                    },{
                        xtype : 'form',
                        itemId : 'form2',
                        hidden : true,
                        width : 400,
                        frame : false,
                        margin : '10 0 0 0',
                        padding : 2,
                        defaults: {
                            labelWidth: 180
                        },
                        title : 'เอกสารประกอบ/Document',
                        items : [{
                            xtype: 'textfield',
                            name: 'description',
                            rows : 5,
                            colspanx : 2
                        },{
                            xtype: 'filefield',
                            name: 'recFile',
                            msgTarget: 'side',
                            buttonText: 'เลือกไฟล์/Select',
                            allowBlank: false,
                            buttonOnly : false,
                            margin : '0px 0 0 0px',
                            fieldLabel: 'ชื่อไฟล์/File'
                        },{
                            xtype : 'button',
                            action : 'upload',
                            margin : '0px 0 0 140px',
                            text: 'นำเข้า / Upload',
                            rowspanx : 2,
                            scalex : "medium",
                            formBind : true,
                            handler : function(btn) {
                                var main = this.up('form');
                                var form = main.getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        url: 'http://vm:46233/lineservice.asmx/sendImage', 
                                        waitMsg: 'Uploading ...',
                                        success: function (form, action) {
                                        },
                                        failure: function (form, action) {
                                            Ext.Msg.alert('Failed', action.result.msg, function () {                                                    
                                            });
                                        }
                                    });
                                }
                            }
                        }]
                    }]
                }
            }] 
        });

        var center  = Ext.create("Ext.panel.Panel",{
            region: 'center',
            disabled : true,
            bodyPadding : 1,
            reference : 'center',
            layout: {
                type: 'vbox',
                padding: 1,
                align: 'stretch'
            },
            items: [{
                title: 'Message',
                glyph: 'xf1d7@FontAwesome',
                xtype : 'form',
                reference : 'roomInfoForm',
                layout: 'hbox',
                bodyStyle: {
                    background: '#eeeeee'
                },
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
                },{
                    flex : 1
                } ,{
                    xtype : 'button',
                    glyph: 'xf24d@FontAwesome',
                    text : 'ออกใบงาน',
                    disabled : true,
                    margin : '2 0 0 2',
                    reference : 'createRequestBtn',
                    handler : 'onCreateRequestClick'
                } ,{
                    xtype : 'button',
                    glyph: 'xf133@FontAwesome',
                    margin : '2 0 0 2',
                    text : 'แสดงใบงาน',
                    handler : 'onRequestListClick'
                } ,{
                    xtype : 'button',
                    glyph: 'xf233@FontAwesome',
                    margin : '2 0 0 2',
                    text : 'ดูข้อความทั้งหมด',
                    handler : 'onMoreMessageClick'
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
                bufferedRenderer : false,
                flex: 1,
                listeners : {
                    selectionchange :  function( sm , selected , eOpts ) {
                        var btn = me.down("button[reference=createRequestBtn]")
                        var selection = sm.getSelection()
                        if (selected.length)
                            btn.setText("ออกใบงาน ("+sm.getSelection().length+")")
                        else
                            btn.setText("ออกใบงาน")
                        btn.setDisabled(selection == 0) 
                    }
                }
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
                        colspan: 2,
                        enableKeyEvents : true,
                        listeners : {
                            keypress : function ( field , e , eOpts ) {
                                if (e.getKey() === e.ENTER ) {
                                    //console.log("enter")
                                    if (e.altKey) {
                                        var content = field.getValue();
                                        var el = field.inputEl.dom;
                                        var caret = el.selectionStart;
                                        field.setValue(content.substring(0, caret) + "\n" + content.substring(caret, content.length));
                                        el.setSelectionRange(caret+1, caret+1);
                                        e.stopPropagation();
                                    } else {
                                        var ctrl = me.getController()
                                        var btn = me.down("button[action=sendMessage]");
                                        if (btn.isVisible()) {
                                            ctrl.onSendBtnClick.call(ctrl, btn);
                                        } else {
                                            ctrl.onSendContactBtnClick.call(ctrl, me.down("button[action=sendContactMessage]"));
                                        }
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }
                                }
                            }
                        }
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
                        text: 'ส่งข้อความ',
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
                        reference : 'stickerBtn',
                        action : 'sticker',
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
                                    '<input id="fileupload" type="file" name="uploadFile" multiple>',
                                '</span>'
                            ].join(""),
                        listeners : {
                            afterrender : "uploadHandler"
                        }    
                    }]

                }]
            }]
        })
        me.items = [west , center]

        me.callParent();
    }
});
