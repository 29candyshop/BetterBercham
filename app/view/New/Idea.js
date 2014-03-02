Ext.define('ModelIdeaLocation', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['Title', 'Goto']
    }
});

Ext.create('Ext.data.Store', {
    id: 'ListIdeaStore',
    model: 'ModelIdeaLocation',
    sorters: 'Title',
    grouper: function(record) {
        return record.get('Title')[0];
    },
    data: [
        {Title: 'Location', Goto: 'Location'},
        ]
});

Ext.create('Ext.data.Store', {
    id: 'ListIdeaPicture',
    model: 'ModelIdeaLocation',
    sorters: 'Title',
    grouper: function(record) {
        return record.get('Title')[0];
    },
    data: [
        {Title: 'Get Picture', Goto: 'Location'},
        ]
});
        
Ext.define('BetterPenang.view.New.Idea', {
    extend: 'Ext.Container',
    xtype: 'newidea',

   requires: [
        'Ext.form.*',
        'Ext.field.*',
        'Ext.Button',
		'Ext.Img',
		'Ext.data.JsonP',
        'Ext.data.Store',
        'Ext.List',
		'Ext.Toolbar',
		'Ext.picker.*',
		'Ext.TitleBar',
    ],
    
    // launch: function()
    // {
		// console.log("Launch Idea");
    // },
    
    initialize: function () {
        this.callParent(arguments);
		IdeaMsk = null;
		mIdeaBody = Ext.getCmp("ideabody");
		ideaLocationImage = Ext.getCmp("imgIdeaLocationPhoto");
		ideaLocationText = Ext.getCmp("locationAddr");
		switch(Ext.os.deviceType)
		{
			case "Phone":
				console.log("Phone init for Idea");
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				console.log("Default init for Idea");
				
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				
				if(BetterPenang.app.deviceWidth > 640)
				{
					ideaLocationImage.setWidth(BetterPenang.app.deviceWidth - 10);
					//ideaLocationImage.setWidth(640);
				}
				else
				{
					ideaLocationImage.setWidth(BetterPenang.app.deviceWidth - 10);
				}
				//Ext.Msg.alert('Tap', 'width: ' + ideaLocationImage.getWidth() + " Heigth: " + ideaLocationImage.getHeight(), Ext.emptyFn);
				ideaLocationImage.setHidden(true);
				ideaLocationText.setHidden(true);
				break;
		}
		mNewIdea = "";
		IdeaCurrentCoordinate="";
        IdeaCurrentAddress = "";
		ImgString = "";
		
        this.on('show', function() {
             try
              {
				var bgbody = Ext.getCmp("ideabgbody");
				bgbody.setWidth(BetterPenang.app.deviceWidth);
				bgbody.setHeight(BetterPenang.app.deviceHeight - 100);
				
				//Clear All Field here
				mNewIdea = "";
				var newidea_textbox = Ext.getCmp('YourNewIdea');
				var chk_postFB = Ext.getCmp('PosttoFB');
				
				if(BetterPenang.app.getController("BetterPGApp").GetPreviousForm() != 'Location')
				{
					newidea_textbox.setValue(mNewIdea);
				}
				
				//Run some code here
                var a = BetterPenang.app.getController("BetterPGApp").GetCoordinate();
                var b = BetterPenang.app.getController("BetterPGApp").GetAddress();
                IdeaCurrentCoordinate = a;
                IdeaCurrentAddress = b;
					
                var panel = Ext.getCmp('locationAddr');				
                panel.setHtml(b);
				
				if(b == "")
				{
					var selectField = Ext.getCmp('LocationType');
					selectField.setValue('EntirePG');
				}
				
				if(Ext.os.deviceType == "Phone")
				{
					if(b != "")
					{
						ideaLocationText.setHidden(false);
					}
					
				}
				else
				{
					if(ideaLocationImage.getHidden() == false)
					{
						var CurrentLong = IdeaCurrentCoordinate.lng();
						var CurrentLat = IdeaCurrentCoordinate.lat();
						
						var staticMap = "";
						// if(BetterPenang.app.deviceWidth > 640)
						// {
							// if(BetterPenang.app.deviceWidth > 1280)
							// {
								// staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (ideaLocationImage.getWidth()) + "x" + (ideaLocationImage.getHeight()/2) + "&scale=2&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";
								// //Ext.Msg.alert('Tap', 'width: ' + ideaLocationImage.getWidth() + " Heigth: " + (ideaLocationImage.getHeight() / 2), Ext.emptyFn);
							// }
							// else						
							// {
								// staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (ideaLocationImage.getWidth()/2) + "x" + (ideaLocationImage.getHeight()/2) + "&scale=2&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";
								// //Ext.Msg.alert('Tap', 'width: ' + ideaLocationImage.getWidth() + " Heigth: " + (ideaLocationImage.getHeight() / 2), Ext.emptyFn);
							// }
							
						// }
						// else
						// {
							var staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (ideaLocationImage.getWidth()) + "x" + ideaLocationImage.getHeight() + "&scale=1&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";
						
						//}
						var left = (BetterPenang.app.deviceWidth/2) - (ideaLocationImage.getWidth() / 2);
						var imageMap = '<div style=\"overflow: hidden; position: absolute; top: 0px; left: ' + left + 'px; border: thin solid #666666;\"><img src="' + staticMap + '" />';
						//ideaLocationImage.setSrc(null);
						ideaLocationImage.setHtml(imageMap);
					}
				}
                //panel.setHtml("<FONT COLOR=\"#000000\" size=\"2\" align=\"center\">@" + b + "</FONT>");
                //Ext.Msg.alert('Tap', 'Coordinate: ' + a, Ext.emptyFn);
              }
            catch(err)
              {
                CurrentCoordinate = 'Location';
              //Handle errors here
                //BetterPenang.app.getController("BetterPGApp").SetValue("NoValue", "NoValue");
              }
			  
			 
	        //Ext.Msg.alert('Tap', 'show: ', Ext.emptyFn);
        }, this);
 
    },
    
    config: {
         // fields: [
                // { name: 'ComplaintType',     type: 'string' },
                // { name: 'Description', type: 'string' },
                // { name: 'Location', type: 'string' },
                // { name: 'For',    type: 'string' },
                // { name: 'PostFB',      type: 'string' }             
            // ],
        
        //title: 'New Complaint',
		ideaLocationImage: null,
		ideaLocationText: null,
		mNewIdea: null,
        IdeaCurrentCoordinate: null,
        IdeaCurrentAddress: null,
		ImgPhoto: null,
		ImgContainer: null,
		ImgString: null,
		mIdeaBody: null,
		IdeaMsk: null,
        scrollable: 'vertical',
        baseCls: 'x-show-contact',
        layout: 'vbox',
        //width: Ext.os.deviceType == 'Phone' ? null : 330,
        //height: Ext.os.deviceType == 'Phone' ? null : 550,
        items: [
            {
                xtype: "toolbar",
                docked: "top",
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
                title: "New Idea",
                items: [
                    {
                        xtype: "button",
                        ui: "back",
                        text: "back",
                        itemId: "backButton",
						
                    },
                    { xtype: "spacer" },
                    // {
                        // xtype: "button",
                        // ui: "action",
                        // text: "Post",
                        // itemId: "postIdea",
						// id: "postIdea"
                    // }
                ]
            },
			{
				xtype: 'container',
				id: 'ideabgbody',
				//height: 500,
				//width: 500,
				//style: 'background-color: #aaaaaa',
				//fullscreen: true,
				layout: 'fit',			
				items:
				[	
				{
					xtype: 'container',
					id: 'ideabody',
					//style: 'background-color: #aaaaaa',
					layout: 'vbox',			
					items:[	
						{
							xtype: 'panel',
							height: 10
						},
						{
							xtype: 'fieldset',
							//title: 'New Idea Info',
							margin: Ext.os.deviceType == 'Phone' ? '10 10 10 10' : '30 80 30 80',
							//instructions: 'Please enter the information above.',
							defaults: {
								required: true,
								labelAlign: 'left',
								labelWidth: '40%'
							},
							items: [
							   
								{
									xtype: 'textareafield',
									name: 'YourNewIdea',
									id: 'YourNewIdea',
									label: 'Idea:',
									maxRows: Ext.os.deviceType == 'Phone' ? 5: 10,
								}
							]
						},
						{
								height: Ext.os.deviceType == 'Phone' ? 60 : 0,
								xtype: 'list',
								ui: 'round',
								id: 'gotolocationFromIdea',
								hidden: Ext.os.deviceType == 'Phone' ? true : true,
								grouped: false,
								pinHeaders: false,
								scrollable: 'false',
								disableSelection: false,
								onItemDisclosure: function(record, btn, index) {
									//Ext.Msg.alert('DisclosureTap', 'Disclose more info for ', Ext.emptyFn);
								},
								//valueField: 'rank',
								//displayField: 'title',
								store: 'ListIdeaStore',
								itemTpl: '<div class="contact"><strong>{Title}</strong></div>'
						},
						{
							xtype: 'container',
							//layout: 'fit',
							id: 'imgLocationContainer',
							
							layout: {
								type: 'hbox',
								align: 'stretch',
								pack: 'center '
							},
							//height: '100%',
							//width: '100%',
							items:
							[
								{
									 html: '',
									 width: 5
								},
								{
									xtype: "image",
									//html: "<img width=\"100%;\" src=\"resources/images/penang_bg_2.png\" align=\"center\">",//"resources/images/betterPenang.png",
									mode: '',
									id: "imgIdeaLocationPhoto",
									hidden: Ext.os.deviceType == 'Phone' ? true : true,
									flex: "2",
									margin: '10 80 10 80',
									//itemId: "imgIdeaPhoto",
									//width: '100%',
									height:  Ext.os.deviceType == 'Phone' ? 0 : 400,
									width: 400,
									listeners: {                                
										tap: function() {
											BetterPenang.app.getController("BetterPGApp").onGotoLocationCommand();
											//Ext.Msg.alert('Tap', 'Image tapped', Ext.emptyFn);   
											//check if...
										}
									}
								},
								// {
									// html: '',
									// width: 50
								// },
								// {
									// xtype: "image",
									// //html: "<img width=\"100%;\" src=\"resources/images/penang_bg_2.png\" align=\"center\">",//"resources/images/betterPenang.png",
									// mode: '',
									// id: "imgIdeaCapturePhoto",
									// flex: "2",
									// //itemId: "imgIdeaPhoto",
									// //width: '100%',
									// height:  Ext.os.deviceType == 'Phone' ? 0 : 300,
									// width: 300,
									// listeners: {                                
										// tap: function() {
											// //BetterPenang.app.getController("BetterPGApp").onGotoLocationCommand();
											// //Ext.Msg.alert('Tap', 'Image tapped', Ext.emptyFn);   
											// //check if...
										// }
									// }
								// },
							]
						},
						{
								xtype: 'container',
								//hidden: Ext.os.deviceType == 'Phone' ? true : true,
								id: 'AddressIdeaContainer',
								layout: {
									type: 'hbox',
									align: 'stretch',
									pack: 'center'
								},
								items:
								[
									{
										xtype:'panel',
										width: 15,
										id: 'locationAddr1',
										//html: '.      .',
								   },
									{
										xtype:'panel',
										width: Ext.os.deviceType == 'Phone' ? 300 : 600,
										id: 'locationAddr',
										html: '....',
									},
									 {
										xtype:'panel',
										width: 15,
										id: 'locationAddr3',
										//html: '.      .',
								   },

								],
						},			
						{
							height: Ext.os.deviceType == 'Phone' ? 0 : 0,
							xtype: 'list',
							ui: 'round',
							id: 'gotoPictureFromIdea',
							grouped: false,
							pinHeaders: false,
							scrollable: 'false',
							disableSelection: false,
							onItemDisclosure: function(record, btn, index) {
								//Ext.Msg.alert('DisclosureTap', 'Disclose more info for ', Ext.emptyFn);
							},
							//valueField: 'rank',
							//displayField: 'title',
							store: 'ListIdeaPicture',
							//text: CurrentCoordinate,
							itemTpl: '<div class="contact"><strong>{Title}</strong></div>'
						},
					]
				},
				]
			},
			{
                xtype: "panel",
                docked: "bottom",
				height: Ext.os.deviceType == 'Phone' ? 60: 90,
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
				//style: 'background-color: #aaaaaa', //#2da0ff',
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
						text: "Post Idea",
						itemId: "btnPostIdea",
						id: "btnPostIdea",
						margin: Ext.os.deviceType == 'Phone' ? '10 10 10 10' : '20 130 30 130',
						// handler: function() {
							// Ext.Msg.alert('Done', 'OS: ' + Ext.os.deviceType); 
						// },
					},
					//{ xtype: "spacer" 	},
                ]
            },
			
			
          
//            {
//                id: 'content',
//                tpl: [
//                    '<div class="top">',
//                        '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
//                        '<div class="name">{firstName} {lastName}<span>{title}</span></div>',
//                    '</div>'
//                ].join('')
//            },
//            {
//                xtype: 'map',
//                flex: 1,
//                mapOptions: {
//                    zoomControl: true,
//                    panControl: true,
//                    rotateControl: false,
//                    streetViewControl: false,
//                    mapTypeControl: true,
//                    zoom: 12
//                }
//            }
        ],
        listeners: [
//            {
//                show: function()
//                {
//                    Ext.Msg.alert('Tap', 'show', Ext.emptyFn);
//                },
//            },
            {
                delegate: "#gotolocationFromIdea",
                event: "itemtap",
                fn: "onGotoLocationTap"
            },
            {
                delegate: "#backButton",
                event: "tap",
                fn: "onBackButtonTap"
            },
            {
                delegate: "#btnPostIdea",
                event: "tap",
                fn: "onPostIdea"
            }
        ],
        record: null,
		mContentView: null
    },

