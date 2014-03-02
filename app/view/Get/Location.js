Ext.Loader.setPath({
    //'Ext': '../../src',
    'Ext.plugin': 'lib/plugin'
});

Ext.define('BetterPenang.view.Get.Location', {
    extend: 'Ext.Panel',
    xtype: 'getlocation',

   requires: [
		'Ext.MessageBox',
        'Ext.Map',
        'Ext.Button',
        'Ext.SegmentedButton',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.plugin.google.Traffic',
        'Ext.plugin.google.Tracker'
    ],
		
   initialize: function () {

        this.callParent(arguments);
		locationmap = null;
		console.log("Initialize Second");
		mBody = Ext.getCmp("mapholder");
		msk = null;
		switch(Ext.os.deviceType)
		{
			case "Phone":
				console.log("Phone init for Location");
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				break;
			
			// case "Tablet":
				// Ext.Viewport.setWidth(null);
				// Ext.Viewport.setHeight(null);
				// break;
			
			default:
				console.log("Default init for Location");
				Ext.Viewport.setWidth(BetterPenang.app.deviceWidth);
				Ext.Viewport.setHeight(BetterPenang.app.deviceHeight);
				
				break;
		}
		this.on('show', function() {
			
			
			//loadScript();
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "http://maps.google.com/maps/api/js?sensor=true&callback=initializeform2";
			
			if(locationmap == null)
			{
				try
				{
					document.body.removeChild(script);
				}
				catch(err)
				{
				
				}
				msk = "0";
				mBody.mask({ 
						xtype: 'loadmask', 
						message: 'Please wait...Obtaining Location',
				});
				document.body.appendChild(script);
			}
			//var result = $(document.body.children).has(script);
			//var m = jQuery.contains(document.body.children, script);

		});

		SetAutoLocation = true;
		initializeform2 = function() {
			//console.log("sg is here");
		
			// The following is accomplished with the Google Map API
			var map_position = new google.maps.LatLng(5.370267, 100.43261);  //MPSP HQ //5.3702678231335526|100.43261630527218
			ClsPosition = map_position;

			
			infowindow = new google.maps.InfoWindow({
				content: 'My Location (Estimates)'
			});

			locationmap = Ext.create('Ext.Map', {
				flex: 2,
				cls: 'x-map',
				itemId: "mymap",
				layout: 'fit', 
				enable: true, 
				mapOptions : {
					zoom : 16,
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					navigationControl: true,
					navigationControlOptions: {
						style: google.maps.NavigationControlStyle.DEFAULT
					}
				},
				
				listeners : {
					maprender : function(comp, map){
						try
						{
							if(mMarker == null)
							{
								mMarker = new google.maps.Marker({
									 position: map_position,
									 draggable: true,
									 map: map
								});
							}
						}
						catch(err)
						{
							mMarker = new google.maps.Marker({
									 position: map_position,
									 draggable: true,
									 map: map
								});
						}
						infowindow.open(map, mMarker);   
						setTimeout( function(){map.panTo (map_position);} , 1000);
						
						google.maps.event.addListener(mMarker, 'mouseup', function() {
							var mPosition = mMarker.getPosition();
							var latlng = new google.maps.LatLng(mPosition.lat(), mPosition.lng());
							ClsPosition = mPosition;
							   var geocoder;
							   if(!geocoder) {
								  geocoder = new google.maps.Geocoder();	
								}
								geocoder.geocode( { 'location': mPosition}, function(results, status) {
									 if (status == google.maps.GeocoderStatus.OK)
									 {
										varLat = results[0].geometry.location.lat();
										varLng = results[0].geometry.location.lng();
										
										var content = '<strong>' + results[0].formatted_address + '</strong>';
										ClsAddress = content;
										infowindow.setContent(content);
										infowindow.open(map, mMarker);      
										Ext.Viewport.unmask();
									 }									
								});
						});
					},
				},				 
			});
			geo = Ext.create('Ext.util.Geolocation', {
				autoUpdate: false,
				listeners: {
					locationupdate: function(geo) {
						console.log("move marker on location refresh");
						SetAutoLocation = false;
						lat = geo.position.coords.latitude;
						log = geo.position.coords.longitude;
						
						varLat = geo.position.coords.latitude;
						varLng = geo.position.coords.longitude;
						
						map_position = new google.maps.LatLng(lat, log);
						if (locationmap.rendered)
						{
							locationmap.setMapCenter(map_position);
							mMarker.setPosition(map_position);
							var geocoder;
							if(!geocoder) {
								geocoder = new google.maps.Geocoder();	
							}
							geocoder.geocode( { 'location': map_position}, 
							function(results, status) {
								 if (status == google.maps.GeocoderStatus.OK)
								 {
									var content = '<strong>' + results[0].formatted_address + '</strong>';
									ClsAddress = content;
									ClsPosition = map_position;
									infowindow.setContent(content);
									//infowindow.open(locationmap, mMarker);   
									//geo.setAutoUpdate(false);
									mBody.unmask();
									msk = null;
									Ext.Msg.show({
									   title: 'Current Location',
									   message: 'Your Location is: ' + ClsAddress + ', Please select OK to use this address.',
									   //width: 300,
									   buttons: Ext.MessageBox.OKCANCEL,
									   //multiLine: true,
									   //prompt : { maxlength : 180, autocapitalize : true },
									   fn: function(buttonId) {
											switch(buttonId)
											{
												case "ok":
													
													try
													  {
													  //Run some code here
														 BetterPenang.app.getController("BetterPGApp").SetValue(ClsPosition, ClsAddress);
														 BetterPenang.app.getController("BetterPGApp").SetLat(varLat);
														BetterPenang.app.getController("BetterPGApp").SetLng(varLng);
													  }
													catch(err)
													  {
													  //Handle errors here
														BetterPenang.app.getController("BetterPGApp").SetValue("", "");
														BetterPenang.app.getController("BetterPGApp").SetLat(varLat);
														BetterPenang.app.getController("BetterPGApp").SetLng(varLng);
													  }
													BetterPenang.app.getController("BetterPGApp").onBackToHomeCommand();
													//BetterPenang.view.Get.Location.this.fireEvent("backToHomeCommandFromLocation", BetterPenang.view.Get.Location.this);// "" + position);
													//Ext.getCmp("getlocation").fireEvent("backToHomeCommandFromLocation", Ext.getCmp("getlocation"));
													console.log('I pressed the "' + buttonId + '" button.');
													break;
												
												case "cancel":
													console.log('You pressed the "' + buttonId + '" button.');
													break;
											}
										   
									   }
									});
								 }							
							});							
						}
						else
						{
							Ext.Viewport.unmask();
							locationmap.on('activate', locationmap.onUpdate, locationmap, {single: true, data: map_position});
						}

					},
					locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
						if(bTimeout){
							//alert('Timeout occurred.');
						} else {
							//alert('Error occurred.');
						}
					}
				}
			});
			geo.updateLocation();
			Ext.getCmp("mapholder").add(locationmap);
			console.log("Add map");
			
		};
	},
	
    config: {

        layout: 'fit',
        enable: true, 
        //width: Ext.os.deviceType == 'Phone' ? 330 : 330,
        //height: Ext.os.deviceType == 'Phone' ? 550 : 550,
        ClsPosition: null,
        ClsAddress: null,
        mMarker: null,
		SetAutoLocation: true,
		geo: null,
		mBody: null,
		msk: null,
		locationmap: null,
		varLat : null,
		varLng: null,
		
		items: [
			{
				xtype: "toolbar",
				docked: 'top',
                flex: 1,
                text: 'Get Location',
                title: "Get Location",
				style: 'background-image: -webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#FCDC4E),color-stop(2%,#FCDC4E),color-stop(100%,#E3C439))',
                defaults: {
                    iconMask: true
                },
                items: [
                    {
                        xtype: "button",
                        iconMask: false,
                        ui: "back",
                        text: "Back",
                        itemId: "backButton",
						id: "backButton",
                    },
                    {
                        xtype: "spacer",
                    },
                    {
                        xtype: "button",
                        iconMask: true,
                        iconCls: 'locate',
                        itemId: "locateButton",
                        handler: function() {
							if(msk == null)
							{
								msk = "0";
								mBody.mask({ 
									xtype: 'loadmask', 
									message: 'Please wait...Obtaining Location',
								});
								geo.updateLocation();
							}
							else
							{
								msk = null;
								mBody.unmask();
							}
                            

                        },
                    },
                ]
			},
			{
				type: 'container',
				id: 'mapholder',
				height: null,
				layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                },
                //style: 'background-color: #2da0ff',
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
						text: "Use this Location",
						itemId: "btnGetLocation",
						id: "btnGetLocation",
						margin: Ext.os.deviceType == 'Phone' ? '10 10 10 10' : '20 130 30 130',
						// handler: function() {
							// Ext.Msg.alert('Done', 'OS: ' + Ext.os.deviceType); 
						// },
					},
					//{ xtype: "spacer" 	},
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
                delegate: "#btnGetLocation",
                event: "tap",
                fn: "onUseLocationButtonTap"
            },

        ],

    },

    SetInfo: function(Info) {
        Ext.Msg.alert('Tap', 'Set Info: ' + Info, Ext.emptyFn);
        //fromWhere = from;
    },

    onPostIdea: function () {
        Ext.Msg.alert('Tap', 'Post Complaint', Ext.emptyFn);
        //console.log("deleteNoteCommand");
        //this.fireEvent("PostIdeaCommand", this);
    },
	onBackButtonTap: function () {
		if(msk != null)
		{
			Ext.Msg.show({
			   title: 'Cancel?',
			   message: 'Please select OK to Cancel Locating...',
			   //width: 300,
			   buttons: Ext.MessageBox.OKCANCEL,
			   //multiLine: true,
			   //prompt : { maxlength : 180, autocapitalize : true },
			   fn: function(buttonId) {
					switch(buttonId)
					{
						case "ok":
							msk = null;
							mBody.unmask();
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
			this.fireEvent("backToHomeCommandFromLocation", this);
		}
		
        //
    },
    onUseLocationButtonTap: function () {
        //Ext.Msg.alert('Tap', 'Back', Ext.emptyFn);
        //console.log("backToHomeCommand");
		if(msk == null)
		{
			try
			  {
			  //Run some code here
				BetterPenang.app.getController("BetterPGApp").SetValue(ClsPosition, ClsAddress);
				BetterPenang.app.getController("BetterPGApp").SetLat(varLat);
				BetterPenang.app.getController("BetterPGApp").SetLng(varLng);
			  }
			catch(err)
			  {
			  //Handle errors here
				BetterPenang.app.getController("BetterPGApp").SetValue("", "");
				BetterPenang.app.getController("BetterPGApp").SetLat(varLat);
				BetterPenang.app.getController("BetterPGApp").SetLng(varLng);
			  }
			this.fireEvent("backToHomeCommandFromLocation", this);// "" + position);
		}
    }
});
