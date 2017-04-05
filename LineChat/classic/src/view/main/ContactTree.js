Ext.define('LineChat.view.main.ContactTree', {
    extend: 'Ext.tree.Panel',
    
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'LineChat.ux.SearchField'
    ],    
    xtype: 'contact-tree',
    
    reserveScrollbar: true,
    
    title: 'Contacts',
    height: 370,
    useArrows: true,
    rootVisible: false,
    multiSelect: true,
    singleExpand: false,
    hideHeaders : true,
    
    initComponent: function() {
        var me = this;
        this.width = 600;
        var talkerWithTpl = Ext.create('Ext.XTemplate',
            '<div class="chat-room-item" style="position: absolute;top: 0px;width: 403px;left: 100px;">',
                '<div class="chat-message" style="padding:3px;float:right">',
                    '<div style="float:left;margin-right: 1px;color:{[this.statusColor(values.waitFlag,values.talkDatetime)]}">',
                        '<i class="fa fa-comment fa-lg"></i>',
                    '</div>',
                    '<div class="chat-datetime">{[this.elapsed(values.waitFlag,values.talkDatetime,values.joinDatetime)]}</div>',
                    '<tpl if="unread &gt; 0">',
                        '<span class="chat-by-name x-tab-badgeCls" style="top: 25px;right: 29px;">{unread}</span>',
                    '</tpl>',
                    '<i title="Delete" class="fa fa-minus-circle delete-btn" aria-hidden="true" style="font-size: 26px;float: right;color: orangered;"></i>',
                '</div>',
                '<div class="chat-message" style="padding:3px;">',
                    '<span class="chat-by-name" style="margin-right: 2px">{[this.getDisplayName(values)]}</span>',
                    '<div class="chat-message">',
                        '<span class="chat-by-name" style="margin-right: 2px">{[this.getMessage(values)]} </span>',
                    '</div>',
                '</div>',
            '</div>',
            {
                getMessage : function (message) {
                    if (message.messageType != 'text') {
                        if (message.sourceType == 'agent') {
                            return Ext.String.ellipsis("You "+message.messageText, 30)
                        } else {
                            return Ext.String.ellipsis(message.displayName+" "+message.messageText, 30)
                        }
                    }
                    return Ext.String.ellipsis(message.messageText, 30)
                },
                getDisplayName : function (message) {
                    return Ext.String.ellipsis(message.personName||message.displayName, 30)
                },
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
        this.tbarx = [{
            text : 'test',
            handler : function () {
                /*
                var rec = me.getStore().getAt(0);
                console.log(rec)
                me.getStore().getAt(0).set("user",'wat')
                me.getStore().getAt(0).set("task",'task')
                */
                var contactStore = Ext.getStore("ContactTree");
                var record = contactStore.findRecord("contactId", "489057F9-1F48-49B6-9464-BD2247C23642")

                console.log(record)
                var rootNode = me.getRootNode()
                me.getStore().load({
                    node : record
                })
            }
        }]
        me.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: {
                flex: 1,
                xtype: 'searchfield',
                onFieldMutation: function(e) {
                    var me = this,
                    key = e.getKey(),
                    isDelete = key === e.BACKSPACE || key === e.DELETE,
                    rawValue = me.inputEl.dom.value,
                    len = rawValue.length;
                    if (me.doQueryTask) {
                        me.doQueryTask = new Ext.util.DelayedTask(me.doRawQuery, me);
                    }
                    if (!me.readOnly && (rawValue !== me.lastMutatedValue || isDelete) && key !== e.TAB) {
                        me.lastMutatedValue = rawValue;
                        me.lastKey = key;
                        if (len && (e.type !== 'keyup' || (!e.isSpecialKey() || isDelete))) {
                            me.doQueryTask.delay(me.queryDelay);
                        }
                    }
                },
                doRawQuery : function () {
                    var me = this,
                    query = me.inputEl.dom.value;
                    if (query.length >= 3) {
                        me.onSearchClick()
                    }
                },
                listeners : {
                    afterrender :function ( me , eOpts ) {
                        me.doQueryTask = new Ext.util.DelayedTask(me.doRawQuery, me);
                    }
                },
                store: 'ContactTree'
            }
        }]
        var data = {
            "text": ".",
            "children": [
                {
                    "task": "Project: Shopping",
                    "duration": 13.25,
                    "user": "Tommy Maintz",
                    "iconCls": "tree-grid-task-folder",
                    "expanded": true,
                    "children": [
                        {
                            "task": "Housewares",
                            "duration": 1.25,
                            "user": "Tommy Maintz",
                            "iconCls": "tree-grid-task-folder",
                            "children": [
                                {
                                    "task": "Kitchen supplies",
                                    "duration": 0.25,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task"
                                }, {
                                    "task": "Groceries",
                                    "duration": .4,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task",
                                    "done": true
                                }, {
                                    "task": "Cleaning supplies",
                                    "duration": .4,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task"
                                }, {
                                    "task": "Office supplies",
                                    "duration": .2,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task"
                                }
                            ]
                        }, {
                            "task": "Remodeling",
                            "duration": 12,
                            "user": "Tommy Maintz",
                            "iconCls": "tree-grid-task-folder",
                            "expanded": true,
                            "children": [
                                {
                                    "task": "Retile kitchen",
                                    "duration": 6.5,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task"
                                }, {
                                    "task": "Paint bedroom",
                                    "duration": 2.75,
                                    "user": "Tommy Maintz",
                                    "iconCls": "tree-grid-task-folder",
                                    "children": [
                                        {
                                            "task": "Ceiling",
                                            "duration": 1.25,
                                            "user": "Tommy Maintz",
                                            "iconCls": "tree-grid-task",
                                            "leaf": true
                                        }, {
                                            "task": "Walls",
                                            "duration": 1.5,
                                            "user": "Tommy Maintz",
                                            "iconCls": "tree-grid-task",
                                            "leaf": true
                                        }
                                    ]
                                }, {
                                    "task": "Decorate living room",
                                    "duration": 2.75,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task",
                                    "done": true
                                }, {
                                    "task": "Fix lights",
                                    "duration": .75,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task",
                                    "done": true
                                }, {
                                    "task": "Reattach screen door",
                                    "duration": 2,
                                    "user": "Tommy Maintz",
                                    "leaf": true,
                                    "iconCls": "tree-grid-task"
                                }
                            ]
                        }
                    ]
                }, {
                    "task": "Project: Testing",
                    "duration": 2,
                    "user": "Core Team",
                    "iconCls": "tree-grid-task-folder",
                    "children": [
                        {
                            "task": "Mac OSX",
                            "duration": 0.75,
                            "user": "Tommy Maintz",
                            "iconCls": "tree-grid-task-folder",
                            "children": [
                                {
                                    "task": "FireFox",
                                    "duration": 0.25,
                                    "user": "Tommy Maintz",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }, {
                                    "task": "Safari",
                                    "duration": 0.25,
                                    "user": "Tommy Maintz",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }, {
                                    "task": "Chrome",
                                    "duration": 0.25,
                                    "user": "Tommy Maintz",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }
                            ]
                        }, {
                            "task": "Windows",
                            "duration": 3.75,
                            "user": "Darrell Meyer",
                            "iconCls": "tree-grid-task-folder",
                            "children": [
                                {
                                    "task": "FireFox",
                                    "duration": 0.25,
                                    "user": "Darrell Meyer",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }, {
                                    "task": "Safari",
                                    "duration": 0.25,
                                    "user": "Darrell Meyer",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }, {
                                    "task": "Chrome",
                                    "duration": 0.25,
                                    "user": "Darrell Meyer",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }, {
                                    "task": "Internet Explorer",
                                    "duration": 3,
                                    "user": "Darrell Meyer",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }
                            ]
                        }, {
                            "task": "Linux",
                            "duration": 0.5,
                            "user": "Aaron Conran",
                            "iconCls": "tree-grid-task-folder",
                            "children": [
                                {
                                    "task": "FireFox",
                                    "duration": 0.25,
                                    "user": "Aaron Conran",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }, {
                                    "task": "Chrome",
                                    "duration": 0.25,
                                    "user": "Aaron Conran",
                                    "iconCls": "tree-grid-task",
                                    "leaf": true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        Ext.apply(this, {
            store : 'ContactTree',
            storex: new Ext.data.TreeStore({
                fields: [{
                    name: 'task',
                    type: 'string'
                }, {
                    name: 'user',
                    type: 'string'
                }, {
                    name: 'duration',
                    type: 'float'
                }, {
                    name: 'done',
                    type: 'boolean'
                }],
                proxyx: {
                    type: 'ajax',
                    url: LineChat.app.baseURL + 'listContactTree'
                },
                folderSort: true,
                data : data
            }),
            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'Task',
                flex: 1,
                sortable: true,
                dataIndex: 'displayName',
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    //console.log('wat',record)
                    if (record.get("leaf")) {
                        metaData.style="min-height: 50px;"
                        return talkerWithTpl.apply(record.data)
                    }
                    return value;
                }
            }]
        });
        this.callParent();
    },

    listeners: {
        rowclick: 'contactTalkingWith',
        itemclick: function (v, r) {
            r.isExpanded() ? r.collapse() : r.expand();
        }
    }
});