//    updateRecord: function(newRecord) {
//        //Ext.Msg.alert('Tap', 'From Update Record', Ext.emptyFn);
//        if (newRecord) {
//            this.down('#content').setData(newRecord.data);

//            this.down('map').setMapCenter({
//                latitude: newRecord.data.latitude,
//                longitude: newRecord.data.longitude
//            });
//        }
//    },


    onGotoLocationTap: function()
    {
        this.fireEvent("GetLocationCommand", this);
    },
    
	onPostIdea2: function () {
		
		if(localStorage.getItem(facebook_token))
		{
			var str = localStorage.getItem(facebook_token)
			Ext.Msg.alert('Tap', 'value: ' + str, Ext.emptyFn);
		}
		
	}
	,
    onPostIdea: function () {
        //Ext.Msg.alert('Tap', 'Post Complaint', Ext.emptyFn);
		try
		{
			if(IdeaMsk != null)
			{
				return;
			}
			var objIdeaFor = Ext.getCmp('LocationType');
			
			var ComplaintTitle = Ext.getCmp('YourNewIdea');
			var strIdea = ComplaintTitle.getValue();
			var strAddress = "";
			var strCoordinate = "0.0|0.0";
			var strImageString = "";
			var strImageString2 = "";
			var contentView = Ext.getCmp('newidea');

			if(strIdea == "")
			{
				Ext.Msg.alert('Data Empty', 'Please enter your idea', Ext.emptyFn);
				return;
			}
			
			/*if(IdeaCurrentAddress != null)
			{
				strAddress = IdeaCurrentAddress;
			}
			if(IdeaCurrentCoordinate != null)
			{
				strCoordinate = IdeaCurrentCoordinate;
			}
			
			var strLocation = objIdeaFor.getValue();
			
			if(strLocation == "AddressNeighborhood")
			{
				if(strCoordinate == "")
				{
					Ext.Msg.alert('Data Empty', 'Please select an address.', Ext.emptyFn);
					return;
				}
			}*/
			var strLocation = "MBI";
			var strData_For = "\"For\":\"" + strLocation + "\",";
			var datetime = new Date();
			var intDate = datetime.getTime();
			var strDateTime = "" + intDate; //"09/09/2012";
			var strUserID= mUserID;
			var strToken = localStorage.getItem(facebook_token);
			
			var strData_Idea = "\"Idea\":\"" + strIdea + "\",";
			var strData_Coordinate = "\"Coordinate\":\"" + strCoordinate + "\",";
			var strData_Address = "\"Neighborhood\":\"" + strAddress + "\",";
			var strData_Datetime = "\"Datetime\":\"" + strDateTime + "\",";
			var strData_UserID = "\"UserID\":\"" + strUserID + "\",";
			var strData_UserFBAccess_Token = "\"UserFBAccess_Token\":\"" + strToken + "\"";
			
			var strData = "{" + strData_For + strData_Idea + strData_Coordinate + strData_Address + strData_Datetime + strData_UserID + strData_UserFBAccess_Token + "}";
			
			var networkState = "" + navigator.network.connection.type;
			if (networkState == "unknown")
			{
				Ext.Msg.alert('status', 'Your Device seems like does not have internet connection..', Ext.emptyFn);
				return;
			}
		}
		catch(err)
		{
			Ext.Msg.alert('Post', 'Error: ' + err, Ext.emptyFn);
			return;
		}
		
		IdeaMsk = "0";
		mIdeaBody.mask({ xtype: 'loadmask', message: 'Posting Idea...' });
		
		$.ajax({
				url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/PostIdea',
				data: strData,
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				type: 'POST',
				timeout: 15000,
				success: function(data, status){
					IdeaMsk = null;
					mIdeaBody.unmask();
					var strReturn = "" + data.d;
					if(strReturn == "0")
					{
						//back to main
						Ext.Msg.alert('Done', 'Successfully Posted Idea.', function(data)
						{
							BetterPenang.app.getController("BetterPGApp").onBackToHomeCommand();
						});						
					}
					else
					{
						switch(strReturn)
						{
							case "-1":	//Post to FB error
								Ext.Msg.alert('Error', 'Sorry, Error Posting Idea. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-2": //Image upload issue
								Ext.Msg.alert('Error', 'Sorry, Error Posting Idea. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-3": //Not login
								Ext.Msg.alert('Error', 'Please Login to Facebook before submitting Idea.', Ext.emptyFn);
								break;
								
							case "-4":	//Database ID error
								Ext.Msg.alert('Error', 'Sorry, Error Posting Idea. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-5":	//Upload photo error
								Ext.Msg.alert('Error', 'Sorry, Error Posting Idea. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-6": //Map request issue
								Ext.Msg.alert('Error', 'Sorry, Error Posting Idea. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-7"://Access token expired
								Ext.Msg.alert('Error', 'Sorry, Your Facebook session maybe expired, please re-login. Code: ' + strReturn, Ext.emptyFn);
								break;
						}										
					}
				},
				error: function(x, t, m) {
					IdeaMsk = null;				
					mIdeaBody.unmask();
					if(t==="timeout") {
						Ext.Msg.alert('Error', 'Sorry, Please check your internet connection.' , Ext.emptyFn);
					} else {
						Ext.Msg.alert('Error', 'Sorry, Error Posting Idea. Code: ' + t , Ext.emptyFn);
					}
				},
				
			});

		// Ext.util.JSONP.request({ 
			// //url: 'http://ec2-54-251-15-129.ap-southeast-1.compute.amazonaws.com/betterpg/service1.asmx/getTestString', 
			// //url: 'http://localhost/Ainsider/Service1.asmx/getTestStringParam',
			// //url: 'http://localhost/testjsonp/WebService1_JSONP.asmx/Surface',
			// url: 'http://localhost:52813/WebService1_JSONP.asmx/PostComplain',
			// //url: 'http://ec2-54-251-15-129.ap-southeast-1.compute.amazonaws.com/MyJsonp/WebService1_JSONP.asmx/getTestString',
			// params: {
				// //radius: '5',
				// //input: '\'this is from SG PC\'',
				// //User: '\'ALL\'',
				// //For: '\'MPPP\'',
				
				// method: 'POST',
				// For: '\'MPPP\'',
				// Title: '\'' + strComplaintTitle + '\'', //'\'Test Complaint from App\'',
				// Description: '\'Test Description for complaint\'',
				// Coordinate: '\'' + strCoordinate + '\'',
				// Address: '\'' + strAddress + '\'',
				// Datetime: '\'13/7/2012\'',
				// ImageString: '\'' + strImageString + '\'',
				// UserID: '\'' + strImageString + '\'',
				// UserFBAccess_Token: '\'-\'',
				// format: 'json',
            // },
			// timeout : 600000,
			// callbackKey: 'callback', 
			// callback: function(success, result) { 
				// try
				// {
					// Ext.Msg.alert('Tap', 'success: ' + success + ' result: ' + result.d, Ext.emptyFn);
				// }
				// catch(err)
				// {
					// Ext.Msg.alert('Tap', 'success: ' + success, Ext.emptyFn);
				// }
				
			// } 
		// });
    },
    onBackButtonTap: function () {
		if(IdeaMsk != null)
		{
			Ext.Msg.show({
			   title: 'Cancel?',
			   message: 'Please select OK to Cancel Posting Idea...',
			   //width: 300,
			   buttons: Ext.MessageBox.OKCANCEL,
			   //multiLine: true,
			   //prompt : { maxlength : 180, autocapitalize : true },
			   fn: function(buttonId) {
					switch(buttonId)
					{
						case "ok":
							IdeaMsk = null;
							mIdeaBody.unmask();
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
			this.fireEvent("backToHomeCommand", this);
		}
    },
	

});

