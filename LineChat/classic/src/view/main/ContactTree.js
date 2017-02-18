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
        this.tbarx = [{
            text : 'test',
            handler : function () {
                var rec = me.getStore().getAt(0);
                console.log(rec)
                me.getStore().getAt(0).set("user",'wat')
                me.getStore().getAt(0).set("task",'task')
            }
        }]
        me.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: {
                flex: 1,
                xtype: 'searchfield',
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
                rendererx: function (value, metaData, record, rowIndex, colIndex, store) {
                    console.log('wat',value)
                    // style the cell differently depending on how the value relates to the
                    // average of all values
                    var average = store.average('grades');
                    metaData.tdCls = (value < average) ? 'needsImprovement' : 'satisfactory';
                    return value+"-<br/>"+record.get("user");
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