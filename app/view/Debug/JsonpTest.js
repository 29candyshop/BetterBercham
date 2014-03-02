// Ext.define('ModelDebug', {
    // extend: 'Ext.data.Model',
    // config: {
        // fields: ['DebugTitle', 'DebugURL']
    // }
// });

// Ext.create('Ext.data.Store', {
    // id: 'DebugList',
    // model: 'ModelDebug',
    // sorters: 'DebugTitle',
    // grouper: function(record) {
        // return record.get('DebugTitle')[0];
    // },
    // data: [
			// {DebugTitle: 'Get Test String', DebugURL: '-'},
			// {DebugTitle: 'Get Total Post', DebugURL: '-'},
			// {DebugTitle: 'Get Total Post from MPPP', DebugURL: '-'},
			// {DebugTitle: 'Get Total Post From MPSP', DebugURL: '-'},
        // ]
// });

Ext.define('BetterPenang.view.Debug.JsonpTest', {
     extend: 'Ext.Container',    
     xtype : 'myjsonptest',

    config: {
        cls: 'x-contacts',
        width: Ext.os.deviceType == 'Phone' ? 330 : 330,
        height: Ext.os.deviceType == 'Phone' ? 550 : 550,
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
		items: [
			 {
				xtype: "toolbar",
				docked: "top",
				title: "JSONP Testing Page",
				items: [
					{
						xtype: "button",
						ui: "back",
						text: "back",
						itemId: "backButton"
					}
				]
			},
			{
				xtype: 'container',
				flex: '1',
				layout: {
					type: 'vbox',
					align: 'stretch',
					pack: 'start'
				},
				items: 
				[
					// {
						// width: Ext.os.deviceType == 'Phone' ? 320 : 320,
						// height: Ext.os.deviceType == 'Phone' ? 500 : 500,
						// xtype: 'list',
						// id: 'debuglist',
						// ui: 'round',
						
						// //emptyText: '<p class="no-searches">No More Posts</p>',
						// grouped: false,
						// pinHeaders: false,
						// onItemDisclosure: function(record, btn, index) {
			
						// },
						// cls: 'x-contacts',
						// store: 'DebugList', //getRange(0, 9),                               
							  // itemTpl: [
								// '<div class=\"list-item-narrative\">{DebugTitle}</div>',
								// '<span>-</span>',
							// ].join('')
					// }
				]
			},
		],
		listeners: 
		[
			{
				delegate: "#backButton",
				event: "tap",
				fn: "onBackButtonTap"
			},
			{
				delegate: "#refreshButton",
				event: "tap",
				fn: "onRefreshTap"
			}
        ]
        
    },
      
    onRefreshTap: function () {
        //Ext.Msg.alert('Tap', 'Post Complaint', Ext.emptyFn);
        //console.log("deleteNoteCommand");
        this.fireEvent("RefreshCommand", this);
    },
    onBackButtonTap: function () {
        //Ext.Msg.alert('Tap', 'Back', Ext.emptyFn);
        //console.log("backToHomeCommand");
        this.fireEvent("backToHomeCommand", this);
    }
});
