Ext.define("BetterPenang.controller.BetterPGApp", {

    extend: "Ext.app.Controller",
    
    config: {
        refs: {
            main: 'mainview',
			login: 'login',
            //options: 'options',
            optionlist: '#optionlist',
            newcomplaint: 'newcomplaint',
			viewposts: 'viewposts',
            postComplaintButton: '#postComplaintButton',
            postIdeaButton: '#postIdeaButton',
            logoutButton: '#logoutButton',
            recentposts: 'recentposts',
            newidea: 'newidea',
            getlocation: 'getlocation',
			myjsonptest: 'myjsonptest',
        },

        control: {
            //main: {
                //push: 'onMainPush',
                //pop: 'onMainPop'
            //},
            optionlist: {
                itemtap: 'onContactSelect',
            },
            postComplaintButton: {
                tap: 'onPostComplaint'
            },         
            postIdeaButton: {
                tap: 'onPostIdea'
            },
            newcomplaint:
            {
                PostComplaintCommand: "onPostComplaint",
                backToHomeCommand: "onBackToHomeCommand",
                GetLocationCommand: "onGotoLocationCommand"
            },
            recentposts:
            {
                RefreshCommand: "onRefreshCommand",
                backToHomeCommand: "onBackToHomeCommand"
            },
            newidea:
            {
                PostIdeaCommand: "onPostIdea",
                backToHomeCommand: "onBackToHomeCommand",
                GetLocationCommand: "onGotoLocationCommand"
            },
            getlocation:
            {
                backToHomeCommandFromLocation: "onBackToHomeCommandFromLocation"
            },
			jsonptest:
			{
				backToHomeCommand: "onBackToHomeCommand",
			}
            
        },
		PreviousForm: null,
        CurrentForm: null,
        FromXtoLocation: null,
        SelectedCoordinate: null,
        SelectedAddress: null,
		ImageString: null,
		FromInstantCapture: null,
		
		ViewPostTitle: null,
		ViewPostLatitude: null,
		ViewPostLongitude: null,
		ViewPostImagePath: null,
		ViewPostDescription: null,
		ViewPostUserID: null,
		ViewPostFor: null,
		ViewPostType: null,
		ViewPostPicSize: null,
		ViewPostDateTime: null,
		ViewPostAddress: null,
		ViewPostFB_ID: null,
		objVarLat: null,
		objVarLng: null,
    },
    
      // Transitions
    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },

	init: function() {
		var me = this;
		ImageString = "";
		SelectedAddress = "";
		SelectedCoordinate = "";
		FromXtoLocation = "";
		CurrentForm = "";
		PreviousForm = "";
		FromInstantCapture = false;
		objVarLat = null;
		objVarLng = null;
	},
	SetLat: function(latitude)
	{
		objVarLat = latitude;
	},
	GetLat: function()
	{
		return objVarLat;
	},
	
	SetLng: function(longitude)
	{
		objVarLng = longitude;
	},
	GetLng: function()
	{
		return objVarLng;
	},
	GetPreviousForm: function()
	{
		return PreviousForm;
	},
	SetViewPostInfo: function(Title, Latitude, Longitude, ImagePath, Description, UserID, For, Type, picSize, DateTime, Address, FB_Post)
	{
		ViewPostTitle = Title;
		ViewPostLatitude= Latitude;
		ViewPostLongitude= Longitude;
		ViewPostImagePath = ImagePath;
		ViewPostDescription= Description;
		ViewPostUserID= UserID;
		ViewPostFor= For;
		ViewPostType= Type;
		ViewPostPicSize = picSize;
		ViewPostDateTime = DateTime;
		ViewPostAddress = Address;
		ViewPostFB_ID = FB_Post;
	},
	GetViewFB_ID: function()
	{
		return ViewPostFB_ID;
	},
	GetViewAddress: function()
	{
		return ViewPostAddress;
	},
	GetViewDateTime: function()
	{
		return ViewPostDateTime;
	},
	GetViewPicSize: function()
	{
		return ViewPostPicSize;
	},
	GetViewTitle: function()
	{
		return ViewPostTitle;
	},
	GetViewLatitude: function()
	{
		return ViewPostLatitude;
	},
	GetViewLongitude: function()
	{
		return ViewPostLongitude;
	},
	GetViewImagePath: function()
	{
		return ViewPostImagePath;
	},
	GetViewDescription: function()
	{
		return ViewPostDescription;
	},
	GetViewUserID: function()
	{
		return ViewPostUserID;
	},
	GetViewFor: function()
	{
		return ViewPostFor;
	},
	GetViewType: function()
	{
		return ViewPostType;
	},
	
	GetCurrentForm: function()
	{
		return CurrentForm;
	},
	
	GetIsInstantCapture: function()
	{
		return FromInstantCapture;
	},
	
	SetInstantCapture: function(IsInstantCapture)
	{
		FromInstantCapture = IsInstantCapture;
	},
	
	GetImageUrl: function()
	{
		return ImageString;
	},
	
    GetCoordinate: function()
    {
        return SelectedCoordinate;
    },
    
    GetAddress: function()
    {
        return SelectedAddress;
    },
    
    SetValue: function(Coordinate, Address)
    {
        SelectedCoordinate = Coordinate;
        SelectedAddress = Address;
        //Ext.Msg.alert('Tap', 'Coordinate: ' + Coordinate + 'Address: ' + Address, Ext.emptyFn);
    },
	
	SetImageValue: function(ImageStr)
	{
		var imgdata = "" + ImageStr;
		
		ImageString = "data:image/jpeg;base64," + ImageStr;
		if(imgdata.indexOf("http://www") != -1)
		{
			ImageString = ImageStr;
		}
	},

    onMainPush: function(view, item) {
       var editButton = this.getPostComplaintButton();

        if (item.xtype == "newcomplaint") {
            //this.getContacts().deselectAll();
            this.showpostComplaintButton();
        } else {
            this.hidepostComplaintButton();
        }
        
    },

    onMainPop: function(view, item) {
       //Ext.Msg.alert('Tap', 'main pop', Ext.emptyFn);
       this.hidepostComplaintButton();
        
    },
    
    onArrowSelect: function(record, btn, index)
    {
        Ext.Msg.alert('Tap', 'Disclosure Selected ', Ext.emptyFn);
    },
	
	ShowViewPostPage: function()
	{
		if(!this.viewposts)
		{
			this.viewposts = Ext.create('BetterPenang.view.ViewPosts');
		}
		CurrentForm = 'viewposts';
		Ext.Viewport.animateActiveItem(this.viewposts, this.slideLeftTransition);
	},

	ShowComplaintPage: function()
	{
		if (!this.newcomplaint) {
			//Ext.Msg.alert('Tap', 'Create new Form' + index, Ext.emptyFn);
			this.newcomplaint = Ext.create('BetterPenang.view.New.Complaints');
		}
		//Ext.Msg.alert('Tap', 'Tap Selected: ' + index, Ext.emptyFn);
		 // Bind the record onto the show contact view
		//this.newcomplaint.setRecord(record);
		CurrentForm = 'Complaint';
		Ext.Viewport.animateActiveItem(this.newcomplaint, this.slideLeftTransition);
	},
	
	ShowMainPage: function(username, id)
	{
		if (!this.main) {
			this.main = Ext.create('BetterPenang.view.Main');
		}
		CurrentForm = 'main';
		Ext.Viewport.animateActiveItem(this.main, this.slideLeftTransition);
		this.main.showLoginText(username, id);
	},
	
	ShowMainPage2: function()
	{
		if (!this.main) {
			this.main = Ext.create('BetterPenang.view.Main');
		}
		CurrentForm = 'main';
		Ext.Viewport.animateActiveItem(this.main, this.slideLeftTransition);
	},
	
	ShowLoginPage: function()
	{
		if (!this.login) {
			this.login = Ext.create('BetterPenang.view.Login');
		}
		CurrentForm = 'login';
		Ext.Viewport.animateActiveItem(this.login, this.slideLeftTransition);
	},
	
    onContactSelect: function(list, index, node, record) {
        
        switch(index)
        {
           case 0:
				navigator.camera.getPicture(
					function (imageData)
					{
						FromInstantCapture = true;
						var imgdata = "" + imageData;
						ImageString = "data:image/jpeg;base64," + imageData;
						if(imgdata.indexOf("http://www") != -1)
						{
							ImageString = imageData;
						}
						
						BetterPenang.app.getController("BetterPGApp").ShowComplaintPage();
					},
					function (message)
					{
						//error
						ImageString = "";
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
						// FromInstantCapture = true;
						// var imgdata = "" + url;
						// ImageString = "data:image/jpeg;base64," + url;
						// if(imgdata.indexOf("http://www") != -1)
						// {
							// ImageString = url;
						// }
						
						// this.ShowComplaintPage();
					// }, 
					// failure: function() { 
						// ImageString = "";
						// //Ext.Msg.alert('Error', 'There was an error when acquiring the picture.'); 
					// }, 
					// scope: this });
                break;
                
            case 1:
                //var editButton = this.getPostComplaintButton();
				ImageString = "";
				FromInstantCapture = false;				
				SelectedAddress = "";
				SelectedCoordinate = "";
				
                if (!this.newcomplaint) {
                    //Ext.Msg.alert('Tap', 'Create new Form' + index, Ext.emptyFn);
                    this.newcomplaint = Ext.create('BetterPenang.view.New.Complaints');
                }
                //Ext.Msg.alert('Tap', 'Tap Selected: ' + index, Ext.emptyFn);
                 // Bind the record onto the show contact view
                //this.newcomplaint.setRecord(record);
                CurrentForm = 'Complaint';
                Ext.Viewport.animateActiveItem(this.newcomplaint, this.slideLeftTransition);
                break;
            case 2:
				SelectedAddress = "";
				SelectedCoordinate = "";
				
                if (!this.newidea) {
                    //Ext.Msg.alert('Tap', 'Create new Form' + index, Ext.emptyFn);
                    this.newidea = Ext.create('BetterPenang.view.New.Idea');
                }
                CurrentForm = 'Idea';
                Ext.Viewport.animateActiveItem(this.newidea, this.slideLeftTransition);
                break;
                
            case 3:
                //var editButton = this.getPostComplaintButton();
            
                if (!this.recentposts) {
                    //Ext.Msg.alert('Tap', 'Create new Form' + index, Ext.emptyFn);
                    this.recentposts = Ext.create('BetterPenang.view.RecentPosts');
                }
                //Ext.Msg.alert('Tap', 'Tap Selected: ' + index, Ext.emptyFn);
                 // Bind the record onto the show contact view
                //this.newcomplaint.setRecord(record);

                Ext.Viewport.animateActiveItem(this.recentposts, this.slideLeftTransition);
                break;
            
        }
//        if(index == 1)
//        {
//            var editButton = this.getPostComplaintButton();
//            
//            if (!this.newcomplaint) {
//                //Ext.Msg.alert('Tap', 'Create new Form' + index, Ext.emptyFn);
//                this.newcomplaint = Ext.create('BetterPenang.view.New.Complaints');
//            }
//            //Ext.Msg.alert('Tap', 'Tap Selected: ' + index, Ext.emptyFn);
//             // Bind the record onto the show contact view
//            this.newcomplaint.setRecord(record);

//            Ext.Viewport.animateActiveItem(this.newcomplaint, this.slideLeftTransition);

//             // Push the show contact view into the navigation view
//             //this.main.push(this.newcomplaint);
//            //this.getMain().push(this.newcomplaint);
//        }
        
       
    },
    
    onOptionTap: function() {
       Ext.Msg.alert('Tap', 'Option Tapped ', Ext.emptyFn);
    },
    
    onGotoLocationCommand: function(){
         if(!this.getlocation)
          {
                this.getlocation = Ext.create('BetterPenang.view.Get.Location');
          }
          FromXtoLocation = CurrentForm;
          CurrentForm = 'GetLocation';
          //app.view.Get.Location.SetInfo("DDD");
          
          //this.getLocation.setInfo();
          Ext.Viewport.animateActiveItem(this.getlocation, this.slideLeftTransition);
    },
    
    onBackToHomeCommandFromLocation: function (position) {
      if(CurrentForm == 'GetLocation')
        {
            //Ext.Msg.alert('Tap', 'position: ' + position, Ext.emptyFn);
            switch(FromXtoLocation)
            {
                case 'Complaint':
                    CurrentForm = 'Complaint';
					PreviousForm = 'Location';
                    FromXtoLocation = '';
                    Ext.Viewport.animateActiveItem(this.newcomplaint, this.slideRightTransition);
                    break;
                    
                case 'Idea':
                    CurrentForm = 'Idea';
					PreviousForm = 'Location';
                    FromXtoLocation = '';
                    //newidea.updateListStore();
                    Ext.Viewport.animateActiveItem(this.newidea, this.slideRightTransition);
                   break;
            }
        }
        else
        {
            Ext.Viewport.animateActiveItem(this.getMain(), this.slideRightTransition);
        }
    },

    onBackToHomeCommand: function () {
        if(CurrentForm == 'GetLocation')
        {
            switch(FromXtoLocation)
            {
                case 'Complaint':
                    CurrentForm = 'Complaint';
					PreviousForm = 'Location';
                    FromXtoLocation = '';
                    Ext.Viewport.animateActiveItem(this.newcomplaint, this.slideRightTransition);
                    break;
                    
                case 'Idea':
                    CurrentForm = 'Idea';
					PreviousForm = 'Location';
                    FromXtoLocation = '';
                    Ext.Viewport.animateActiveItem(this.newidea, this.slideRightTransition);
                   break;

            }
        }
        else
        {
			if(CurrentForm == 'viewposts')
			{
				
				Ext.Viewport.animateActiveItem(this.recentposts, this.slideRightTransition);
				CurrentForm = 'RecentList';
				PreviousForm = 'viewposts';
			}
			else
			{
				Ext.Viewport.animateActiveItem(this.getMain(), this.slideRightTransition);
				PreviousForm = CurrentForm;
			}
        }
        //console.log("onBackToHomeCommand");
        //this.activateNotesList();
        
    },

    onPostComplaint: function() {
       Ext.Msg.alert('Tap', 'Post Complaint Pressed ', Ext.emptyFn);
    },
    onRefreshCommand: function()
    {
        Ext.Msg.alert('Tap', 'Refresh Pressed ', Ext.emptyFn);
    },

    onContactChange: function() {
        //this.showpostIdeaButton();
    },

    onPostIdea: function() {
      Ext.Msg.alert('Tap', 'Post Idea Pressed ', Ext.emptyFn);
    },

    showpostComplaintButton: function() {
        var editButton = this.getPostComplaintButton();

        if (!editButton.isHidden()) {
            return;
        }

        this.hidepostIdeaButton();

        editButton.show();
    },

    hidepostComplaintButton: function() {
        var editButton = this.getPostComplaintButton();

        if (editButton.isHidden()) {
            return;
        }

        editButton.hide();
    },

    showpostIdeaButton: function() {
        var saveButton = this.getPostIdeaButton();

        if (!saveButton.isHidden()) {
            return;
        }

        saveButton.show();
    },

    hidepostIdeaButton: function() {
        var saveButton = this.getPostIdeaButton();

        if (saveButton.isHidden()) {
            return;
        }

        saveButton.hide();
    }
});
