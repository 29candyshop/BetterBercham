Ext.define('BetterPenang.view.Options', {
     extend: 'Ext.Container',
     xtype : 'options',

    config: {
        title: 'Better Penang',
        cls: 'x-contacts',
//          layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
//                type: 'vbox',
//                align: 'center',
//                pack: 'start'
//            },

             layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
        //store: 'Contacts',
        //cls:  'x-contacts',//'demo-list',
            items: [
                
                {
                 xtype: 'container',
                                flex: '1',
                                layout: {
                                    type: 'vbox',
                                    align: 'center',
                                    pack: 'start'
                                },
                                items: [
                                    {
                                         width: Ext.os.deviceType == 'Phone' ? null : 300,
                                        height: Ext.os.deviceType == 'Phone' ? null : 500,
                                        xtype: 'list',
                                        id: 'optionlist',
                                        ui: 'round',
                    //                layout: {
                    //                    type: 'hbox',
                    //                    align: 'center',
                    //                    pack: 'center'
                    //                },
                                    //docked: 'top',
                                    grouped: false,
                                    pinHeaders: false,
                                    onItemDisclosure: function(record, btn, index) {
                                        //Ext.Msg.alert('DisclosureTap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                    },
                    //                onItemTap: function(record, btn, index) {
                    //                    Ext.Msg.alert('ItemTap', 'Item Tap more info for ' + record.get('firstName'), Ext.emptyFn);
                    //                },
                                    cls: 'x-contacts',
                                    store: 'Contacts', //getRange(0, 9),
                                  
                                    //itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
                                          itemTpl: [
                                            '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
                                            '<div class=\"list-item-narrative\">{firstName}</div>',
                                             '<span>.</span>'
                                        ].join('')
                                    }
                                    ]
                          },
//            {
//              xtype: 'container',
//                                flex: '1',
//                                layout: {
//                                    type: 'vbox',
//                                    align: 'stretch',
//                                    pack: 'end'
//                                },
//                                items: [
//                                     {
//                                        xtype: 'panel',
//                                        flex: '1',
//                                        html: ' '
//                                    },
//                                    {
//                                         xtype: 'component',
//                                         flex: '2',
//                                        html: [
//                                            '<img width="100%;" src="resources/images/penang_bg_2.png" align="center"><br>',
////                                            '<a id="trailerbutton" class="x-button-normal x-button" href="www.google.com">',
////                                            '<span class="x-button-label">Trailer<br>anschauen</span></a>  ', 
//                                        ].join("")
//                                    },
////                                    {
////                                         xtype: 'image',
////                                        //layout: 'fit',
////                                        flex: '3',
////                                        src: 'resources/images/penang_bg_2.png',
////                                        align: 'center'
////                                    }
//                                 ]              
//                //html: 'This image is created by xtype'
//            }
//            {
//                xtype: 'panel',
//                flex:2,
//                html: 'This panel is created by xtype'
//            }
            ]
          
        
//        itemTpl: [
//            '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
//            '{firstName} {lastName}',
//            '<span>{title}</span>'
//        ].join('')
    }
});
