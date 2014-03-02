Ext.define('ModelLocation', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['Title', 'Goto']
    }
});

Ext.create('Ext.data.Store', {
    id: 'ListStore',
    model: 'ModelLocation',
    sorters: 'Title',
    grouper: function(record) {
        return record.get('Title')[0];
    },
    data: [
        {Title: 'Location', Goto: 'Location'},
        ]
});

Ext.create('Ext.data.Store', {
    id: 'ListPicture',
    model: 'ModelLocation',
    sorters: 'Title',
    grouper: function(record) {
        return record.get('Title')[0];
    },
    data: [
        {Title: 'Get Picture', Goto: 'Location'},
        ]
});

var CameraactionSheet = Ext.create('Ext.ActionSheet', {
    items: [
        {
            text: 'From Camera',
            //ui  : 'decline'
        },
        {
            text: 'From Gallery'
        },
        {
            text: 'Cancel',
            ui  : 'confirm'
        }
    ]
});
        
Ext.define('BetterPenang.view.New.Complaints', {
    extend: 'Ext.Container',
    xtype: 'newcomplaint',

   requires: [
        'Ext.form.*',
        'Ext.field.*',
        'Ext.Button',
		'Ext.data.JsonP',
        'Ext.data.Store',
        'Ext.List',
		'Ext.ActionSheet',
		'Ext.Toolbar',
		'Ext.picker.*',
		'Ext.TitleBar',
    ],
	
	initialize: function () {
		this.callParent(arguments);
		ComplaintMsk = null;
		mComplaintBody = Ext.getCmp("complaintbody");
		imgComplaintLocation = Ext.getCmp('imgComplaintLocationPhoto');
		imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
		imageHolder = Ext.getCmp("imgPhoto");
		objComplaintType = Ext.getCmp('ComplaintType');
		objDescription = Ext.getCmp("Description");
		objOtherType = Ext.getCmp("OtherType");
		switch(Ext.os.deviceType)
		{
			case "Phone":
				console.log("Phone init for Complaint");
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				
				imageHolder.setWidth(BetterPenang.app.deviceWidth - 20);
				imageHolder.setHeight(BetterPenang.app.deviceWidth - 20);
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				console.log("Default init for Complaint");
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);

				//Ext.Viewport.setWidth(null);
				//Ext.Viewport.setHeight(null);
				
				break;
		}
		varComplaintLat = null;
		varComplaintLng = null;
		
		this.on('show', function() {
             try
              {		
				//Run some code here
				//Clear All Field
				if(BetterPenang.app.getController("BetterPGApp").GetPreviousForm() != 'Location')
				{
					objComplaintType.setValue('Potholes');
					objDescription.setValue('');
					objOtherType.setValue('');
					objOtherType.setHidden(true);
				}
				
				var a = BetterPenang.app.getController("BetterPGApp").GetCoordinate();
                var b = BetterPenang.app.getController("BetterPGApp").GetAddress();
				
				varComplaintLat = BetterPenang.app.getController("BetterPGApp").GetLat();
				varComplaintLng = BetterPenang.app.getController("BetterPGApp").GetLng();
				
                CurrentCoordinate = a;
                CurrentAddress = b;
                var panel = Ext.getCmp('locationComplaintAddr');
				panel.setHtml(b);
				
				if(b != "")
				{
					var CurrentLong = CurrentCoordinate.lng();
					var CurrentLat = CurrentCoordinate.lat();
					
					var staticMap = "";
					if(imgComplaintLocation.getWidth() > 640)
					{
						if(imgComplaintLocation.getWidth() > 1280)
						{
							staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (imgComplaintLocation.getWidth()) + "x" + (imgComplaintLocation.getHeight()/2) + "&scale=2&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";
							//Ext.Msg.alert('Tap', 'width: ' + ideaLocationImage.getWidth() + " Heigth: " + (ideaLocationImage.getHeight() / 2), Ext.emptyFn);
						}
						else						
						{
							staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (imgComplaintLocation.getWidth()/2) + "x" + (imgComplaintLocation.getHeight()/2) + "&scale=2&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";
							//Ext.Msg.alert('Tap', 'width: ' + ideaLocationImage.getWidth() + " Heigth: " + (ideaLocationImage.getHeight() / 2), Ext.emptyFn);
						}
						
					}
					else
					{
						var staticMap = "http://maps.googleapis.com/maps/api/staticmap?center=" + CurrentLat + "%2C" + CurrentLong + "&zoom=16&size=" + (imgComplaintLocation.getWidth()) + "x" + imgComplaintLocation.getHeight() + "&scale=1&sensor=false&markers=color%3Ared%7Ccolor%3Ared%7Clabel%3AA%7C" + CurrentLat + "%2C" + CurrentLong + "";
					
					}
					var imageMap = '<div style=\"overflow: hidden; position: absolute; top: 0px; left: ' + left + 'px; border: thin solid #666666;\"><img src="' + staticMap + '" />';
					var left = (BetterPenang.app.deviceWidth/2) - (((imgComplaintLocation.getWidth() * 2) + 30) / 2);
					//imgComplaintLocation.setSrc(staticMap);
					imgComplaintLocation.setHtml(imageMap);
				}
				else
				{
					imgComplaintLocation.setHtml("");
					imgComplaintLocation.setSrc('resources/images/getLocationSquareGrey.png');
				}
				
			
				var imageUrl = "";
				try
				{					
					try
					{
						imageUrl = BetterPenang.app.getController("BetterPGApp").GetImageUrl();
					}
					catch(err)
					{
					
					}
				
					if(imageUrl == "")
					{							
						if( Ext.os.deviceType == 'Phone')
						{
							imageHolder.setWidth(300);
							imageHolder.setHeight(300);
							imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
						}
						else
						{
							imgComplaintPhoto.setWidth(300);
							imgComplaintPhoto.setHeight(300);
							imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
							//imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
						}
					}
					else
					{			
						if( Ext.os.deviceType == 'Phone')
						{
							var imgTempPhone = new Image();
							imgTempPhone.onload = function() {
								var w = imgTempPhone.width;
								var h = imgTempPhone.height;
								imageHolder.setWidth(w);
								imageHolder.setHeight(h);
								imageHolder.setSrc(imageUrl);
							  //alert(this.width + 'x' + this.height);
							}
							imgTempPhone.src = imageUrl;
							//imageHolder.setSrc(imageUrl);
						}
						else
						{
							var imgTemp = new Image();							
							imgTemp.onload = function() {
								var w = imgTemp.width;
								var h = imgTemp.height;
								imgComplaintPhoto.setWidth(w);
								imgComplaintPhoto.setHeight(h);
								imgComplaintPhoto.setSrc(imageUrl);
							}
							imgTemp.src = imageUrl;
							//imgComplaintPhoto.setSrc(imageUrl);
						}
						
						console.log("load image");
					}
				}
				catch(err)
				{
					Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
					console.log("not image");
				}
				
              }
            catch(err)
            {
                CurrentCoordinate = 'Location';
                //BetterPenang.app.getController("BetterPGApp").SetValue("NoValue", "NoValue");
            }
        }, this);
	},
    
    config: {
         fields: [
                { name: 'ComplaintType',     type: 'string' },
                { name: 'Description', type: 'string' },
                { name: 'Location', type: 'string' },
                { name: 'For',    type: 'string' },
                { name: 'PostFB',      type: 'string' }             
            ],
        
        //title: 'New Complaint',
		objComplaintType: null,
		objDescription: null,
		imgComplaintLocation: null,
		imgComplaintPhoto: null,
		imageHolder: null,
		CurrentCoordinate: null,
        CurrentAddress: null,
		ImgPhoto: null,
		ImgContainer: null,
		ImgString: null,
		mComplaintBody: null,
		ComplaintMsk: null,
		objOtherType: null,
		varComplaintLat : null,
		varComplaintLng: null,
		
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
                title: "New Complaint",
                items: [
                    {
                        xtype: "button",
                        ui: "back",
                        text: "back",
                        itemId: "backButton"
                    },
                    { xtype: "spacer" },
                    // {
                        // xtype: "button",
                        // ui: "action",
                        // text: "Post",
                        // itemId: "postComplaint"
                    // }
                ]
            },
			{
				xtype: 'container',
				id: 'complaintbody',
				items:[
				{
					xtype: 'panel',
					height: 10
				},
				{
					xtype: 'fieldset',
					//title: 'New Complaint Info',
					margin: Ext.os.deviceType == 'Phone' ? '10 10 10 10' : '30 80 30 80',
					//instructions: 'Please enter the information above.',
					defaults: {
						required: true,
						labelAlign: 'left',
						labelWidth: '40%'
					},
					items: 
					[
						{
						   
							xtype: 'selectfield',
							id: 'ComplaintType',
							name: 'ComplaintType',
							label: 'Type:',
							usePicker: Ext.os.deviceType == 'Phone' ? true : false,
							valueField: 'rank',
							displayField: 'title',
							store: {
								data: [
									{ rank: 'Potholes', title: 'Potholes'},
									{ rank: 'FaultyTrafficLight', title: 'Faulty Traffic Light'},
									{ rank: 'FaultyStreetLamp', title: 'Faulty Street Lamp'},
									{ rank: 'OpenBurning', title: 'Open Burning'},
									{ rank: 'IlegalDumpSite', title: 'Ilegal Dump Site'},
									{ rank: 'FlashFlood', title: 'Flash Flood'},
									{ rank: 'DrainageIssue', title: 'Drainage Issues'},
									{ rank: 'DamageRoadSign', title: 'Damage Road Sign'},
									{ rank: 'DemageSewageLid', title: 'Damage/Missing Sewage Lid'},
									{ rank: 'UncutGrass', title: 'Uncut Grass'},
									{ rank: 'Others', title: 'Others'}
								]
							},
							listeners: {                                
								change: function(field, value) {
									if(value.data.rank == "Others")
									{
										objOtherType.setValue('');
										objOtherType.setHidden(false);
									}
									else
									{
										objOtherType.setValue('');
										objOtherType.setHidden(true);
									}
								}
							}
						},
						{
							xtype: 'textfield',
							id: 'OtherType',
							name: 'OtherType',
							label: 'Other:',
							hidden: true,
							maxRows: 3,
						},
						{
							xtype: 'textareafield',
							name: 'Description',
							id: 'Description',
							label: 'Description',
							maxRows: Ext.os.deviceType == 'Phone' ? 3: 10,
						}
					]
				},
				{
						height: Ext.os.deviceType == 'Phone' ? 60 : 0,
						xtype: 'list',
						id: "gotolocationfromcomplaint",
						ui: 'round',
						grouped: false,
						pinHeaders: false,
						scrollable: 'false',
						disableSelection: false,
						onItemDisclosure: function(record, btn, index) {
							//this.fireEvent("PostComplaintCommand", this);
							//Ext.Msg.alert('DisclosureTap', 'Disclose more info for ', Ext.emptyFn);
						},
						//valueField: 'rank',
						//displayField: 'title',
						store: 'ListStore',
						itemTpl: '<div class="contact"><strong>{Title}</strong></div>'
				},
				{
						xtype: 'container',
						id: 'AddressComplaintContainer',
						hidden: Ext.os.deviceType == 'Phone' ? false : true,
						//height: Ext.os.deviceType == 'Phone' ? 60 : 0,
						layout: {
							type: 'hbox',
							align: 'center',
							pack: 'center'
						},
						items:
						[
							{
								xtype:'panel',
								width: 15,
								hidden: Ext.os.deviceType == 'Phone' ? false : true,
								//height: Ext.os.deviceType == 'Phone' ? 60 : 0,
								id: 'locationComplaintAddr1',
								//html: '.      .',
						   },
							{
								xtype:'panel',
								width: 300,
								hidden: Ext.os.deviceType == 'Phone' ? false : true,
								//height: Ext.os.deviceType == 'Phone' ? 60 : 0,
								id: 'locationComplaintAddr',
								html: '....',
							},
							 {
								xtype:'panel',
								width: 15,
								hidden: Ext.os.deviceType == 'Phone' ? false : true,
								//height: Ext.os.deviceType == 'Phone' ? 60 : 0,
								id: 'locationComplaintAddr3',
								//html: '.      .',
						   },

						],
				},
				{
					xtype: 'container',
					//style: 'background-color: #bbbbbb', //#4390D8', //#2da0ff',
					hidden: Ext.os.deviceType == 'Phone' ? true : false,
					items:
					[
						{
							xtype: 'panel',
							style: 'background-color: #000000',
							height: 1,
							hidden: Ext.os.deviceType == 'Phone' ? true : false,
						},
						{
							xtype: 'container',
							//layout: 'fit',
							//border: '2',
							id: 'imgComplaintLocationContainer',
							//style: 'background-color: #bbbbbb', //#4390D8', //#2da0ff',
							layout: {
								type: 'hbox',
								align: 'stretch',
								pack: 'center '
							},
							margin: '20 0 20 0',
							//height: '100%',
							//width: '100%',
							items:
							[

								{
									xtype: "image",
									//html: "<img width=\"100%;\" src=\"resources/images/penang_bg_2.png\" align=\"center\">",//"resources/images/betterPenang.png",
									mode: '',
									id: "imgComplaintLocationPhoto",
									flex: "2",
									
									//itemId: "imgIdeaPhoto",
									//width: '100%',
									height:  Ext.os.deviceType == 'Phone' ? 0 : 300,
									width: 300,
									listeners: {                                
										tap: function() {
											BetterPenang.app.getController("BetterPGApp").onGotoLocationCommand();
											//Ext.Msg.alert('Tap', 'Image tapped', Ext.emptyFn);   
											//check if...
										}
									}
								},
								{
									html: '',
									width: 30
								},
								{
									xtype: "image",
									//html: "<img width=\"100%;\" src=\"resources/images/penang_bg_2.png\" align=\"center\">",//"resources/images/betterPenang.png",
									mode: '',
									id: "imgComplaintCapturePhoto",
									flex: "2",
									mode: 'element',
									//itemId: "imgIdeaPhoto",
									//width: '100%',
									height:  Ext.os.deviceType == 'Phone' ? 0 : 300,
									width: 300,
									listeners: {                                
										tap: function() {
											//Ext.Viewport.add(CameraactionSheet);
											//CameraactionSheet.show();
											if (!this.actions) {
												this.actions = new Ext.ActionSheet({
												items: [{
												  text: 'From Camera',
												  //ui: 'decline',
												  scope: this,
												  handler: function() {
													navigator.camera.getPicture(
													function (imageData)
													{
														imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
														imageHolder = Ext.getCmp("imgPhoto");
														var imgdata = "" + imageData;
														var imgStr = "data:image/jpeg;base64," + imageData;
														if(imgdata.indexOf("http://www") != -1)
														{
															imgStr = imageData;
														}

														try
														{					
															imageUrl = imgStr;

															if(imageUrl == "")
															{	
																Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																
															}
															else
															{			
																if( Ext.os.deviceType == 'Phone')
																{
																	var imgTempPhone = new Image();
																	imgTempPhone.onload = function() {
																		var w = imgTempPhone.width;
																		var h = imgTempPhone.height;
																		imageHolder.setWidth(w);
																		imageHolder.setHeight(h);
																		imageHolder.setSrc(imageUrl);
																	  //alert(this.width + 'x' + this.height);
																	}
																	imgTempPhone.src = imageUrl;
																	//imageHolder.setSrc(imageUrl);
																}
																else
																{
																	var imgTemp = new Image();
																	imgTemp.onload = function() {
																		var w = imgTemp.width;
																		var h = imgTemp.height;
																		imgComplaintPhoto.setWidth(w);
																		imgComplaintPhoto.setHeight(h);
																		imgComplaintPhoto.setSrc(imageUrl);
																	}
																	imgTemp.src = imageUrl;
																}
															}
															BetterPenang.app.getController("BetterPGApp").SetImageValue(imageData);
														}
														catch(err)
														{
															Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
															console.log("not image");
														}
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
													// Ext.device.Camera.capture({ 
														// source: 'camera', 
														// destination: 'data', 
														// quality: 75,
														// width: 300,
														// height: 300,
														// success: function(url) { 
															// imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
															// imageHolder = Ext.getCmp("imgPhoto");
															// var imgdata = "" + url;
															// var imgStr = "data:image/jpeg;base64," + url;
															// if(imgdata.indexOf("http://www") != -1)
															// {
																// imgStr = url;
															// }

															// try
															// {					
																// imageUrl = imgStr;

																// if(imageUrl == "")
																// {	
																	// Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																	// else
																	// {
																		// imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																// }
																// else
																// {			
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// var imgTempPhone = new Image();
																		// imgTempPhone.onload = function() {
																			// var w = imgTempPhone.width;
																			// var h = imgTempPhone.height;
																			// imageHolder.setWidth(w);
																			// imageHolder.setHeight(h);
																			// imageHolder.setSrc(imageUrl);
																		  // //alert(this.width + 'x' + this.height);
																		// }
																		// imgTempPhone.src = imageUrl;
																		// //imageHolder.setSrc(imageUrl);
																	// }
																	// else
																	// {
																		// var imgTemp = new Image();
																		// imgTemp.onload = function() {
																			// var w = imgTemp.width;
																			// var h = imgTemp.height;
																			// imgComplaintPhoto.setWidth(w);
																			// imgComplaintPhoto.setHeight(h);
																			// imgComplaintPhoto.setSrc(imageUrl);
																		// }
																		// imgTemp.src = imageUrl;
																	// }
																// }
																// BetterPenang.app.getController("BetterPGApp").SetImageValue(url);
															// }
															// catch(err)
															// {
																// Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
																// console.log("not image");
															// }
														// }, 
														// failure: function() { 
															
														// }, 
													// });
													
													this.actions.hide();
													//this.popup.hide();
													}
												}, {
												  text: 'From Gallery',
												  scope: this,
												  handler: function() {
													navigator.camera.getPicture(
													function (imageData)
													{
														//Set Image String to Controller
														imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
														imageHolder = Ext.getCmp("imgPhoto");
														var imgdata = "" + imageData;
														var imgStr = "data:image/jpeg;base64," + imageData;
														if(imgdata.indexOf("http://www") != -1)
														{
															imgStr = imageData;
														}

														try
														{					
															imageUrl = imgStr;

															if(imageUrl == "")
															{	
																Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																if( Ext.os.deviceType == 'Phone')
																{
																	imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																}
																else
																{
																	imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
																}
															}
															else
															{			
																if( Ext.os.deviceType == 'Phone')
																{
																	var imgTempPhone = new Image();
																	imgTempPhone.onload = function() {
																		var w = imgTempPhone.width;
																		var h = imgTempPhone.height;
																		imageHolder.setWidth(w);
																		imageHolder.setHeight(h);
																		imageHolder.setSrc(imageUrl);
																	  //alert(this.width + 'x' + this.height);
																	}
																	imgTempPhone.src = imageUrl;
																	//imageHolder.setSrc(imageUrl);
																}
																else
																{
																	var imgTemp = new Image();
																	imgTemp.onload = function() {
																		var w = imgTemp.width;
																		var h = imgTemp.height;
																		imgComplaintPhoto.setWidth(w);
																		imgComplaintPhoto.setHeight(h);
																		imgComplaintPhoto.setSrc(imageUrl);
																	}
																	imgTemp.src = imageUrl;
																}
															}
															BetterPenang.app.getController("BetterPGApp").SetImageValue(imageData);
														}
														catch(err)
														{
															Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
															console.log("not image");
														}
													},
													function (message)
													{
														//error
													}, 
													{ 
														quality: 75,
														sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
														destinationType: navigator.camera.DestinationType.DATA_URL,
														targetWidth: 300,
														targetHeight: 300,
													});
													// Ext.device.Camera.capture({ 
														// source: 'library', 
														// destination: 'data', 
														// quality: 75,
														// width: 300,
														// height: 300,
														// success: function(url) { 
															// imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
															// imageHolder = Ext.getCmp("imgPhoto");
															// var imgdata = "" + url;
															// var imgStr = "data:image/jpeg;base64," + url;
															// if(imgdata.indexOf("http://www") != -1)
															// {
																// imgStr = url;
															// }

															// try
															// {					
																// imageUrl = imgStr;

																// if(imageUrl == "")
																// {	
																	// Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																	// else
																	// {
																		// imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																// }
																// else
																// {			
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// var imgTempPhone = new Image();
																		// imgTempPhone.onload = function() {
																			// var w = imgTempPhone.width;
																			// var h = imgTempPhone.height;
																			// imageHolder.setWidth(w);
																			// imageHolder.setHeight(h);
																			// imageHolder.setSrc(imageUrl);
																		  // //alert(this.width + 'x' + this.height);
																		// }
																		// imgTempPhone.src = imageUrl;
																		// //imageHolder.setSrc(imageUrl);
																	// }
																	// else
																	// {
																		// var imgTemp = new Image();
																		// imgTemp.onload = function() {
																			// var w = imgTemp.width;
																			// var h = imgTemp.height;
																			// imgComplaintPhoto.setWidth(w);
																			// imgComplaintPhoto.setHeight(h);
																			// imgComplaintPhoto.setSrc(imageUrl);
																		// }
																		// imgTemp.src = imageUrl;
																	// }
																// }
																// BetterPenang.app.getController("BetterPGApp").SetImageValue(url);
															// }
															// catch(err)
															// {
																// Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
																// console.log("not image");
															// }
														// }, 
														// failure: function() { 
															
														// }, 
													// });
													this.actions.hide();
													//this.popup.hide();
												  }
												}, {
												  text: 'cancel',
												  ui: 'decline',
												  scope: this,
												  handler: function() {
													this.actions.hide();
													//this.popup.hide();
												  }
												}]
											  });
											  Ext.Viewport.add(this.actions);
											}
											
											this.actions.show();
										}
									}
								},
							]
						},
						{
							xtype: 'panel',
							//style: 'background-color: #bbbbbb',
							height: 20,
						},
					],
				},
				{
						height: Ext.os.deviceType == 'Phone' ? 0 : 0,
						xtype: 'list',
						id: "gotopicturefromcomplaint",
						ui: 'round',
						grouped: false,
						pinHeaders: false,
						scrollable: 'false',
						disableSelection: false,
						onItemDisclosure: function(record, btn, index) {
							//Ext.Msg.alert('DisclosureTap', 'Get Photo ', Ext.emptyFn);
						},
						//valueField: 'rank',
						//displayField: 'title',
						store: 'ListPicture',
						itemTpl: '<div class="contact"><strong>{Title}</strong></div>',
				},
				{
						xtype: 'container',
						//id: 'AddressIdeaContainer',
						hidden: Ext.os.deviceType == 'Phone' ? false : true,
						layout: {
							type: 'hbox',
							align: 'center',
							pack: 'center'
						},
						items:
						[
							{
								xtype:'panel',
								width: 15,
								//id: 'locationAddr1',
								html: '...',
							}
						],
				},
				{
					xtype: 'container',
					//layout: 'fit',
					id: 'imgContainer',
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
							xtype: "image",
							//html: "<img width=\"100%;\" src=\"resources/images/penang_bg_2.png\" align=\"center\">",//"resources/images/betterPenang.png",
							mode: '',
							id: "imgPhoto",
							flex: "2",
							//itemId: "imgIdeaPhoto",
							//width: '100%',
							height: Ext.os.deviceType == 'Phone' ? 400: 0,
							width: 400,
							listeners: {                                
								tap: function() {
										if (!this.actions) {
											this.actions = new Ext.ActionSheet({
											items: [
											{
												text: 'From Camera',
												//height: 40,
												//ui: 'decline',
												scope: this,
												handler: function() 
												{
													navigator.camera.getPicture(
													function (imageData)
													{
														imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
														imageHolder = Ext.getCmp("imgPhoto");
														var imgdata = "" + imageData;
														var imgStr = "data:image/jpeg;base64," + imageData;
														if(imgdata.indexOf("http://www") != -1)
														{
															imgStr = imageData;
														}

														try
														{					
															imageUrl = imgStr;

															if(imageUrl == "")
															{	
																Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																
															}
															else
															{			
																if( Ext.os.deviceType == 'Phone')
																{
																	var imgTempPhone = new Image();
																	imgTempPhone.onload = function() {
																		var w = imgTempPhone.width;
																		var h = imgTempPhone.height;
																		imageHolder.setWidth(w);
																		imageHolder.setHeight(h);
																		imageHolder.setSrc(imageUrl);
																	  //alert(this.width + 'x' + this.height);
																	}
																	imgTempPhone.src = imageUrl;
																	//imageHolder.setSrc(imageUrl);
																}
																else
																{
																	var imgTemp = new Image();
																	imgTemp.onload = function() {
																		var w = imgTemp.width;
																		var h = imgTemp.height;
																		imgComplaintPhoto.setWidth(w);
																		imgComplaintPhoto.setHeight(h);
																		imgComplaintPhoto.setSrc(imageUrl);
																	}
																	imgTemp.src = imageUrl;
																}
															}
															BetterPenang.app.getController("BetterPGApp").SetImageValue(imageData);
														}
														catch(err)
														{
															Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
															console.log("not image");
														}
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
													// Ext.device.Camera.capture({ 
														// source: 'camera', 
														// destination: 'data', 
														// quality: 75,
														// width: 300,
														// height: 300,
														// success: function(url) { 
														
															// imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
															// imageHolder = Ext.getCmp("imgPhoto");
															// var imgdata = "" + url;
															// var imgStr = "data:image/jpeg;base64," + url;
															// if(imgdata.indexOf("http://www") != -1)
															// {
																// imgStr = url;
															// }

															// try
															// {					
																// imageUrl = imgStr;

																// if(imageUrl == "")
																// {	
																	// Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																	// else
																	// {
																		// imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																// }
																// else
																// {			
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// var imgTempPhone = new Image();
																		// imgTempPhone.onload = function() {
																			// var w = imgTempPhone.width;
																			// var h = imgTempPhone.height;
																			// imageHolder.setWidth(w);
																			// imageHolder.setHeight(h);
																			// imageHolder.setSrc(imageUrl);
																		  // //alert(this.width + 'x' + this.height);
																		// }
																		// imgTempPhone.src = imageUrl;
																		// //imageHolder.setSrc(imageUrl);
																	// }
																	// else
																	// {
																		// var imgTemp = new Image();
																		// imgTemp.onload = function() {
																			// var w = imgTemp.width;
																			// var h = imgTemp.height;
																			// imgComplaintPhoto.setWidth(w);
																			// imgComplaintPhoto.setHeight(h);
																			// imgComplaintPhoto.setSrc(imageUrl);
																		// }
																		// imgTemp.src = imageUrl;
																	// }
																// }
																// BetterPenang.app.getController("BetterPGApp").SetImageValue(url);
															// }
															// catch(err)
															// {
																// Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
																// console.log("not image");
															// }
														// },
														// failure: function() { 
														
														// },
													// });
													
													this.actions.hide();
												}
											},
											{
												text: 'From Gallery',
												//height: 40,
												scope: this,
												handler: function() 
												{
													navigator.camera.getPicture(
													function (imageData)
													{
														//Set Image String to Controller
														imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
														imageHolder = Ext.getCmp("imgPhoto");
														var imgdata = "" + imageData;
														var imgStr = "data:image/jpeg;base64," + imageData;
														if(imgdata.indexOf("http://www") != -1)
														{
															imgStr = imageData;
														}

														try
														{					
															imageUrl = imgStr;

															if(imageUrl == "")
															{	
																Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																if( Ext.os.deviceType == 'Phone')
																{
																	imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																}
																else
																{
																	imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
																}
															}
															else
															{			
																if( Ext.os.deviceType == 'Phone')
																{
																	var imgTempPhone = new Image();
																	imgTempPhone.onload = function() {
																		var w = imgTempPhone.width;
																		var h = imgTempPhone.height;
																		imageHolder.setWidth(w);
																		imageHolder.setHeight(h);
																		imageHolder.setSrc(imageUrl);
																	  //alert(this.width + 'x' + this.height);
																	}
																	imgTempPhone.src = imageUrl;
																	//imageHolder.setSrc(imageUrl);
																}
																else
																{
																	var imgTemp = new Image();
																	imgTemp.onload = function() {
																		var w = imgTemp.width;
																		var h = imgTemp.height;
																		imgComplaintPhoto.setWidth(w);
																		imgComplaintPhoto.setHeight(h);
																		imgComplaintPhoto.setSrc(imageUrl);
																	}
																	imgTemp.src = imageUrl;
																}
															}
															BetterPenang.app.getController("BetterPGApp").SetImageValue(imageData);
														}
														catch(err)
														{
															Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
															console.log("not image");
														}
													},
													function (message)
													{
														//error
													}, 
													{ 
														quality: 75,
														sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
														destinationType: navigator.camera.DestinationType.DATA_URL,
														targetWidth: 300,
														targetHeight: 300,
													});
													// Ext.device.Camera.capture({ 
														// source: 'library', 
														// destination: 'data', 
														// quality: 75,
														// width: 300,
														// height: 300,
														// success: function(url) { 													
															// imgComplaintPhoto = Ext.getCmp('imgComplaintCapturePhoto');
															// imageHolder = Ext.getCmp("imgPhoto");
															// var imgdata = "" + url;
															// var imgStr = "data:image/jpeg;base64," + url;
															// if(imgdata.indexOf("http://www") != -1)
															// {
																// imgStr = url;
															// }

															// try
															// {					
																// imageUrl = imgStr;

																// if(imageUrl == "")
																// {	
																	// Ext.Msg.alert('Error', 'Empty Photo?', Ext.emptyFn);
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// imageHolder.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																	// else
																	// {
																		// imgComplaintPhoto.setSrc('resources/images/getPhotoSquareGrey.png');
																	// }
																// }
																// else
																// {			
																	// if( Ext.os.deviceType == 'Phone')
																	// {
																		// var imgTempPhone = new Image();
																		// imgTempPhone.onload = function() {
																			// var w = imgTempPhone.width;
																			// var h = imgTempPhone.height;
																			// imageHolder.setWidth(w);
																			// imageHolder.setHeight(h);
																			// imageHolder.setSrc(imageUrl);
																		  // //alert(this.width + 'x' + this.height);
																		// }
																		// imgTempPhone.src = imageUrl;
																		// //imageHolder.setSrc(imageUrl);
																	// }
																	// else
																	// {
																		// var imgTemp = new Image();
																		// imgTemp.onload = function() {
																			// var w = imgTemp.width;
																			// var h = imgTemp.height;
																			// imgComplaintPhoto.setWidth(w);
																			// imgComplaintPhoto.setHeight(h);
																			// imgComplaintPhoto.setSrc(imageUrl);
																		// }
																		// imgTemp.src = imageUrl;
																	// }
																// }
																// BetterPenang.app.getController("BetterPGApp").SetImageValue(url);
															// }
															// catch(err)
															// {
																// Ext.Msg.alert('Error', 'Error: ' + err, Ext.emptyFn);
																// console.log("not image");
															// }
															
														// }, 
														// failure: function() { 
															
														// }
													// });
													this.actions.hide();
												}
											},
											{
												text: 'cancel',
												//height: 40,
												ui: 'decline',
												scope: this,
												handler: function() {
													this.actions.hide();
												}
											}]
											
										});
										Ext.Viewport.add(this.actions);
									}
									this.actions.show();
								}
							}
						},
					]
				},
				{
                    xtype: 'container',
					//id: 'AddressIdeaContainer',
					hidden: Ext.os.deviceType == 'Phone' ? false : true,
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items:
                    [
                        {
                            xtype:'panel',
                            width: 15,
                            //id: 'locationAddr1',
                            html: '...',
						}
                    ],
				},
				]
			},
			{
                xtype: "panel",
                docked: "bottom",
				height: Ext.os.deviceType == 'Phone' ? 60: 90,
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
				//style: 'background-color: #888888', //#4390D8', //#2da0ff',
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
						text: "Post Complaint",
						itemId: "btnPostComplaint",
						id: "btnPostComplaint",
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
            {
                delegate: "#gotolocationfromcomplaint",
                event: "itemtap",
                fn: "onGetLocationTap"
            },
			{
                delegate: "#gotopicturefromcomplaint",
                event: "itemtap",
                fn: "onGetPictureTap"
            },
            {
                delegate: "#backButton",
                event: "tap",
                fn: "onBackButtonTap"
            },
            {
                delegate: "#btnPostComplaint",
                event: "tap",
                fn: "onPostComplaint"
            }
        ],
        record: null
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

	onGetPictureTap: function()
	{

		

		//Ext.Msg.alert('Tap', 'Get Picture', Ext.emptyFn);
	},
	
    onGetLocationTap: function()
    {
         //Ext.Msg.alert('Tap', 'Get Location', Ext.emptyFn);
         this.fireEvent("GetLocationCommand", this);
    },
    
    onPostComplaint: function () {
		try
		{
			if(ComplaintMsk != null)
			{
				return;
			}
			
			objComplaintType = Ext.getCmp('ComplaintType');
			objDescription = Ext.getCmp("Description");
			objOtherType = Ext.getCmp("OtherType");
			
			var strComplaintTitle = objComplaintType.getValue();//ComplaintTitle.getValue();
			if(strComplaintTitle == "Others")
			{
				strComplaintTitle = "" + objOtherType.getValue();
					if(strComplaintTitle == "")
					{
						Ext.Msg.alert('Data Empty', 'Please enter title of your complaint.', Ext.emptyFn);
						return;
					}
			}
			var strAddress = "" + CurrentAddress;
			var strCoordinate = "" + CurrentCoordinate;
			var strImageString = BetterPenang.app.getController("BetterPGApp").GetImageUrl();
			var strImageString2 = "";
			var strDescription = "" + objDescription.getValue();
			
			if(strAddress == "")
			{
				Ext.Msg.alert('Data Empty', 'Please select an address for your complaint.', Ext.emptyFn);
				return;
			}

			if(CurrentAddress != null)
			{
				strAddress = CurrentAddress;
			}
			if(CurrentCoordinate != null)
			{
				strCoordinate = CurrentCoordinate;
			}
			try
			{
				var length = strImageString.length;
			}
			catch(err)
			{
				strImageString = "";
			}
			var datetime = new Date();
			var intDate = datetime.getTime();
			var strDateTime = "" + intDate; //"09/09/2012";
			var strUserID = mUserID;
			
			var strData_For = "\"For\":\"MPPP\",";
			//check coordinate
			var CurrentLat = CurrentCoordinate.lat();
			var CurrentLong = CurrentCoordinate.lng();
			var strCoor = CurrentLat + "|" + CurrentLong;
			
			//Ext.Msg.alert('Data Empty', '' + strCoor + "   " + strCoordinate, Ext.emptyFn);
			//return;
							
			if(CurrentLong > 100.35)
			{
				strData_For = "\"For\":\"MPSP\",";
			}
			else
			{
				strData_For = "\"For\":\"MPPP\",";
			}
			
			var strToken = localStorage.getItem(facebook_token);
			
			var strData_Title = "\"Title\":\"" + strComplaintTitle + "\",";
			var strData_Description = "\"Description\":\"" + strDescription + "\",";
			var strData_Coordinate = "\"Coordinate\":\"" + strCoordinate + "\",";
			var strData_Address = "\"Address\":\"" + strAddress + "\",";
			var strData_Datetime = "\"Datetime\":\"" + strDateTime + "\",";
			var strData_ImageString = "\"ImageString\":\"" + strImageString + "\",";
			var strData_UserID = "\"UserID\":\"" + strUserID + "\",";
			var strData_UserFBAccess_Token = "\"UserFBAccess_Token\":\"" + strToken + "\"";
			
			var strData = "{" + strData_For + strData_Title + strData_Description + strData_Coordinate + strData_Address + strData_Datetime + strData_ImageString + strData_UserID + strData_UserFBAccess_Token + "}";
			
			var networkState = "" + navigator.network.connection.type;			
		}
		catch(err)
		{
			Ext.Msg.alert('Post', 'Error: ' + err, Ext.emptyFn);
			return;
		}
		if (networkState == "unknown")
		{
			Ext.Msg.alert('status', 'Your Device seems like does not have internet connection..', Ext.emptyFn);
			return;
		}
			
		ComplaintMsk = "0";
		mComplaintBody.mask({ xtype: 'loadmask', message: 'Posting Complaint, Please Wait...' });
		
		try
		{
			$.ajax({
				url:'http://webservices.betterbercham.com/Betterberchamservice_jsonp.asmx/PostComplain',
				data: strData,
				//dataType: 'text',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				type: 'POST',
				timeout: 15000,
				success: function(data, status){
					ComplaintMsk = null;
					mComplaintBody.unmask();
					var strReturn = "" + data.d;
					if(strReturn == "0")
					{
						//back to main
						Ext.Msg.alert('Done', 'Successfully Posted Complaint.', function(data)
						{
							BetterPenang.app.getController("BetterPGApp").onBackToHomeCommand();
						});
					}
					else
					{
						switch(strReturn)
						{
							case "-1":	//Post to FB error
								Ext.Msg.alert('Error', 'Sorry, Error Posting Complaint. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-2": //Image upload issue
								Ext.Msg.alert('Error', 'Sorry, Error Posting Complaint. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-3": //Not login
								Ext.Msg.alert('Error', 'Please Login to Facebook before submitting Complaint.', Ext.emptyFn);
								break;
								
							case "-4":	//Database ID error
								Ext.Msg.alert('Error', 'Sorry, Error Posting Complaint. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-5":	//Upload photo error
								Ext.Msg.alert('Error', 'Sorry, Error Posting Complaint. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-6": //Map request issue
								Ext.Msg.alert('Error', 'Sorry, Error Posting Complaint. Code: ' + strReturn, Ext.emptyFn);
								break;
								
							case "-7"://Access token expired
								Ext.Msg.alert('Error', 'Sorry, Your Facebook session maybe expired, please re-login. Code: ' + strReturn, Ext.emptyFn);
								break;
						}
					}
					
				},
				error: function(x, t, m) {
					ComplaintMsk = null;
					mComplaintBody.unmask();
					if(t==="timeout") 
					{
						Ext.Msg.alert('Error', 'Sorry, Please check your internet connection.' , Ext.emptyFn);
					} 
					else 
					{
						Ext.Msg.alert('Error', 'Sorry, Error Posting Complaint. Code: ' + t , Ext.emptyFn);
					}
				},
			});
			// var strSurfaceParam = "\"radius\":\"5\"";
			// var strSufaceData = "{" + strSurfaceParam + "}";
			// $.ajax({
				// url:'http://46.137.215.68/myjsonp/WebService1.asmx/Surface',
				// data: strSufaceData,//'{"radius":"5"}',
				// contentType: "application/json; charset=utf-8",
				// dataType: "json",
				// type: 'POST',
				// success: function(data, status){
					// Ext.Viewport.unmask();
					// //var obj = JSON.parse(data);
					// //alert(obj.count);
					// Ext.Msg.alert('ajax', 'data: ' + data.d, Ext.emptyFn);
				// },
				// error: function(error) {
					// Ext.Viewport.unmask();
					// Ext.Msg.alert('ajax', 'Error: ' + error.statusText , Ext.emptyFn);
				// }
			// });
		}
		catch(err)
		{
			ComplaintMsk = null;
			mComplaintBody.unmask();
			Ext.Msg.alert('ajax', 'Error: ' + err , Ext.emptyFn);
		}
		

		// $.ajax({
			// url:'http://46.137.215.68/myjsonp/WebService1.asmx/getTestString',
			// data: {},
			// dataType: 'text',
			// type: 'POST',
			// success: function(data, status){
				// Ext.Msg.alert('ajax', 'data: ' + data, Ext.emptyFn);
			// },
			// error: function(error) {
				// Ext.Msg.alert('ajax', 'Error: ' + error , Ext.emptyFn);
				// //window.plugins.childBrowser.close();
			// }
		// });
		
		// Ext.util.JSONP.request({ 
			// //url: 'http://ec2-54-251-15-129.ap-southeast-1.compute.amazonaws.com/betterpg/service1.asmx/getTestString', 
			 // //url: 'http://localhost/Ainsider/Service1.asmx/getTestStringParam',
			 // //url: 'http://localhost/testjsonp/WebService1_JSONP.asmx/Surface',
			 // //url: 'http://localhost:52813/WebService1_JSONP.asmx/getTotalPostFilter',
			 // url: 'http://46.137.215.68/myjsonp/WebService1_JSONP.asmx/getTestString',
			 // //url: 'http://ec2-54-251-15-129.ap-southeast-1.compute.amazonaws.com/MyJsonp/WebService1_JSONP.asmx/getTestString',
			  // params: {
				// //radius: '5',
				// //input: '\'this is from SG PC\'',
				// //User: '\'ALL\'',
				// //For: '\'MPPP\'',
				// format: 'json',
            // },
			// callbackKey: 'callback', 
			// callback: function(success, result) { 
				// Ext.Msg.alert('Tap', 'success: ' + success + ' result: ' + result.d, Ext.emptyFn);
			// } 
		// });
    },
    onBackButtonTap: function () {
		if(ComplaintMsk != null)
		{
			Ext.Msg.show({
			   title: 'Cancel?',
			   message: 'Please select OK to Cancel Posting Complaint...',
			   //width: 300,
			   buttons: Ext.MessageBox.OKCANCEL,
			   //multiLine: true,
			   //prompt : { maxlength : 180, autocapitalize : true },
			   fn: function(buttonId) {
					switch(buttonId)
					{
						case "ok":
							ComplaintMsk = null;
							mComplaintBody.unmask();
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
    }
});
