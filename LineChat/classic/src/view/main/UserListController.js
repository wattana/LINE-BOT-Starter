Ext.define('LineChat.view.main.UserListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.userlist',

    onItemSelected: function (sender, record) {
        console.log(record)
        var me = this;
        if (!this.contactPersonWin) {
            var store = Ext.create("Ext.data.BufferedStore",{
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
                    },
                    {
                        name: 'open_date',
                        type: 'date',
                        dateFormat:"YmdHis"
                    }
                ],
                autoLoad : true,
                pageSize : 25,
                proxy: {
                    type: 'ajax',
                    url: LineChat.app.baseURL+'listContactPerson',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            });
            var win=
                Ext.create('Ext.window.Window', {
                title: 'User Dummy',
                closeAction : 'hide',
                height: 400,
                width: 850,
                constrain : true,
                modal : true,
                layoutx : {
                    type : 'vbox',
                    align : 'stretch',
                    pack: 'start'
                },
                layout : 'border',
                items: [{ 
                    xtype : 'form',
                    region : 'center',
                    layout : 'fit',
                    items : [{
                        xtype : 'fieldset',
                        title : LineChat.app.isEn?'Detail':'รายละเอียด',
                        layoutx : {
                            type : 'hbox'
                        },
                        defaults:{
                            submitValue : true
                        },
                        items :[{
                            xtype : 'displayfield',
                            fieldLabel : 'Display Name',
                            name : 'line_name'
                        },{
                            xtype : 'displayfield',
                            fieldLabel : 'User Id',
                            name : 'line_id'   
                        },{ 
                            xtype: 'fieldcontainer',                    
                            fieldLabel: 'Contact',
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                readOnly: 'true',
                                margin: '0 5 0 0'
                            },
                            items : [{
                                xtype:'hidden',
                                name : 'contactId'
                            },{
                                xtype:'hidden',
                                name : 'contactPersonId'
                            },
                            {
                                xtype: 'displayfield',
                                readOnly: false,
                                name: 'personName',
                                width: 170,
                                fieldStyle:"text-transform:uppercase",
                                listeners : {
                                    blur : function ( field , event , eOpts ) {
                                        var form = field.up("form[name=searchForm]").getForm();
                                        if (field.getValue()) {
                                            ///DssWeb.app.showMask();
                                            Ext.Ajax.request({
                                                url: DssWeb.app.env.BASE_URL+"commonInquiryCA/listSecurity",
                                                headersx: { 'Content-Type': 'application/json','Accept': 'application/json' },
                                                withCredentials : true,
                                                params : {
                                                    istrSecurityAbbr : field.getValue()
                                                },
                                                success: function(response, opts) {
                                                    var result = Ext.decode(response.responseText).rows;
                                                    if (result.length) {
                                                        var me = this;
                                                        var item = result[0];
                                                        form.findField("iintSecurityID").setValue(item.Security_ID)
                                                        form.findField("Security_Abbr").setValue(item.Security_Abbr)
                                                        form.findField("ISIN_Code").setValue(item.ISIN_Code)
                                                        form.findField("Security_Name_Thai").setValue(item.Security_Name_Thai)
                                                        form.findField("Security_Name_Eng").setValue(item.Security_Name_Eng)
                                                        form.findField("istrMarketID").setValue(item.Security_ID)
                                                        form.findField("Market_Name").setValue(item.Market_Name)
                                                    } else {
                                                        Ext.Msg.alert('Error', DssWeb.app.isEn ? "NVDR's securities not found" : "ไม่พบข้อมูลหลักทรัพย์", function () {
                                                            form.findField("iintSecurityID").reset()
                                                            form.findField("Security_Abbr").reset()
                                                            form.findField("ISIN_Code").reset()
                                                            form.findField("Security_Name_Thai").reset()
                                                            form.findField("Security_Name_Eng").reset()
                                                            form.findField("istrMarketID").reset()
                                                            form.findField("Market_Name").reset()                             
                                                        });
                                                    }
                                                    //DssWeb.app.hideMask();
                                                },
                                                failure: DssWeb.app.failureHandler
                                            });
                                        } else {
                                            form.findField("iintSecurityID").reset()
                                                            form.findField("Security_Abbr").reset()
                                                            form.findField("ISIN_Code").reset()
                                                            form.findField("Security_Name_Thai").reset()
                                                            form.findField("Security_Name_Eng").reset()
                                                            form.findField("istrMarketID").reset()
                                                            form.findField("Market_Name").reset()  
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                icon: null,
                                hidden : true,
                                glyph: 'xf002@FontAwesome',
                                handler : 'onListSeurityClick'
                            }]
                        },{
                            xtype: 'displayfield',
                            name: 'personCode'
                        }]
                    }],
                    buttonAlign : 'left',
                    buttons : [{
                        xtype : 'button',
                        text : 'Save',
                        margin : '0 0 0 10',
                        handler : function (btn) {
                            var form = btn.up("form")
                            form.submit({
                                url: LineChat.app.baseURL+"updateContactPerson", 
                                waitMsg: 'Saving ...',
                                success: function (form, action) {
                                    var result = action.result;
                                    if (!result.success) {
                                        Ext.Msg.alert('Error', result.msg);
                                    } else {
                                        Ext.Msg.alert('Success', LineChat.app.isEn?'Save success.':"บันทึกข้อมูลสำเร็จ ", function () {
                                            btn.up("window").close();
                                            Ext.getStore("User").load()
                                            Ext.getStore("ContactTree").load()
                                            Ext.getStore("Room").load()                                            
                                        });
                                    }   
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('Failed', action.result.msg, function () {                                                    
                                    });
                                }
                            });
                        }
                    },{
                        xtype : 'button',
                        margin : '0 0 0 10',
                        text : 'Cancel',
                        handler : function () {
                            this.up("window").close();
                        }
                    }],
                    listeners : {
                        afterrender : function (form){
                            form.loadRecord(record)
                        }
                    }
                },{ 
                    xtype : 'grid',
                    width : 400,
                    region : 'east',
                    split : true,
                    selModel :  {
                        type : 'checkboxmodel',
                        mode : 'SINGLE',
                        allowDeselect : true
                    },
                    dockedItems : [{
                        dock: 'top',
                        xtype: 'toolbar',
                        items: {
                            flex: 1,
                            xtype: 'searchfield',
                            store: store
                        }
                    }],
                    store : store,
                    columns: [
                        { text: LineChat.app.isEn?'Code':'รหัส',  dataIndex: 'person_code', width:120 },
                        { text: LineChat.app.isEn?'Name':'ชื่อ', dataIndex: 'person_name', flex: 1 }
                    ],
                    flex : 1,
                    scrollToBottom : false,
                    listeners : {
                        viewreadyx : function (grid) {
                            grid.getStore().getProxy().setExtraParam("contactId", contactId)                            
                            grid.getStore().load({
                                callback: function (records, operation, success) {
                                }
                            })
                        },
                        selectionchange :  function( sm , selected , eOpts ) {
                            var form = me.contactPersonWin.down("form")
                            if (selected.length)
                                form.getForm().setValues({
                                    contactId : selected[0].get("contact_id"),
                                    contactPersonId : selected[0].get("contact_person_id"),
                                    personCode : selected[0].get("person_code"),
                                    personName : selected[0].get("person_name")
                                })
                        }
                    }
                }],
                buttons : []

            }).show();
            this.contactPersonWin = win;
        } else {
            this.contactPersonWin.show(null,
            function (){
                me.contactPersonWin.down("form").loadRecord(record)
            })
        }
            
    }
})