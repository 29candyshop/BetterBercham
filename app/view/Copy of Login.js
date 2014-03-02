/**
 * This view shows the 'Initializing' loading mask, as well as displaying the Login text and button
 * if the user isn't logged in to Facebook.
 */
Ext.define('BetterPenang.view.Login', {
    extend: 'Ext.Container',
	xtype: 'login',
    requires: [
        'Ext.MessageBox'
    ],
	
	initialize: function () {
		this.callParent(arguments);
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
				Ext.Viewport.setWidth(null);
				//Ext.Viewport.setHeight(null);
				var logo = Ext.getCmp("login_logo");
				console.log("Test: " + BetterPenang.app.deviceWidth);
				var width = BetterPenang.app.deviceWidth; //Ext.Viewport.getWindowWidth(); //Ext.Element.getViewportWidth(); //screen.width;
				var logowidth = 400;
				var logowidth_toset = logowidth;
				if(width < logowidth)
				{
					logowidth_toset = width;
				}
				var ratio = logowidth/width;
				var toShow = ratio * 100;
				console.log("browser width : " + width);
				//console.log("ratio : " + ratio);
				//console.log("toShow : " + toShow);
				var toshow_reverse = 100 - toShow;
				//var htmlstr = "'<img width=\"" + toShow + "%;\" src=\"resources/images/betterPenang.png\" align=\"center\"><br>'";
				var htmlstr = "<img width=\"" + logowidth_toset + "\" src=\"resources/images/betterPenang.png\" align=\"center\"><br>";
				//console.log("html string : " + htmlstr);
				logo.setHtml(htmlstr);
				var bkwidth = 1600;//564;
				var bkwidth_toset = bkwidth;
				if(width < bkwidth)
				{
					bkwidth_toset = width;
				}
				console.log("bk width to set : " + bkwidth_toset);
				var bk = Ext.getCmp("loginpanel_bk");
				var htmlstr_bk = "<img width=\"" + bkwidth_toset + "\" src=\"resources/images/pg-panorama.png\" align=\"center\"><br>";
				//console.log("html string : " + htmlstr);
				bk.setHtml(htmlstr_bk);
				break;
		}
	},
	
    config: {
        //padding: 20,
        //layout: 'fit',
		//width: Ext.os.deviceType == 'Phone' ? 330 : 330,
        //height: Ext.os.deviceType == 'Phone' ? 550 : 550,
        items: [
           { 
                    xtype: 'container',
                    height: Ext.os.deviceType == 'Phone' ? 110 : 160,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    style: 'background-color: #2da0ff',
                    items: [
                        //{ xtype: 'spacer' },
                        {
                              xtype: 'container',
                                flex: '1',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch',
                                    pack: 'start'
                                },
                                items: [
//                                     {
//                                        xtype: 'container',
//                                        flex: '1',
//                                        html: ' ',
//                                       //style: 'background-color: #000000',
//                                    },
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
												id: 'login_logo',
												flex: '2',
												html: [
													'<img width="100%;" src="resources/images/betterPenang.png" align="center"><br>',
												].join("")
											},

										 ]              
                                        
                                    },
                                    // {
                                         // xtype: 'component',
										 // id: 'login_logo',
                                         // flex: '2',
                                        // html: [
                                            // '<img width="100%;" src="resources/images/betterPenang.png" align="center"><br>',
                                        // ].join("")
                                    // },
//                                    {
//                                        xtype: 'panel',
//                                        flex: '3',
//                                        html: 'A community Complaints & Ideas Pooling Platform',
//                                        style: 'background-color: #000000',
//                                    },
                                    {
                                      xtype: 'container',
                                       //style: 'background-color: #000000',
                                        flex: '3',
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
												html: ['<FONT COLOR="#ffffff" size="2">A Community Complaints & Ideas Pooling Platform</FONT>'].join(""),
                                               //html: 'A community Complaints & Ideas Pooling Platform',
                                               //style: 'font-color: #FFffff',
                                                //html : '<span style="font-color: #FFffff;">Tab 1</span>',
                                            },
                                             {
                                                xtype: 'button',
                                                //style: 'background-color: #ffffff',
                                                //flex: '1',
                                                margin: '5,5,5,5',
                                                id: 'LoginInfoButton',
                                                //ui: 'action',
                                                // text: 'Info',
                                                html: ['<FONT COLOR="#ffffff" size="2">Info</FONT>'].join(""),
                                                //text: 'info',
                                                align: 'right',
                                                 ui: 'sencha',
                                                 ui: 'action',
                                                handler: function() {
													var overlay_width = BetterPenang.app.deviceWidth - 60;
													var overlay_height = BetterPenang.app.deviceHeight - 200;
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
                                                            html: '<p>Better Penang is an community owned platform which allows users to post complaints' +
                                                            ' and ideas to make Penang a better place for everyone. This app is based on the idea that a' + 
                                                            ' democracy can only work if everyone plays their role. As such, Better Penang is a community-driven' + 
                                                            ' effort, it will only work if you and I do our part to make it work. </p></br>' + 
                                                            '<p>NOTE: The app is created and maintained by volunteers using our own resources. No government fund' + 
                                                            ' was spent on this project and while we are happy to receive the support from local government officials,' + 
                                                            ' especially MPSP and MPPP, we are not directly affiliated to the government. Please support our effort by' + 
                                                            ' clicking the advertisement in the app. Or alternatively, you can support us by purchasing the paid version of this app via Google Play.</p>',
                                                            items: [
                                                                {
                                                                    docked: 'top',
                                                                    xtype: 'toolbar',
                                                                    title: 'About Us'
                                                                }
                                                            ],
                                                            scrollable: true
                                                        });
                                                    }

                                                    this.overlay.show();
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
				//style: 'background-color: #ffffff',
				flex: '2',
				height: Ext.os.deviceType == 'Phone' ? 270 : 330,
				layout: {
					type: 'vbox',
					align: 'center',
					pack: 'start'
				},
				items: 
				[
					{
						xtype: 'button',
						//style: 'background-color: #ffffff',
						//flex: '1',
						margin: '45,5,5,5',
						id: 'facebooklogin',
						//ui: 'action',
						// text: 'Info',
						html: ['<FONT COLOR="#ffffff" size="2">Login with Facebook</FONT>'].join(""),
						//text: 'info',
						align: 'right',
						ui: 'sencha',
						ui: 'action',
						handler: function() {
							//window.plugins.childBrowser.showWebPage('http://www.google.com');
							//Login with Facebook
							//Ext.Viewport.mask({ xtype: 'loadmask', message: 'Please wait...' });
							try
							{
							// var fbCode = "";
							// Ext.Ajax.request({
								// url:'https://graph.facebook.com/oauth/access_token?client_id='+my_client_id+'&client_secret='+my_secret+'&code='+fbCode+'&redirect_uri=http://www.facebook.com/connect/login_success.html',
								// params: {
								// },
								// method: 'POST',
								// success: function(response){
									// var text = response.responseText;
									
									// Ext.Msg.alert('facebooklocchanged', 'Done FB Success ', Ext.emptyFn);
									// // We store our token in a localStorage Item called facebook_token
									// localStorage.setItem(facebook_token, text.split("=")[1]);
									
									// window.plugins.childBrowser.close();
									
									// me.FBInit();
									// // process server response here
								// },
								// error: function(response)
								// {
									// Ext.Msg.alert('facebooklocchanged', 'Error ', Ext.emptyFn);
									// window.plugins.childBrowser.close();
								// }
							// });
							
								BetterPenang.app.getController("Facebook").FBLogin();
								//BetterPenang.app.getController("BetterPGApp").ShowMainPage();
								//Facebook.init();
							}
							catch(err)
							{
								Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
							}
							
							// FB.login(function(response)
							// {
								// Ext.Viewport.unmask();
								// if (response.session)
								// {
									// if (response.perms)
									// {
										// console.log('user is logged in and granted some permissions: ' + response.perms);
									// }
									// else
									// {
										// console.log('logged in but didnt grant permissions');
									// }
								// }
								// else
								// {
									// console.log('not logged in');
								// }
							// },
							// {scope:'publish_stream'});
						},
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
						 id: 'loginpanel_bk',
                        // flex: '2',
                        //  style: 'background-color: #000000',
                        html: [
                            '<img width="100%;" src="resources/images/pg-panorama.png" align="center"><br>',
                        ].join("")
                    },

                 ]              
            },
			{
                xtype: "toolbar",
                html: ['<FONT COLOR="#ffffff" size="2" align="center">Please Login with Facebook</FONT>'].join(""),
                //title: "Current Login User: SG",
                docked: "bottom",
                items: [
                   
                ]
            }
        ]
    },

    // showLoginText: function() {

        // var redirectUrl = Ext.Object.toQueryString({
            // redirect_uri: window.location.protocol + "//" + window.location.host + window.location.pathname,
            // client_id: BetterPenang.app.facebookAppId,
            // response_type: 'token'
        // });
		// console.log("URL " + redirectUrl);
        // this.setHtml([
            // '<h2>Welcome to #Better-Penang</h2>',
            // '<p>With this app you can lodge your complaints and share your ideas with us.</p>',
            // '<p>In order to use #Better-Penang you must sign in with your Facebook account.</p>',
            // '<a class="fbLogin" href="https://m.facebook.com/dialog/oauth?' + redirectUrl + '"></a>',
            // '<div class="fb-facepile" data-app-id="' + BetterPenang.app.facebookAppId + '" data-max-rows="2" data-width="300"></div>'
        // ].join(''));

        // FB.XFBML.parse(document.getElementById('splash'));
    // }
});
