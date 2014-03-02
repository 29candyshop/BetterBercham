Ext.define('BetterPenang.view.Main', {
    extend: 'Ext.Container', //.navigation.View',
    xtype: 'mainview',
    requires: [
        'Ext.MessageBox',
        'Ext.device.Camera',
        //'BetterPenang.view.Options',
        //'BetterPenang.view.New.Complaints'
    ],
	
	// show: function()
	// {
		// this.callParent(arguments);
		// console.log("show First");
	// },
	
	initialize: function () {
		this.callParent(arguments);
		
		//BetterPenang.app.deviceWidth = 640;
		//BetterPenang.app.deviceHeight = 960;
		//var pictureSource = navigator.camera.PictureSourceType;
        //var destinationType = navigator.camera.DestinationType;
		
		switch(Ext.os.deviceType)
		{
			case "Phone":
				//Ext.Viewport.setWidth(null);
				//Ext.Viewport.setHeight(null);
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				//Ext.Viewport.setWidth(640);				
				//Ext.Viewport.setHeight(960);
				
				Ext.Viewport.setWidth(null);
				var logo = Ext.getCmp("mainpanel_logo");
				console.log("Test: " + BetterPenang.app.deviceWidth);
				var width = BetterPenang.app.deviceWidth; //Ext.Viewport.getWindowWidth(); //Ext.Element.getViewportWidth(); //screen.width;
				var logowidth = 600; //400
				var logowidth_toset = logowidth;
				if(width < logowidth)
				{
					logowidth_toset = width;
				}
				var ratio = logowidth/width;
				var toShow = ratio * 100;
				//console.log("browser width : " + width);
				//console.log("ratio : " + ratio);
				//console.log("toShow : " + toShow);
				var toshow_reverse = 100 - toShow;
				//var htmlstr = "'<img width=\"" + toShow + "%;\" src=\"resources/images/betterPenang.png\" align=\"center\"><br>'";
				//var htmlstr = "<img width=\"" + logowidth_toset + "\" src=\"resources/images/BetterPenangLogo_653x133.png\" align=\"center\"><br>";
				var htmlstr = "<span style='font-size:36px;color:#fff;font-weight:bold;text-shadow: 2px 2px #000000;'>BETTER BERCHAM</span><br>";
				//console.log("html string : " + htmlstr);
				logo.setHtml(htmlstr);
				var bkwidth = 1032;//1600;//564;
				if(Ext.os.deviceType == "Phone")
				{
					bkwidth = 1623;
				}
				var bkwidth_toset = bkwidth;
				if(width < bkwidth)
				{
					bkwidth_toset = width;
				}
				console.log("bk width to set : " + bkwidth_toset);
				var bk = Ext.getCmp("mainpanel_bk");
				//var htmlstr_bk = "<img width=\"" + bkwidth_toset + "\" src=\"resources/images/pg-panorama.png\" align=\"center\"><br>";
				var htmlstr_bk = "<img width=\"" + bkwidth_toset + "\" src=\"resources/images/betterpg-mainlogo4.png\" align=\"center\"><br>";
				//console.log("html string : " + htmlstr);
				if(Ext.os.deviceType == "Phone")
				{
					htmlstr_bk = "<img width=\"" + bkwidth_toset + "\" src=\"resources/images/betterpg-mainlogo-iphone_640x208.png\" align=\"center\"><br>";
				}
				//bk.setHtml(htmlstr_bk);
				
				break;
		}
		this.on('show', function() {
			//return;
			var networkState = "" + navigator.network.connection.type;
			if (networkState == "unknown")
			{
				Ext.Msg.alert('status', 'Your Device seems like does not have internet connection..', Ext.emptyFn);
				return;
			}
			// $.ajax({
				// url:'https://graph.facebook.com/me?access_token='+localStorage.getItem(facebook_token),
				// data: {},
				// dataType: 'text',
				// type: 'GET',
				// success: function(data, status){
					// try
					// {
						// //Ext.Msg.alert('status', 'status: ' + status, Ext.emptyFn);
						// var obj = JSON.parse(data);
						// var username = obj.name;
						// var id = obj.id;	
						// mUserID = id;
						// mUserName = username;							
					// }
					// catch(err)
					// {
						// Ext.Msg.show({
						   // title: 'Facebook Error',
						   // message: 'Your facebook session might be expires, please re-login',
						   // buttons: Ext.MessageBox.OK,
						   // fn: function(buttonId) {
								// switch(buttonId)
								// {
									// case "ok":
										// BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
										// break;
								// }						   
						   // }
						// });					
					// }					
				// },
				// error: function(error) {
					// Ext.Msg.show({
					   // title: 'Facebook Error',
					   // message: 'Your facebook session might be expires, please re-login',
					   // buttons: Ext.MessageBox.OK,
					   // fn: function(buttonId) {
							// switch(buttonId)
							// {
								// case "ok":
									// BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
									// break;
							// }						   
					   // }
					// });	
				// }
			// });
		}, this);
	},

    config: {
        //autoDestroy: false,
        autoMaximize: true,
        //width: Ext.os.deviceType == 'Phone' ? null : 330,
        //height: Ext.os.deviceType == 'Phone' ? null : null, //550,
       
        //fullscreen: true,
        cls: 'x-contacts',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },

        items: [
            { 
                    xtype: 'container',
                    height: Ext.os.deviceType == 'Phone' ? 80 : 160,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    style: 'background-color: #FCDC4E', //#2da0ff',
                    items: [
                        //{ xtype: 'spacer' },
                        {
                              xtype: 'container',
                                flex: '1',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch',
                                    pack: 'center'
                                },
                                items: [
                                    {
										xtype: 'container',
										flex: '3',
										//style: 'background-color: #000000',
										layout: {
											type: 'hbox',
											align: 'end',
											pack: 'center'
										},
										items: [
											{
												xtype: 'component',
												id: 'mainpanel_logo',
												html: [
													'<img width="100%;" src="resources/images/BetterPenangLogo_653x133.png" align="center"><br>',
												].join("")
											},

										]              
                                        
                                    },
                                    {
										xtype: 'container',
										hidden: Ext.os.deviceType == 'Phone' ? true: false,
                                        layout: {
                                            type: 'hbox',
                                            align: 'end',
                                            pack: 'end'
                                        },
                                        items: [
                                            {
                                                xtype: 'panel',
                                                //html: ['<FONT COLOR="#ffffff" size="2">A Community Complaints & Ideas </FONT><br/>',
                                                //        '<FONT COLOR="#ffffff" size="2">Pooling Platform</FONT>'].join(""),
												html: ['<FONT COLOR="#000" size="2">A Community Complaints & Ideas Pooling Platform</FONT>'].join(""),
                                                //html: 'A community Complaints & Ideas Pooling Platform',
                                                //style: 'font-color: #FFffff',
                                                //html : '<span style="font-color: #FFffff;">Tab 1</span>',
                                            },
                                             {
                                                xtype: 'button',
                                                //style: 'background-color: #ffffff',
                                                //flex: '1',
                                                margin: '5,5,5,5',
                                                id: 'InfoButton',
                                                //ui: 'action',
                                                // text: 'Info',
                                                html: ['<FONT COLOR="#ffffff" size="2">Info</FONT>'].join(""),
                                                //text: 'info',
                                                align: 'right',
                                                ui: 'sencha',
                                                ui: 'action',
                                                handler: function() {
													var overlay_width = BetterPenang.app.deviceWidth - 200;
													var overlay_height = BetterPenang.app.deviceHeight - 300;
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
                                                            width: Ext.os.deviceType == 'Phone' ? 260 : overlay_width,
                                                            height: Ext.os.deviceType == 'Phone' ? 300 : overlay_height,
                                                            styleHtmlContent: true,
                                                            html: '<p>Better Bercham is an extended app from Better Penang Platform. ' + 
															'It iscommunity owned platform which allows users to post complaints and ' + 
															'ideas to make Bercham a better place for everyone. This app is based on ' + 
															'the idea that a democracy can only work if everyone plays their role. As such, ' + 
															'it is a community-driven effort, it will only work if you and I do our part to make it work. ' +
                                                            '</p></br>' + 
                                                            '<p>NOTE: The app is created and maintained by volunteers using our own resources.' + 
															'No government fund was spent on this project and while we are happy to ' + 
															'receive the support from local government officials, we are not directly affiliated ' + 
															'to the government. Please support our effort by clicking the advertisement in the app' + 
															'</p>',                                                          
                                                            items: [
                                                                {
                                                                    docked: 'top',
                                                                    xtype: 'toolbar',
																	//html: ['<FONT COLOR="#ffffff" size="3">About Us</FONT>'].join(""),
                                                                    title: 'About Us'
                                                                },
																{
                                                                    docked: 'bottom',
                                                                    xtype: 'toolbar',
                                                                    //title: 'bar'
																	items: [
																		{ xtype: "spacer" },
																		{
																			xtype: 'button',
																			hidden: true,
																			//margin: '5,5,5,5',
																			//id: 'InfoButton',
																			//ui: 'action',
																			// text: 'Info',
																			html: ['<FONT COLOR="#ffffff" size="2">Like it on FB</FONT>'].join(""),
																			//text: 'info',
																			//align: 'right',
																			ui: 'sencha',
																			ui: 'action',
																			handler: function() {
																				BetterPenang.app.getController("Facebook").TestBrowser();
																				
																				// try
																				// {
																					// var networkState = navigator.network.connection.type;
																					// Ext.Msg.alert('status', "" + networkState, Ext.emptyFn);
																				// }
																				// catch(err)
																				// {
																					// Ext.Msg.alert('Done', 'Error: ' + err);
																				// }
																				
																			},
																		},
																		// {
																			// xtype: 'button',
																			// html: ['<FONT COLOR="#ffffff" size="2">Purchase Paid Version</FONT>'].join(""),
																			// //text: 'info',
																			// //align: 'right',
																			// ui: 'sencha',
																			// ui: 'action',
																		// },
																		{ xtype: "spacer" },
																	]
                                                                }
                                                            ],
                                                            scrollable: true
                                                        });
                                                    }
													var btnInfo = Ext.getCmp("InfoButton");
                                                    this.overlay.show();//By(btnInfo);
                                                }
                                            }

                                         ]             
                                }
                              ]             
                        }
                         
                    ]
                },
				{
					xtype: 'panel',
					style: 'background-color: #000000',
					height: 1,
				},
                {
                    xtype: 'container',
                    flex: '2',
                    height: Ext.os.deviceType == 'Phone' ? 270 : 330,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'start'
                    },
                    items: [
                        {
                            width: Ext.os.deviceType == 'Phone' ? 270 : 330,
                            height: Ext.os.deviceType == 'Phone' ? 500 : 500,
                            xtype: 'list',
                            id: 'optionlist',
                            ui: 'round',
                            grouped: false,
                            pinHeaders: false,
                            onItemDisclosure: function(record, btn, index) {
                                //Ext.Msg.alert('DisclosureTap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
								if(index == 0)
								{
									console.log('launch camera');
									
				
									try
									{
										navigator.camera.getPicture(
											function (imageData)
											{
												//Set Image String to Controller
												//Ext.Msg.alert('data', 'data: ' + imageData.substring(0,10)); 
												BetterPenang.app.getController("BetterPGApp").SetImageValue(imageData);
												BetterPenang.app.getController("BetterPGApp").ShowComplaintPage();
											},
											function (message)
											{
												//error
											}, 
											{ 
												quality: 75,
												destinationType: navigator.camera.DestinationType.DATA_URL,
												targetWidth: 300,
												targetHeight: 300,
											});
									}
									catch(err)
									{
										Ext.Msg.alert('Error', 'Err: ' + err); 
									
									}
									
										
									// Ext.device.Camera.capture({ 
										// source: 'camera', 
										// destination: 'data', 
										// quality: 75,
										// width: 300,
										// height: 300,
										// success: function(url) { 
											// //Set Image String to Controller
											// BetterPenang.app.getController("BetterPGApp").SetImageValue(url);
											// BetterPenang.app.getController("BetterPGApp").ShowComplaintPage();
										// }, 
										// failure: function() { 
											// //Ext.Msg.alert('Error', 'There was an error when acquiring the picture.'); 
										// }, 
										// scope: this });
										
								}
                            },
                            cls: 'x-contacts',
                            store: 'Contacts',                          
                                  itemTpl: [
                                    '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
                                    '<div class=\"list-item-narrative\">{firstName}</div>',
                                     '<span>{lastName}</span>' //
                                    ].join('')
                        }
                    ]
                },
            {
				xtype: 'container',
                flex: '3',
                //style: 'background-color: #000000',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'end'
                },
                items: [
                    {
                        xtype: 'component',
						id: 'mainpanel_bk',
                        html: [
                            //'<img width="100%;" src="resources/images/betterpg-mainlogo-iphone_640x208.png" align="center"><br>',
                        ].join("")
                    },

                 ]              
            },
            {
                xtype: "toolbar",
                docked: "bottom",
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
                items: [
					{
						xtype: 'panel',
						id: 'userimage',
						margin: Ext.os.deviceType == 'Phone' ? '1,1,1,1' : '1,1,1,1', //130
					},
					{
						xtype: 'panel',
						id: 'logininfo',
						itemid: 'logininfo',
						html: ['<FONT COLOR="#ffffff" size="2">Current Login User: -</FONT><br/>'].join(""),
					},
                    { xtype: 'spacer' },
                    {
                        xtype: "button",
                        text: 'Logout',
                        ui: 'sencha',
                        align: 'right',
                        ui: 'action',
                        itemId: "logoutButton",
						handler: function() {
							try
							{
								Ext.Msg.alert('data', 'data: ' + navigator.camera.DestinationType.DATA_URL); 
								
								localStorage.removeItem(facebook_token);
								BetterPenang.app.getController("Facebook").FBInit();

							}
							catch(err)
							{
								Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
							}
							
							/*Ext.Viewport.mask({ xtype: 'loadmask', message: 'Please wait...' });
							FB.logout(function(response)
							{
								Ext.Viewport.unmask();
								if (response.session)
								{
									if (response.perms)
									{
										console.log('user is logged in and granted some permissions: ' + response.perms);
									}
									else
									{
										console.log('logged in but didnt grant permissions');
									}
								}
								else
								{
									console.log('not logged in');
								}
							});*/
						},
                    }
                ]
            }
          
        ],
		Listeners:
		[
			{
                delegate: "#optionlist",
                event: "itemtap",
                fn: "onSelectionTap"
            },
		]
    },
	
	onPhotoDataSuccess: function(url)
	{
		//Set Image String to Controller
		BetterPenang.app.getController("BetterPGApp").SetImageValue(url);
		BetterPenang.app.getController("BetterPGApp").ShowComplaintPage();
	},
	
	onFail: function(message)
	{
	
	},
	
	onSelectionTap: function(list, index, node, record)
	{
		if(index == 0)
		{			

		}
	},
	
	onPhotoDataSuccess: function(imageData) {
		console.log('camera success');
    },
	showLoginText: function(username, userid) {
		var logintext = Ext.getCmp('logininfo');
		var loginimage = Ext.getCmp('userimage');
		var text = '<FONT COLOR="#ffffff" size="2">Current Login User: ' + username + '</FONT><br/>';
		if(Ext.os.deviceType == 'Phone')
		{
			text = '<FONT COLOR="#ffffff" size="2">User: ' + username + '</FONT><br/>';
		}
		
		var image = '<img src="https://graph.facebook.com/' + userid + '/picture?type=square" />';
		logintext.setHtml(text);
		loginimage.setHtml(image);
	},
});
