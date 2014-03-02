Ext.Loader.setPath({
    'Ext': 'sdk/src',
	'Ext.plugin': 'sdk/src/plugin'
});



var timeAgoInWords = function(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - time)/1000),//date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 )//|| day_diff >= 31 )
		return "months ago";
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
		day_diff < 365 && Math.ceil( day_diff / 31 ) + " months ago";
}
	

Ext.define('BetterPenang.view.RecentPosts', {
     extend: 'Ext.Container',
    
     xtype : 'recentposts',
	 requires: [
		'Ext.data.JsonP',
        'Ext.List',
		'Ext.carousel.Carousel',
		'Ext.Toolbar',
		'Ext.picker.*',
		'Ext.TitleBar',
    ],
	
	initialize: function () {
        this.callParent(arguments);
		RecentPostMsk = null;
		mRecentPostBody = Ext.getCmp("recentpostbody");
		var recentall = Ext.getCmp("recentlist");
		mFBID = "";
		switch(Ext.os.deviceType)
		{
			case "Phone":
				
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				
				recentall.setWidth(BetterPenang.app.deviceWidth);
				recentall.setHeight(BetterPenang.app.deviceHeight - 160);//110);
				console.log("Phone init for Recent Post");
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				
				recentall.setWidth(BetterPenang.app.deviceWidth * 0.9);
				recentall.setHeight(BetterPenang.app.deviceHeight - 140);
				console.log("Default init for Recent Post");
				break;
		}
		this.on('show', function() {
            try
             {		
				$.ajaxSetup({ cache: false });
				//Reset All Value
				
				if(BetterPenang.app.getController("BetterPGApp").GetCurrentForm() != "viewposts")
				{
					if(Ext.os.deviceType === 'Phone')
					{
						var iphoneselection = Ext.getCmp('iphoneregionselection');				
						iphoneselection.setValue('both');
					}
					else
					{
						var ipadselection = Ext.getCmp('ipadregionselection');
						var ipadcomplaintselection = Ext.getCmp('complaintType');
						//var ipadsearch = Ext.getCmp('search');
						ipadcomplaintselection.setValue('All');
						//ipadsearch.setValue('');
						ipadselection.setValue('both');
					}
				
					RecentPostMsk = "0";
					mRecentPostBody.mask({ xtype: 'loadmask', message: 'Please wait...' });
		
					var mystore = Ext.getStore("Posts");
					mystore.removeAll();
					mystore.sync();
					
					console.log("Init Recent Posts");
			
					$.ajax({
						url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/getTotalPostAndroid?wsdl' + new Date().getTime() + Math.random(),
						data: '{"User":"ALL", "For":"ALL", "Type":"ALL", "PhotoOnly":""}',
						//contentType: "application/json; charset=utf-8",
						cache: false,
						dataType: "json",
						type: 'POST',
						success: function(data, status){
							var length = data.d.length;
							//Ext.Viewport.unmask();
							//Ext.Msg.alert('data', 'length: ' + length , Ext.emptyFn);
							var listcmp = Ext.getCmp("recentlist");
							var mystore = Ext.getStore("Posts");
							var wordlength = 20;
							switch(Ext.os.deviceType)
							{
								case "Phone":
									wordlength = 20;
									break;
									
								default:
									wordlength = 60;
									break;
							}
							simpleDB_token = data.d[0]["TrackingID"];
							
							for(var start = 1; start < length; start++)
							{
								console.log("Data: " + data.d[start]["Title"]);
								var mTitle = data.d[start]["Title"];
								if(mTitle.length > wordlength)
								{
									mTitle = mTitle.substring(0,(wordlength - 1)) + "...";
								}
								var For = data.d[start]["ForPage"];
								if(For == "")
								{
									For = "All";
								}
								mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"], fbid: '' + data.d[start]["FB_post"], address: '' + data.d[start]["Address"] });
							}
							mystore.sync();
							RecentPostMsk = null;
							mRecentPostBody.unmask();
							
						},
						error: function(error) {
							RecentPostMsk = null;
							mRecentPostBody.unmask();
							Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
						}
					});
				}
              }
            catch(err)
              {
				Ext.Viewport.unmask();
				Ext.Msg.alert('ajax', 'Error: ' + err , Ext.emptyFn);
              }
        }, this);
		
		
	},
	
    config: {
        //title: 'Better Penang',
        cls: 'x-contacts',
        //width: Ext.os.deviceType == 'Phone' ? null : 330,
        //height: Ext.os.deviceType == 'Phone' ? null : 550,
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        mFBID: null,  
		mRecentPostBody: null,
		RecentPostMsk: null,
        items: [
				{
                    xtype: "toolbar",
                    docked: "top",
					style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
                    title: (Ext.os.deviceType === 'Phone') ? "Recent Posts" : "",
                    items: (Ext.os.deviceType === 'Phone') ? [
						{
                            xtype: "button",
                            ui: "back",
                            text: "back",
                            itemId: "backButton"
                        },
						{xtype: 'spacer'},
						// {
							// xtype: 'selectfield',
							// id: 'iphoneregionselection',
							// name: 'iphoneregionselection',
							// options: [
								// {text: 'Both', value: 'both'},
								// {text: 'MPSP', value: 'MPSP'},
								// {text: 'MPPP', value: 'MPPP'}
							// ],
							// listeners: {                                
								// change: function(field, value) { 
									// //check if...
									// var filter = "";
									// //var objcomplainttype = Ext.getCmp("ipadregionselection");
									// //var complainttype = objcomplainttype.getValue();
									
									// if(value.data.value == "both")
									// {
										// //set to ALL
										// filter = "ALL";
									// }
									// else
									// {
										// //Set to 
										// filter = value.data.value;
									// }
									
									// RecentPostMsk = "0";
									// mRecentPostBody.mask({ xtype: 'loadmask', message: 'Please wait...' });
		
									// var mystore = Ext.getStore("Posts");
									// mystore.removeAll();
									// mystore.sync();
									// $.ajax({
										// url:'http://46.137.215.68/myjsonp/WebService1.asmx/getTotalPost?wsdl' + new Date().getTime() + Math.random(),
										// data: '{"User":"ALL", "For":"' + filter + '", "Type":""}',
										// contentType: "application/json; charset=utf-8",
										// dataType: "json",
										// type: 'POST',
										// success: function(data, status){
											// var length = data.d.length;
											// var listcmp = Ext.getCmp("recentlist");
											// //listcmp.setCls("x-contacts");
											// var mystore = Ext.getStore("Posts");
											// var wordlength = 20;
											// switch(Ext.os.deviceType)
											// {
												// case "Phone":
													// wordlength = 20;
													// break;
													
												// default:
													// wordlength = 60;
													// break;
											// }
											
											// simpleDB_token = data.d[0]["TrackingID"];
											
											// for(var start = 1; start < length; start++)
											// {
												// console.log("Data: " + data.d[start]["Title"]);
												// var mTitle = data.d[start]["Title"];
												// if(mTitle.length > wordlength)
												// {
													// mTitle = mTitle.substring(0,(wordlength - 1)) + "...";
												// }
												// var For = data.d[start]["ForPage"];
												// if(For == "")
												// {
													// For = "All";
												// }
												// mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"], fbid: '' + data.d[start]["FB_post"], address: '' + data.d[start]["Address"] });
							
												// //mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"] });
							
											// }
											// mystore.sync();
											// RecentPostMsk = null;
											// mRecentPostBody.unmask();
											
										// },
										// error: function(error) {
											// RecentPostMsk = null;
											// mRecentPostBody.unmask();
											// Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
										// }
									// });
									
								// }
							// }
						// },
					] : [
                        {
                            xtype: "button",
                            ui: "back",
                            text: "back",
                            itemId: "backButton"
                        },
						{
							xtype: 'selectfield',
							name: 'ipadregionselection',
							id: 'ipadregionselection',
							options: [
								{text: 'MPPP & MPSP', value: 'both'},
								{text: 'MPSP', value: 'MPSP'},
								{text: 'MPPP', value: 'MPPP'}
							],
							listeners: {                                
								change: function(field, value) { 
									//check if...
									var filter = "";
									var objcomplainttype = Ext.getCmp("complaintType");
									var complainttype = objcomplainttype.getValue();
									if(value.data.value == "both")
									{
										//set to ALL
										filter = "ALL";
									}
									else
									{
										//Set to 
										filter = value.data.value;
									}
									if(complainttype == "All")
									{
										//set to ALL
										complainttype = "";
									}
									RecentPostMsk = "0";
									mRecentPostBody.mask({ xtype: 'loadmask', message: 'Please wait...' });
		
									var mystore = Ext.getStore("Posts");
									mystore.removeAll();
									mystore.sync();
									$.ajax({
										url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/getTotalPost?wsdl' + new Date().getTime() + Math.random(),
										data: '{"User":"ALL", "For":"' + filter + '", "Type":"' + complainttype + '"}',
										contentType: "application/json; charset=utf-8",
										dataType: "json",
										type: 'POST',
										success: function(data, status){
											var length = data.d.length;
											var listcmp = Ext.getCmp("recentlist");
											//listcmp.setCls("x-contacts");
											var mystore = Ext.getStore("Posts");
											var wordlength = 20;
											switch(Ext.os.deviceType)
											{
												case "Phone":
													wordlength = 20;
													break;
													
												default:
													wordlength = 60;
													break;
											}
											
											simpleDB_token = data.d[0]["TrackingID"];

											for(var start = 1; start < length; start++)
											{
												console.log("Data: " + data.d[start]["Title"]);
												var mTitle = data.d[start]["Title"];
												if(mTitle.length > wordlength)
												{
													mTitle = mTitle.substring(0,(wordlength - 1)) + "...";
												}
												var For = data.d[start]["ForPage"];
												if(For == "")
												{
													For = "All";
												}
												mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"], fbid: '' + data.d[start]["FB_post"], address: '' + data.d[start]["Address"] });
							
												//mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"] });
												//mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"]});
											}
											mystore.sync();
											RecentPostMsk = null;
											mRecentPostBody.unmask();
											
										},
										error: function(error) {
											RecentPostMsk = null;
											mRecentPostBody.unmask();
											Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
										}
									});
									
								}
							}
						},
						{
							xtype: 'selectfield',
							name: 'complaintType',
							id: 'complaintType',
							prependText: 'Type:',
							options: [
								{text: 'All',            value: 'All'},
								{text: 'Potholes',    value: 'Potholes'},
								{text: 'Faulty Traffic Light', value: 'Faulty traffic light'},
								{text: 'Faulty Street Lamp', value: 'Faulty street lamp'},
								{text: 'Open Burning', value: 'Open burning'},
								{text: 'Ilegal Dump Site', value: 'Ilegal dump site'},
								{text: 'Flash Flood', value: 'Flash flood'},
								{text: 'Drainage Issue', value: 'Drainage issue'},
								{text: 'Damage Road Sign', value: 'Damage road sign'},
								{text: 'Demage Sewage Lid', value: 'Demage sewage lid'},
								{text: 'Uncut Grass', value: 'Uncut grass'},
							],
							listeners: {                                
								change: function(field, value) { 
									var type = "";
									var objFor = Ext.getCmp("ipadregionselection");
									var For = objFor.getValue();
									if(For == "both")
									{
										//set to ALL
										For = "ALL";
									}
	
									if(value.data.value == "All")
									{
										//set to ALL
										type = "";
									}
									else
									{
										//Set to 
										type = value.data.value;
									}
									Ext.Viewport.mask({ xtype: 'loadmask', message: 'Please wait...' });
		
									var mystore = Ext.getStore("Posts");
									mystore.removeAll();
									mystore.sync();
									$.ajax({
										url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/getTotalPost?wsdl' + new Date().getTime() + Math.random(),
										data: '{"User":"ALL", "For":"' + For + '", "Type":"' + type + '"}',
										contentType: "application/json; charset=utf-8",
										dataType: "json",
										type: 'POST',
										success: function(data, status){
											var length = data.d.length;
											var listcmp = Ext.getCmp("recentlist");
											//listcmp.setCls("x-contacts");
											var mystore = Ext.getStore("Posts");
											var wordlength = 20;
											switch(Ext.os.deviceType)
											{
												case "Phone":
													wordlength = 20;
													break;
													
												default:
													wordlength = 60;
													break;
											}
											
											simpleDB_token = data.d[0]["TrackingID"];
											
											for(var start = 1; start < length; start++)
											{
												console.log("Data: " + data.d[start]["Title"]);
												var mTitle = data.d[start]["Title"];
												if(mTitle.length > wordlength)
												{
													mTitle = mTitle.substring(0,(wordlength - 1)) + "...";
												}
												var For = data.d[start]["ForPage"];
												if(For == "")
												{
													For = "All";
												}
												mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"], fbid: '' + data.d[start]["FB_post"], address: '' + data.d[start]["Address"] });
							
												//mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"] });
							
												//mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"]});
											}
											mystore.sync();
											Ext.Viewport.unmask();
											
										},
										error: function(error) {
											Ext.Viewport.unmask();
											Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
										}
									});
								}
							}
						}
                    ]
                }, 
				{
					xtype: 'panel',
					hidden: Ext.os.deviceType == "Phone" ? false: true,
					style: 'background-color: #cccccc',
					items:[
						{
							xtype: 'selectfield',
							id: 'iphoneregionselection',
							name: 'iphoneregionselection',
							options: [
								{text: 'MPPP & MPSP', value: 'both'},
								{text: 'MPSP', value: 'MPSP'},
								{text: 'MPPP', value: 'MPPP'}
							],
							listeners: {                                
								change: function(field, value) { 
									//check if...
									var filter = "";
									//var objcomplainttype = Ext.getCmp("ipadregionselection");
									//var complainttype = objcomplainttype.getValue();
									
									if(value.data.value == "both")
									{
										//set to ALL
										filter = "ALL";
									}
									else
									{
										//Set to 
										filter = value.data.value;
									}
									
									RecentPostMsk = "0";
									mRecentPostBody.mask({ xtype: 'loadmask', message: 'Please wait...' });
		
									var mystore = Ext.getStore("Posts");
									mystore.removeAll();
									mystore.sync();
									$.ajax({
										url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/getTotalPost?wsdl' + new Date().getTime() + Math.random(),
										data: '{"User":"ALL", "For":"' + filter + '", "Type":""}',
										contentType: "application/json; charset=utf-8",
										dataType: "json",
										type: 'POST',
										success: function(data, status){
											var length = data.d.length;
											var listcmp = Ext.getCmp("recentlist");
											//listcmp.setCls("x-contacts");
											var mystore = Ext.getStore("Posts");
											var wordlength = 20;
											switch(Ext.os.deviceType)
											{
												case "Phone":
													wordlength = 20;
													break;
													
												default:
													wordlength = 60;
													break;
											}
											
											simpleDB_token = data.d[0]["TrackingID"];
											
											for(var start = 1; start < length; start++)
											{
												console.log("Data: " + data.d[start]["Title"]);
												var mTitle = data.d[start]["Title"];
												if(mTitle.length > wordlength)
												{
													mTitle = mTitle.substring(0,(wordlength - 1)) + "...";
												}
												var For = data.d[start]["ForPage"];
												if(For == "")
												{
													For = "All";
												}
												mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"], fbid: '' + data.d[start]["FB_post"], address: '' + data.d[start]["Address"] });
							
												//mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"] });
							
											}
											mystore.sync();
											RecentPostMsk = null;
											mRecentPostBody.unmask();
											
										},
										error: function(error) {
											RecentPostMsk = null;
											mRecentPostBody.unmask();
											Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
										}
									});
									
								}
							}
						}
					]
				},
				{
					xtype: 'panel',
					height: 1,
					hidden: Ext.os.deviceType == "Phone" ? false: true,
				},
				{
					xtype: 'container',
					id: 'recentpostbody',
					items:[
						{
							xtype: 'panel',
							style: 'background-color: #000000',
							height: 1,
						},
						{
							xtype: 'container',
							flex: '1',
							layout: {
								type: 'vbox',
								align: 'center',
								pack: 'center'
							},
							items: 
								[
									{
										//width: screen.width,//Ext.os.deviceType == 'Phone' ? (Ext.Viewport.getWindowWidth()*0.9) : Ext.Viewport.getWindowWidth(),
										//height: screen.height - 60,//Ext.os.deviceType == 'Phone' ? Ext.Viewport.getWindowHeight() : Ext.Viewport.getWindowHeight(),
										xtype: 'list',
										//margin: Ext.os.deviceType == 'Phone' ? '10 10 10 10' : '10 10 10 10',
										//disableSelection: true,
										//autoLoad: true,
										//limit: 5,
										//centered: true,
										//modal: true,
										//hideOnMaskTap: false,
										id: 'recentlist',
										ui: 'round',
										
										emptyText: '<p class="no-searches">No More Posts</p>',
										grouped: false,
										pinHeaders: false,
										// onItemDisclosure: function(record, btn, index) {

										// },
										// plugins: [
										   // { xclass: 'Ext.plugin.ListPaging' },
										   // { xclass: 'Ext.plugin.PullRefresh' }
										// ],
				   
										cls: 'x-contacts',
										store: 'Posts', //getRange(0, 9),                               
											// itemTpl: [
												// //'<div class="headshot" style="background-image:url(resources/images/posts/{headshot});"></div>',
												// '<div class="headshot" style="background-image:url(https://graph.facebook.com/{headshot}/picture?type=square);"></div>',
												// '<div class=\"list-item-narrative\">{firstName}</div>',
												// '<span>{lastName}</span>',
												// //'<span class="posted">{[this.posted(values.telephone)]}</span>',
												// '<span>4 hours ago</span>',
												// //{
												// //	posted: timeAgoInWords,
												// //}
											// ].join('')
										itemTpl: Ext.create('Ext.XTemplate',
												'<div class="headshot" style="background-image:url(https://graph.facebook.com/{headshot}/picture?type=square);"></div>',
												'<div class=\"list-item-narrative\">{firstName}</div>',
												'<span>{lastName}</span>',
												'<span class="posted">{[this.posted(values.title)]}</span>',
												//'<span>4 hours ago</span>',
										{
												posted: timeAgoInWords
										}),
										listeners:
										{
											itemtap: function(list, index, node, record)
											{
												var mystore = Ext.getStore("Posts");
												var item = mystore.getAt(index);
												mFBID = item.data.fbid;
												if(Ext.os.deviceType == "Phone")
												{
													//Phone, set to controller, open ViewPosts
													BetterPenang.app.getController("BetterPGApp").SetViewPostInfo(item.data.completetitle, item.data.latitude, item.data.longitude, item.data.country, item.data.description, item.data.headshot, item.data.lastName, item.data.telephone, item.data.state, item.data.title, item.data.address, item.data.fbid);
													BetterPenang.app.getController("BetterPGApp").ShowViewPostPage();
												}
												else
												{
													if (!this.overlay) {
														this.overlay = Ext.Viewport.add({
															xtype: 'panel',
															modal: true,
															hideOnMaskTap: true,
															showAnimation: {
																type: 'popIn',
																duration: 250,
																easing: 'ease-out'
															},
															hideAnimation: {
																type: 'popOut',
																duration: 250,
																easing: 'ease-out'
															},
															centered: true,
															width: Ext.os.deviceType == 'Phone' ? 260 : 500,
															height: Ext.os.deviceType == 'Phone' ? 300 : 500,
															//styleHtmlContent: true,
									
															items: [
																// {
																	// docked: 'top',
																	// xtype: 'toolbar',
																	// //html: ['<FONT COLOR="#ffffff" size="3">About Us</FONT>'].join(""),
																	// title: 'Complaint'
																// },
																{
																	xtype: 'container',
																	//style: 'background-color: #bbbbbb',
																	layout: {
																		type: 'vbox',
																		align: 'stretch'
																	},
																	items: [
																		{
																			xtype: 'carousel',
																			id: 'carouselPicture',
																			width: 500,
																			height: 300,
																			// items: [
																			// {
																				// html: '<p>Swipe left to show the next card&hellip;</p>',
																				// //cls: 'card'
																			// },
																			// {
																				// html: '<p>You can also tap on either side of the indicators.</p>',
																				// //cls: 'card'
																			// },
																			// ]
																		},
																		{
																			xtype: 'panel',
																			style: 'background-color: #000000',
																			height: 1,
																		},
																		{
																			xtype: 'panel',
																			id: "txtTitle",
																			//html: '' + item.data.firstName,
																		},
																		{
																			xtype: 'panel',
																			id: "txtDescription",
																			//html: '' + item.data.firstName,
																		},
																		{
																			xtype: 'panel',
																			id: "txtFor",
																			//html: '' + item.data.firstName,
																		},
																		// {
																			// xtype: 'container',
																			// margin: 10,
																			  // layout: {
																				// type: 'vbox',
																				// align: 'center',
																				// pack: 'start'
																			// },
																			// items: [
																				// {
																					// xtype: 'panel',
																					// id: "txtTitle",
																					// //html: '' + item.data.firstName,
																				// },
																				// {
																					// xtype: 'panel',
																					// id: "txtDescription",
																					// //html: '' + item.data.firstName,
																				// },
																				// // {
																					// // xtype: "image",
																					// // mode: '',
																					// // //height: 250,
																					// // //width: 450,
																					// // margin: '10 0 0 10',
																					// // id: "imgItemPhoto",
																					// // //ui: 'rounded',
																					// // //html: "<img width=\"100%;\" src=\"" + item.data.country + "\" align=\"center\">",//"resources/images/betterPenang.png",
																				// // },
																				// // {
																					// // xtype: "image",
																					// // mode: '',
																					// // margin: '10 0 0 10',
																					// // id: "imgLocationPhoto",
																				// // }
																			// ]
																		// },
																	],
																},
																{
																	xtype: 'container',
																	docked: "bottom",
																	height: 80,
																	style: 'background-color: #888888',
																	layout: {
																		type: 'vbox',
																		align: 'stretch',
																		pack: 'start'
																	},
																	items:
																	[
																		{
																			xtype: 'panel',
																			style: 'background-color: #000000',
																			height: 1,
																		},
																		{
																			xtype: 'container',
																			//height: 80,
																			//style: 'background-color: #666666',
																			layout: {
																				type: 'hbox',
																				align: 'center',
																				pack: 'start'
																			},
																			items:
																			[
																				{
																					xtype: 'container',
																					margin: '10 10 10 10',
																					style: 'background-color: #000000',
																					items:
																					[
																						{
																							xtype: 'image',
																							margin: '1 1 1 1',
																							id: 'imgUserPic',
																						},
																					]	
																				},	
																				{
																					xtype: 'container',
																					margin: '10 10 10 10',
																					layout: {
																						type: 'vbox',
																						align: 'start',
																						pack: 'center'
																					},
																					items:
																					[
																						{
																							xtype: 'panel',
																							id: "txtUserName",
																							ui: 'action',
																							//html: ['<FONT COLOR="#ffffff" size="2">Like it on FB</FONT>'].join("")
																							html: 'user name',
																						},
																						{
																							xtype: 'panel',
																							id: "txtSince",
																							html: '3 days go',
																						},
																						{
																							xtype: 'panel',
																							id: "txtLikes",
																							html: '<FONT COLOR="#ffffff" size="3">- likes</FONT>',
																						}
																					]
																				
																					
																				},
																				{
																					xtype: 'spacer',
																				},
																				{
																					xtype: 'button',
																					margin: '10 10 10 10',
																					ui: 'action',
																					id: 'btnLike',
																					html: '<FONT COLOR="#ffffff" size="3">Like</FONT>',
																					handler: function() {
																						//Ext.Msg.alert('fb', '' + mFBID, Ext.emptyFn)
																						$.ajax({
																							url:'https://graph.facebook.com/' + mFBID + '/likes?wsdl' + new Date().getTime() + Math.random() + '&access_token='+ localStorage.getItem(facebook_token),
																							data: {},
																							dataType: 'text',
																							type: 'POST',
																							success: function(data, status){
																								$.ajax({
																									url:'https://graph.facebook.com/' + mFBID + '?access_token='+ localStorage.getItem(facebook_token),
																									data: {},
																									dataType: 'text',
																									type: 'GET',
																									success: function(data, status){
																										//get username
																										//Ext.Msg.alert('ajax', 'data: ' + data, Ext.emptyFn);
																										var obj = JSON.parse(data);
																										var likecount = obj.likes;
																										var count = "0";
																										try
																										{
																											count = "" + likecount.count;													
																										}
																										catch(err)
																										{
																										
																										}
																										
																										var txt_likes = Ext.getCmp("txtLikes");
																										var htmlLikes ='<FONT COLOR="#ffffff" size="3">'  + count + ' likes</FONT>';
																										txt_likes.setHtml(htmlLikes);
																									},
																									error: function(error) {
																										//Ext.Msg.alert('ajax', 'Error: ' + error, Ext.emptyFn);
																										//BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
																									}
																								});
																							},
																							error: function(error) {
																								//Ext.Msg.alert('ajax', 'Error: ' + error, Ext.emptyFn);
																								//BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
																							}
																						});
																						//Ext.Msg.alert('Done', 'OS: ' + Ext.os.deviceType); 
																					},
																				}
																			]
																		},
																	]
																},
																// {
																	// xtype: 'panel',
																	// docked: "bottom",
																	// style: 'background-color: #000000',
																	// height: 1,
																// },
																// {
																	// xtype: 'container',
																	// docked: "bottom",
																	// height: 80,
																	// style: 'background-color: #666666',
																	// layout: {
																		// type: 'hbox',
																		// align: 'center',
																		// pack: 'start'
																	// },
																	// items:
																	// [
																		// {
																			// xtype: 'image',
																			// margin: '10 10 10 10',
																			// id: 'imgUserPic',
																		// },
																		// {
																			// xtype: 'container',
																			// layout: {
																				// type: 'vbox',
																				// align: 'start',
																				// pack: 'start'
																			// },
																			// items:
																			// [
																				// {
																					// xtype: 'panel',
																					// id: "txtUserName",
																					// html: 'user name',
																				// },
																				// {
																					// xtype: 'panel',
																					// id: "txtSince",
																					// html: '3 days go',
																				// }
																			// ]
																		
																			
																		// }
																	// ]
																// }
															],
															scrollable: 'vertical',
														});
													}
													var ca = Ext.getCmp("carouselPicture");
													ca.removeAll(true, false);
													//var item1 = ca.getAt(1);
													//var item2 = ca.getAt(2);
													
												
													var CarousalWidth = ca.getWidth();
													var CarousalHeight = ca.getHeight();
													
													var myPanel2 = Ext.create('Ext.Panel', {
															html: 'This will be added to a Container'
														});
													
													var mType = item.data.telephone;
													var CurrentLat  = item.data.latitude;
													var CurrentLong = item.data.longitude;
													
													if(mType == "C")
													{
														//complaint
													}
													//Ext.Msg.alert('ajax', '' + CarousalWidth + 'x' +  CarousalHeight + ',' + item.data.state, Ext.emptyFn);
													if(item.data.country != "")
													{
														var myPanel1 = Ext.create('Ext.Panel', {
															html: 'This will be added to a Container'
														});
														
														$.ajax({
															url:'http://Betterpenangaxmx.29candyshop.com/WebService1.asmx/getImage?wsdl' + new Date().getTime() + Math.random(),
															data: '{"imageURL":"' + item.data.country + '","Width":"' + CarousalWidth + '", "Height":"' + CarousalHeight + '","PicSize":"' + item.data.state + '"}',
															contentType: "application/json; charset=utf-8",
															cache: false,
															dataType: "json",
															type: 'POST',
															success: function(data, status){
																var length = data.d.length;
																if(length > 0)
																{
																	var mImageString = "data:image/jpeg;base64," + data.d;
																	var imgStr = "<div style=\"width: " + CarousalWidth + "px; height: " + CarousalHeight + "px; border: thin solid #666666; overflow: hidden; position: relative;\"><img src=\"" + mImageString + "\"/></div>";
																	myPanel1.setHtml("" + imgStr);
																	ca.add([myPanel1]);
																}
																if(CurrentLat == "0.0" && CurrentLong == "0.0")
																{
																	myPanel2.setHtml("</br></br><p>" + item.data.address + "</p>");
																	ca.add([myPanel2]);
																	ca.setActiveItem(0);
																}
																else
																{
																	
																	var staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (500) + "x" + (300) + "&scale=1&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";							
																	var imageMap = '<img src="' + staticMap + '" />';
																	//item2.setSrc(staticMap);
																	myPanel2.setHtml("" + imageMap);
																	ca.add([myPanel2]);
																	ca.setActiveItem(0);
																}
															},
															error: function(error) {
																Ext.Viewport.unmask();
																Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
															}
														});
													}
													else
													{
														if(CurrentLat == "0.0" && CurrentLong == "0.0")
														{
															if(item.data.telephone == "I")
															{
																myPanel2.setHtml("</br></br><p>" + item.data.lastName + "</p>");
																ca.add([myPanel2]);
																ca.setActiveItem(0);
															}
															else
															{
																myPanel2.setHtml("</br></br><p>" + item.data.address + "</p>");
																ca.add([myPanel2]);
																ca.setActiveItem(0);
															}
														}
														else
														{
															var staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (500) + "x" + (300) + "&scale=1&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";							
															var imageMap = '<img src="' + staticMap + '" />';
															//item2.setSrc(staticMap);
															myPanel2.setHtml("" + imageMap);
															ca.add([myPanel2]);
															ca.setActiveItem(0);
														}
													}
													
													// var imgI = Ext.getCmp("imgItemPhoto");
													// if(item.data.country != "")
													// {
														// var imgStr = "<div style=\"width: 450px; height: 250px; border: thin solid #666666; overflow: hidden; position: relative;\"><img src=\"" + item.data.country + "\" style=\"position: absolute; left:-37px; width:450px; height: 650px;\"/></div>";
														// //imgI.setSrc("" + item.data.country);
														// imgI.setHtml("" + imgStr);
													// }
				
													// var imgL = Ext.getCmp("imgLocationPhoto");
													// var staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (450) + "x" + (250) + "&scale=1&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";							
													// imgL.setSrc(staticMap);
													
													var txt = Ext.getCmp("txtTitle");
													if(item.data.telephone == "I")
													{
														txt.setHtml("Idea: " + item.data.completetitle);
													}
													else
													{
														txt.setHtml("Complaint: " + item.data.completetitle);
													}
													
													
													var txtDes = Ext.getCmp("txtDescription");
													txtDes.setHtml("Description: " + item.data.description);
													
													var txtFor = Ext.getCmp("txtFor");
													txtFor.setHtml("" + item.data.lastName);
													
													var imgUser = Ext.getCmp("imgUserPic");
													var imageUser= '<img src="https://graph.facebook.com/' + item.data.headshot + '/picture?type=square" />';
													//var imgStr = '<div class="headshot" style="background-image:url(https://graph.facebook.com/' + item.data.headshot + '/picture?type=square);"></div>';
													imgUser.setHtml(imageUser);
					
													var txtAgo = Ext.getCmp("txtSince");
													var Ago = timeAgoInWords(item.data.title);
													var htmlAgo ='<FONT COLOR="#ffffff" size="3">'  + Ago + '</FONT>';
													txtAgo.setHtml(htmlAgo);
													//txtAgo.setHtml(Ago);
													
													var txt_likes = Ext.getCmp("txtLikes");
													var htmlLikes ='<FONT COLOR="#ffffff" size="3">- like</FONT>';
													txt_likes.setHtml(htmlLikes);
													
													$.ajax({
														url:'https://graph.facebook.com/' + item.data.headshot,
														data: {},
														dataType: 'text',
														type: 'GET',
														success: function(data, status){
															//get username
															//Ext.Msg.alert('ajax', 'data: ' + data, Ext.emptyFn);
															var obj = JSON.parse(data);
															var username = obj.name;
															var id = obj.id;
															var txt_username = Ext.getCmp("txtUserName");
															var htmlName ='<FONT COLOR="#ffffff" size="3">'  + username + '</FONT>';
															txt_username.setHtml(htmlName);
															//txt_username.setHtml(username);
														},
														error: function(error) {
															//Ext.Msg.alert('ajax', 'Error: ' + error, Ext.emptyFn);
															//BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
														}
													});

													$.ajax({
														url:'https://graph.facebook.com/' + item.data.fbid + '?access_token='+ localStorage.getItem(facebook_token),
														data: {},
														dataType: 'text',
														type: 'GET',
														success: function(data, status){
															//get username
															//Ext.Msg.alert('ajax', 'data: ' + data, Ext.emptyFn);
															var obj = JSON.parse(data);
															var likecount = obj.likes;
															var count = "0";
															try
															{
																count = "" + likecount.count;													
															}
															catch(err)
															{
															
															}
															
															//var txt_likes = Ext.getCmp("txtLikes");
															htmlLikes ='<FONT COLOR="#ffffff" size="3">'  + count + ' likes</FONT>';
															txt_likes.setHtml(htmlLikes);
														},
														error: function(error) {
															//Ext.Msg.alert('ajax', 'Error: ' + error, Ext.emptyFn);
															//BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
														}
													});
													this.overlay.show();
													//Ext.Msg.alert('tap', 'data: ' + item.data.firstName, Ext.emptyFn);
												}

												
											},
										},
									}
								]
						},							
					]
				},
				{
					xtype: "panel",
					docked: "bottom",
					height: Ext.os.deviceType == 'Phone' ? 60: 100,
					style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',//'background-color: #aaaaaa', //#2da0ff',
					items: [
						//{ xtype: "spacer" 	},
						{
							xtype: 'panel',
							style: 'background-color: #000000',
							height: 1,
						},
						{
							xtype: "button",
							ui: "action",
							height: 40,
							text: "Load More",
							itemId: "LoadMoreButton",
							id: "LoadMoreButton",
							margin: Ext.os.deviceType == 'Phone' ? '10 10 10 10' : '20 130 30 130',
							handler: function() {
								if(RecentPostMsk != null)
								{
									return;
								}
								
								var loadmore_For = "";
								var loadmore_Type = "";
								
								switch(Ext.os.deviceType)
								{
									case "Phone":
										var objPhoneFor = Ext.getCmp("iphoneregionselection");
										loadmore_For = objPhoneFor.getValue();
										loadmore_Type = "";
										break;
										
									default:
										var objTabletFor = Ext.getCmp("ipadregionselection");
										loadmore_For = objTabletFor.getValue();
										
										var objTabletType = Ext.getCmp("complaintType");
										loadmore_Type = objTabletType.getValue();
										break;
								}
											
								//Check Type
								if(loadmore_Type == "All")
								{
									//set to ALL
									loadmore_Type = "";
								}
								
								//Check For
								if(loadmore_For == "both")
								{
									//set to ALL
									loadmore_For = "ALL";
								}
									
								//Ext.Msg.alert('Done', 'Token: ' + simpleDB_token); 
								if(simpleDB_token != "-")
								{
									RecentPostMsk = "0";
									mRecentPostBody.mask({ xtype: 'loadmask', message: 'Please wait...' });
									//get from server
									$.ajax({
										url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmxgetNextToken?wsdl' + new Date().getTime() + Math.random(),
										data: '{"User":"ALL", "For":"' + loadmore_For + '", "Type":"' + loadmore_Type + '", "Token":"' + simpleDB_token + '"}',
										contentType: "application/json; charset=utf-8",
										cache: false,
										dataType: "json",
										type: 'POST',
										success: function(data, status){
											var length = data.d.length;
											//Ext.Viewport.unmask();
											//Ext.Msg.alert('data', 'length: ' + length , Ext.emptyFn);
											var listcmp = Ext.getCmp("recentlist");
											var mystore = Ext.getStore("Posts");
											var wordlength = 20;
											switch(Ext.os.deviceType)
											{
												case "Phone":
													wordlength = 20;
													break;
													
												default:
													wordlength = 60;
													break;
											}
											simpleDB_token = data.d[0]["TrackingID"];
											
											for(var start = 1; start < length; start++)
											{
												console.log("Data: " + data.d[start]["Title"]);
												var mTitle = data.d[start]["Title"];
												if(mTitle.length > wordlength)
												{
													mTitle = mTitle.substring(0,(wordlength - 1)) + "...";
												}
												var For = data.d[start]["ForPage"];
												if(For == "")
												{
													For = "All";
												}
												mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"], fbid: '' + data.d[start]["FB_post"], address: '' + data.d[start]["Address"] });
						
												//mystore.add({firstName:'' + mTitle,lastName: 'For ' + For, headshot: '' + data.d[start]["UserID"], title: '' + data.d[start]["DateTime"], city: '' + data.d[start]["TrackingID"], country: '' + data.d[start]["ImageURL"], longitude: ''+ data.d[start]["Longtitude"], latitude: ''+ data.d[start]["Latitude"], telephone: '' + data.d[start]["Type"], state: ''+ data.d[start]["PicSize"], description: ''+ data.d[start]["Description"], completetitle: '' + data.d[start]["Title"] });
											}
											mystore.sync();
											RecentPostMsk = null;
											mRecentPostBody.unmask();
											
										},
										error: function(error) {
											RecentPostMsk = null;
											mRecentPostBody.unmask();
											Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
										}
									});
			
								}
							}
						}
					]
				},
            ],
            listeners: [
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
    },
    onBackButtonTap: function () {
		if(RecentPostMsk != null)
		{
			Ext.Msg.show({
			   title: 'Cancel?',
			   message: 'Please select OK to Cancel Retrieving Posts...',
			   //width: 300,
			   buttons: Ext.MessageBox.OKCANCEL,
			   //multiLine: true,
			   //prompt : { maxlength : 180, autocapitalize : true },
			   fn: function(buttonId) {
					switch(buttonId)
					{
						case "ok":
							RecentPostMsk = null;
							mRecentPostBody.unmask();
							BetterPenang.app.getController("BetterPGApp").onBackToHomeCommand();
							break;
						
						case "cancel":
							console.log('You pressed the "' + buttonId + '" button.');
							break;
					}
				   
			   }
			});
		}
		else
		{
			var mystore = Ext.getStore("Posts");
			mystore.removeAll();
			mystore.sync();
			this.fireEvent("backToHomeCommand", this);
		}
		
    },
	
});
