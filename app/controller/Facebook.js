/**
 * Handles Facebook interactions, specifically Login and Logout.
 *
 * When a user logs in, we display their profile picture and a list of Runs.
 */
Ext.define('BetterPenang.controller.Facebook', {
    extend: 'Ext.app.Controller',
    //requires: ['Ext.MessageBox'],

    config: {
        control: {
            '#signout': {
                tap: 'onUserTap'
            },
            '#logoutButton': {
                tap: 'logout'
            }
        }
    },

    /**
     * Load the Facebook Javascript SDK asynchronously
     */
	 
	launch: function () {
        this.callParent();
        console.log("launch FB");
		
    },

    init: function() {
		var me = this;
		  
		console.log("init FB");
		//app.init();
		//if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
        //if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
		// try
		// {
			// FB.init({ appId: BetterPenang.app.facebookAppId, nativeInterface: CDV.FB, useCachedDialogs: false });
			// if (BetterPenang.app.facebookAppId == '') return;
			// console.log("App ID: 145752665562770");
			// var me = this;
			// //FB.init({ appId: "145752665562770", nativeInterface: CDV.FB, useCachedDialogs: false });
			// // FB.init({
			  // // appId      : '145752665562770', // App ID
			  // // //channelUrl : '//localhost/betterpg/index.html', // Channel File
			  // // status     : true, // check login status
			  // // cookie     : true, // enable cookies to allow the server to access the session
			  // // //xfbml      : true  // parse XFBML
			// // });
			
			// FB.Event.subscribe('auth.login', function(response) {
                               // alert('auth.login event');
                               // });
            
            // FB.Event.subscribe('auth.logout', function(response) {
                               // alert('auth.logout event');
                               // });
            
            // FB.Event.subscribe('auth.sessionChange', function(response) {
                               // alert('auth.sessionChange event');
                               // });
            
            // FB.Event.subscribe('auth.statusChange', function(response) {
                               // alert('auth.statusChange event');
                               // });
			
			// // FB.Event.subscribe('auth.logout', Ext.bind(me.onLogout, me));
			
			// // FB.Event.subscribe('auth.login', Ext.bind(me.onLogin, me));

			// FB.getLoginStatus(function(response) {
				// console.log("Get Status " + response.status);
				// clearTimeout(me.fbLoginTimeout);

				// me.hasCheckedStatus = true;
				// Ext.Viewport.setMasked(false);

				// if (response.status == 'connected') {
					// //console.log("FB Connected");
					// me.onLogin();
				// } else {
					// //console.log("FB Disconnected");
					// me.login();
				// }
			// });
			// //me.login();
			// //console.log("set timeout " + BetterPenang.app.facebookAppId);
			// me.fbLoginTimeout = setTimeout(function() {

				// Ext.Viewport.setMasked(false);

			// }, 10000);
		// }
		// catch(err)
		// {
			// console.log("error: " + err);
		// }

        // window.fbAsyncInit = Ext.bind(this.onFacebookInit, this);

		// (function(d){
			// var js, id = 'facebook_js_sdk'; if (d.getElementById(id)) {return;}
			// js = d.createElement('script'); js.id = id; js.async = true;
			// js.src = "//connect.facebook.net/en_US/all.js";
			// d.getElementsByTagName('head')[0].appendChild(js);
		// }(document));
    },
	
	TestBrowser: function()
	{
		window.plugins.childBrowser.showWebPage("http://www.yahoo.com");
	},

	FBInit: function()
	{
		var me = this;
		
		if(!localStorage.getItem(facebook_token))
		{
			// var json = '{"result":true,"count":1}',
			// obj = JSON.parse(json);
			// alert(obj.count);
			var username = "SG";
			var id = "1310551757";
			//mUserID = id;
			//mUserName = username;
			//BetterPenang.app.getController("BetterPGApp").ShowMainPage(username, id);
			BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
		}
		else
		{
			Ext.Viewport.mask({ xtype: 'loadmask', message: 'Please wait, logging in..' });
			$.ajax({
				url:'https://graph.facebook.com/me?access_token='+localStorage.getItem(facebook_token),
				data: {},
				dataType: 'text',
				type: 'GET',
				success: function(data, status){
					//get username
					Ext.Viewport.unmask();
					try
					{
						//Ext.Msg.alert('status', 'status: ' + status, Ext.emptyFn);
						var obj = JSON.parse(data);
						var username = obj.name;
						var id = obj.id;		
						mUserID = id;
						mUserName = username;						
						BetterPenang.app.getController("BetterPGApp").ShowMainPage(username, id);					
					}
					catch(err)
					{
						BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
					}
					
				},
				error: function(error) {
					//Ext.Msg.alert('ajax', 'Error: ' + error, Ext.emptyFn);
					Ext.Viewport.unmask();
					BetterPenang.app.getController("BetterPGApp").ShowLoginPage();
				}
			});
		}
	},
	
	FBLogin: function()
	{
		//BetterPenang.app.getController("BetterPGApp").ShowMainPage("", "");
		//return;
		// var fbCode = '5555555555';
		// $.ajax({
				// url:'http://46.137.215.68/myjsonp/WebService1_JSONP.asmx/getTestString',
				// data: {},
				// dataType: 'text',
				// type: 'POST',
				// success: function(data, status){
					// Ext.Msg.alert('ajax', 'data: ' + data, Ext.emptyFn);
					// //Ext.Msg.alert('ajax', 'Done FB Success ', Ext.emptyFn);
					// // We store our token in a localStorage Item called facebook_token
					// //localStorage.setItem(facebook_token, data.split("=")[1]);
					
					// //window.plugins.childBrowser.close();
					
					// //me.FBInit();
				// },
				// error: function(error) {
					// Ext.Msg.alert('ajax', 'Error: ' + error.status , Ext.emptyFn);
					// //window.plugins.childBrowser.close();
				// }
			// });	
		var me = this;
		
		// Begin Authorization
		var authorize_url = "https://graph.facebook.com/oauth/authorize?wsdl" + new Date().getTime() + Math.random()
		 authorize_url += "&client_id=" + my_client_id;
		 authorize_url += "&redirect_uri=" + my_redirect_uri;
		 authorize_url += "&display=" + my_display;
		 authorize_url += "&scope=publish_stream,offline_access";
		 //authorize_url += "&type=user_agent";
		 
		// Open Child browser and ask for permissions
		window.plugins.childBrowser.onLocationChange = function(loc){
			 me.ChildBrowserLocationChanged(loc);
		};
		
		window.plugins.childBrowser.showWebPage(authorize_url);
		//window.plugins.childBrowser.showWebPage(authorize_url, 
		//						{
		//							//showNavigationBar : false,
		//							showLocationBar : false,
		//							showAddress : false
		//						});
	},
	
	ChildBrowserLocationChanged: function(loc)
	{
		var me = this;
		if (loc.indexOf("https://www.facebook.com/connect/login_success.html") >= 0 || loc.indexOf("https://www.facebook.com/connect/login_success.html") > -1) 
		{
			var userfbCode = loc.match(/code=(.*)$/)[1];
			/*var fbToken = loc.match(/access_token=(.*)$/)[1];
			localStorage.setItem(facebook_token, fbToken);
					
			window.plugins.childBrowser.close();
					
			me.FBInit();*/
			
			$.ajax({
				url:'https://graph.facebook.com/oauth/access_token?client_id='+my_client_id+'&client_secret='+my_secret+'&code='+userfbCode+'&redirect_uri=https://www.facebook.com/connect/login_success.html',
				data: {},
				dataType: 'text',
				type: 'POST',
				success: function(data, status){
					//Ext.Msg.alert('ajax', 'Done FB Success ', Ext.emptyFn);
					// We store our token in a localStorage Item called facebook_token
					localStorage.setItem(facebook_token, data.split("=")[1]);
					
					window.plugins.childBrowser.close();
					
					me.FBInit();
				},
				error: function(error) {
					Ext.Msg.alert('ajax', 'Error: ' + error.d['message'], Ext.emptyFn);
					window.plugins.childBrowser.close();
				}
			});
		}
		else
		{
			// if(loc.indexOf("facebook") >= 0)
			// {
			
			// }
			// else
			// {
				// window.plugins.childBrowser.close();
			// }
			if (loc.indexOf("about:blank") >= 0)
			{
				window.plugins.childBrowser.close();
				//Ext.Msg.alert('FB', 'Error Signing in to Facebook', Ext.emptyFn);
			}
			// var strLoc = "" + loc;
			// if(strLoc.length > 20)
			// {
				// strLoc = strLoc.substring(0,20);
			// }
			//Ext.Msg.alert('facebooklocchanged', '' + strLoc, Ext.emptyFn);
		}
	},
	
	
    onFacebookInit: function() {
		console.log("On FB Init");
        if (BetterPenang.app.facebookAppId == '') return;
		console.log("App ID: " + BetterPenang.app.facebookAppId);
        var me = this;

		FB.init({
		  appId      : BetterPenang.app.facebookAppId, // App ID
		  //channelUrl : '//localhost/betterpg/index.html', // Channel File
		  status     : true, // check login status
		  cookie     : true, // enable cookies to allow the server to access the session
		  //xfbml      : true  // parse XFBML
		});
		
        FB.Event.subscribe('auth.logout', Ext.bind(me.onLogout, me));
		
		FB.Event.subscribe('auth.login', Ext.bind(me.onLogin, me));

        FB.getLoginStatus(function(response) {
			console.log("Get Status " + response.status);
            clearTimeout(me.fbLoginTimeout);

            me.hasCheckedStatus = true;
            Ext.Viewport.setMasked(false);

            if (response.status == 'connected') {
				//console.log("FB Connected");
                me.onLogin();
            } else {
				//console.log("FB Disconnected");
                me.login();
            }
        });
		//me.login();
		//console.log("set timeout " + BetterPenang.app.facebookAppId);
        me.fbLoginTimeout = setTimeout(function() {

            Ext.Viewport.setMasked(false);

        }, 10000);
    },

    login: function() {
		console.log("show login page");
        Ext.Viewport.setMasked(false);
		//BetterPenang.app.getController("BetterPGApp").ShowMainPage();
        var splash = Ext.getCmp('login');
        if (!splash) {
            Ext.Viewport.add({ xclass: 'BetterPenang.view.Login', id: 'login' });
        }
        //Ext.getCmp('login').showLoginText();
    },

    onLogin: function() {

        var me = this,
            errTitle;

        FB.api('/me', function(response) {

            if (response.error) {
                FB.logout();

                errTitle = "Facebook " + response.error.type + " error";
                Ext.Msg.alert(errTitle, response.error.message, function() {
                    me.login();
                });
            } else {
                BetterPenang.userData = response;
				console.log("ME:  " + BetterPenang.userData.name);
				console.log("Access Token:  " + FB.getAuthResponse()['accessToken']);
				
                if (!me.main) {
                    me.main = Ext.create('BetterPenang.view.Main', {
                        id: 'main'
                    });
                }
                Ext.Viewport.setActiveItem(me.main);
				me.main.showLoginText(BetterPenang.userData.name, BetterPenang.userData.id );
                //Ext.getStore('Runs').load();
            }
        });
    },

    logout: function() {
        Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Logging out...'});
        FB.logout();
    },

    /**
     * Called when the Logout button is tapped
     */
    onLogout: function() {

        if (!this.hasCheckedStatus) return;

        this.login();

        Ext.Viewport.setMasked(false);
        Ext.Viewport.setActiveItem(Ext.getCmp('login'));
        //Ext.getStore('Runs').removeAll();

        //this.logoutCmp.destroy();
    },

    /**
     * When the user profile picture is tapped, create a Logout button and pop it up next to the
     * avatar.
     */
    onUserTap: function(cmp) {

        if (!this.logoutCmp) {
            this.logoutCmp = Ext.create('Ext.Panel', {
                width: 120,
                top: 0,
                left: 0,
                padding: 5,
                modal: true,
                hideOnMaskTap: true,
                items: [
                    {
                        xtype: 'button',
                        id: 'logoutButton',
                        text: 'Logout',
                        ui: 'decline'
                    }
                ]
            });
        }

        this.logoutCmp.showBy(cmp);
    }
});
