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
        

        var west = Ext.create("Ext.tab.Panel",{
            region : 'west',
            width : 545,
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
                title: 'Settings',
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
                padding: '2',
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
                minHeight : 200,
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
                bodyPadding: 10,
                border: false,
                layout: {
                    type: 'vbox',
                    padding: '5',
                    align: 'stretch'
                },
                items: [{
                    layout: 'column',
                    items : [{
                        xtype: 'textarea',
                        style: {
                            width: '100%',
                            height: '15px'
                        },
                        columnWidth: 1,
                        flex : 1,
                        grow: true,
                        growMin: 25,
                        growMax: 200,
                        growAppend: '-',
                        name: 'message',
                        colspan: 2
                    }, {
                        xtype: 'button',
                        text: 'ส่งข้อความ',
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
                        text: 'Send',
                        action : 'sendContactMessage',
                        style: {
                            marginLeft: '5px',
                            marginBottom: '5px'
                        },
                        formBind: true,
                        hidden : true,
                        handler : 'onSendContactBtnClick'
                    }]
                },{
                    title : 'ช่วยเหลือ',
                    xtype : 'fieldset',
                    height : 180,
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
                }]
            }]
        })
        me.items = [west , center]

        me.callParent();
    }
});
