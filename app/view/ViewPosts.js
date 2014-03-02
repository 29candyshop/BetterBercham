Ext.Loader.setPath({
    'Ext': 'sdk/src',
	//'Ext.plugin': 'sdk/src/plugin'
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
	

Ext.define('BetterPenang.view.ViewPosts', {
     extend: 'Ext.Container',
    
     xtype : 'viewposts',
	 requires: [
		'Ext.data.JsonP',
        //'Ext.List',
		'Ext.carousel.Carousel'
    ],
	
	initialize: function () {
        this.callParent(arguments);
		mFBID = "";
		switch(Ext.os.deviceType)
		{
			case "Phone":
				
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				//recentall.setWidth(BetterPenang.app.deviceWidth);
				//recentall.setHeight(BetterPenang.app.deviceHeight * 0.9);
				console.log("Phone init for Recent Post");
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);

				console.log("Default init for Recent Post");
				break;
		}
		this.on('show', function() {
            try
             {		
				Ext.Viewport.mask({ xtype: 'loadmask', message: 'Please wait...' });
				var ca = Ext.getCmp("carouselViewPostPicture");
				ca.removeAll(true, false);
				ca.setWidth(BetterPenang.app.deviceWidth);
								
				var CarousalWidth = ca.getWidth();
				var CarousalHeight = ca.getHeight();
				
				var myPanel2 = Ext.create('Ext.Panel', {
					html: 'This will be added to a Container'
				});
								
				mFBID = BetterPenang.app.getController("BetterPGApp").GetViewFB_ID();
				var CurrentLat  = BetterPenang.app.getController("BetterPGApp").GetViewLatitude();
				var CurrentLong = BetterPenang.app.getController("BetterPGApp").GetViewLongitude();
			
				var mheight = 300;
				var mWidth = 500;
				if(Ext.os.deviceType == 'Phone')
				{
					mheight = 200;
					mWidth = 350;
				}
			
				if(BetterPenang.app.getController("BetterPGApp").GetViewImagePath() != "")
				{
					var myPanel1 = Ext.create('Ext.Panel', {
						html: 'This will be added to a Container'
					});
												
					$.ajax({
						url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/getImage?wsdl' + new Date().getTime() + Math.random(),
						data: '{"imageURL":"' + BetterPenang.app.getController("BetterPGApp").GetViewImagePath() + '","Width":"' + CarousalWidth + '", "Height":"' + CarousalHeight + '","PicSize":"' + BetterPenang.app.getController("BetterPGApp").GetViewPicSize() + '"}',
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
								myPanel2.setHtml("</br></br><p>" + BetterPenang.app.getController("BetterPGApp").GetViewAddress() + "</p>");
								//myPanel2.setHtml("<p>No Location Info Associated. User may enter address manually;</p>");
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
						if(BetterPenang.app.getController("BetterPGApp").GetViewType() == "I")
						{
							myPanel2.setHtml("</br></br><p>" + BetterPenang.app.getController("BetterPGApp").GetViewFor() + "</p>");
							ca.add([myPanel2]);
							ca.setActiveItem(0);
						}
						else
						{
							myPanel2.setHtml("</br></br><p>" + BetterPenang.app.getController("BetterPGApp").GetViewAddress() + "</p>");
							ca.add([myPanel2]);
							ca.setActiveItem(0);
						}
					}
					else
					{
						var staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + mWidth + "x" + mheight + "&scale=1&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";							
						var imageMap = '<img src="' + staticMap + '" />';
						//item2.setSrc(staticMap);
						myPanel2.setHtml("" + imageMap);
						ca.add([myPanel2]);
						ca.setActiveItem(0);
					}
					//No Photo
					
				}
				
				var txt = Ext.getCmp("txtTitle");
				txt.setHtml("Complaint: " + BetterPenang.app.getController("BetterPGApp").GetViewTitle());
				
				var txt = Ext.getCmp("txtDescription");
				txt.setHtml("Description: " + BetterPenang.app.getController("BetterPGApp").GetViewDescription());
				
				var txtFor = Ext.getCmp("txtFor");
				txtFor.setHtml("" + BetterPenang.app.getController("BetterPGApp").GetViewFor());
											
				var imgUser = Ext.getCmp("imgUserPic");
				var imageUser= '<img src="https://graph.facebook.com/' + BetterPenang.app.getController("BetterPGApp").GetViewUserID() + '/picture?type=square" />';
				imgUser.setHtml(imageUser);
				
				var txtAgo = Ext.getCmp("txtSince");
				var Ago = timeAgoInWords(BetterPenang.app.getController("BetterPGApp").GetViewDateTime());
				var htmlAgo ='<FONT COLOR="#ffffff" size="2">'  + Ago + '</FONT>';
				txtAgo.setHtml(htmlAgo);
				
				
				$.ajax({
					url:'https://graph.facebook.com/' + BetterPenang.app.getController("BetterPGApp").GetViewUserID(),
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
						var htmlName ='<FONT COLOR="#ffffff" size="2">'  + username + '</FONT>';
						txt_username.setHtml(htmlName);
					},
					error: function(error) {

					}
				});
						
				$.ajax({
					url:'https://graph.facebook.com/' + BetterPenang.app.getController("BetterPGApp").GetViewFB_ID() + '?access_token='+ localStorage.getItem(facebook_token),
					data: {},
					dataType: 'text',
					type: 'GET',
					success: function(data, status){
						
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
						var htmlLikes ='<FONT COLOR="#ffffff" size="3">- likes</FONT>';
						txt_likes.setHtml(htmlLikes);
					}
				});
				Ext.Viewport.unmask();
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
        //cls: 'x-contacts',
        //width: Ext.os.deviceType == 'Phone' ? null : 330,
        //height: Ext.os.deviceType == 'Phone' ? null : 550,
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
		scrollable: 'vertical',
		baseCls: 'x-show-contact',
		//objComplaintType: null,
		//objComplaintType: null,
		//objComplaintType: null,
		mFBID: null,
		
		items:
		[
			{
				xtype: "toolbar",
				docked: "top",
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
				//title: "Recent Posts",
				items: 
				[
					{
						xtype: "button",
						ui: "back",
						text: "back",
						itemId: "backToRecentPosts",
						id: "backToRecentPosts",
						handler: function() {
							BetterPenang.app.getController("BetterPGApp").onBackToHomeCommand();
						},
					},
					{xtype: 'spacer'},
				] 
			},
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
					align: 'stretch',
					pack: 'start'
				},
				items: 
				[
					{
						xtype: 'container',
						//style: 'background-color: #bbbbbb',
						layout: {
							type: 'vbox',
							align: 'stretch',
							pack: 'start'
						},
						items: [
							{
								xtype: 'carousel',
								id: 'carouselViewPostPicture',
								height: Ext.os.deviceType == 'Phone' ? 200: 300,
								
								items: [
								{
									html: '<p>Swipe left to show the next card&hellip;</p>',
									//cls: 'card'
								},
								{
									html: '<p>You can also tap on either side of the indicators.</p>',
									//cls: 'card'
								},
								]
							}							
						],
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
					}
				]
			},
			{
				xtype: 'container',
				docked: "bottom",
				height: 80,
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
				//style: 'background-color: #666666',
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
										html: 'user name',
									},
									{
										xtype: 'panel',
										id: "txtSince",
										
										html: '3 days go',
									},
									{
										xtype: 'panel',
										html: '<FONT COLOR="#ffffff" size="2">- likes</FONT>',
										id: "txtLikes",
									}
									
								]
							
								
							},
							{
								xtype: 'spacer',
							},
							{
								xtype: 'button',
								margin: '5 5 5 5',
								ui: 'action',
								id: 'btnLike',
								html: '<FONT COLOR="#ffffff" size="2">Like</FONT>',
								handler: function() {
									//Ext.Msg.alert('Done', 'OS: ' + Ext.os.deviceType); 
									$.ajax({
										url:'https://graph.facebook.com/' + mFBID + '/likes?access_token='+ localStorage.getItem(facebook_token),
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
												}
											});
										},
										error: function(error) {
											//Ext.Msg.alert('ajax', 'Error: ' + error, Ext.emptyFn);
										}
									});
								},
							}
						]
					},
				]
			},
        ],
		listeners: 
		[
			{
				delegate: "#backToRecentPosts",
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
        //this.fireEvent("RefreshCommand", this);
		var mystore = Ext.getStore("Posts");
		//mystore.removeAll();
		//mystore.sync();
    },
    onBackButtonTap: function () {
        //Ext.Msg.alert('Tap', 'Back', Ext.emptyFn);
        //console.log("backToHomeCommand");
        //this.fireEvent("backToHomeCommand", this);
    },
	
});
