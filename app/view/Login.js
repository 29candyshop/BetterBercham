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
				var login_bg = Ext.getCmp("login_bg");
				var imgbk = "<img width=\"100%;\" src=\"resources/images/betterpg-iphone4.png\" align=\"center\"><br>";
				login_bg.setHtml(imgbk);
				
				//Ext.Viewport.setWidth(null);
				//Ext.Viewport.setHeight(null);
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				//Ext.Viewport.setWidth(320);
				//Ext.Viewport.setHeight(640);
				Ext.Viewport.setWidth(null);
				var login_bg = Ext.getCmp("login_bg");
				
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
				//logo.setHtml(htmlstr);
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
				//bk.setHtml(htmlstr_bk);
				break;
		}
	},
	
    config: {
        //padding: 20,
        //layout: 'fit',
		//width: Ext.os.deviceType == 'Phone' ? 330 : 330,
        //height: Ext.os.deviceType == 'Phone' ? 550 : 550,
        items: 
		[
			//{
				// xtype: 'container',
				// id: 'loginContainer',
				// style: 'background-color: #aaaaaa', //#4390D8', //#2da0ff',
				// layout:
				// {
                        // type: 'hbox',
                        // align: 'stretch',
                        // pack: 'center'
                // },
				// items:
				// [
					// {
						// xtype: 'panel',
						// style: 'background-color: #000000',
						// width: 1,
					// },
					{
						xtype: 'container',
						id: 'login_bg',
						layout: 'fit',
						html: [
							
							'<img width="100%;" src="resources/images/betterpg-bg3.png" align="center"><br>',
						].join(""),
						items: 
						[
							{
								xtype: 'container',
								//flex: '1',
								//layout: 'card',
								layout: {
									type: 'vbox',
									align: 'center',
									pack: 'end'
								},
								items: [
									{
										xtype: 'button',
										margin: Ext.os.deviceType == 'Phone' ? '10 10 100 10' : '10 10 120 10', //130
										//id: 'InfoButton',
										html: ['<FONT COLOR="#ffffff" size="3">Login using Facebook</FONT>'].join(""),
										//text: 'info',
										align: 'bottom',
										height: 50,
										ui: 'sencha',
										ui: 'action',
										handler: function()
										{							
											try
											{
												BetterPenang.app.getController("Facebook").FBLogin();
											}
											catch(err)
											{
												Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
											}
										},
									},
								],
							}
							
						]
					},
					// {
						// xtype: 'panel',
						// style: 'background-color: #000000',
						// width: 1,
					// },
				//]
			//}
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
