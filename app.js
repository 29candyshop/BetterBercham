//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
	//'Ext': '../../src'
});
//</debug>

Ext.application({
    name: 'BetterPenang',

    requires: [
        'Ext.MessageBox'
    ],

	models: ["Contact","Post"],
    stores: ["Contacts","Posts"],
    controllers: ["Facebook","BetterPGApp"],
    views: ["Main", "MainPage", "Login", "New.Complaints", "RecentPosts", "New.Idea", "Get.Location", "ViewPosts"],
	viewport: {
        autoMaximize: true
    },
	
    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

	//deviceWidth: null,
	//deviceHeight: null,
	
    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
		console.log("App Launched");
		this.facebookAppId = '674651699253599';
		this.deviceWidth = Ext.Viewport.getWindowWidth();
		this.deviceHeight = Ext.Viewport.getWindowHeight();

		//pictureSource=navigator.camera.PictureSourceType;
        //destinationType=navigator.camera.DestinationType;
		
		console.log("app.js width : " + this.deviceWidth);
		console.log("app.js width : " + this.facebookAppId);
		//BetterPenang.app.getController("Facebook").FBInit();
		
		BetterPenang.app.getController("BetterPGApp").ShowMainPage();
		//app.init();
		// if(localStorage.getItem("token"))
		// {
			// Ext.Viewport.add({
				// xclass: 'BetterPenang.view.Main', id: 'main'
			// });
		// }
		// else
		// {
			// Ext.Viewport.add({ xclass: 'BetterPenang.view.Login', id: 'login' });
		// }
        
		var a = typeof window.device;
		var b = typeof window.plugins;
		//var c = ChildBrowser.install();
		//Ext.Msg.alert('device ready', 'Done: ' + a + b, Ext.emptyFn);
        
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
