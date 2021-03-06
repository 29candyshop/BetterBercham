//Application logic

var watchID;
var geoLoc;
var TotalDistance = 0.0;
var TotalCalories = 0.0;
var LastPosition = '';
var mActivityType = "RUNNING";

 var stopwatch;
    var runningstate = 0; // 1 means the timecounter is running 0 means counter stopped
    var stoptime = 0;
    var lapcounter = 0;
    var currenttime;
    var lapdate = '';
    var lapdetails;
    var mFormattedDuration = "";
	var TestCount = 0;
	var LocationCount = 0;
	var LocationCount_Total = 0;
	var LocationCount_background = 0;
	var LocationTimeStamp = 0;
	//var bgGeo = null;
	var nextToken = 0;
	var TotalRunCount = 0;
	
	var nextToken_GroupMember = 0;
	var Total_GroupMemberCount = 0;
	
	var StaticAPI = "AIzaSyAFirO39qok7sQjlQ9leVAcDqdFGQNt8Yc";
	
	var mRetrieveRun = false;
	var mHeight = 0;
	var mWidth = 0;
	
	var mHeight_lblTotal = 40;
	var mHeight_TotalRunner = 50;
	var mHeight_lblDistance = 40;
	var mHeight_Distance = 60;
	
	var mHeight_lblRaised = 40;
	var mHeight_Raised = 60;
	
	var mHeight_lblSelection = 30;
	var mHeight_Padding = 0;
	var mHeight_ActivityType = 120;
	var mHeight_START = 60;
	
	
	var mHeight_DuringRun_divDistance = 120;
	var mHeight_DuringRun_divTime = 100;
	var mHeight_DuringRun_divCalories = 60;
	
	var fontSize = 60;
	
	var melbourne = new google.maps.LatLng(5.398857, 100.302154);
		
		var NavVisible = false;
		var geocoder;
		var marker;
		var map;
		var styles = [
		{
			  stylers: [
				{ hue: "#00ffe6" },
				{ saturation: -20 }
			  ]
		},{
			  featureType: "road.arterial",
			  elementType: "geometry",
			  stylers: [
				{ lightness: 100 },
				{ visibility: "simplified" }
			  ]
		},{
			  featureType: "road",
			  elementType: "labels",
			  stylers: [
				{ visibility: "off" }
			  ]
		}];
		
		var styledMap = new google.maps.StyledMapType(styles,
		{
			name: "Styled Map"
		});
		var hasInitialLocation = true;
		var mapOptions = {
			zoom:      16, //11
			center:    melbourne,
			scrollwheel: false,
			//navigationControl: false,
			mapTypeControl: false,
			//scaleControl: false,
			//draggable: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		 };
		infowindow = new google.maps.InfoWindow({
			content: 'My Location (Estimates)'
		});
		var mapDone = false;
		var mCheckInPosition = "";
		var mCheckInAddress = "";
		var mCheckInFor = "";
	
		var mCurrentLocation;
		var mCurrentAddress = "";
		var mComplaintType = "";
		var mComplaintImageURI = "";
		
	 var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
	var showPostFrom = "";
	var showingCurrentPost = "";
	var complaint_id = -1;
/*var opts = {
	  lines: 12, // The number of lines to draw
	  length: 10, // The length of each line
	  width: 4, // The line thickness
	  radius: 10, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  color: '#222', // #rgb or #rrggbb
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: '200px', // Top position relative to parent in px
	  left: 'auto', // Left position relative to parent in px
	  position: 'relative'
	};	 */
	
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

//var spinner = null;	 

//document ready
$(document).ready(function(){
	//localStorage.setItem("run_fresh", "true");
	//location.hash = "#splashscreen";
	mHeight = $(window).height(); 
	mWidth = $(window).width(); 
	//alert(mWidth);
	var mHeaderHeight = $("#pnlHeader").height();
	
	var totalPadding = mHeight - mHeaderHeight - 30 - (mHeight_lblTotal + mHeight_TotalRunner + mHeight_lblDistance + mHeight_Distance + mHeight_lblSelection + mHeight_ActivityType + mHeight_START);
	if(totalPadding >= 0)
	{
		$('#divPadding').css({'height':'' + totalPadding});
	}
	var totalDarkHeight = (mHeight_lblTotal + mHeight_TotalRunner + mHeight_lblDistance + mHeight_Distance + mHeight_lblSelection + totalPadding);
	$('#divSummary').css({'height':'' + (mHeight_lblTotal + mHeight_TotalRunner + mHeight_lblDistance + mHeight_Distance + mHeight_lblSelection + totalPadding)});
	$('#RunSectionDiv').css({'height':'' + (mHeight - mHeaderHeight - 30)});
	
	var totalDisplay =  mHeight_DuringRun_divDistance + mHeight_DuringRun_divTime + mHeight_DuringRun_divCalories + 60 + 30 + 50;
	var totalSpace = mHeight - totalDisplay;
	//alert(totalSpace);
	if(totalSpace >= 80)
	{
		//have a lot of space, need to enlarge the font 
		var availableSpace = totalDarkHeight - (50 * 3) - mHeight_lblSelection;
		//alert(availableSpace);
		var avallableEach = parseInt(availableSpace / 3); 
		
		//alert(avallableEach);
		
		mHeight_TotalRunner = avallableEach;
		mHeight_Distance = avallableEach;
		mHeight_Raised = avallableEach;
		
		$("#CampaignSummary_TotalRunner").css({'height': mHeight_TotalRunner + 'px'});
		$("#CampaignSummary_TotalDistance").css({'height': mHeight_TotalRunner + 'px'});
		$("#CampaignSummary_TotalRaised").css({'height': mHeight_TotalRunner + 'px'});
		
		fontSize = mHeight_TotalRunner;
		if(mHeight_TotalRunner < 60)
		{
			fontSize = 60;
		}
		$("#CampaignSummary_TotalRunner").css({'font-size': fontSize + 'px'});
		$("#CampaignSummary_TotalDistance").css({'font-size': fontSize + 'px'});
		$("#CampaignSummary_TotalRaised").css({'font-size': fontSize + 'px'});
		
		$("#CampaignSummary_TotalRunner").css({'line-height': fontSize + 'px'});
		$("#CampaignSummary_TotalDistance").css({'line-height': fontSize + 'px'});
		$("#CampaignSummary_TotalRaised").css({'line-height': fontSize + 'px'});
		
		//can show the circular logo
		$("#divRun").css({'margin-top':'0px'});
		//$("#divImgActivity").css({'display':'block'});
		$("#divDistance").css({'margin-top':'20px'});
		$('#DuringRunDiv').css({'height':'' + (mHeight - mHeaderHeight - 30)});
		$('#DuringRunDivInner').css({'height':'' + (mHeight - mHeaderHeight - 30 - 20 - 60)});
		
		$("#CampaignSummary_lblRaised").css({'display':'block'});
		$("#CampaignSummary_TotalRaised").css({'display':'block'});
		
		//$('#divPadding').css({'height':'' + (totalPadding - 80)});
		$('#divPadding').css({'height':'10px'});
		
		
		//==========================================================================
		availableSpace = totalDarkHeight - (50 * 3);
		//alert(availableSpace);
		avallableEach = parseInt(availableSpace / 3); 
		
		//alert(avallableEach);
		
		mHeight_TotalRunner = avallableEach;
		
		
		$("#mCurrentSelectedActivity").css({'height': (mHeight_TotalRunner/2) + 'px'});
		$("#distance").css({'height': mHeight_TotalRunner + 'px'});
		$("#stopwatch").css({'height': mHeight_TotalRunner + 'px'});
		$("#calories").css({'height': mHeight_TotalRunner + 'px'});
		
		$("#mCurrentSelectedActivity").css({'font-size': (mHeight_TotalRunner/2) + 'px'});
		$("#distance").css({'font-size': fontSize + 'px'});
		$("#stopwatch").css({'font-size': fontSize + 'px'});
		$("#calories").css({'font-size': fontSize + 'px'});
		
		$("#mCurrentSelectedActivity").css({'line-height': (mHeight_TotalRunner/2) + 'px'});
		$("#distance").css({'line-height': fontSize + 'px'});
		$("#stopwatch").css({'line-height': fontSize + 'px'});
		$("#calories").css({'line-height': fontSize + 'px'});
		
	}
	else
	{
		$("#divRun").css({'margin-top':'0px'});
		$("#divImgActivity").css({'display':'none'});
		$("#divDistance").css({'margin-top':'0px'});
		$('#DuringRunDiv').css({'height':'' + (mHeight - mHeaderHeight - 30 - 0)});
		$('#DuringRunDivInner').css({'height':'' + (mHeight - mHeaderHeight - 30 - 20 - 60)});
		
		
	}
	
	
	
	
	//alert(h);
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	 setTimeout(function() {
		if ( app ) {
			// PhoneGap application
			document.addEventListener("deviceready", onDeviceReady, false);
		} else {
			// Web page
			 onDeviceReady(); //this is the browser
			 
		}
    }, 500);
	
	
	/*if ( app ) {
		// PhoneGap application
		 document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		// Web page
		 onDeviceReady(); //this is the browser
	}*/
});

//document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	//alert("ready");
	var AccessToken = window.localStorage.getItem('BetterIpoh_AccessTokenV2');
	if(AccessToken == null)
	{	
		window.localStorage.clear();
		localStorage.setItem("run_fresh", "true");
		location.hash = "#LoginPage";
		
	}
	else
	{
		if(AccessToken == "")
		{
			window.localStorage.clear();
			localStorage.setItem("run_fresh", "true");
			location.hash = "#LoginPage";
		}
		else
		{
			location.hash = "#indexPage";
			async(function() {
				//SyncToServer();
				UserSummary();
			}, null);
			
		
		}
	}
	
	
	try{
		navigator.splashscreen.hide();
	}
	catch(err)
	{}
	
	
	document.addEventListener("resume", onResume, false);
	try{
		//bgGeo = window.plugins.backgroundGeoLocation;
		//alert("a:" + window.plugins.backgroundGeoLocation);
		//alert("b:" + window.backgroundGeolocation);
		//alert("c:" + window.BackgroundGeolocation);
	}
	catch(err)
	{
		alert(err);
	}
	/*
	cordova.plugins.notification.local.on("click", function (notification) {
		if (notification.id == 1) {
			//joinMeeting(notification.data.meetingId);
			//alert("Clicked!");
			
		}
	});


	// Notification has reached its trigger time (Tomorrow at 8:45 AM)
	cordova.plugins.notification.local.on("trigger", function (notification) {
		try
		{
			if (notification.id != 1)
				return;

			
		}
		catch(err)
		{
			alert(err);
		}
	});	*/
	
	try{
		 pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
	}catch(err)
	{}
	
	//================= configure geolocation background ==========================
	getLocationUpdate();
	LoadComplaintType();
}

function onResume()
{
	//alert("resume");
	var isStartRun = localStorage.getItem("IsStartRun");
	//alert(isStartRun);
	if(isStartRun == "true")
	{
		UpdateNotification();
	}
	else
	{
		var AccessToken = window.localStorage.getItem('BetterIpoh_AccessTokenV2');
		if(AccessToken == null)
		{
			localStorage.setItem("run_fresh", "true");
			//location.hash = "#LoginPage";
			
		}
		else
		if(AccessToken == "")
		{
			localStorage.setItem("run_fresh", "true");
			//location.hash = "#LoginPage";
		}
		else
		{
			async(function() {
				SyncToServer();
				//UserSummary();
			}, null);
			
		
		}
	}
}
	
function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) {callback();}
    }, 500);
}
$(document).on('click', '.uiPostType', function (event, data) {
	$(".uiPostType").removeClass("active");
	$(this).addClass("active");
	var a = this;
	var id = a.id;
	if(id == "mypost")
	{
		showPostFrom = "me";
		allPost(showPostFrom);
	}
	else
	{
		showPostFrom = "all";
		allPost(showPostFrom);
	}
	//alert(id);
});

//evtStopRun
$(document).on('click', '.evtStopRun', function (event, data) {
	StopRun("");
});

$(document).on('click', '.evtCancelRun', function (event, data) {
	CancelRun();
});

$(document).on('click', '.evtActivityWalk', function (event, data) {
	mActivityType = "WALKING";
	document.getElementById("activityWalking").src = "images/icons/icon_walking.png";
	document.getElementById("activityRunning").src = "images/icons/icon_running_deselected.png";
	document.getElementById("imgMyActivity").src = "images/icons/icon_running.png";
	document.getElementById("activityCycling").src = "images/icons/icon_cycling_deselected.png";
	document.getElementById("txtStartStop").innerHTML = "START MY WALK";
	//$("#activityRunning").css({'background-image':''});
	//$("#activityCycling").css({'background-image':''});
	document.getElementById("mCurrentSelectedActivity").innerHTML = mActivityType;
});

$(document).on('click', '.evtActivityRun', function (event, data) {
	mActivityType = "RUNNING";
	document.getElementById("activityWalking").src = "images/icons/icon_walking_deselected.png";
	document.getElementById("activityRunning").src = "images/icons/icon_running.png";
	document.getElementById("imgMyActivity").src = "images/icons/icon_running.png";
	document.getElementById("activityCycling").src = "images/icons/icon_cycling_deselected.png";
	document.getElementById("txtStartStop").innerHTML = "START MY RUN";
	//$("#activityRunning").css({'background-image':''});
	//$("#activityCycling").css({'background-image':''});
	document.getElementById("mCurrentSelectedActivity").innerHTML = mActivityType;
});

$(document).on('click', '.evtActivityCycle', function (event, data) {
	mActivityType = "CYCLING";
	document.getElementById("activityWalking").src = "images/icons/icon_walking_deselected.png";
	document.getElementById("activityRunning").src = "images/icons/icon_running_deselected.png";
	document.getElementById("imgMyActivity").src = "images/icons/icon_cycling.png";
	document.getElementById("activityCycling").src = "images/icons/icon_cycling.png";
	document.getElementById("txtStartStop").innerHTML = "START MY CYCLING";
	document.getElementById("mCurrentSelectedActivity").innerHTML = mActivityType;
});


//evtBack
$(document).on('click', '.evtBack', function (event, data) {

	window.history.back();

});

$(document).on('click', '.evtBackDialog', function (event, data) {
	$("#NewComplaintSectionPage").css({'display':'block'});
	$("#NewComplaintInfoPage").css({'display':'none'});
	

});

$(document).on('click', '.evtBackMapDialog', function (event, data) {
	$("#NewComplaintInfoPage").css({'display':'block'});
	$("#NewComplaintMapPage").css({'display':'none'});
	

});

$(document).on('click', '.evtCloseDialog', function (event, data) {
	$("#NewComplaintSectionPage").css({'display':'none'});
	$("#NewComplaintInfoPage").css({'display':'none'});
	$("#overlayGeneral").css({'display':'none'});
});

$(document).on('click', '.evtRegister', function (event, data) {
	
	//check 
	if($("#signup_displayname").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_username").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_password").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_confirmpassword").val() == "")
	{
		document.getElementById('lblRegister').innerHTML = "Please fill up your particular, email address and password";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	if($("#signup_password").val() != $("#signup_confirmpassword").val())
	{
		document.getElementById('lblRegister').innerHTML = "Password not match";
		$("#lblRegister").css({"color":"#F4141C"});
		return;
	}
	//var win = window.open("index.html", '_self');
	//return;
	$.mobile.loading("show", {
		text: "Please Wait..",
		textVisible: true,
		theme: "b"
	});
	 $.post("http://cat.betterpg.com/v2/api/_api_register.php", 
		{
			displayname: $("#signup_displayname").val(),
			username: $("#signup_username").val(),
			password: $("#signup_password").val() 
		}, 
		function(result){
			$.mobile.loading("hide");
			var obj = JSON.parse(result);
			if(obj.status == true)
			{
				if(navigator.notification)
				{
					navigator.notification.alert(
						'Register Successfully. Activation code has been emailed to you. Please verify and activate your account.',
						function() {},
						'Register Success',
						'OK'
					);
					var win = window.open("index.html", '_self');
				}
				else
				{
					alert("Register Successfully. Activation code has been emailed to you. Please verify and activate your account.");
					var win = window.open("index.html", '_self');
				}
				
			}
			else
			{
				document.getElementById('lblRegister').innerHTML = "Error Signing Up: " + obj.extra;//"Error signing up. Please try again.";
				$("#lblRegister").css({"color":"#F4141C"});
				return;
			}
		}
	);
});

$(document).on('click', '.evtHistory', function (event, data) {
	var a = this;
	var id = a.id.replace("Historyinfo-", "");
	showingCurrentPost = id;
	if(mWidth <= 700)
	{
		location.hash = "#runMap";
	}
	else
	{
		showDialogPost(showingCurrentPost);
	}
	/*
	//var result = window.localStorage.getItem("aktif_runHistory");
	var result = window.localStorage.getItem("aktif_runHistory_Individual")
	var objGroup = JSON.parse(result);
	for(var i = 0; i < objGroup.length; i++) {
		var obj = objGroup[i];
		if(obj.activityid == id)
		{
			
			localStorage.setItem("CurrentRun_id", id);
			localStorage.setItem("CurrentRun_Duration", obj.duration);
			localStorage.setItem("CurrentRun_Distance", obj.distance);		
			localStorage.setItem("CurrentRun_Map", obj.map);
			localStorage.setItem("CurrentRun_Date", obj.rundate);
			localStorage.setItem("CurrentRun_Calories", obj.calories);
			location.hash = "#runMap";
			break;
		}
	}*/
	
});

$(document).on('click', '.evtGroup', function (event, data) {
	var a = this;
	var id = a.id.replace("groupinfo-", "");
	var result = window.localStorage.getItem("aktif_Groups");
	var objGroup = JSON.parse(result);
	for(var i = 0; i < objGroup.group.length; i++) {
		var obj = objGroup.group[i];
		if(obj.id == id)
		{
			localStorage.setItem("CurrentGroup_id", id);
			localStorage.setItem("CurrentGroup_Name", obj.name);
			localStorage.setItem("CurrentGroup_Distance", obj.totaldistance);		
			localStorage.setItem("CurrentGroup_Icon", obj.group_icon);
			localStorage.setItem("CurrentGroup_Image", obj.group_image);	
			localStorage.setItem("CurrentGroup_Tagline", obj.tagline);
			localStorage.setItem("CurrentGroup_Member", obj.membercount);
			
			
			location.hash = "#individualGroupPage";
			break;
		}
	}
	
});

$(document).on('click', '.evtEvent', function (event, data) {
	var a = this;
	var id = a.id.replace("eventinfo-", "");
	$.mobile.loading("show", {
		text: "Please Wait..",
		textVisible: true,
		theme: "b"
	});		
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.get("http://www.aktifpenang.com/api/_api_event_get.php", 
		{
			token: mToken,
			eventid: id
		}, 
		function(result){
			$.mobile.loading("hide");
			//spinner.stop();
			var obj = JSON.parse(result);
			/*	$response['status'] = true;
				$response['eventname'] = $eventname;
				$response['eventdate'] = $eventdate;
				$response['eventtime'] = $eventtime;
				$response['eventdescription'] = $eventdescription;
				$response['eventlocation'] = $eventlocation;
				$response['eventtype'] = $eventtype;
				$response['eventcoordinate'] = $eventcoordinate;
				$response['eventurl'] = $eventurl;
				$response['banner'] = $banner;*/
				
			var coor = "";
			if(obj.eventcoordinate != null)
			{
				coor = obj.eventcoordinate.replace(" ","");
			}
			var html = '';
				if(obj.banner != null)
				{
					html = '<div id="IndividualPageImage" style="width:100%;height:130px;float:left;background-image:url(http://www.aktifpenang.com/' + obj.banner+ ');background-repeat:no-repeat;background-size:cover;"></div>';
				}
				html +=	'<div style="width:100%;height:auto;margin-top:20px;float:left;background-color:#eee;opacity:0.7;">'+
						'<span id="IndividualPageName" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 18px;color:#222;">'+ obj.eventname + '</span>'+
						'<span id="IndividualPageName" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 13px;color:#555;">'+ obj.eventtype + '</span>'+
						'<span id="IndividualPageTagline" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;margin-top:20px;">'+ obj.eventdate + '</span>'+
						'<span id="IndividualPageTagline" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;margin-top:20px;">'+ obj.eventtime + '</span>'+
						'<span id="IndividualPageInfo" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#666;margin-top:30px;">About</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">' + obj.eventdescription + '</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">Location: ' + obj.eventlocation + '</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">More Info: ' + obj.eventurl + '</span>';
					if(obj.eventcoordinate != null)
					{
						html+=	'<div class="" style="margin-top:10px;height:' + mWidth + 'px;width:100%;background-image:url(http://maps.googleapis.com/maps/api/staticmap?size=400x400&center=' +coor +'&zoom=16&markers=color:red%7Clabel:A%7C' +coor+');background-repeat:no-repeat;background-size:cover;float:left;"></div>';
					}
				html	+= '</div>'+
				'';
			document.getElementById("IndividualMain").innerHTML = html;
		}
	);
	location.hash = "#IndividualPage";
			
	
});

$(document).on('click', '.evtSponsor', function (event, data) {
	var a = this;
	var id = a.id.replace("sponsorinfo-", "");
	$.mobile.loading("show", {
		text: "Please Wait..",
		textVisible: true,
		theme: "b"
	});		
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.get("http://www.aktifpenang.com/api/_api_sponsor_get.php", 
		{
			token: mToken,
			sponsorid: id
		}, 
		function(result){
			$.mobile.loading("hide");
			//spinner.stop();
			var obj = JSON.parse(result);
			/*$response['status'] = true;
				$response['name'] = $name;
				$response['about'] = $description;
				$response['message'] = $message;
				$response['type'] = $type;
				$response['website'] = $url;
				$response['email'] = $email;
				$response['contact'] = $phone;
				$response['videolink'] = $videolink;
				$response['banner'] = $banner;
				$response['icon'] = $icon;*/
				
			var html = '';
				if(obj.banner != null)
				{
					html = '<div id="IndividualPageImage" style="width:100%;height:130px;float:left;background-image:url(http://www.aktifpenang.com/' + obj.banner+ ');background-repeat:no-repeat;background-size:cover;"></div>';
				}
				html +=	'<div style="width:100%;height:auto;margin-top:20px;float:left;background-color:#eee;opacity:0.7;">'+
						'<span id="IndividualPageName" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 18px;color:#222;">'+ obj.name + '</span>'+
						'<span id="IndividualPageName" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 13px;color:#555;">'+ obj.type + '</span>'+
						'<span id="IndividualPageTagline" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;margin-top:20px;">'+ obj.message + '</span>'+
						'<span id="IndividualPageInfo" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#666;margin-top:30px;">About</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">' + obj.about + '</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">Website: ' + obj.website + '</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">Email: ' + obj.email + '</span>'+
						'<span id="Individualdescription" class="gridValue" style="width:100%;font-weight: normal !important;font-size: 14px;color:#444;">Contact: ' + obj.contact + '</span>'+
					
					
					'</div>'+
				'';
			document.getElementById("IndividualMain").innerHTML = html;
		}
	);
	location.hash = "#IndividualPage";
			
	
});

 $(document).on('click', '.evtJoin', function (event, data) {
	var a = this;
	var id = $('#btnJoinGroup' + '').val();
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.post("http://www.aktifpenang.com/api/_api_group_join.php", 
	{
		token: mToken,
		groupname: id,
		action: 'join'
	}, 
	function(result){
		var obj = JSON.parse(result);
		if(obj.status == true)
		{
			localStorage.setItem("group_fresh", "true");
			window.history.back();
			//location.hash = "#individualGroupPage";
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error joining this group, please try again later.',
					function() {},
					'Join Group',
					'OK'
				);
			}
			else
			{
				alert("Error joining this group, please try again later");
			}
		}
	});
});

 $(document).on('click', '.evtLeave', function (event, data) {
	var a = this;
	var id = $('#btnLeaveGroup' + '').val();
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.post("http://www.aktifpenang.com/api/_api_group_join.php", 
	{
		token: mToken,
		groupname: id,
		action: 'leave'
	}, 
	function(result){
		var obj = JSON.parse(result);
		if(obj.status == true)
		{
			localStorage.setItem("group_fresh", "true");
			window.history.back();
			//location.hash = "#individualGroupPage";
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error Leaving Group. Please try again later.',
					function() {},
					'Leave Group',
					'OK'
				);
			}
			else
			{
				alert("Error leaving this group, please try again later");
			}
		}
	});
	
});

 $(document).on('click', '.evtComplaintType', function (event, data) {
	try {
	
		var a = this;
		var id = a.id;
		//alert("Complaint: " + id);
		mComplaintType = document.getElementById(id + "-name").innerHTML;
		complaint_id = parseInt(document.getElementById(id + "-name").getAttribute('value'));
		if(mWidth <= 700)
		{
			location.hash = "#NewComplaintInfoPage";
		}
		else
		{
			var left = (mWidth - 500 - 20)/2;
			
			
			$("#NewComplaintInfoPage").css({'margin-top':'0'});
			//$("#NewComplaintInfoPage").css({'position':'fixed'});
			$("#NewComplaintInfoPage").css({'position':'relative'});
			$("#NewComplaintInfoPage").css({'width':'500px'});
			$("#NewComplaintInfoPage").css({'height':'720px'});
			
			$("#NewComplaintInfoPage").css({'min-height':'650px'});
			//
			$("#NewComplaintInfoPage").css({'overflow':'scroll'});
			$("#NewComplaintInfoPage").css({'z-index':'1004'});
			$("#NewComplaintInfoPage").css({'display':'block'});
			$("#NewComplaintInfoPage").css({'margin-left':left +'px'});
			$("#NewComplaintInfoPage").css({'top':'130px'});
			$("#NewComplaintInfoPage").css({'padding':'0px'});
			$("#NewComplaintInfoPage").css({'border-radius':'8px'});
			$("#NewComplaintInfoPage").css({'border-style':'solid'});
			$("#NewComplaintInfoPage").css({'border-width':'5px'});
			$("#NewComplaintInfoPage").css({'border-color':'#666'});
			$("#NewComplaintInfoTop").css({'display':'none'});
			
			
			
			$("#NewComplaintInfoMain").css({'margin-top':'60px'});
			$("#NewComplaintInfoMain").css({'margin-bottom':'60px'});
			
			$("#startandstopbutton").css({'bottom':'170px'});
			$("#startandstopbutton").css({'position':'fixed'});
			$("#startandstopbutton").css({'width':'500px'});
			
			$("#pnlDialogComplaintInfoTop").css({'display':'block'});
			$("#pnlDialogComplaintInfoTop").css({'top':'135px'});
			
			
			$("#overlayGeneral").css({'display':'block'});
			
			$("#NewComplaintSectionPage").css({'display':'none'});
			
			
			showComplaintInfoPage();
			$("#pnlComplaintInfo").css({'height':'auto'});
		}	
	}
	catch(err) {
		alert( err.message);
	}
});

 $(document).on('click', '.evtLocation', function (event, data) {
	//GotoLocation();
});

 $(document).on('click', '.evtAddNewComplaint', function (event, data) {
	var a = this;

	if(mWidth <= 700)
	{
		location.hash = "#NewComplaintSectionPage";
	}
	else
	{
		var left = (mWidth - 500 - 20)/2;
		$("#NewComplaintSectionPage").css({'position':'fixed'});
		$("#NewComplaintSectionPage").css({'width':'500px'});
		$("#NewComplaintSectionPage").css({'height':'650px'});
		$("#NewComplaintSectionPage").css({'min-height':'650px'});
		$("#NewComplaintSectionMain").css({'height':'600px'});
		$("#NewComplaintSectionPage").css({'overflow':'scroll'});
		$("#NewComplaintSectionPage").css({'z-index':'1004'});
		$("#NewComplaintSectionPage").css({'display':'block'});
		$("#NewComplaintSectionPage").css({'margin-left':left +'px'});
		$("#NewComplaintSectionPage").css({'top':'100px'});
		//$("#NewComplaintSectionPage").css({'padding':'10px'});
		$("#NewComplaintSectionPage").css({'border-radius':'8px'});
		$("#NewComplaintSectionPage").css({'border-style':'solid'});
		$("#NewComplaintSectionPage").css({'border-width':'5px'});
		$("#NewComplaintSectionPage").css({'border-color':'#666'});
		$("#NewComplaintSectionTop").css({'display':'none'});
		$("#pnlDialogComplaintTop").css({'display':'block'});
		$("#overlayGeneral").css({'display':'block'});
		
		showcomplainttype();
	}
	
});

/* $(document).on('click', '.evtAddPhotoDiv', function (event, data) {
	try{
		console.log("Add Photo Pressed");
		alert("Add Photo");
		var a = this;
		$("#pnlCameraOption").css({'display':'block'});
		$("#overlayCameraOption").css({'display':'block'});
	}
	catch(err) {
		alert( err.message);
	}
});

 $(document).on('click', '.evtAddPhoto', function (event, data) {
	try{
		console.log("Add Photo Pressed");
		alert("Add Photo");
		var a = this;
		$("#pnlCameraOption").css({'display':'block'});
		$("#overlayCameraOption").css({'display':'block'});
	}
	catch(err) {
		alert( err.message);
	}
});*/
 
 $(document).on('click', '.evtRemovePhoto', function(event, data) {
	var a = this;
	 
 });
 
 /*$(document).on('click', '.evtCancelPhoto', function (event, data) {
	//var a = this;
	$("#pnlCameraOption").css({'display':'none'});
	$("#overlayCameraOption").css({'display':'none'});
});*/

 $(document).on('click', '#btnCheckAddress', function(event, data){
	var inputAddr = document.getElementById("eventAddress").value;
	if(inputAddr == "")
	{
	
	}
	else
	{
		geocoder.geocode( { 'address': inputAddr}, function(results, status) {

			if (status == google.maps.GeocoderStatus.OK) {
				varLat = results[0].geometry.location.lat();
				varLng = results[0].geometry.location.lng();
				
				mCheckInPosition = new google.maps.LatLng(varLat,varLng);// "" + varLat + "," + varLng;
				map.setCenter(results[0].geometry.location);
				marker.setPosition(results[0].geometry.location);
					
				if(varLng > 100.3529)
				{
					mCheckInFor = "|MPSP|";
				}
				else
				{
					mCheckInFor = "|MPPP|";
				}
				
				var content = '<strong>' + results[0].formatted_address + '</strong>';
				mCheckInAddress = results[0].formatted_address;
				//ClsAddress = content;
				infowindow.setContent(content);
				infowindow.open(map, marker);  
			} 
		}); 
	}
 });

  $(document).on('click', '#btnMyLocation', function(event, data){
	
	getLocationUpdate();
	
 });
 
 $(document).on('click', '.evtOverlay', function(event, data){
	$("#overlay").css({'display':'none'});
	$("#dialogPostContent").css({'display':'none'});
 });

$(document).on("scrollstop", function (e) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        header = $(".ui-header", activePage).outerHeight() - 1,
        scrolled = $(window).scrollTop(),
        footer = $(".ui-footer", activePage).outerHeight() - 1,
        scrollEnd = contentHeight - screenHeight + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "historyPage" && scrolled >= scrollEnd) {
        //console.log("adding...");
        addMorePost(activePage, showPostFrom);
    }
	else  if (activePage[0].id == "individualGroupPage" && scrolled >= scrollEnd) {
		 //addMoreGroupMember(activePage);
	}
	
});

//display alert box when submit button clicked(testing)
function disp_alert(email) {
        alert(email + ", login successfulled.");
     }
     
function reset_alert(email) {
        alert(email + ", reset password.");
    }
    
function ResetPassword()
{
	var email = $("#reset_email").val();
	if(email == "")
	{
		if(navigator.notification)
			{
				navigator.notification.alert(
					'Please enter your email address.',
					function() {},
					'Reset Password',
					'OK'
				);
			}
			else
			{
				alert("Please enter your email address.");
			}
		return;
	}
	// var toAdd = document.getElementById('forgotPasswordPage');
	//var left = window.innerWidth/2 - 20;
	//opts.left = left + 'px';
	//spinner = new Spinner(opts).spin(toAdd);
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});
	$.post("http://www.aktifpenang.com/api/_api_resetpassword.php", 
	{
		token: email
	}, 
	function(result){
		//spinner.stop();
		$.mobile.loading("hide");
		var obj = JSON.parse(result);
		if(obj.status == true)
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Password reset successful. Please chheck your registered email account for termporally password.',
					function() {},
					'Reset Password',
					'OK'
				);
			}
			else
			{
				alert("Password Reset Successful, Please check your registered email account for temporally password.");
			}
			Logout();
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Password reset error: ' + obj.extra,
					function() {},
					'Reset Password',
					'OK'
				);
			}
			else
			{
				alert("Password Reset Error: " + obj.extra);
			}
		}
	});
}

function ChangePassword()
{
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	var old_password = $("#oldpassword").val();
	var newpassword = $("#newpassword").val();
	var newpassword_confirm = $("#newpassword_confirm").val();
	if(newpassword == "" || old_password == "")
	{
		if(navigator.notification)
			{
				navigator.notification.alert(
					'Please fill in all the fields',
					function() {},
					'Change Password',
					'OK'
				);
			}
			else
			{
				alert("Please fill in all the fields");
			}
		return;
	}
	if(newpassword == newpassword_confirm)
	{
		// var toAdd = document.getElementById('changePasswordPage');
		//var left = window.innerWidth/2 - 20;
		//opts.left = left + 'px';
		//spinner = new Spinner(opts).spin(toAdd);
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});
		 $.post("http://www.aktifpenang.com/api/_api_changepassword.php", 
		{
			token: mToken,
			oldpassword: old_password,
			newpassword: newpassword_confirm
		}, 
		function(result){
			//spinner.stop();
			$.mobile.loading("hide");
			var obj = JSON.parse(result);
			if(obj.status == true)
			{
				if(navigator.notification)
				{
					navigator.notification.alert(
						'Change Password Successful. Please Login with new password.',
						function() {},
						'Change Password',
						'OK'
					);
				}
				else
				{
					alert("Change Password Successful. Please Login with new password.");
				}
				Logout();
			}
			else
			{
				if(navigator.notification)
				{
					navigator.notification.alert(
						'Change Password Failed. Please try again later',
						function() {},
						'Change Password',
						'OK'
					);
				}
				else
				{
					alert("Change Password Failed. Please try again later.");
				}
			}
		});
	}
	else
	{
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Please ensure new password and confirm password is same',
				function() {},
				'Change Password',
				'OK'
			);
		}
		else
		{
			alert("Please ensure new password and confirm password is same.");
		}
	}
	
}

function LoginEmail()
{
	if($("#username").val() == "")
	{
		document.getElementById('lblLogin').innerHTML = "Please fill up your email address and password";
		$("#lblLogin").css({"color":"#F4141C"});
		return;
	}
	if($("#password").val() == "")
	{
		document.getElementById('lblLogin').innerHTML = "Please fill up your email address and password";
		$("#lblLogin").css({"color":"#F4141C"});
		return;
	}
	 var name = document.getElementById("username").value;
     var pass = document.getElementById("password").value;
	 
	// var toAdd = document.getElementById('EmailLoginPage');
	//var left = window.innerWidth/2 - 20;
	//opts.left = left + 'px';
	//spinner = new Spinner(opts).spin(toAdd);
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});
	 $.post("http://www.betteripoh.com/api/_api_login.php", {username: name, password:pass}, function(result){
        //$("span").html(result);
		//spinner.stop();
		$.mobile.loading("hide");
		var obj = JSON.parse(result);
		//window.localStorage.getItem('BetterIpoh_AccessTokenV2')
		if(obj.status == true)
		{
			if(obj.token != "")
			{
				window.localStorage.setItem("BetterIpoh_AccessTokenV2", obj.token);
				window.localStorage.setItem("LoginType", "email");
				window.localStorage.setItem("UserID", name);
				localStorage.setItem("run_fresh", "true");
				//var url = "main1.html";
				//var win = window.open(url, '_self');
				location.hash = "#indexPage";
				UserSummary();
			}
		}
		else
		{
			document.getElementById('lblLogin').innerHTML = "Error Login: " + obj.token;
			$("#lblLogin").css({"color":"#F4141C"});
			return;
		}
		//alert(obj.token);
    });
}

function LoginFacebook()
{
	//alert("Start FB Login");
	try {
		//facebookConnectPlugin.browserInit("1575196586053265");
		 facebookConnectPlugin.logout( 
                    function (response) { 
						//alert("logout DONE");
						facebookConnectPlugin.login( ["email"], 
							function (response) 
							{	
								try {
									//alert(JSON.stringify(response));
									//var obj = JSON.parse(response);
									//alert("status:" + response.authResponse.email);
									if(response.status == "connected")
									{	
										var t = response.authResponse.accessToken;
										//alert("token:" + t);
										//alert("user:" + response.authResponse.userID);
										window.localStorage.setItem("BetterIpoh_AccessTokenV2", t);
										window.localStorage.setItem("LoginType", "facebook");
										window.localStorage.setItem("UserID", response.authResponse.userID);
										window.localStorage.setItem("run_fresh", "true");
										var mUserID = response.authResponse.userID;
										
										facebookConnectPlugin.api( "/me", null,
											function (response) 
											{ 
												//alert(JSON.stringify(response)) 
												window.localStorage.setItem("UserName", response.name);
												$.mobile.loading("show", {
													text: "Please Wait..",
													textVisible: true,
													theme: "b"
												});
												try
												{
													$.post("http://www.aktifpenang.com/api/_api_loginFb.php", 
													{
														fbuserid: mUserID,
														fbusername: response.name,
														fbemail: '',
														token: t
													}, 
													function(result){
														$.mobile.loading("hide");
														//var url = "main1.html";
														//var win = window.open(url, '_self');
														location.hash = "#indexPage";
														UserSummary();
													});
												}
												catch(err)
												{
													$.mobile.loading("hide");
													alert(err);
												}
											},
											function (response) { 
												//alert(JSON.stringify(response)) 
											}); 
										/*
										*/
										
									}
									else
									{
										if(navigator.notification)
										{
											navigator.notification.alert(
												'Error logging in',
												function() {},
												'Facebook Login',
												'OK'
											);
										}
										else
										{
											alert("Error Logging in.");
										}
									}
									//alert(JSON.stringify(response)) 
								}
								
								catch(err) {
									alert(err.message);
								}
							},
							function (response) { alert(JSON.stringify(response)) });
					},
                    function (response) { alert(JSON.stringify(response)) });
		
	}
	catch(err) {
		alert(err.message);
	}
	
}

			
	  /*int[] Image_Complaint = new int[]{
		R.drawable.complaint_potholes_shadow, 
		R.drawable.complaint_drainage_shadow,
		R.drawable.complaint_uncutgrass_shadow,
		R.drawable.complaint_trafficlight_shadow,
		R.drawable.complaint_streetlight_shadow,
		R.drawable.complaint_openfire_shadow,
		R.drawable.complaint_trashissue_shadow,
		R.drawable.complaint_signboard_shadow,
		R.drawable.complaint_banner_shadow,
		R.drawable.complaint_sewage_shadow,
		R.drawable.complaint_flood_shadow,
		R.drawable.cat_dog_shadow,
		R.drawable.dead_tree_shadow,
		R.drawable.no_parking_shadow,
		R.drawable.ilegal_structure_shadow,
		R.drawable.playground_shadow,
		R.drawable.mosquito_shadow,
		R.drawable.complaint_other_shadow};*/
			
var arrComplaintTypeIcon = ["complaint_potholes_shadow", 
							"complaint_drainage_shadow", 
							"complaint_uncutgrass_shadow",
							"complaint_trafficlight_shadow",
							"complaint_streetlight_shadow",
							"complaint_openfire_shadow",
							"complaint_trashissue_shadow",
							"complaint_signboard_shadow",
							"complaint_banner_shadow",
							"complaint_sewage_shadow",
							"complaint_flood_shadow",
							"cat_dog_shadow",
							"dead_tree_shadow",
							"no_parking_shadow",
							"ilegal_structure_shadow",
							"playground_shadow",
							"mosquito_shadow",
							"complaint_other_shadow"];
							
	/*	var String[] ComplaintTitle = { 
			"Potholes",
			"Drainage Issue", 
			"Uncut Grass", 
			"Traffic Light Issue",
			"Street Light Issue",
			"Open Burning",
			"Illegal Trash Site", 
			"Damaged SignBoard", 
			"Illegal Banner", 
			"Sewage Lid Missing", 
			"Flash Flood", 
			"Stray Animal Issue",
			"Dead Tree",
			"Illegal Parking",
			"Illgeal Structure",
			"Damaged Public Facilities",
			"Pest Issue",
			"Others" };		*/				
var arrComplaintTitle = ["Potholes",
						 "Drainage Issue",
						 "Uncut Grass",
						 "Traffic Light Issue",
						 "Street Light Issue",
						 "Open Burning",
						 "Illegal Trash Site",
						 "Damaged SignBoard",
						 "Illegal Banner", 
						"Sewage Lid Missing", 
						"Flash Flood", 
						"Stray Animal Issue",
						"Dead Tree",
						"Illegal Parking",
						"Illgeal Structure",
						"Damaged Public Facilities",
						"Pest Issue",
						"Others"
						 ];
function ShowPhotoSelection()
{
	try{
		console.log("Add Photo Pressed");
		//alert("Add Photo");
		var a = this;
		$("#pnlCameraOption").css({'display':'block'});
		$("#overlayCameraOption").css({'display':'block'});
	}
	catch(err) {
		alert( err.message);
	}
}

function RemovePhoto()
{
	 var smallImage = document.getElementById('imgPhoto');
      // Unhide image elements
      //
      //smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = '';
	   $("#pnlPhoto").css({'display':'none'});
	   //========= show remove ============
		$("#pnlAddPhoto").css({'width':'100%'});
		$("#pnlAddPhoto").css({'margin-right':'0%'});
		$("#pnlAddPhoto").css({'display':'block'});
		$(".evtAddPhoto").css({'float':'none'});
		 $("#txtAddPhoto").css({'text-align':'center'});
		 
		 
		$("#pnlRemovePhoto").css({'display':'none'});
		mComplaintImageURI = "";
}

function GotoLocation()
{
	try{
		var a = this;
		console.log("Location Pressed");
		//alert("Location Pressed");
		if(mWidth <= 700)
		{
			location.hash = "#NewComplaintMapPage";
		}
		else
		{
			var left = (mWidth - 500 - 20)/2;
			$("#mapview").css({'height':'420px'});
			$("#NewComplaintMapPage").css({'position':'fixed'});
			$("#NewComplaintMapPage").css({'width':'500px'});
			$("#NewComplaintMapPage").css({'height':'720px'});
			$("#NewComplaintMapPage").css({'min-height':'650px'});
			//$("#NewComplaintSectionMain").css({'height':'600px'});
			$("#NewComplaintMapPage").css({'overflow':'scroll'});
			$("#NewComplaintMapPage").css({'z-index':'1004'});
			$("#NewComplaintMapPage").css({'display':'block'});
			$("#NewComplaintMapPage").css({'margin-left':left +'px'});
			$("#NewComplaintMapPage").css({'top':'100px'});
			//$("#NewComplaintMapPage").css({'padding':'10px'});
			$("#NewComplaintMapPage").css({'border-radius':'8px'});
			$("#NewComplaintMapPage").css({'border-style':'solid'});
			$("#NewComplaintMapPage").css({'border-width':'5px'});
			$("#NewComplaintMapPage").css({'border-color':'#666'});
			$("#NewComplaintMapTop").css({'display':'none'});
			$("#mapdivision").css({'height':'350px'});
			$("#overlayGeneral").css({'display':'block'});
			$('#pnlDialogComplaintMapTop').css({'display':'block'});
			$("#NewComplaintInfoPage").css({'display':'none'});
			showMapView();
		}
	}
	catch(err) {
		alert( err.message);
	}
}

function ClosePhotoSelection()
{
	$("#pnlCameraOption").css({'display':'none'});
	$("#overlayCameraOption").css({'display':'none'});
}

function showComplaintInfoPage()
{
	var mHeaderHeight = $("#pnlHeader").height();
	var mHeightButtonSubmit = 60;
	
	var totalheight_complaintinfo = mHeight - mHeaderHeight - mHeightButtonSubmit - 60 - 60;
	//$("#complaintDescription").css({'height':totalheight_complaintinfo + 'px'});
	document.getElementById("complaintAddress").innerHTML = mCurrentAddress;
	document.getElementById("lblcomplaintTitle").innerHTML = "" + mComplaintType + "";
	document.getElementById("lblComplaintTitleDialog").innerHTML = "" + mComplaintType + "";
	
	image = arrComplaintTypeIcon[complaint_id] + '.png';
	document.getElementById("complaintinfo_icon").src = 'images/icon_complaint/' + image;
	$("#pnlCameraOption").css({'display':'none'});
	var mmHeight = mHeight - 50 - 50 - 50 - 20;
	$("#pnlComplaintInfo").css({'height': mmHeight + 'px'});
	$("#complaintDescription").removeClass();
}

function LoadComplaintType()
{
	var html = "";
	mComplaintType = "";
	document.getElementById("NewComplaintSectionMain").innerHTML = '<p style="width:100%;text-align:center;margin-top:0;margin-bottom:1em;text-transform:Uppercase;">Please Select Complaint Type:</p>';
	for(var i = 0; i < arrComplaintTitle.length; i++)
	{
		html += '<div id="' + arrComplaintTypeIcon[i] + '" onclick="" class="evtComplaintType" style="max-width:170px;position:relative;float:left;margin-top:1px;margin-left:1px;width:32.5%;height:140px;background-image:url(\'images/icon_complaint/' + arrComplaintTypeIcon[i] + '.png\');background-size:contain;background-repeat:no-repeat;">' + 
					'<p id= "' + arrComplaintTypeIcon[i] + '-name" value="' + i + '" style="position:absolute;bottom:0px;width:100%;text-align:center;color:#222;">' + arrComplaintTitle[i] + '</p>'+
				'</div>';
	}
	document.getElementById("NewComplaintSectionMain").innerHTML += html;
	
}

function showcomplainttype(){
	
	if(mWidth <= 700)
	{
		location.hash = "#NewComplaintSectionPage";
	}
	else
	{
		location.hash = "#indexPage";
		var left = (mWidth - 500 - 20)/2;
		$("#NewComplaintSectionPage").css({'position':'fixed'});
		$("#NewComplaintSectionPage").css({'width':'500px'});
		$("#NewComplaintSectionPage").css({'height':'720px'});
		$("#NewComplaintSectionPage").css({'min-height':'650px'});
		$("#NewComplaintSectionMain").css({'height':'600px'});
		$("#NewComplaintSectionPage").css({'overflow':'scroll'});
		$("#NewComplaintSectionPage").css({'z-index':'1004'});
		$("#NewComplaintSectionPage").css({'display':'block'});
		$("#NewComplaintSectionPage").css({'margin-left':left +'px'});
		$("#NewComplaintSectionPage").css({'top':'100px'});
		//$("#NewComplaintSectionPage").css({'padding':'10px'});
		$("#NewComplaintSectionPage").css({'border-radius':'8px'});
		$("#NewComplaintSectionPage").css({'border-style':'solid'});
		$("#NewComplaintSectionPage").css({'border-width':'5px'});
		$("#NewComplaintSectionPage").css({'border-color':'#666'});
		$("#NewComplaintSectionTop").css({'display':'none'});
		$("#pnlDialogComplaintTop").css({'display':'block'});
		$("#NewComplaintSectionPage").css({'padding-top':'0px'});
		$("#overlayGeneral").css({'display':'block'});
		
	}
	
	
}

function complaintClicked()
{
	try {
	
		var a = this;
		var id = a.id;
		//alert("Complaint: " + id);
		mComplaintType = document.getElementById(id + "-name").innerHTML;
		complaint_id = parseInt(document.getElementById(id + "-name").getAttribute('value'));
		if(mWidth <= 700)
		{
			location.hash = "#NewComplaintInfoPage";
		}
		else
		{
			var left = (mWidth - 500 - 20)/2;
			
			
			//$("#NewComplaintInfoPage").css({'position':'fixed'});
			$("#NewComplaintInfoPage").css({'position':'relative'});
			$("#NewComplaintInfoPage").css({'width':'500px'});
			$("#NewComplaintInfoPage").css({'height':'650px'});
			
			$("#NewComplaintInfoPage").css({'min-height':'650px'});
			//
			$("#NewComplaintInfoPage").css({'overflow':'scroll'});
			$("#NewComplaintInfoPage").css({'z-index':'1004'});
			$("#NewComplaintInfoPage").css({'display':'block'});
			$("#NewComplaintInfoPage").css({'margin-left':left +'px'});
			$("#NewComplaintInfoPage").css({'top':'100px'});
			$("#NewComplaintInfoPage").css({'padding':'0px'});
			$("#NewComplaintInfoPage").css({'border-radius':'8px'});
			$("#NewComplaintInfoPage").css({'border-style':'solid'});
			$("#NewComplaintInfoPage").css({'border-width':'5px'});
			$("#NewComplaintInfoPage").css({'border-color':'#666'});
			$("#NewComplaintInfoTop").css({'display':'none'});
			
			
			
			$("#NewComplaintInfoMain").css({'margin-top':'60px'});
			$("#NewComplaintInfoMain").css({'margin-bottom':'60px'});
			
			$("#startandstopbutton").css({'bottom':'240px'});
			$("#startandstopbutton").css({'position':'fixed'});
			$("#startandstopbutton").css({'width':'500px'});
			
			$("#pnlDialogComplaintInfoTop").css({'display':'block'});
			$("#overlayGeneral").css({'display':'block'});
			
			$("#NewComplaintSectionPage").css({'display':'none'});
			showComplaintInfoPage();
			$("#pnlComplaintInfo").css({'height':'auto'});
		}	
	}
	catch(err) {
		alert( err.message);
	}
}

function showMapView(){
	if(mapDone == false)
		{
			
			var now = new Date();

			map = new google.maps.Map($("#map_canvas")[0], mapOptions);
			//map.mapTypes.set('map_style', styledMap);
			//map.setMapTypeId('map_style');
		
		
			marker = new google.maps.Marker({
				position: mCurrentLocation,
				map:      map,
				title:    "Location",
				draggable: true,
				//icon:     icons['train']
			});	
			google.maps.event.addListener(marker, 'mouseup', function() {
					var mPosition = marker.getPosition();
					//var mPos = mMarker.getLatLng();
					//ClsPosition = mPosition;
					//var geocoder;
					if(!geocoder) {
						geocoder = new google.maps.Geocoder();	
					}

					geocoder.geocode( { 'location': mPosition}, function(results, status) {
						 if (status == google.maps.GeocoderStatus.OK)
						 {
							varLat = results[0].geometry.location.lat();
							varLng = results[0].geometry.location.lng();
							if(varLng > 100.3529)
							{
								mCheckInFor = "|MPSP|";
							}
							else
							{
								mCheckInFor = "|MPPP|";
							}
							mCheckInPosition = new google.maps.LatLng(varLat,varLng);// "" + varLat + "," + varLng;
							//mCheckInPosition = "" + varLat + "," + varLng;
							var content = '<strong>' + results[0].formatted_address + '</strong>';
							mCheckInAddress = results[0].formatted_address;
							document.getElementById("eventAddress").value = mCheckInAddress;
							document.getElementById("txtCoordinate").value = varLat + "," + varLng;
							//ClsAddress = content;
							infowindow.setContent(content);
							infowindow.open(map, marker);      
						 }									
					});
			});
			// Check for geolocation support   

			if (navigator.geolocation) {
				// Get current position
				if(hasInitialLocation == false)
				{
					navigator.geolocation.getCurrentPosition(function (position) {
						// Success!
						var mylocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
						mCheckInPosition = "" + position.coords.latitude + "," + position.coords.longitude;
						map.setCenter(mylocation);
						marker.setPosition(mylocation);
						//var geocoder;
						if(!geocoder) {
							geocoder = new google.maps.Geocoder();	
						}
						geocoder.geocode( { 'location': mylocation}, function(results, status) {
							 if (status == google.maps.GeocoderStatus.OK)
							 {
								varLat = results[0].geometry.location.lat();
								varLng = results[0].geometry.location.lng();
								
								if(varLng > 100.3529)
								{
									mCheckInFor = "|MPSP|";
								}
								else
								{
									mCheckInFor = "|MPPP|";
								}
								
								var content = '<strong>' + results[0].formatted_address + '</strong>';
								mCheckInAddress = results[0].formatted_address;
								document.getElementById("eventAddress").value = mCheckInAddress;
								document.getElementById("txtCoordinate").value = varLat + "," + varLng;
								//ClsAddress = content;
								infowindow.setContent(content);
								infowindow.open(map, marker);      
							 }									
						});
					});
				}
				else
				{
				//mCheckInPosition = "" + position.coords.latitude + "," + position.coords.longitude;
						map.setCenter(mCurrentLocation);
						marker.setPosition(mCurrentLocation);
						//var geocoder;
						if(!geocoder) {
							geocoder = new google.maps.Geocoder();	
						}
						geocoder.geocode( { 'location': mCurrentLocation}, function(results, status) {
							 if (status == google.maps.GeocoderStatus.OK)
							 {
								varLat = results[0].geometry.location.lat();
								varLng = results[0].geometry.location.lng();
								
								
								var content = '<strong>' + results[0].formatted_address + '</strong>';
								mCheckInAddress = results[0].formatted_address;
								document.getElementById("eventAddress").value = mCheckInAddress;
								document.getElementById("txtCoordinate").value = varLat + "," + varLng;
								//ClsAddress = content;
								infowindow.setContent(content);
								infowindow.open(map, marker);      
							 }									
						});
				}
			}
			mapDone = true;
		}
		
		
}

function UpdateLocation(){
	mCurrentLocation = mCheckInPosition ;
	mCurrentAddress = mCheckInAddress;
	//document.getElementById("complaintAddress").innerHTML = mCurrentAddress;
	//location.hash = "#NewComplaintInfoPage";
	if(mWidth <= 700)
	{
		window.history.back();
	}
	else
	{
		var left = (mWidth - 500 - 20)/2;
		
		/*$("#NewComplaintInfoPage").css({'margin-top':'0'});
		
		$("#NewComplaintInfoPage").css({'position':'fixed'});
		$("#NewComplaintInfoPage").css({'width':'500px'});
		$("#NewComplaintInfoPage").css({'height':'720px'});
		$("#NewComplaintInfoPage").css({'min-height':'650px'});
		//$("#NewComplaintSectionMain").css({'height':'600px'});
		$("#NewComplaintInfoPage").css({'overflow':'scroll'});
		$("#NewComplaintInfoPage").css({'z-index':'1003'});
		$("#NewComplaintInfoPage").css({'display':'block'});
		$("#NewComplaintInfoPage").css({'margin-left':left +'px'});
		$("#NewComplaintInfoPage").css({'top':'130px'});
		$("#NewComplaintInfoPage").css({'padding':'0px'});
		$("#NewComplaintInfoPage").css({'border-radius':'8px'});
		$("#NewComplaintInfoPage").css({'border-style':'solid'});
		$("#NewComplaintInfoPage").css({'border-width':'5px'});
		$("#NewComplaintInfoPage").css({'border-color':'#666'});
		$("#NewComplaintInfoTop").css({'display':'none'});
		$("#overlayGeneral").css({'display':'block'});
		
		$("#NewComplaintMapPage").css({'display':'none'});
		showComplaintInfoPage();*/
		
		
		$("#NewComplaintInfoPage").css({'margin-top':'0'});
		//$("#NewComplaintInfoPage").css({'position':'fixed'});
		$("#NewComplaintInfoPage").css({'position':'relative'});
		$("#NewComplaintInfoPage").css({'width':'500px'});
		$("#NewComplaintInfoPage").css({'height':'720px'});
		
		$("#NewComplaintInfoPage").css({'min-height':'650px'});
		//
		$("#NewComplaintInfoPage").css({'overflow':'scroll'});
		$("#NewComplaintInfoPage").css({'z-index':'1004'});
		$("#NewComplaintInfoPage").css({'display':'block'});
		$("#NewComplaintInfoPage").css({'margin-left':left +'px'});
		$("#NewComplaintInfoPage").css({'top':'130px'});
		$("#NewComplaintInfoPage").css({'padding':'0px'});
		$("#NewComplaintInfoPage").css({'border-radius':'8px'});
		$("#NewComplaintInfoPage").css({'border-style':'solid'});
		$("#NewComplaintInfoPage").css({'border-width':'5px'});
		$("#NewComplaintInfoPage").css({'border-color':'#666'});
		$("#NewComplaintInfoTop").css({'display':'none'});
		
		
		
		$("#NewComplaintInfoMain").css({'margin-top':'60px'});
		$("#NewComplaintInfoMain").css({'margin-bottom':'60px'});
		
		$("#startandstopbutton").css({'bottom':'170px'});
		$("#startandstopbutton").css({'position':'fixed'});
		$("#startandstopbutton").css({'width':'500px'});
		
		$("#pnlDialogComplaintInfoTop").css({'display':'block'});
		$("#pnlDialogComplaintInfoTop").css({'top':'135px'});
		
		
		$("#overlayGeneral").css({'display':'block'});
		
		
			
		$("#NewComplaintMapPage").css({'display':'none'});	
		showComplaintInfoPage();
		$("#pnlComplaintInfo").css({'height':'auto'});
	}
}

function SubmitComplaint(){
	//submit complaint
	var _address = document.getElementById("complaintAddress").innerHTML;
	var _complaintitle = document.getElementById("lblcomplaintTitle").innerHTML;
	var _description = document.getElementById("complaintDescription").value;
	var _coor = mCurrentLocation.lat() + "|" + mCurrentLocation.lng();
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	var mCompalintID = complaint_id + 1;
	if(complaint_id == 17)
	{
		mCompalintID = 0;
	}
	if(mComplaintImageURI == "")
	{
	
		$.mobile.loading("show", {
				text: "Please Wait..",
				textVisible: true,
				theme: "b"
			});		
			
		
		$.post("http://www.betteripoh.com/api/_api_postcomplaint_withimage.php", 
		{
			token: mToken,
			txtAddress: _address,
			txtTitle : _complaintitle,
			txtTitleID: mCompalintID,
			txtComplaintDescription: _description,
			txtCoordinate: _coor,
			txtFor: mCheckInFor
			//imagepath: ''
			
			//userid: username
		}, 
		function(result){
			$.mobile.loading("hide");
			var obj = JSON.parse(result);
			if(obj.status == true)
			{
				SubmitSuccess();
				/*if(navigator.notification)
				{
					navigator.notification.alert(
						'EThank you for submiting complaint ',
						function() {},
						'Success',
						'OK'
					);
					location.hash = "#indexPage";
				}
				else
				{
					alert('Thank you for submiting complaint');
					location.hash = "#indexPage";
				}*/
			}
			//alert(obj.status);
		});
	}
	else
	{
		//uploadPhoto(mComplaintImageURI);
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});	
		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=mComplaintImageURI.substr(mComplaintImageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";

		var params = new Object();
		params.token = mToken;
		params.txtAddress = _address;
		params.txtTitle = _complaintitle;
		params.txtTitleID = mCompalintID;
		params.txtComplaintDescription = _description;
		params.txtCoordinate = _coor;
		params.txtFor = mCheckInFor;
		
		options.params = params;
		options.chunkedMode = false;

		var ft = new FileTransfer();
		ft.upload(mComplaintImageURI, "http://www.betteripoh.com/api/_api_postcomplaint_withimage.php", SubmitDone, fail, options);
	}
}

function SubmitDone(r)
{
	var result = r.response;
	var obj = JSON.parse(result);
	if(obj.status == true)
	{
		SubmitSuccess();
	}
	else
	{
		alert("error submitting complaint");
	}
}
function SubmitSuccess()
{
	var smallImage = document.getElementById('imgPhoto');
    smallImage.src = "";
	
	if(navigator.notification)
	{
		navigator.notification.alert(
			'Thank you for submiting complaint ',
			function() {},
			'Success',
			'OK'
		);
		RemovePhoto();
		//mComplaintImageURI = "";
		$.mobile.loading("hide");
		
		if(mWidth <= 700)
		{
			location.hash = "#indexPage";
		}
		else
		{
			$("#NewComplaintSectionPage").css({'display':'none'});
			$("#NewComplaintInfoPage").css({'display':'none'});
			$("#overlayGeneral").css({'display':'none'});
		}
		
		
	}
	else
	{
		RemovePhoto();
		//mComplaintImageURI = "";
		$.mobile.loading("hide");
		alert('Thank you for submiting complaint');
		if(mWidth <= 700)
		{
			location.hash = "#indexPage";
		}
		else
		{
			$("#NewComplaintSectionPage").css({'display':'none'});
			$("#NewComplaintInfoPage").css({'display':'none'});
			$("#overlayGeneral").css({'display':'none'});
		}
	}
}

function allPost(username){
	if(showingCurrentPost != "")
	{
		showingCurrentPost = "";
		return;
	}
	if(username == "")
	{
		$(".uiPostType").removeClass("active");
		$("#allpost").addClass("active");
	}
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});		
		
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	$.get("http://www.betteripoh.com/api/api_get_post.php", 
	{
		token: mToken,
		userid: username
	}, 
	function(result){
		$.mobile.loading("hide");
		var obj = JSON.parse(result);
		
		//spinner.stop();
		nextToken = obj.nexttoken;
		TotalRunCount = obj.total;
		var panelMain = $('#HistoryMain' + '');
		panelMain.empty();
		//window.localStorage.setItem("aktif_runHistory_Individual", "");
		for(var i = 0; i < obj.posts.length; i++) {
			var objPost = obj.posts[i];
			LoadPost(objPost, true);
			
		}
	});
}

function addMorePost(page, username) {
	if(nextToken < TotalRunCount)
	{
		$.mobile.loading("show", {
			text: "loading more..",
			textVisible: true,
			theme: "b"
		});
		 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
			$.get("http://www.betteripoh.com/api/api_get_post.php", 
			{
				token: mToken,
				nexttoken: nextToken,
				userid: username
			}, 
			function(result){
				$.mobile.loading("hide");
				var obj = JSON.parse(result);
				nextToken = obj.nexttoken;
				TotalRunCount = obj.total;
				
				window.localStorage.setItem("aktif_runHistory", result);
				objGroup = obj;
				var panelMain = $('#HistoryMain' + '');
				//panelMain.empty();
				for(var i = 0; i < objGroup.posts.length; i++) {
					var obj = objGroup.posts[i];
					
					LoadPost(obj, false);
					
					/*var image = "";
					var complaint_id = obj.complaintid;
					switch(complaint_id)
					{
						case "0":
							image = arrComplaintTypeIcon[0] + '.png';
							break;
					}
					
					image = arrComplaintTypeIcon[0] + '.png';
					var widthTitle = mWidth - 100;
					var html = '<div id="Historyinfo-' + obj.id + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icon_complaint/' + image + ');background-color:#45ADA8;border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:' + widthTitle + 'px;">' + 
					'<div style="position:relative;">' + 
					'<span id="" style="color:#000;font-size:1.1em;">' + obj.title + '</span></div>' + 
					'<div style="position:relative;">' + 
					'<span id="" style="font-size:14px;color:#888;">' + obj.description + '</span></div>' + 
					'<div style="position:relative;">' + 
					'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:left;"></div><span id="" style="color:#000;font-size:0.8em;">' + obj.address + '</span></div>' + 
					'<div style="position:relative;">' + 
					'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
					'<span id="" style="font-size:14px;color:#888;">' + obj.datetime + '</span></div></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
						
						
					*/
					
					
				}
				//var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual");
				//window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
				
				//alert(obj.token);
			});
	}
}

function LoadPost(obj, saveStorage){
	var panelMain = $('#HistoryMain' + '');
	var current_id = obj.activityid;
	/*if(saveStorage == true)
	{
		var int_current_id = parseInt(current_id)  + 1;
		window.localStorage.setItem("aktif_nextt_activity_id", int_current_id);	
		
		var strObj = JSON.stringify(obj);
		strObj = strObj.replace("}","");
		strObj = strObj + ',"sync":"yes"}';
		var objStorage =  window.localStorage.getItem("aktif_runHistory_Individual");
		if(objStorage == ""  || objStorage == null)
		{
			window.localStorage.setItem("aktif_runHistory_Individual", "[" + strObj);	
		}
		else
		{
			objStorage = objStorage.replace("]", "");
			window.localStorage.setItem("aktif_runHistory_Individual", objStorage + "," +  strObj);
		}
	}*/
	
	
	var image = "";
	var complaint_id = obj.complaintid;
	if(complaint_id != "")
	{
		var intcomplaint_id = parseInt(complaint_id) - 1;
		if(intcomplaint_id == -1)
		{
			image = arrComplaintTypeIcon[arrComplaintTitle.length - 1] + '.png';
		}
		else
		{
			image = arrComplaintTypeIcon[intcomplaint_id] + '.png';
		}
	}
	else
	{
		image = arrComplaintTypeIcon[arrComplaintTitle.length - 1] + '.png';
	}
	/*switch(complaint_id)
	{
		case "0":
			image = arrComplaintTypeIcon[0] + '.png';
			break;
	}*/
	
	//image = arrComplaintTypeIcon[0] + '.png';
	var maxWidth = mWidth -30-20;
	var maxHeight = "";
	var maxHeightTitle = "";
	var maxHeightAddress = "";
	if(mWidth > 700)
	{
		//ipad
		maxWidth = (mWidth / 3) - 25 - 20;
		maxHeight = "height:330px;overflow:hidden;margin:5px;";
		maxHeightTitle = "height:80px;overflow:hidden;";
		maxHeightAddress = "height:40px;overflow:hidden;";
	}
	var widthTitle = maxWidth - 80;
	
	var htmlImage = '';
	if(obj.image != '')
	{
		htmlImage = '<div style="float:left;background:url(\'' + obj.image + '\');background-repeat:no-repeat;background-size:cover;width:' + maxWidth + 'px;height:150px;"></div>' ;
	}
	var html = 
	'<div id="Historyinfo-' + obj.postid + '" class="evtHistory clsShadow" style="padding:10px;background-color:#fff;border-style:solid;border-width:1px;border-color:#999;position:relative;float:left;width:' + maxWidth + 'px;'+ maxHeight + 'margin-top:10px;">' + 
	'<div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icon_complaint/' + image + ');background-color:#45ADA8;border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
	'<div style="float:left;width:' + widthTitle + 'px;' + maxHeightTitle + '">' + 
		'<div style="position:relative;float:left;width:100%;">' + 
			'<span id="" style="color:#000;font-size:1.1em;">' + obj.title + '</span>' + 
		'</div>' + 
		//'<span id="" style="color:#444;font-size:1.0em;width:100%;float:left;">' + obj.status + '</span>' + 
		'<span id="" style="font-size:14px;color:#888;float:left;">' + obj.description + '</span>' + 
	'</div>'+
	'<div style="position:relative;float:left;width:100%;">' + 
	'<span id="" style="width:60px;font-size:14px;color:#888;float:left;text-align:center;">STATUS:</span>' + 
	'<span id="" style="font-size:14px;color:#888;float:left;">' + obj.status + '</span></div>' + 
	'<div style="position:relative;float:left;width:100%;' + maxHeightAddress + '">' + 
	'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:left;"></div><span id="" style="color:#000;font-size:0.8em;">' + obj.address + '</span></div>' + 
	'<div style="position:relative;float:left;width:100%;">' + 
	'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
	'<span id="" style="font-size:14px;color:#888;">' + obj.datetime + '</span></div>' + 
	htmlImage + 
	//'<div style="position:absolute;bottom:0px;float:left;width:' + (maxWidth - 0) +'px;height:1px;margin-left:0%;background-color:#aaa;"></div>'
	'</div>';
	
	panelMain.append(html);
	//panelMain.append('<div style="float:left;width:' + (maxWidth - 10) +'px;height:1px;margin-left:0%;background-color:#aaa;"></div>');
	
	//console.log(obj.name);
	//console.log(obj.tagline);
	//console.log(obj.membercount);
	
	//console.log(distance + "km");
	//console.log(obj.isGroup);
}

	//=============================== camera =====================================
	function onPhotoDataSuccess(imageData) {
      // Get image handle
      //
      var smallImage = document.getElementById('imgPhoto');
      // Unhide image elements
      //
      //smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
	  
	  $("#pnlPhoto").css({'display':'block'});
	  //$("#pnlAddPhoto").css({'display':'none'});
    }
    
	// Called when a photo is successfully retrieved
    //
    function onPhotoFileSuccess(imageData) {
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});	
      // Get image handle
      //console.log(JSON.stringify(imageData));
      
   	  // Get image handle
      //
      var smallImage = document.getElementById('imgPhoto');
      // Unhide image elements
      //
      //smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = imageData;
	   $("#pnlPhoto").css({'display':'block'});
	   $("#pnlCameraOption").css({'display':'none'});
	  $("#overlayCameraOption").css({'display':'none'}); 
		
		//========= show remove ============
		 $("#pnlAddPhoto").css({'width':'40%'});
		 $("#pnlAddPhoto").css({'margin-right':'5%'});
		 $(".evtAddPhoto").css({'float':'right'});
		  $("#txtAddPhoto").css({'text-align':'right'});
		 
		   $("#pnlAddPhoto").css({'display':'none'});
		$("#pnlRemovePhoto").css({'display':'block'});
		//uploadPhoto(imageData);
		mComplaintImageURI = imageData;
		$.mobile.loading("hide");
    }
    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);
      // Get image handle
      //
      var largeImage = document.getElementById('imgPhoto');
      // Unhide image elements
      //
     // largeImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
	    $("#pnlPhoto").css({'display':'block'});
    }
    // A button will call this function
    //
    function capturePhotoWithData() {
		//onPhotoFileSuccess("");
		//uploadPhoto("");
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { 
			destinationType: Camera.DestinationType.FILE_URI, 
			allowEdit: true, 
			targetWidth: 500, 
			targetHeight: 500 });
    }
    
	function capturePhotoWithFile() {
		//onPhotoFileSuccess("");
		
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { 
			allowEdit: true, 
			targetWidth: 500, 
			targetHeight: 500,
			destinationType: Camera.DestinationType.FILE_URI, 
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY });
    }
    
    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }
    // Called if something bad happens.
    // 
    function onFail(message) {
      //alert('Failed because: ' + message);
	    $("#pnlCameraOption").css({'display':'none'});
		$("#overlayCameraOption").css({'display':'none'}); 
    }
	
	function uploadPhoto(imageURI) {
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});	
		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";

		var params = new Object();
		params.value1 = "test";
		params.value2 = "param";

		options.params = params;
		options.chunkedMode = false;

		var ft = new FileTransfer();
		ft.upload(imageURI, "http://www.betteripoh.com/api/_api_uploadimage.php", win, fail, options);
	}

	function fail(error) {
		alert("An error has occurred: Code = " + error.code);
	}
	function win(r) {
		console.log("Code = " + r.responseCode);
		console.log("Response = " + r.response);
		console.log("Sent = " + r.bytesSent);
		//alert(r.response);
		mComplaintImageURI = "";
		$.mobile.loading("hide");
	}
//===========================================================================================

function UserSummary(){
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 if(mToken != null)
	 {
	 $.get("http://www.betteripoh.com/api/_api_usersummary.php", 
		{
			token: mToken
		}, 
		function(result){
			//$("span").html(result);
			var obj = JSON.parse(result);
			//var summary_username = obj.username;
			window.localStorage.setItem("totalpost", obj.summary[0].totalpost);
			window.localStorage.setItem("totalassigned", obj.summary[0].totalassigned);
			window.localStorage.setItem("totalclosed", obj.summary[0].totalclosed);
			window.localStorage.setItem("userpost", obj.summary[0].userpost);
			window.localStorage.setItem("userassigned", obj.summary[0].userassigned);
			window.localStorage.setItem("userclosed", obj.summary[0].userclosed);
			window.localStorage.setItem("lastpost", obj.summary[0].lastpost);
			window.localStorage.setItem("userid", obj.username);
			window.localStorage.setItem("displayname", obj.displayname);
			displaySummary();
			displayUserSummary("Index");

			//UserProfile();
			//alert(obj.token);
		});
	}
}

function sep1000(somenum,usa){
  var dec = String(somenum).split(/[.,]/)
     ,sep = usa ? ',' : '.'
     ,decsep = usa ? '.' : ',';
  return dec[0]
         .split('')
         .reverse()
         .reduce(function(prev,now,i){
                   return i%3 === 0 ? prev+sep+now : prev+now;}
                )
         .split('')
         .reverse()
         .join('') +
         (dec[1] ? decsep+dec[1] :'')
  ;
}

function displaySummary(){
	var totalpost = window.localStorage.getItem("totalpost");
	var totalassigned = window.localStorage.getItem("totalassigned");
	var totalclosed = window.localStorage.getItem("totalclosed");
	var userpost = window.localStorage.getItem("userpost");
	var userassigned = window.localStorage.getItem("userassigned");
	var userclosed = window.localStorage.getItem("userclosed");
	var lastpost = window.localStorage.getItem("lastpost");
	var TotalEvents = window.localStorage.getItem("TotalEvents");
    var shortName = window.localStorage.getItem("shortname");
	
	var displayname = window.localStorage.getItem("displayname");
	
	$("#welcomeusername").html("Hello, </br>" + displayname );
	$("#complaint_TotalCase").html(totalpost + "" );
	$("#complaint_TotalInProgress").html(totalassigned + "" );
	$("#complaint_TotalClosed").html(totalclosed + "" );
	//$("#CampaignSummary_TotalDistance").html(userpost + "" );
	
}

function displayUserSummary(divId)
{
	var userpost = window.localStorage.getItem("userpost");
	var userassigned = window.localStorage.getItem("userassigned");
	var userclosed = window.localStorage.getItem("userclosed");
	var lastpost = window.localStorage.getItem("lastpost");
	var displayname = window.localStorage.getItem("displayname");
	/*var CampaignUser = window.localStorage.getItem("CampaignUser");
	var CampaignDistance = window.localStorage.getItem("CampaignDistance");
	var firstname = window.localStorage.getItem("firstname");
	var lastname = window.localStorage.getItem("lastname");
	var userimage = window.localStorage.getItem("userimage");
	var TotalRuns = window.localStorage.getItem("TotalRuns");
	var TotalDistance = window.localStorage.getItem("TotalDistance");
	var TotalEvents = window.localStorage.getItem("TotalEvents");
    var shortName = window.localStorage.getItem("shortname");*/
	

	$("#username"+ divId).html("" + displayname + "" );
	
	
	$("#userSummary"+ divId).html("Total Post: " + userpost + "</br>Closed: " + userclosed + "</br>In Progress: " + userassigned );
	
	if(window.localStorage.getItem("LoginType") == "facebook")
	{
		imageURL = "https://graph.facebook.com/" + window.localStorage.getItem("userid") + "/picture?type=large";
		$("#userImage"+ divId).css({'background-image':'url('+imageURL+')'});
	}
}

function LeaderBoard()
{
	//var toAdd = document.getElementById('leaderBoardPage');
	//var left = window.innerWidth/2 - 20;
	//opts.left = left + 'px';
	//spinner = new Spinner(opts).spin(toAdd);	
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});					
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		$.get("http://www.aktifpenang.com/api/_api_leader_get.php", 
		{
			token: mToken
		}, 
		function(result){
			$.mobile.loading("hide");
			//spinner.stop();
			//$("span").html(result);
			var objLeader = JSON.parse(result);
			var panelMain = $('#LeaderBoardMain' + '');
			panelMain.empty();
			var html = '<div id="" class="" style="float:left;width:100%;margin-top:0px;background-color:#222;color:#fff;height:40px;line-Height:40px;padding-Left:10px;">Top Runners</div>';
			panelMain.append(html);
			
			for(var i = 0; i < objLeader.individual_leader.length; i++) {
				var obj = objLeader.individual_leader[i];	
				var mdistance = parseFloat(obj.totaldistance);
				var munit = "meter";
				if(mdistance > 1000.0)
				{
					mdistance = mdistance / 1000.0;
					munit = "km";
				}
				mdistance = Math.round(mdistance * 100) / 100;
				var imageURL = "";
				if(obj.logintype == "email")
				{
					imageURL = "images/icons/login.png";
				}
				else
				{
					imageURL = "https://graph.facebook.com/" + obj.username + "/picture?type=large";
				}
				var background = '#fff';
				if(i % 2 == 0)
				{
					background = '#f0f0f0';
				}
				var html = '<div id="Historyinfo-' + obj.id + '" class="" style="float:left;width:100%;padding-top:10px;background-color:'+ background +';"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
				'<div style="float:left;width:75%;"><span id="" style="line-height:40px;height:100%;">' + obj.name + '</span><div style="float:right;height:50px;">' + 
							'<span id="" style="font-size:1.2em;color:#E51919;line-height:40px;height:100%;float:left;">'  + mdistance + munit +  '</span><div style="margin-top:10px;width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:right;"></div></div></div></div>';
				panelMain.append(html);
				panelMain.append('<div style="float:left;width:100%;height:1px;margin-left:0%;background-color:#aaa;"></div>');
				
			}
			var html = '<div id="" class="" style="float:left;width:100%;margin-top:0px;background-color:#222;color:#fff;height:40px;line-Height:40px;padding-Left:10px;">Top Cyclist</div>';
			panelMain.append(html);
			
			for(var i = 0; i < objLeader.cycling_leader.length; i++) {
				var obj = objLeader.cycling_leader[i];	
				var mdistance = parseFloat(obj.totaldistance);
				var munit = "meter";
				if(mdistance > 1000.0)
				{
					mdistance = mdistance / 1000.0;
					munit = "km";
				}
				mdistance = Math.round(mdistance * 100) / 100;
				var imageURL = "";
				if(obj.logintype == "email")
				{
					imageURL = "images/icons/login.png";
				}
				else
				{
					imageURL = "https://graph.facebook.com/" + obj.username + "/picture?type=large";
				}
				var background = '#fff';
				if(i % 2 == 0)
				{
					background = '#f0f0f0';
				}
				var html = '<div id="Historyinfo-' + obj.id + '" class="" style="float:left;width:100%;padding-top:10px;background-color:'+ background +';"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
				'<div style="float:left;width:75%;"><span id="" style="line-height:40px;height:100%;">' + obj.name + '</span><div style="float:right;height:50px;">' + 
				'<span id="" style="font-size:1.2em;color:#E51919;float:left;line-height:40px;height:100%;">'  + mdistance + munit +  '</span><div style="margin-top:10px;width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:right;"></div></div></div></div>';
				panelMain.append(html);
				panelMain.append('<div style="float:left;width:100%;height:1px;margin-left:0%;background-color:#aaa;"></div>');
				
			}
			var html = '<div id="" class="" style="float:left;width:100%;margin-top:0px;background-color:#222;color:#fff;height:40px;line-Height:40px;padding-Left:10px;">Top Groups</div>';
			panelMain.append(html);
			for(var i = 0; i < objLeader.group_leader.length; i++) {
				var obj = objLeader.group_leader[i];
				var distance = obj.group_distance;
				distance = distance / 1000.0;
				distance = Math.round(distance * 100) / 100;
				var background = '#fff';
				if(i % 2 == 0)
				{
					background = '#f0f0f0';
				}
				var html = '<div id="groupinfo" class="evtGroup" style="float:left;width:100%;padding-top:10px;background-color:'+ background +';"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(\'http://www.aktifpenang.com/group_images/' + obj.group_icon + '\');border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div>'+
							'<div style="float:left;width:60%;"><span id="">' + obj.group_name + '</span></br><span id="" style="font-size:14px;color:#555;">' + obj.tagline + '</span></br><span id="" style="font-size:1.2em;color:#E51919;">' +  distance + 'km</span></div>';
							

				html = html + '</div>';		
				panelMain.append(html);
				panelMain.append('<div style="float:left;width:100%;height:1px;margin-left:0%;background-color:#aaa;"></div>');				
			}
		}
	);
}

function Events()
{
	//var toAdd = document.getElementById('groupsPage');
	//var left = window.innerWidth/2 - 20;
	//opts.left = left + 'px';
	//spinner = new Spinner(opts).spin(toAdd);	
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});		
		 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		 $.get("http://www.aktifpenang.com/api/_api_event_get.php", 
			{
				token: mToken
			}, 
			function(result){
				$.mobile.loading("hide");
				//spinner.stop();
				var obj = JSON.parse(result);
				
					/*$event = array(
						'id' => $id,
						'eventname' => $eventname,
						'eventdate' => $eventdate,
						'eventdescription' => $eventdescription,
						'eventtype' => $eventtype,
						'eventcreator' => $eventcreator,
						'eventlocation' => $eventlocation,
						'eventcoordinate' => $eventcoordinate,
						'eventurl' => $eventurl,
					);,*/
							
							
				window.localStorage.setItem("aktif_events", result);
				objEvent = obj;
				var panelMain = $('#EventMain' + '');
				panelMain.empty();
				for(var i = 0; i < objEvent.event.length; i++) {
					var obj = objEvent.event[i];
					var distance = obj.totaldistance;
					distance = distance / 1000.0;
					distance = Math.round(distance * 100) / 100;
					var html = '<div id="eventinfo-'+ obj.id + '" class="evtEvent" style="float:left;width:100%;margin-top:10px;"><div style="display:block;margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(\'images/icons/event.png\');border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div>'+
								'<div style="float:left;width:70%;margin-left:5px;"><span id="">' + obj.eventname + '</span></br><span id="" style="font-size:14px;color:#555;">Date: ' + obj.eventdate + '</span></br><span id="" style="font-size:14px;color:#888;">' + obj.eventdescription + '</span></br><span id="" style="font-size:14px;color:#888;">Location: ' + obj.eventlocation + '</span></div>';
								
					
					html = html + '</div>';
					
					
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					console.log(obj.name);
					console.log(obj.tagline);
					console.log(obj.membercount);
					
					console.log(distance + "km");
					console.log(obj.isGroup);
				}
				localStorage.setItem("event_fresh", "false");
				//alert(obj.token);
			});

}

function Sponsors()
{
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});		
		 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		 $.get("http://www.aktifpenang.com/api/_api_sponsor_get.php", 
			{
				token: mToken
			}, 
			function(result){
				$.mobile.loading("hide");
				//spinner.stop();
				var obj = JSON.parse(result);
				
					/*$sponsor = array(
						'id' => $id,
						'name' => $name,
						'description' => $description,
						'type' => $type,
						'icon' => $icon
					);*/
							
							
				window.localStorage.setItem("aktif_sponsors", result);
				objSponsor = obj;
				var panelMain = $('#SponsorsMain' + '');
				panelMain.empty();
				for(var i = 0; i < objSponsor.sponsor.length; i++) {
					var obj = objSponsor.sponsor[i];
					var distance = obj.totaldistance;
					distance = distance / 1000.0;
					distance = Math.round(distance * 100) / 100;
					var html = '<div id="sponsorinfo-'+ obj.id + '" class="evtSponsor" style="float:left;width:100%;margin-top:10px;"><div style="display:block;margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(\'http://www.aktifpenang.com/' + obj.icon + '\');border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div>'+
								'<div style="float:left;width:60%;margin-left:20px;"><span id="">' + obj.name + '</span></br><span id="" style="font-size:14px;color:#888;">' + obj.description + '</span></br><span id="" style="font-size:14px;color:#888;">Type: ' + obj.type + '</span></div>';
								
					
					html = html + '</div>';
					
					
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					console.log(obj.name);
					console.log(obj.tagline);
					console.log(obj.membercount);
					
					console.log(distance + "km");
					console.log(obj.isGroup);
				}
				//localStorage.setItem("event_fresh", "false");
				//alert(obj.token);
			});

}

function Groups()
{
	//var toAdd = document.getElementById('groupsPage');
	//var left = window.innerWidth/2 - 20;
	//opts.left = left + 'px';
	//spinner = new Spinner(opts).spin(toAdd);	
		$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});		
		 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		 $.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				groupid: ''
			}, 
			function(result){
				$.mobile.loading("hide");
				//spinner.stop();
				var obj = JSON.parse(result);
				
					/*'id' => $id,
							'name' => $name,
							'tagline' => $tagline,
							'group_image' => $group_image,
							'group_icon' => $group_icon,
							'membercount' => $member,
							'totaldistance' => $totaldistance,
							'isGroup' => $isGroup,*/
							
							
				window.localStorage.setItem("aktif_Groups", result);
				objGroup = obj;
				var panelMain = $('#GroupMain' + '');
				panelMain.empty();
				for(var i = 0; i < objGroup.group.length; i++) {
					var obj = objGroup.group[i];
					var distance = obj.totaldistance;
					distance = distance / 1000.0;
					distance = Math.round(distance * 100) / 100;
					var html = '<div id="groupinfo-'+ obj.id + '" class="evtGroup" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(\'http://www.aktifpenang.com/group_images/' + obj.group_icon + '\');border-radius: 30px;width: 60px;height: 60px;float:left;background-size:contain;"></div>'+
								'<div style="float:left;width:60%;"><span id="">' + obj.name + '</span></br><span id="" style="font-size:14px;color:#555;">' + obj.tagline + '</span></br><span id="" style="font-size:14px;color:#888;">' + obj.membercount + 'members | ' +  distance + 'km</span></div>';
								
					if(obj.isGroup != "0")
					{
						html = html + '<div style="margin-left:0px;margin-bottom:0px;margin-right:0px;background-image:url(images/icons/tick.png);border-radius: 15px;width: 30px;height: 30px;float:right;background-size:contain;"></div>';
					}
					html = html + '</div>';
					
					
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					console.log(obj.name);
					console.log(obj.tagline);
					console.log(obj.membercount);
					
					console.log(distance + "km");
					console.log(obj.isGroup);
				}
				localStorage.setItem("group_fresh", "false");
				//alert(obj.token);
			});

}

function Runs(mRunid)
{
	var RefreshRun = localStorage.getItem("run_fresh");
	alert(RefreshRun);
	if(RefreshRun == "true" || RefreshRun == "")
	{
		mRetrieveRun = true;
		SyncToServer();
		
	}
	else
	{
		try
		{
			var panelMain = $('#HistoryMain' + '');
			panelMain.empty();
			var result = window.localStorage.getItem("aktif_runHistory_Individual")
			var objGroup = JSON.parse(result);
			for(var i = 0; i < objGroup.length; i++) {
				var obj = objGroup[i];
				LoadRun(obj, false);
			}
		}
		catch(err)
		{
			localStorage.setItem("run_fresh", "true")
		}
	}
	localStorage.setItem("run_fresh", "false");
}

function addFirstRun()
{
	nextToken = 0;
	//var toAdd = document.getElementById('historyPage');
	//var left = window.innerWidth/2 - 20;
	//opts.left = left + 'px';
	//spinner = new Spinner(opts).spin(toAdd);	
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});		
		
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	$.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
	{
		token: mToken,
		runid: 'all'
	}, 
	function(result){
		$.mobile.loading("hide");
		var obj = JSON.parse(result);
		
		//spinner.stop();
		nextToken = obj.nexttoken;
		TotalRunCount = obj.total;
			/*'activityid' => $id,
				'distance' => $distance,
				'activity_type' => $activity_type,
				'duration' => $duration,
				'avepace' => $avepace,
				'workout_type' => $workout_type,
				'eventid' => $eventid,
				'rundate' => $rundate,
				'checkin_type' => $checkin_type,
				'map' => $_map,
				*/
					
					
		window.localStorage.setItem("aktif_runHistory", result);
		objGroup = obj;
		var panelMain = $('#HistoryMain' + '');
		panelMain.empty();
		window.localStorage.setItem("aktif_runHistory_Individual", "");
		for(var i = 0; i < objGroup.runs.length; i++) {
			var obj = objGroup.runs[i];
			LoadRun(obj, true);
			
			/*
			var current_id = obj.activityid;
			var int_current_id = parseInt(current_id)  + 1;
			window.localStorage.setItem("aktif_nextt_activity_id", int_current_id);	
			
			var strObj = JSON.stringify(obj);
			strObj = strObj.replace("}","");
			strObj = strObj + ',"sync":"yes"}';
			var objStorage = window.localStorage.getItem("aktif_runHistory_Individual");
			if(objStorage == "")
			{
				window.localStorage.setItem("aktif_runHistory_Individual", "[" + strObj);	
			}
			else
			{
				objStorage = objStorage.replace("]", "");
				window.localStorage.setItem("aktif_runHistory_Individual", objStorage + "," +  strObj);
			}
			
			
			var mdistance = parseFloat(obj.distance);
			var munit = "meter";
			if(mdistance > 1000.0)
			{
				mdistance = mdistance / 1000.0;
				munit = "km";
			}
			mdistance = Math.round(mdistance * 100) / 100;
			
			var image = "";
			if(obj.activity_type.toLowerCase() == "running")
			{
				image = "icon_run.png";
			}
			else
			{
				image = "cycling.png";
			}
			
			//var strDate = new Date(obj.rundate.replace(' ', 'T'));
			var strDate = new Date(obj.rundate.replace(/-/g, '/'));
			
			//if(strDate == "Invalid Date")
			//{
			//	strDate = new Date(obj.rundate);
			//}

			//var strDate = new Date(obj.rundate);
			var dd = strDate.getDate(); var mm = strDate.getMonth(); //January is 0! 
			var yyyy = strDate.getFullYear(); 
			
			var ampm = '';
			var hh = strDate.getHours();
			if(hh > 12)
			{
				hh = hh - 12;
				ampm = 'pm';
			}
			else
			{
				ampm = 'am';
			}
			var min = strDate.getMinutes();
			
			
			if(min < 10) min = '0' + min;
			
			
			var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
			'<div style="float:left;width:60%;"><span id="">' + mdistance + munit + '</span></br><span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></br><span id="" style="font-size:14px;color:#888;">' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + ampm + '</span></div></div>';
			panelMain.append(html);
			panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
			
			//console.log(obj.name);
			//console.log(obj.tagline);
			//console.log(obj.membercount);
			
			//console.log(distance + "km");
			//console.log(obj.isGroup);*/
		}
		var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual");
		window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
		
		//alert(obj.token);
	});
}

function addMoreRun(page) {
	if(nextToken < TotalRunCount)
	{
		$.mobile.loading("show", {
			text: "loading more..",
			textVisible: true,
			theme: "b"
		});
		 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
			 $.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				nexttoken: nextToken,
				runid: 'all'
			}, 
			function(result){
				$.mobile.loading("hide");
				var obj = JSON.parse(result);
				nextToken = obj.nexttoken;
				TotalRunCount = obj.total;
				//spinner.stop();
					/*'activityid' => $id,
						'distance' => $distance,
						'activity_type' => $activity_type,
						'duration' => $duration,
						'avepace' => $avepace,
						'workout_type' => $workout_type,
						'eventid' => $eventid,
						'rundate' => $rundate,
						'checkin_type' => $checkin_type,
						'map' => $_map,
						*/
							
							
				window.localStorage.setItem("aktif_runHistory", result);
				objGroup = obj;
				var panelMain = $('#HistoryMain' + '');
				//panelMain.empty();
				for(var i = 0; i < objGroup.runs.length; i++) {
					var obj = objGroup.runs[i];
					
					
					
					var strObj = JSON.stringify(obj);
					strObj = strObj.replace("}","");
					strObj = strObj + ',"sync":"yes"}';
					var objStorage =  window.localStorage.getItem("aktif_runHistory_Individual");
					if(objStorage == ""  || objStorage == null)
					{
						window.localStorage.setItem("aktif_runHistory_Individual", "[" + strObj);	
					}
					else
					{
						objStorage = objStorage.replace("]", "");
						window.localStorage.setItem("aktif_runHistory_Individual", objStorage + "," +  strObj);
					}
					
					
					
					var mdistance = parseFloat(obj.distance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					
					var image = "";
					if(obj.activity_type.toLowerCase() == "running")
					{
						image = "icon_run.png";
					}
					else
					{
						image = "cycling.png";
					}
					
					//var strDate = new Date(obj.rundate.replace(' ', 'T'));
					var strDate = new Date(obj.rundate.replace(/-/g, '/'));
					
					//if(strDate == "Invalid Date")
					//{
					//	strDate = new Date(obj.rundate);
					//}
	
					//var strDate = new Date(obj.rundate);
					var dd = strDate.getDate();
					var mm = strDate.getMonth(); //January is 0! 
					var yyyy = strDate.getFullYear(); 
					if(CurrentLoadingMonth != mm)
					{
						CurrentLoadingMonth = mm;
						var htmlMonth = '<div id="Group-' + CurrentLoadingMonth + '" class="" style="float:left;width:100%;margin-top:0px;height:40px;background-color:#000;"><p style="float:left;padding-left:1em;font-size:1.3em;color:#ccc;line-height:2em;height:100%;margin:0;">'+ monthNames[CurrentLoadingMonth]  + ' ' + yyyy + '</p></div>';
						panelMain.append(htmlMonth);
						//panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
					}
									var ampm = '';
					var hh = strDate.getHours();
					if(hh >= 12)
					{
						if(hh > 12)
						{
							hh = hh - 12;
						}
						ampm = 'pm';
					}
					else
					{
						ampm = 'am';
					}
					var min = strDate.getMinutes();
					
					
					if(min < 10) min = '0' + min;
					
					
					//var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					//'<div style="float:left;width:60%;"><span id="">' + mdistance + munit + '</span></br><span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></br><span id="" style="font-size:14px;color:#888;">' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + ampm + '</span></div></div>';
					var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;">' + 
					'<div style="position:relative;">' + 
					'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:left;"></div><span id="" style="color:#E51919;font-size:1.8em;">' + mdistance + munit + '</span></div>' + 
					'<div style="position:relative;">' + 
					'<div style="width:20px;height:20px;background-size:cover;background-image:url(images/icons/icon_time.png);float:left;"></div>' + 
					'<span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></div>' + 
					'<div style="position:relative;">' + 
					'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
					'<span id="" style="font-size:14px;color:#888;">' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + ampm + '</span></div></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
					
				}
				var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual");
				window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
				
				//alert(obj.token);
			});
	}
}

var CurrentLoadingMonth = 0;

function LoadRun(obj, saveStorage)
{
	var panelMain = $('#HistoryMain' + '');
	var current_id = obj.activityid;
	if(saveStorage == true)
	{
		var int_current_id = parseInt(current_id)  + 1;
		window.localStorage.setItem("aktif_nextt_activity_id", int_current_id);	
		
		var strObj = JSON.stringify(obj);
		strObj = strObj.replace("}","");
		strObj = strObj + ',"sync":"yes"}';
		var objStorage =  window.localStorage.getItem("aktif_runHistory_Individual");
		if(objStorage == ""  || objStorage == null)
		{
			window.localStorage.setItem("aktif_runHistory_Individual", "[" + strObj);	
		}
		else
		{
			objStorage = objStorage.replace("]", "");
			window.localStorage.setItem("aktif_runHistory_Individual", objStorage + "," +  strObj);
		}
	}
	
	var mdistance = parseFloat(obj.distance);
	var munit = "meter";
	if(mdistance > 1000.0)
	{
		mdistance = mdistance / 1000.0;
		munit = "km";
	}
	mdistance = Math.round(mdistance * 100) / 100;
	
	var image = "";
	if(obj.activity_type.toLowerCase() == "running")
	{
		image = "icon_run.png";
	}
	else if(obj.activity_type.toLowerCase() == "walking")
	{
		image = "walking.png";
	}
	else
	{
		image = "cycling.png";
	}
	
	//var strDate = new Date(obj.rundate.replace(' ', 'T'));
	var strDate = new Date(obj.rundate.replace(/-/g, '/'));
	
	//if(strDate == "Invalid Date")
	//{
	//	strDate = new Date(obj.rundate);
	//}

	//var strDate = new Date(obj.rundate);
	var dd = strDate.getDate(); 
	var mm = strDate.getMonth(); //January is 0! 
	var yyyy = strDate.getFullYear(); 
	
	if(CurrentLoadingMonth != mm)
	{
		CurrentLoadingMonth = mm;
		var htmlMonth = '<div id="Group-' + CurrentLoadingMonth + '" class="" style="float:left;width:100%;margin-top:0px;height:40px;background-color:#000;"><p style="float:left;padding-left:1em;font-size:1.3em;color:#ccc;line-height:2em;height:100%;margin:0;">'+ monthNames[CurrentLoadingMonth]  + ' ' + yyyy + '</p></div>';
		panelMain.append(htmlMonth);
		//panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
	
	}
	
	var ampm = '';
	var hh = strDate.getHours();
	if(hh >= 12)
	{
		if(hh > 12)
		{
			hh = hh - 12;
		}
		ampm = 'pm';
	}
	else
	{
		ampm = 'am';
	}
	var min = strDate.getMinutes();
	
	
	if(min < 10) min = '0' + min;
	
	
	var html = '<div id="Historyinfo-' + obj.activityid + '" class="evtHistory" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icons/' + image + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
	'<div style="float:left;width:60%;">' + 
	'<div style="position:relative;">' + 
	'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:left;"></div><span id="" style="color:#E51919;font-size:1.8em;">' + mdistance + munit + '</span></div>' + 
	'<div style="position:relative;">' + 
	'<div style="width:20px;height:20px;background-size:cover;background-image:url(images/icons/icon_time.png);float:left;"></div>' + 
	'<span id="" style="font-size:14px;color:#888;">Duration: ' + obj.duration + '</span></div>' + 
	'<div style="position:relative;">' + 
	'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
	'<span id="" style="font-size:14px;color:#888;">' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + ampm + '</span></div></div></div>';
	panelMain.append(html);
	panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
	
	//console.log(obj.name);
	//console.log(obj.tagline);
	//console.log(obj.membercount);
	
	//console.log(distance + "km");
	//console.log(obj.isGroup);
}

function sharemyrun()
{
	try{
		//window.plugins.socialsharing.share('Message and subject', 'The subject');
		//alert(localStorage.getItem("CurrentRun_Map"));
		//window.plugins.socialsharing.share('I have completed ' + localStorage.getItem("CurrentRun_Distance") + ' via AktifPenang! Come join me!', null, localStorage.getItem("CurrentRun_Map"), 'http://www.aktifpenang.com');
		//data:image/png;base64,R0lGODlhDAAMALMBAP8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUKAAEALAAAAAAMAAwAQAQZMMhJK7iY4p3nlZ8XgmNlnibXdVqolmhcRQA7
	
		
		 html2canvas($("#runMapPanel"), {
			onrendered: function(canvas) {
				//theCanvas = canvas;
				//document.body.appendChild(canvas);
				//var canvasNew = document.createElement('CANVAS');
				try
				{
					var img = new Image();
					img.crossOrigin = 'Anonymous';
					img.onload = function(){
						try
						{
							var canvasImg = document.createElement('CANVAS');
							canvasImg.setAttribute("id", "CANVASDiv");
							document.body.appendChild(canvasImg);
							//document.getElementById("runMapShare").appendChild(canvasImg);
							ctx = canvasImg.getContext('2d');
							canvasImg.height = this.height;
							canvasImg.width = this.width;
							ctx.drawImage(this, 0, 0);
							
							var img=document.getElementById("imgMap");
							img.crossOrigin = 'Anonymous';
							//ctx.drawImage(img,10,10);
							ctx.drawImage(img,30,200,img.width * 0.9, img.height * 0.9);
							//var base64ImgDiv = canvasImg.toDataURL();
							//alert(base64Img);
							 html2canvas($("#CANVASDiv"), {
								onrendered: function(canvas2) {
									var base64ImgDiv = canvas2.toDataURL();
									//alert(base64ImgDiv);
									//document.getElementById("runMapShare").innerHTML ="";
									//var list = document.getElementById("CANVASDiv")[0];   // Get the <ul> element with id="myList"
									//document.body.removeChild(list); 
									document.body.removeChild(canvasImg);
									try{
										var mD = localStorage.getItem("CurrentRun_Distance");
										var mdblD = parseFloat(mD);
										if(mdblD > 1000.0)
										{
											var d = mdblD / 1000.0;
											mdistance = (Math.round(d * 100) / 100) + "km";
											
										}
										else
										{
											mdistance = (Math.round(mdblD * 100) / 100) + "meter";
											
										}
										//alert(mdistance);
										window.plugins.socialsharing.share("I have completed " + mdistance + " via AktifPenang! Come join me!", "", base64ImgDiv, "http://www.aktifpenang.com");
									}
									catch(err)
									{
										alert(err);
									}
								}
							});
						}
						catch(err)
						{
							alert(err);
						}
					};
				}
				catch(err)
				{
					alert(err);
				}
				var dataURL_1 = canvas.toDataURL();
				//alert(dataURL_1);
				img.src = dataURL_1;
	
				/*var ctx=canvas.getContext("2d");
				var img=document.getElementById("imgMap");
				img.crossOrigin = 'Anonymous';
				
				ctx.drawImage(img,30,200,img.width * 0.9, img.height * 0.9);
			
				var base64ImgDiv = canvas.toDataURL();
				//alert(base64Img);
				
				window.plugins.socialsharing.share("I have completed " + localStorage.getItem("CurrentRun_Distance") + " via AktifPenang! Come join me!", "", base64ImgDiv, "http://www.aktifpenang.com");
				*/
			}
		});
	
		//var base64 = getBase64Image(document.getElementById("divMap"));
		
		
		/*convertImgToBase64URL(localStorage.getItem("CurrentRun_Map"), function(base64Img){
			//alert(base64Img);
			window.plugins.socialsharing.share("I have completed " + localStorage.getItem("CurrentRun_Distance") + " via AktifPenang! Come join me!", "", base64Img, "http://www.aktifpenang.com");

		});*/
		
	}
	catch(err)
	{
		alert(err);
	}
	//navigator.share("My Run","Join me on Aktif Penang and raise fund!","");
}

function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function Logout()
{
	$.mobile.loading("show", {
			text: "Loging Out..",
			textVisible: true,
			theme: "b"
		});
	window.localStorage.clear();
	//location.hash = "#LoginPage";
	var url = "index.html";
	var win = window.open(url, '_self');
}

function UserProfile()
{
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.get("http://www.aktifpenang.com/api/_api_userprofile.php", 
		{
			token: mToken
		}, 
		function(result){
			//$("span").html(result);
			var obj = JSON.parse(result);
			
				/*
				'lastname' => $lastname,
				'firstname' => $firstname,
				'shortname' => $shortname,
				'userimage' => $userimage,
				'dob' => $dob,
				'height' => $height,
				'weight' => $weight,
				'contact' => $contact,
				'email' => $email,
				'notification' => $notification,
				'gender' => $gender,
*/		
			try
			{
				
				
				window.localStorage.setItem("userprofie_lastname", obj.userprofile[0].lastname);
				window.localStorage.setItem("userprofie_firstname", obj.userprofile[0].firstname);
				window.localStorage.setItem("userprofie_shortname", obj.userprofile[0].shortname);
				window.localStorage.setItem("userprofie_userimage", obj.userprofile[0].userimage);
				window.localStorage.setItem("userprofie_dob", obj.userprofile[0].dob);
				window.localStorage.setItem("userprofie_height", obj.userprofile[0].height);
				window.localStorage.setItem("userprofie_weight", obj.userprofile[0].weight);
				window.localStorage.setItem("userprofie_gender", obj.userprofile[0].gender);
				
				//alert(obj.token);
				displayUserProfile();
				
				if(obj.userprofile[0].weight == null)
				{
					if(navigator.notification)
					{
						navigator.notification.alert(
							'Please fill up your profile.',
							function() {},
							'Run',
							'OK'
						);
					}
					else
					{
						alert("Please fill up your profile.");
					}
					location.hash = "#EditProfilePage";
				}
				
			}
			catch(err)
			{
				//alert(arr);
			}
		});
	
}

function displayUserProfile()
{
	var mLoginType = window.localStorage.getItem("LoginType");
	if(mLoginType ==  "facebook")
	{
		imageURL = "https://graph.facebook.com/" + window.localStorage.getItem("userid") + "/picture?type=large";
		$("#profileImage").css({'background-image':'url('+imageURL+')'});
		//hide change password button
		$("#userprofile_changepassword").hide();
	}
	else
	{
		$("#userprofile_changepassword").show();
	}
	/*var lastname = window.localStorage.getItem("userprofie_lastname");
	var firstname = window.localStorage.getItem("userprofie_firstname");
	var shortname = window.localStorage.getItem("userprofie_shortname");
	var dob = window.localStorage.getItem("userprofie_dob");
	var height = window.localStorage.getItem("userprofie_height");
	var weight = window.localStorage.getItem("userprofie_weight");
	var gender = window.localStorage.getItem("userprofie_gender");*/

	var totalpost = window.localStorage.getItem("totalpost");
	var totalassigned = window.localStorage.getItem("totalassigned");
	var totalclosed = window.localStorage.getItem("totalclosed");
	var userpost = window.localStorage.getItem("userpost");
	var userassigned = window.localStorage.getItem("userassigned");
	var userclosed = window.localStorage.getItem("userclosed");
	var lastpost = window.localStorage.getItem("lastpost");
	var TotalEvents = window.localStorage.getItem("TotalEvents");
    var shortName = window.localStorage.getItem("shortname");
	
	var displayname = window.localStorage.getItem("displayname");
	
	$("#userprofie_displayname").html("" + displayname + "" );
	$("#userprofie_height").html("Your Total Posts: " + userpost + "" + "" );
	$("#userprofie_weight").html("Total Closed: " + userclosed + "" + "" );
	$("#userprofie_gender").html("In Progress: " + userassigned + " " + "" );
	$("#userprofie_dob").html("Last Posted: " + lastpost + " " + "" );

	
}

function openFB()
{
	window.open("https://www.facebook.com/AktifPenang", '_system');
}

function showSettings()
{
	var Accuracy = window.localStorage.getItem("setting_accuracy");
	var Notification = window.localStorage.getItem("setting_notification");
	
	$("#trackAccuracy").val(Accuracy);
	$("#notification").val(Notification);
}


function saveSettigs()
{
	var Accuracy = $("#trackAccuracy").val();
	var Notification = $("#notification").val();
	
	window.localStorage.setItem("setting_accuracy", Accuracy);
	window.localStorage.setItem("setting_notification", Notification);
	
	window.history.back();
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function displayeditProfile()
{
	var lastname = window.localStorage.getItem("userprofie_lastname");
	var firstname = window.localStorage.getItem("userprofie_firstname");
	var shortname = window.localStorage.getItem("userprofie_shortname");
	var dob = window.localStorage.getItem("userprofie_dob");
	var height = window.localStorage.getItem("userprofie_height");
	var weight = window.localStorage.getItem("userprofie_weight");
	var gender = window.localStorage.getItem("userprofie_gender");

	var res = dob.split("-");
	//var dt = new Date(res[2]+"-"+res[1]+"-"+res[0]);
	var dt_new = pad(parseInt(res[2]))+"-"+pad(parseInt(res[1]))+"-"+pad(parseInt(res[0]));
	var dt = new Date();
	$("#fname").val("" + firstname + "" );
	$("#lname").val("" + lastname + "" );
	$("#displayname").val("" + shortname + "" );
	$("#height").val("" + height + "" + "" );
	$("#weight").val("" + weight + "" + "" );
	$("#gender").val(gender);
	//var element = document.getElementById('gender');
	//element.value = gender;
	var v;
	if(gender == "M")
	{
		v = "Male";
	}
	else
	{
		v = "Female";
	}
	//$("#gender option[value='" + gender + "']").attr("selected",true);
	
	 /*for(var i=0; i < element.options.length; i++)
	  {
		//var v = element.options[i].value;
		if(element.options[i].value === gender) {
		  element.selectedIndex = i;
		  break;
		}
	  }*/
	//document.getElementById("myGender").innerHTML = v;  
   
	//document.getElementById('DOB').value = dt_new;
	//var a = document.getElementById('DOB').value;
	$("#DOB").val(dt_new);//'1988-8-15');//'2013-12-31');
	//var s = $("#DOB").val();
}

function editProfile()
{
	var element = document.getElementById('gender');
	var vgender = element.value;
	if(vgender == "")
	{
		vgender = "M";
	}
	
	var element = document.getElementById('fname');
	var vfname = element.value;
	
	var element = document.getElementById('lname');
	var vlname = element.value;
	
	var element = document.getElementById('displayname');
	var vdisplayname = element.value;
	
	var element = document.getElementById('height');
	var vheight = element.value;
	
	var element = document.getElementById('weight');
	var vweight = element.value;
	
	var element = document.getElementById('DOB');
	var vDOB = element.value;
	var res = vDOB.split("-");
	//var dt = new Date(res[2]+"-"+res[1]+"-"+res[0]);
	
	var dt_new = pad(parseInt(res[2]))+"-"+pad(parseInt(res[1]))+"-"+pad(parseInt(res[0]));
	
	/*  nameValuePairs.add(new BasicNameValuePair("token",  params[0]));
	              nameValuePairs.add(new BasicNameValuePair("lastname",  params[1]));
	              nameValuePairs.add(new BasicNameValuePair("firstname",  params[2]));
	              nameValuePairs.add(new BasicNameValuePair("shortname",  params[3]));
	              nameValuePairs.add(new BasicNameValuePair("dob",  params[4]));
	              nameValuePairs.add(new BasicNameValuePair("height",  params[5]));
	              nameValuePairs.add(new BasicNameValuePair("weight",  params[6]));
	              nameValuePairs.add(new BasicNameValuePair("contact",  params[7]));
	              nameValuePairs.add(new BasicNameValuePair("email",  params[8]));
	              nameValuePairs.add(new BasicNameValuePair("notification",  params[9]));
	              nameValuePairs.add(new BasicNameValuePair("gender",  params[10]));
	              nameValuePairs.add(new BasicNameValuePair("userimage",  params[11]));
		*/
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.post("http://www.aktifpenang.com/api/_api_userprofile.php", 
	 {
		token: mToken,
		lastname: vlname, 
		firstname:vfname,
		shortname:vdisplayname,
		dob:dt_new,
		height:vheight,
		weight:vweight,
		contact:'',
		email:'',
		notification:'',
		gender:vgender,
		userimage:''
		
	}, function(result){
        //$("span").html(result);
		 $.mobile.loading("hide");
		var obj = JSON.parse(result);
		//window.localStorage.getItem('BetterIpoh_AccessTokenV2')
		if(obj.status == true)
		{
			window.localStorage.setItem("userprofie_lastname", vlname);
			window.localStorage.setItem("userprofie_firstname", vfname);
			window.localStorage.setItem("userprofie_shortname", vdisplayname);
			window.localStorage.setItem("userprofie_userimage", '');
			window.localStorage.setItem("userprofie_dob", dt_new);
			window.localStorage.setItem("userprofie_height", vheight);
			window.localStorage.setItem("userprofie_weight", vweight);
			window.localStorage.setItem("userprofie_gender", vgender);
			pressBackButton();
			//history.go(-1);
			//window.localStorage.setItem("BetterIpoh_AccessTokenV2", obj.token);
			//var url = "main1.html";
			//var win = window.open(url, '_self');
			
		}
		else
		{
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error updating your profile. Please try again.',
					function() {},
					'Edit Profile',
					'OK'
				);
			}
			else
			{
				alert("Error Updating Your Profile. Please Try Again.");
			}
		}
		//alert(obj.token);
    });
	
}

/*function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
		
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}*/

function StartRun()
{

	//callbackFn("a", 200);
	TotalCalories = 0.0;
	TotalDistance = 20.0;
	LocationCount = 0;
	LocationCount_Total = 0;
	LocationCount_background = 0;
	LastPosition = "";
	LocationTimeStamp = 0;
	localStorage.setItem("CurrentRun_LastPosition", LastPosition);
	
	//$("#distance").val(TotalDistance);
	//$("#calories").val("- -");
	document.getElementById("distance").innerHTML = TotalDistance;
	document.getElementById("calories").innerHTML = "- -";
	
	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")");
	
	//Store activity type
	var mActivity = mActivityType;//$("#activity").val();
	localStorage.setItem("CurrentRun_Activity", mActivity);
	localStorage.setItem("CurrentRun_Date", new Date());
	

	//set button color to red 
	/*$("#btnStart").css({'display':'none'});
	$("#btnStop").css({'display':'block'});
	$("#btnCancel").css({'display':'block'});*/
	
	$("#RunSectionDiv").css({'display':'none'});
	$("#DuringRunDiv").css({'display':'block'});
	
	//disable selection 
	document.getElementById('activity').disabled = true;
	
	//set mcurrent run to emty
	localStorage.setItem("CurrentRun", "");
	localStorage.setItem("IsStartRun", "true");
	
	//start timer
	startDuration();
	
	//start location updates
	getLocationUpdate();
	try
	{
		//window.plugins.backgroundGeoLocation.stop();
	}
	catch(err)
	{
	
	}
	try
	{
		//configureBackgroundGeoLocation();
	}
	catch(err)
	{
		//alert(err);
	}
	
	
	try
	{
		/*cordova.plugins.notification.local.hasPermission(function (granted) {
			if(granted == false)
			{
				cordova.plugins.notification.local.registerPermission(function (granted) {
                   // alert(granted ? 'Yes' : 'No');
                });
			}
		});
		
		cordova.plugins.notification.local.schedule({
			id: 1,
			text: "You started RUN. Click here to return to AktifPenang App" 
		});*/
		
	}
	catch(err)
	{
		//alert(err);
	}
	
}

function CancelRun()
{
	try
	{
		/*cordova.plugins.notification.local.clear(1, function () {
                    cordova.plugins.notification.local.getIds(function (ids) {
						//alert('IDs: ' + ids.join(' ,'));
					});
                });*/
	}
	catch(err)
	{
		//alert(err);
	}
	//set button color to red 
	/*$("#btnStart").css({'display':'block'});
	$("#btnStop").css({'display':'none'});
	$("#btnCancel").css({'display':'none'});*/
	
	$("#RunSectionDiv").css({'display':'block'});
	$("#DuringRunDiv").css({'display':'none'});
	
	document.getElementById('activity').disabled = false;
	//sttop timer
	stopDuration();
	
	//store duration 
	$("#stopwatch").val("00:00:00");
	$("#distance").val("0.0");
	$("#calories").val("- -");
	
	
	localStorage.setItem("CurrentRun_Duration", "");
	
	//store distance
	localStorage.setItem("CurrentRun_Distance", "");
	
	//store colaries 
	localStorage.setItem("CurrentRun_Calories", "");
	
	//stop location updates
	stopLocationWatch();
	try
	{
		//window.plugins.backgroundGeoLocation.stop();
	}
	catch(err)
	{
	
	}

	localStorage.setItem("CurrentRun_Date", "");
	localStorage.setItem("CurrentRun_Map", "");
	localStorage.setItem("IsStartRun", "false");
}

function StopRun(error_str)
{
	//$("#startandstopbutton").val("Start My Run");
	//document.getElementById('btnStartStop').innerHTML = "Start My Run";
	try
	{
		/*cordova.plugins.notification.local.clear(1, function () {
                    cordova.plugins.notification.local.getIds(function (ids) {
						//alert('IDs: ' + ids.join(' ,'));
					});
                });*/
	}
	catch(err)
	{
		//alert(err);
	}
	//set button color to red 
	/*$("#btnStart").css({'display':'block'});
	$("#btnStop").css({'display':'none'});
	$("#btnCancel").css({'display':'none'});*/
	
	$("#RunSectionDiv").css({'display':'block'});
	$("#DuringRunDiv").css({'display':'none'});
	
	document.getElementById('activity').disabled = false;
	//sttop timer
	stopDuration();
	
	//store duration 
	//var mDuration = $("#stopwatch").val();
	var mDuration = document.getElementById("stopwatch").innerHTML;
	localStorage.setItem("CurrentRun_Duration", mDuration);
	
	//store distance
	localStorage.setItem("CurrentRun_Distance", TotalDistance);
	
	//store colaries 
	localStorage.setItem("CurrentRun_Calories", TotalCalories);
	
	//stop location updates
	stopLocationWatch();
	try
	{
		//window.plugins.backgroundGeoLocation.stop();
	}
	catch(err)
	{
	
	}

	
	var today = new Date();
	var dd = today.getDate(); if(dd < 10) dd = '0' + dd;
	var mm = today.getMonth()+1; if(mm < 10) mm = '0' + mm;
	var yyyy = today.getFullYear();
	
	var min = today.getMinutes(); if(min < 10) min = '0' + min;
	var hour = today.getHours(); if(hour < 10) hour = '0' + hour;
	var sec = today.getSeconds(); if(sec < 10) sec = '0' + sec;
	
	var runDate = yyyy + "-" + mm + "-" + dd + " " + hour + ":" + hour + ":" + sec;
	localStorage.setItem("CurrentRun_Date", runDate);
	
	//convert coordinates to static image url
	var mMapURL = getMapURL();
	//alert(mMapURL);
	localStorage.setItem("CurrentRun_Map", mMapURL);
	
	if(error_str == "")
	{
		if(TotalDistance > 0.0)
		{
			//encode path 
			
			var mActivity = localStorage.getItem("CurrentRun_Activity");
			
			var current_id = window.localStorage.getItem("aktif_nextt_activity_id");
			var int_current_id = 0;
			if(current_id == "" || current_id == null)
			{
				int_current_id = 1;
				current_id = 1;
			}
			else
			{
				int_current_id = parseInt(current_id)  + 1;
			}
			window.localStorage.setItem("aktif_nextt_activity_id", int_current_id);	
			var strNewMap = "RunMap_" + current_id;		
			window.localStorage.setItem(strNewMap, mMapURL);				
			var strNewRun = '{"activityid":"' + current_id + '","distance":"' + TotalDistance + '","activity_type":"' + mActivity + '","duration":"' + mDuration + '","avepace":"","workout_type":"Free Run","eventid":"","rundate":"' + runDate + '","checkin_type":"live","map":"'+ strNewMap + '","calories":"' + TotalCalories + '","sync":"no"}';
			
			
			
			var objStorage =  window.localStorage.getItem("aktif_runHistory_Individual");
			if(objStorage == "" || objStorage == null)
			{
				window.localStorage.setItem("aktif_runHistory_Individual", "[" + strNewRun + "]");	
			}
			else
			{
				objStorage = objStorage.replace("[", "");
				window.localStorage.setItem("aktif_runHistory_Individual", "[" + strNewRun + "," + objStorage);
			}
			
			async(function() {
				SynctoDB(current_id);	
			}, null);

			
			//set mcurrent run to emty
			//localStorage.setItem("run_fresh", "true");
			location.hash = "#runMap";
		}
		else
		{
			//SynctoDB();
			//location.hash = "#runMap";
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Distance need to be more than 0.0 meter as valid run.',
					function() {},
					'Run',
					'OK'
				);
			}
			else
			{
				alert("Distance need to be more than 0.0 meter as valid run.");
			}
		}
	}
	else
	{
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Error Starting Run: ' + error_str,
				function() {},
				'Run',
				'OK'
			);
		}
		else
		{
			alert('Error Starting Run: ' + error_str);
		}
	}
	localStorage.setItem("IsStartRun", "false");
			
}

function UpdateNotification()
{
	//TestCount = TestCount + 1;
	try{
		/*cordova.plugins.notification.local.schedule({
			id: 1,
			text: "You started RUN. Click here to return to AktifPenang App" 
		});*/
	}
	catch(err)
	{
	
	}
}
	
function showDialogPost(id)
{
	$("#dialogPostContent").empty();
	$("#overlay").css({'display':'block'});
	$("#dialogPostContent").css({'display':'block'});
	$.mobile.loading("show", {
		text: "Please Wait..",
		textVisible: true,
		theme: "b"
	});		
		
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	$.get("http://www.betteripoh.com/api/api_get_post.php", 
	{
		token: mToken,
		userid: '',
		postid: showingCurrentPost
	}, 
	function(result){
		$.mobile.loading("hide");
		var obj = JSON.parse(result).posts[0];
		$("#dialogPostContent").empty();
		
		var complaint_id = obj.complaintid;
		if(complaint_id != "")
		{
			var intcomplaint_id = parseInt(complaint_id) - 1;
			if(intcomplaint_id == -1)
			{
				image = arrComplaintTypeIcon[arrComplaintTitle.length - 1] + '.png';
			}
			else
			{
				image = arrComplaintTypeIcon[intcomplaint_id] + '.png';
			}
		}
		else
		{
			image = arrComplaintTypeIcon[arrComplaintTitle.length - 1] + '.png';
		}
		//image = arrComplaintTypeIcon[0] + '.png';
		//document.getElementById("currentDateTime").innerHTML = "" + obj.datetime;
		document.getElementById("iconComplaintTypeDialog").src = 'images/icon_complaint/' + image;
		var left = (mWidth - 450 - 20)/2;
		$("#dialogPostContent").css({'width':'450px'});
		$("#dialogPostContent").css({'margin-left':left+'px'});
		$("#dialogPostContent").css({'max-height': (mHeight - 240)+'px'});
		$("#dialogPostContent").css({'overflow-y': 'scroll'});
		var htmlImage = '';
		var htmlMap = '';
		if(obj.image != '')
		{
			htmlImage = '<div style="float:left;background:url(\'' + obj.image + '\');background-repeat:no-repeat;background-size:cover;width:100%;height:300px;"></div>' ;
		}
		if(obj.longitude != '' && obj.latitude != '')
		{
			
		}
		
		var html = htmlImage +
		//'<div id="Historyinfo-' + obj.postid + '" class="evtHistory clsShadow" style="padding:10px;background-color:#fff;border-style:solid;border-width:1px;border-color:#999;position:relative;float:left;width:' + maxWidth + 'px;'+ maxHeight + 'margin-top:10px;">' + 
		//'<div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icon_complaint/' + image + ');background-color:#45ADA8;border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
		'<span style="height:auto;width:100%;float:left;font-size:1em;color:#fff;margin-top:5px;margin-bottom:5px;background-color:#222;">Tracking ID: ' + obj.trackingid + '<br>Date: ' + obj.datetime + '</span>' +
		'<div style="float:left;width:100%;">' + 
			'<div style="position:relative;float:left;width:100%;">' + 
				'<span id="" style="color:#000;font-size:1.2em;">' + obj.title + '</span>' + 
			'</div>' + 
			'<span id="" style="font-size:1em;color:#888;float:left;">' + obj.description + '</span>' + 
		'</div>'+
		'<div style="position:relative;float:left;width:100%;">' + 
		'<span id="" style="width:60px;font-size:14px;color:#888;float:left;text-align:center;">STATUS:</span>' + 
		'<span id="" style="font-size:12m;;color:#888;float:left;">' + obj.status + '</span></div>' + 
		'<div style="position:relative;float:left;width:100%;">' + 
		'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:left;"></div><span id="" style="color:#000;font-size:1em;">' + obj.address + '</span></div>' + 
		//'<div style="position:relative;float:left;width:100%;">' + 
		//'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
		//'<span id="" style="font-size:14px;color:#888;">' + obj.datetime + '</span></div>' + 
		 
		//'<div style="position:absolute;bottom:0px;float:left;width:' + (maxWidth - 0) +'px;height:1px;margin-left:0%;background-color:#aaa;"></div>'
		'';
		document.getElementById("dialogPostContent").innerHTML = html;
		
		var Updates = "";
		for(var i = 0; i < obj.updates.length; i++) {
			var objUpdate = obj.updates[i];
			//=========== add image (if have) =====================
			var imageUpdate = '';
			if(objUpdate.Image != '')
			{
				imageUpdate = '<div style="margin:5%;width:90%;height:200px;float:left;background-image:url(' + objUpdate.Image + ');background-repeat:no-repeat;background-size:cover;"></div>';
			}
			//=====================================================
			Updates += '<div style="width:100%;float:left;background-color:#ddd;">' + 
							'<span style="padding-left:5%;background-color:#222;width:95%;height:40px;line-height:40px;font-size:1em;color:#fff;float:left;text-transform:uppercase;">STATUS: ' + objUpdate.updatetype + '</span>'+
							'<div style="padding-left:5%;position:relative;float:left;width:95%;">' + 
							'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
							'<span id="" style="font-size:14px;color:#888;">' + objUpdate.datetime + '</span></div>' +
							imageUpdate + 
							'<span style="width:90%;height:auto;font-size:1em;color:#222;float:left;padding-left:5%;">Message: ' + objUpdate.message + '</span>'+
						'</div>';
		}
		document.getElementById("dialogPostContent").innerHTML += Updates;
	});
}
	
function displayMyRun()
{
	$("#PostContent").empty();
	$.mobile.loading("show", {
		text: "Please Wait..",
		textVisible: true,
		theme: "b"
	});		
		
	var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	$.get("http://www.betteripoh.com/api/api_get_post.php", 
	{
		token: mToken,
		userid: '',
		postid: showingCurrentPost
	}, 
	function(result){
		//$.mobile.loading("hide");
		var obj = JSON.parse(result).posts[0];
		$("#PostContent").empty();
		var complaint_id = obj.complaintid;
		if(complaint_id != "")
		{
			var intcomplaint_id = parseInt(complaint_id) - 1;
			if(intcomplaint_id == -1)
			{
				image = arrComplaintTypeIcon[arrComplaintTitle.length - 1] + '.png';
			}
			else
			{
				image = arrComplaintTypeIcon[intcomplaint_id] + '.png';
			}
		}
		else
		{
			image = arrComplaintTypeIcon[arrComplaintTitle.length - 1] + '.png';
		}
		//image = arrComplaintTypeIcon[0] + '.png';
		document.getElementById("currentDateTime").innerHTML = "" + obj.datetime;
		document.getElementById("iconComplaintType").src = 'images/icon_complaint/' + image;
		
		var htmlImage = '';
		var htmlMap = '';
		if(obj.image != '')
		{
			htmlImage = '<div style="float:left;background:url(\'' + obj.image + '\');background-repeat:no-repeat;background-size:cover;width:100%;height:300px;"></div>' ;
		}
		if(obj.longitude != '' && obj.latitude != '')
		{
			
		}
		
		var html = htmlImage +
		//'<div id="Historyinfo-' + obj.postid + '" class="evtHistory clsShadow" style="padding:10px;background-color:#fff;border-style:solid;border-width:1px;border-color:#999;position:relative;float:left;width:' + maxWidth + 'px;'+ maxHeight + 'margin-top:10px;">' + 
		//'<div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(images/icon_complaint/' + image + ');background-color:#45ADA8;border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
		'<span style="height:40px;width:100%;float:left;font-size:1em;color:#fff;margin-top:5px;margin-bottom:5px;background-color:#222;">Tracking ID: ' + obj.trackingid + '</span>' +
		'<div style="float:left;width:100%;">' + 
			'<div style="position:relative;float:left;width:100%;">' + 
				'<span id="" style="color:#000;font-size:1.2em;">' + obj.title + '</span>' + 
			'</div>' + 
			'<span id="" style="font-size:1em;color:#888;float:left;">' + obj.description + '</span>' + 
		'</div>'+
		'<div style="position:relative;float:left;width:100%;">' + 
		'<span id="" style="width:60px;font-size:14px;color:#888;float:left;text-align:center;">STATUS:</span>' + 
		'<span id="" style="font-size:12m;;color:#888;float:left;">' + obj.status + '</span></div>' + 
		'<div style="position:relative;float:left;width:100%;">' + 
		'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_distance.png);float:left;"></div><span id="" style="color:#000;font-size:1em;">' + obj.address + '</span></div>' + 
		//'<div style="position:relative;float:left;width:100%;">' + 
		//'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
		//'<span id="" style="font-size:14px;color:#888;">' + obj.datetime + '</span></div>' + 
		 
		//'<div style="position:absolute;bottom:0px;float:left;width:' + (maxWidth - 0) +'px;height:1px;margin-left:0%;background-color:#aaa;"></div>'
		'';
		document.getElementById("PostContent").innerHTML = html;
		
		var Updates = "";
		for(var i = 0; i < obj.updates.length; i++) {
			var objUpdate = obj.updates[i];
			//=========== add image (if have) =====================
			var imageUpdate = '';
			if(objUpdate.Image != '')
			{
				imageUpdate = '<div style="margin:5%;width:90%;height:200px;float:left;background-image:url(' + objUpdate.Image + ');background-repeat:no-repeat;background-size:cover;"></div>';
			}
			//=====================================================
			Updates += '<div style="width:100%;float:left;background-color:#ddd;">' + 
							'<span style="padding-left:5%;background-color:#222;width:95%;height:40px;line-height:40px;font-size:1em;color:#fff;float:left;text-transform:uppercase;">STATUS: ' + objUpdate.updatetype + '</span>'+
							'<div style="padding-left:5%;position:relative;float:left;width:95%;">' + 
							'<div style="width:25px;height:25px;background-size:cover;background-image:url(images/icons/icon_event.png);float:left;"></div>' + 
							'<span id="" style="font-size:14px;color:#888;">' + objUpdate.datetime + '</span></div>' +
							imageUpdate + 
							'<span style="width:90%;height:auto;font-size:1em;color:#222;float:left;padding-left:5%;">Message: ' + objUpdate.message + '</span>'+
						'</div>';
		}
		document.getElementById("PostContent").innerHTML += Updates;
	});
	return;
	var mActivity = localStorage.getItem("CurrentRun_Activity");
	var mD = localStorage.getItem("CurrentRun_Distance");
	var mDuration = localStorage.getItem("CurrentRun_Duration");
	var mMap = localStorage.getItem("CurrentRun_Map");
	var runDate = localStorage.getItem("CurrentRun_Date");
	var Calories = localStorage.getItem("CurrentRun_Calories");
	
	//alert(runDate);
	$("#divMap").css({'background-image':'none'});
	document.getElementById("imgMap").src = "";
	
	//var strDate = new Date(runDate.replace(' ', 'T'));
	var strDate = new Date(runDate.replace(/-/g, '/'));
	/*if(strDate == "Invalid Date")
	{
		strDate = new Date(runDate);
	}*/
	//alert(strDate);
	var dd = strDate.getDate(); 
	
	var mm = strDate.getMonth(); //January is 0! 
	var yyyy = strDate.getFullYear(); 
	
	var ampm = '';
	var hh = strDate.getHours();
	if(hh >= 12)
	{
		if(hh > 12)
		{
			hh = hh - 12;
		}
		ampm = 'pm';
	}
	else
	{
		ampm = 'am';
	}
	
	var min = strDate.getMinutes();
	if(min < 10) min = '0' + min;

	if(mMap.indexOf("RunMap_") > -1)
	{
		//contain 
		//var strID = mMap.replace("RunMap_", "");
		//var intID = parseInt(strID);
		var strStoredMap = window.localStorage.getItem(mMap);
		mMap = strStoredMap;
	}

	if(mMap == "")
	{
		 var id = localStorage.getItem("CurrentRun_id");
		 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		 $.get("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				runid: id
			}, 
			function(result){
				var obj = JSON.parse(result);
				var strMap = "url('" + obj.runs[0].map + "')";
				//alert(strMap);
				localStorage.setItem("CurrentRun_Map", obj.runs[0].map);
				var myMap = obj.runs[0].map;// + "&key=" + StaticAPI;
				//$("#divMap").css({'background-image':'url('+  myMap +')'});
				var w = window.innerWidth - 40;
				$("#imgMap").css({"width":w});
				$("#imgMap").css({"height":w});
				//$("#imgMap").src = obj.runs[0].map;
				
				document.getElementById("imgMap").src = myMap;
			}
		);
	}
	else
	{
		mMap = mMap;// + "&key=" + StaticAPI;
		//$("#divMap").css({'background-image':'url('+ mMap +')'});
		var w = window.innerWidth - 40;
		$("#imgMap").css({"width":w});
		$("#imgMap").css({"height":w});
		//$("#imgMap").src = obj.runs[0].map;'
		
		document.getElementById("imgMap").src = mMap;
	}
	
	if(mD > 1000.0)
	{
		var d = mD / 1000.0;
		mdistance = Math.round(d * 100) / 100;
		document.getElementById('lblMyRunDistance').innerHTML = "Distance (km):";
		document.getElementById('mapDistance').innerHTML = mdistance;
	}
	else
	{
		mdistance = Math.round(mD * 100) / 100;
		document.getElementById('lblMyRunDistance').innerHTML = "Distance (meter):";
		document.getElementById('mapDistance').innerHTML = mdistance;
	}
			
	
	
	
	//document.getElementById('lblMapDistance').innerHTML = document.getElementById('lbldistance').innerHTML;
	//document.getElementById('mapDistance').innerHTML = mdistance;
	document.getElementById('mapDuration').innerHTML = mDuration;
	document.getElementById('mapRunDate').innerHTML = '' + dd + ' ' + monthNames[mm] + ' ' + yyyy + ' '+ hh + ':' + min + '' + ampm;//runDate;
	document.getElementById('mapCalories').innerHTML = '' + Calories;
	//$("#mapDistance").val(mdistance + "");
	//$("#mapDuration").val(mDuration + "");
	//$("#mapRunDate").val(runDate + "");
}

function displayGroup()
{
	//individualGroupPage
	
	var CurrentGroup_id = localStorage.getItem("CurrentGroup_id");
	var CurrentGroup_Name = localStorage.getItem("CurrentGroup_Name");
	var CurrentGroup_Distance = localStorage.getItem("CurrentGroup_Distance");	
	var CurrentGroup_Image = localStorage.getItem("CurrentGroup_Image");	
	var CurrentGroup_Tagline = localStorage.getItem("CurrentGroup_Tagline");
	var CurrentGroup_Member = localStorage.getItem("CurrentGroup_Member");
			
	$("#groupImage").css({'background-image':'url(http://www.aktifpenang.com/group_images/'+ CurrentGroup_Image +')'});
	
	
	if(CurrentGroup_Distance > 1000.0)
	{
		var d = CurrentGroup_Distance / 1000.0;
		mdistance = Math.round(d * 100) / 100;
		document.getElementById('groupInfo').innerHTML = "Members: " + CurrentGroup_Member + " | " +  mdistance + "km";
	}
	else
	{
		mdistance = Math.round(CurrentGroup_Distance * 100) / 100;
		document.getElementById('groupInfo').innerHTML = "Members: " + CurrentGroup_Member + " | " +  mdistance + "member";
	}

	document.getElementById('groupName').innerHTML = CurrentGroup_Name;
	document.getElementById('groupTagline').innerHTML = CurrentGroup_Tagline;

	//======================================================
	$.mobile.loading("show", {
			text: "Please Wait..",
			textVisible: true,
			theme: "b"
		});		
	 var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
	 $.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				groupid: CurrentGroup_id
			}, 
			function(result){
				$.mobile.loading("hide");
				var obj = JSON.parse(result);
				
				nextToken_GroupMember = obj.nexttoken;
				Total_GroupMemberCount = obj.total;
				
				var objUserlist = obj.userlist;
				var objIsJoined = obj.isGroup;
				if(objIsJoined == "0")
				{
					$('#btnJoinGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').css({'display':'none'});
					$('#btnJoinGroup' + '').val(CurrentGroup_id);
				}
				else
				{
					$('#btnJoinGroup' + '').css({'display':'none'});
					$('#btnLeaveGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').val(CurrentGroup_id);
				}
				var panelMain = $('#groupMembers' + '');
				panelMain.empty();
				for(var i = 0; i < objUserlist.length; i++) {
					var objUser = objUserlist[i];	
					var mdistance = parseFloat(objUser.userdistance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					var imageURL = "";
					if(objUser.username_type == "email")
					{
						imageURL = "images/icons/login.png";
					}
					else
					{
						imageURL = "https://graph.facebook.com/" + objUser.username_id + "/picture?type=large";
					}
					var html = '<div id="Historyinfo-' + objUser.username_id + '" class="" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + objUser.username + '</span></br><span id="" style="font-size:14px;color:#888;">'  + mdistance + munit +  '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
				}
			}
		);
}

function addMoreGroupMember(page)
{
	if(nextToken_GroupMember < Total_GroupMemberCount)
	{
		$.mobile.loading("show", {
			text: "loading more..",
			textVisible: true,
			theme: "b"
		});
		var CurrentGroup_id = localStorage.getItem("CurrentGroup_id");
		var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		$.get("http://www.aktifpenang.com/api/_api_group_get.php", 
			{
				token: mToken,
				nexttoken: nextToken_GroupMember,
				groupid: CurrentGroup_id
			}, 
			function(result){
				var obj = JSON.parse(result);
				
				nextToken_GroupMember = obj.nexttoken;
				Total_GroupMemberCount = obj.total;
				
				var objUserlist = obj.userlist;
				var objIsJoined = obj.isGroup;
				if(objIsJoined == "0")
				{
					$('#btnJoinGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').css({'display':'none'});
					$('#btnJoinGroup' + '').val(CurrentGroup_id);
				}
				else
				{
					$('#btnJoinGroup' + '').css({'display':'none'});
					$('#btnLeaveGroup' + '').css({'display':'block'});
					$('#btnLeaveGroup' + '').val(CurrentGroup_id);
				}
				var panelMain = $('#groupMembers' + '');
				//panelMain.empty();
				for(var i = 0; i < objUserlist.length; i++) {
					var objUser = objUserlist[i];	
					var mdistance = parseFloat(objUser.userdistance);
					var munit = "meter";
					if(mdistance > 1000.0)
					{
						mdistance = mdistance / 1000.0;
						munit = "km";
					}
					mdistance = Math.round(mdistance * 100) / 100;
					var imageURL = "";
					if(objUser.username_type == "email")
					{
						imageURL = "images/icons/login.png";
					}
					else
					{
						imageURL = "https://graph.facebook.com/" + objUser.username_id + "/picture?type=large";
					}
					var html = '<div id="Historyinfo-' + objUser.username_id + '" class="" style="float:left;width:100%;margin-top:10px;"><div style="margin-left:10px;margin-bottom:10px;margin-right:10px;background-image:url(' + imageURL + ');border-radius: 20px;width: 40px;height: 40px;float:left;background-size:contain;"></div>'+
					'<div style="float:left;width:60%;"><span id="">' + objUser.username + '</span></br><span id="" style="font-size:14px;color:#888;">'  + mdistance + munit +  '</span></div></div>';
					panelMain.append(html);
					panelMain.append('<div style="float:left;width:90%;height:1px;margin-left:5%;background-color:#aaa;"></div>');
					
				}
				$.mobile.loading("hide");
			}
		);

	}
}

function SynctoDB(current_runid)
{
	/*  $distance = isset($_POST['distance']) ? $_POST['distance'] : '';
	$activity_type = isset($_POST['activity_type']) ? $_POST['activity_type'] : '';
	$route = isset($_POST['route']) ? $_POST['route'] : '';
	$duration = isset($_POST['duration']) ? $_POST['duration'] : '';
	$avepace = isset($_POST['avepace']) ? $_POST['avepace'] : '';
	$workout_type = isset($_POST['workout_type']) ? $_POST['workout_type'] : '';
	$eventid = isset($_POST['eventid']) ? $_POST['eventid'] : '';
	$rundate = isset($_POST['rundate']) ? $_POST['rundate'] : '';
	$checkin_type = isset($_POST['checkin_type']) ? $_POST['checkin_type'] : '';
	*/
	try{
		var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
		var mActivity = localStorage.getItem("CurrentRun_Activity");
		var mdistance = localStorage.getItem("CurrentRun_Distance");
		var mDuration = localStorage.getItem("CurrentRun_Duration");
		var mTotalCalories = localStorage.getItem("CurrentRun_Calories");
		/*var mCoor = localStorage.getItem("CurrentRun");
		var arrCoor = mCoor.split("|");

		var text = '{ "employees" : [' +
			'{ "firstName":"John" , "lastName":"Doe" },' +
			'{ "firstName":"Anna" , "lastName":"Smith" },' +
			'{ "firstName":"Peter" , "lastName":"Jones" } ]}';
		var coor_json = "";
		
		for(var i = 0; i < arrCoor.length; i++) {
			var co = arrCoor[i];
			var lat = co.split(",")[0];
			var lo = co.split(",")[1];
			if(coor_json == "")
			{
				coor_json = '{"time":"","lat":"'+ lat + '","long":"' + lo + '"}';
			}
			else
			{
				coor_json = coor_json + ',{"time":"","lat":"'+ lat + '","long":"' + lo + '"}';
			}
		}
		coor_json = "[" + coor_json + "]";*/
		var mRoute = getPathEncoded();
		
		var runDate = localStorage.getItem("CurrentRun_Date");
		
		 $.post("http://www.aktifpenang.com/api/_api_usercheckin.php", 
		 {
			token: mToken,
			distance: mdistance, 
			activity_type:mActivity,
			route:mRoute,
			duration: mDuration,
			avepace:'',
			workout_type:'Free Run',
			eventid:'',
			rundate:runDate,
			checkin_type:'live',
			calories: mTotalCalories
			
		}, function(result){
			//$("span").html(result);
			var objResult = JSON.parse(result);
			//window.localStorage.getItem('BetterIpoh_AccessTokenV2')
			//alert(objResult.status);
			if(objResult.status == true)
			{
				//alert("error");
				//insert to run history json and store to localStorage
				window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "");
				var result = window.localStorage.getItem("aktif_runHistory_Individual")
				var objGroup = JSON.parse(result);
				for(var i = 0; i < objGroup.length; i++) {
					var obj = objGroup[i];
					if(obj.activityid == current_runid)
					{
						obj.sync = "yes";
						
					}
					var strObj = JSON.stringify(obj);
		
					var objStorage =  window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
					if(objStorage == ""  || objStorage == null)
					{
						window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
					}
					else
					{
						objStorage = objStorage.replace("]", "");
						window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
					}
				}
				var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
				window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
			}
		});
	}
	catch(err)
	{
		alert("error:" + err);
	}
}

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

function someFunction(a, b, callback) {
    console.log('Hey doing some stuff!');
    callback();
}


function UploadToServer(obj, callback)
{
	if(obj.sync == "no")
	{
		try
		{
			var activity_id = obj.activityid;
			var strNewMap = "RunMap_" + activity_id;
			var mMapURL = window.localStorage.getItem(strNewMap);
		
			var EncodedMap = mMapURL.replace("http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=enc:" ,"");
			
			var mToken = window.localStorage.getItem("BetterIpoh_AccessTokenV2");
			$.post("http://www.aktifpenang.com/api/_api_usercheckin.php", 
			{
				token: mToken,
				distance: obj.distance, 
				activity_type:obj.activity_type,
				route:EncodedMap,
				duration: obj.duration,
				avepace:'',
				workout_type:'Free Run',
				eventid:'',
				rundate:obj.rundate,
				checkin_type:'live',
				calories: obj.calories
				
			}, function(result){
				//$("span").html(result);
				//$.mobile.loading("hide");
					
				var objResult = JSON.parse(result);
				//window.localStorage.getItem('BetterIpoh_AccessTokenV2')
				//alert(obj.status);
				if(objResult.status == true)
				{
					obj.sync = "yes";
					var strObj = JSON.stringify(obj);
						
					var objStorage = window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
					if(objStorage == ""  || objStorage == null)
					{
						window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
					}
					else
					{
						objStorage = objStorage.replace("]", "");
						window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
					}
					window.localStorage.setItem(strNewMap, "");
				}
				else
				{
					var strObj = JSON.stringify(obj);
					
					var objStorage =  window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
					if(objStorage == ""  || objStorage == null)
					{
						window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
					}
					else
					{
						objStorage = objStorage.replace("]", "");
						window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
					}
				}
				callback();
			});
		}
		catch(err)
		{
			callback();
		}
	}
	else
	{
		var strObj = JSON.stringify(obj);
		
		var objStorage = window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
		if(objStorage == ""  || objStorage == null)
		{
			window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "[" + strObj);	
		}
		else
		{
			objStorage = objStorage.replace("]", "");
			window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", objStorage + "," +  strObj);
		}
		//throw 500;
		callback();
	}
}

function SyncToServer()
{
	$.mobile.loading("show", {
			text: "Syncing with server..",
			textVisible: true,
			theme: "b"
		});
		
	window.localStorage.setItem("aktif_runHistory_Individual_BUFFER", "");
	var result = window.localStorage.getItem("aktif_runHistory_Individual")
	//alert(result);
	if(result == "" || result == null)
	{
		$.mobile.loading("hide");
		if(mRetrieveRun == true)
		{
			addFirstRun();
		}
		mRetrieveRun = false;
	}
	else
	{
		try{
			var objGroup = JSON.parse(result);
			//alert(objGroup.length);
			asyncLoop(objGroup.length, function(loop) {
				var obj = objGroup[loop.iteration()];
				UploadToServer(obj, function(result) {

					// log the iteration
					//console.log(loop.iteration());

					// Okay, for cycle could continue
					loop.next();
				})},
				function(){
					var objStorageFinal = "" + window.localStorage.getItem("aktif_runHistory_Individual_BUFFER");
					window.localStorage.setItem("aktif_runHistory_Individual", objStorageFinal + "]");
					$.mobile.loading("hide");
					console.log('cycle ended');
					if(mRetrieveRun == true)
					{
						addFirstRun();
					}
					mRetrieveRun = false;
				}
			);	
		}
		catch(err)
		{
			$.mobile.loading("hide");
			if(navigator.notification)
			{
				navigator.notification.alert(
					'Error Syncing with server: ' + err,
					function() {},
					'Run',
					'OK'
				);
			}
			else
			{
				alert('Error Syncing with server: ' + err);
			}
		}
	}
}

function getPathEncoded()
{
	var arrCoordinates = [];
	//arrCoordinate = mCoordinate.split("|");
	var CurrentRunPath = localStorage.getItem("CurrentRun");//"38.5,-120.2|40.7,-120.95|43.252,-126.453";//localStorage.getItem("CurrentRun");
	var arrCurrentRun = CurrentRunPath.split("|");
	for (var Coor in arrCurrentRun)
	{
		var arrCoor = arrCurrentRun[Coor].split(",");
		var _Coor = [arrCoor[0], arrCoor[1]];
		arrCoordinates.push(_Coor);
	}
	var encoded = polyline.encode(arrCoordinates);//[[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);//
	//encoded = '{l}_@cmecR@Qb@wA~BSjFThFt@rEp@fEh@jF`@hI?`G_ClFgCvDgBzAo@pDqAf@QtCgAz@[rAe@lDqAbDu@lEk@tEwBbAeEj@uEQuGCqGlA{JdAsIbC}FhHdBjGlBhFxAtGfBlGzAtG`AlHRfII|IOnIi@pI{AfHmA`KdAlGbF|F`E~ElDxFhEfHrDbIxAzILzKjApJpCbIhBhI~AvJfBrIxA~IxAzHb@dIL~GrCnFnIzAhKo@bJaBhJyAxGxA~FfFnDzF~CzEtBxBv@hB~@o@zEu@`GOlECdCE~BMtFZtCzAj@YD_A\\';
	return encoded;
	
}

function getMapURL()
{
	//var mCoordinate = localStorage.getItem("CurrentRun");
	var encoded = getPathEncoded();
	
	//loop and append
	var mapURL = "http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=enc:" + encoded;//localStorage.getItem("CurrentRun");
	
	return mapURL;
}

function showMyPosition(position) {
	console.log(position);
	mCurrentLocation =  new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var latlng = new google.maps.LatLng(
                            position.coords.latitude,
                            position.coords.longitude);
        
		if(position.coords.latitude > 100.3529)
		{
			mCheckInFor = "|MPSP|";
		}
		else
		{
			mCheckInFor = "|MPPP|";
		}
								
        var geoCoder = new google.maps.Geocoder();
        geoCoder.geocode({ location: latlng }, displayResults);
}


function displayResults(results, status) {
        // here you can look through results ...
        //$("body").append("<div>").text(results[0].formatted_address);      
		mCurrentAddress = results[0].formatted_address;
		if(mapDone == true)
		{
			map.setCenter(mCurrentLocation);
						marker.setPosition(mCurrentLocation);
						//var geocoder;
						if(!geocoder) {
							geocoder = new google.maps.Geocoder();	
						}
						geocoder.geocode( { 'location': mCurrentLocation}, function(results, status) {
							 if (status == google.maps.GeocoderStatus.OK)
							 {
								varLat = results[0].geometry.location.lat();
								varLng = results[0].geometry.location.lng();
								
								mCheckInPosition = new google.maps.LatLng(varLat,varLng);
								var content = '<strong>' + results[0].formatted_address + '</strong>';
								mCheckInAddress = results[0].formatted_address;
								document.getElementById("eventAddress").value = mCheckInAddress;
								document.getElementById("txtCoordinate").value = varLat + "," + varLng;
								//ClsAddress = content;
								infowindow.setContent(content);
								infowindow.open(map, marker);      
							 }									
						});
		}
    };

function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude + 
    //"<br>Longitude: " + position.coords.longitude;
	//alert("Accuracy:" + position.coords.accuracy + "\nTimestamp:" + position.timestamp);
	LocationCount_Total = LocationCount_Total + 1;
	
	var diff = position.timestamp - LocationTimeStamp;
	//alert(diff);
	if(LocationTimeStamp == 0)
	{
		LocationTimeStamp =  position.timestamp;
	}
	if(diff > 10000)
	{
		
		$("#Accuracy").val("" + position.coords.accuracy);
		if(position.coords.accuracy <= 10.0)
		{
			//high accuracy 
			
			//var mLastPosition = localStorage.getItem("CurrentRun_LastPosition");
			//LastPosition = mLastPosition;
			if(LastPosition == "")
			{
				LastPosition = position;
				var mCoordinate = localStorage.getItem("CurrentRun");
				if(mCoordinate == "")
				{
					mCoordinate = "" + position.coords.latitude + "," + position.coords.longitude;
					
				}
				else
				{
					mCoordinate = mCoordinate + "|" + position.coords.latitude + "," + position.coords.longitude;
					
				}
				localStorage.setItem("CurrentRun", mCoordinate);
				
				LocationCount = LocationCount + 1;
				
			}
			else
			{
				var distance = calculateDistance(LastPosition.coords.latitude, LastPosition.coords.longitude,
							position.coords.latitude, position.coords.longitude);
				distance = distance * 1000.0;
				if(distance >= 10.0)
				{
					TotalDistance = TotalDistance + distance;
					
					//document.getElementById('distance').innerHTML = TotalDistance;
					
					if(TotalDistance > 1000.0)
					{
						var d = TotalDistance / 1000.0;
						mdistance = Math.round(d * 100) / 100;
						document.getElementById('lbldistance').innerHTML = "DISTANCE (km):";
						//$("#lbldistance").val("Distance (km)");
						//$("#distance").val(mdistance + "");		
						document.getElementById('distance').innerHTML = mdistance;
					}
					else
					{
						mdistance = Math.round(TotalDistance * 100) / 100;
						//$("#lbldistance").val("Distance (meter)");
						document.getElementById('lbldistance').innerHTML = "DISTANCE (meter):";
						//$("#distance").val(mdistance + "");
						document.getElementById('distance').innerHTML = mdistance;
					}
					
					var mCoordinate = localStorage.getItem("CurrentRun");
					if(mCoordinate == "")
					{
						mCoordinate = "" + position.coords.latitude + "," + position.coords.longitude;
					}
					else
					{
						mCoordinate = mCoordinate + "|" + position.coords.latitude + "," + position.coords.longitude;
					}
					localStorage.setItem("CurrentRun", mCoordinate);
					
					LocationCount = LocationCount + 1;
					LastPosition = position;	
					
					try{
						var weight = parseFloat("" + window.localStorage.getItem("userprofie_weight"));
						if(isNaN(weight)== true)
						{
							TotalCalories = "0";
							//$("#calories").val(TotalCalories);
							document.getElementById('calories').innerHTML = TotalCalories;
						}
						else
						{
							var dblTotalDistance = parseFloat("" + TotalDistance);
							var strCal = calculateCalories(dblTotalDistance, weight);
							TotalCalories = strCal;
							//$("#calories").val(strCal);
							document.getElementById('calories').innerHTML = TotalCalories;
						}
					}
					catch(err)
					{
						//alert(err);
					}
				}
			}
			LocationTimeStamp =  position.timestamp;
			//localStorage.setItem("CurrentRun_LastPosition", LastPosition);
			
		}
	}
	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")" + "[" + LocationCount_Total + "]");
	
}

function stopLocationWatch(){
	 geoLoc = navigator.geolocation;
	 // alert("ID: " + watchID);
     geoLoc.clearWatch(watchID);
}

function getLocationUpdate(){
	if(navigator.geolocation){
	   // timeout at 60000 milliseconds (60 seconds)
	   var mAccuracy = window.localStorage.getItem("setting_accuracy");
	   var mHighAccurary = false;
	   if(mAccuracy == "HIGH")
	   {
			mHighAccurary = true;
	   }
	   var options = {maximumAge: 0, timeout:20000, enableHighAccuracy: mHighAccurary };
	   geoLoc = navigator.geolocation;
	   navigator.geolocation.getCurrentPosition(showMyPosition);
	   //watchID = geoLoc.watchPosition(showPosition, errorHandler, options);
	   //alert("ID: " + watchID);
	}
	else{
		if(navigator.notification)
		{
			navigator.notification.alert(
				'Sorry, your device does not support geolocation',
				function() {},
				'Geolocation',
				'OK'
			);
		}
		else
		{
			alert("Sorry, browser does not support geolocation!");
		}
	}
 }
 
function errorHandler(error)
{
	if(error.code == 1)
	{
		StopRun("Your phone do not have GPS/Location service enabled. Please enable location service for AktifPenang under Settings > Privacy > Location");
	}
	else if(error.code == 2)
	{
		//alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
	}
	else
	{
		//alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
	}
	//
}
 
 function calculateDistance(lat1, lon1, lat2, lon2) {
	  var R = 6371; // km
	  var dLat = (lat2 - lat1).toRad();
	  var dLon = (lon2 - lon1).toRad(); 
	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
			  Math.sin(dLon / 2) * Math.sin(dLon / 2); 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	  var d = R * c;
	  return d;
}
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

//===================== background geolocation ========================

function calculateCalories(dblDistance, Weight)
{
	 //convert km to miles 
	var dKmForCalories = dblDistance/1000.0;
	var dMile = dKmForCalories * 0.621371;
	
	//convert kg to pound 
	try
	{
			var dblWeight = parseFloat(Weight);
			var dblWeightPound = dblWeight * 2.20462;
			var CaloriesBurned = (dblWeightPound) * (0.63) * (dMile);
			
			return (Math.round(CaloriesBurned * 10) / 10);
		
	}
	catch(err)
	{
		return "- -";
	}
}

function configureBackgroundGeoLocation()
{
		/*window.navigator.geolocation.getCurrentPosition(function(location) {
            console.log('Location from Phonegap');
			alert("location from phonegap");
			
			 // BackgroundGeoLocation is highly configurable.
			
			//showPos(location);
        });*/
		try{
		    /*var bgGeo = window.plugins.backgroundGeoLocation;
	 
			var callbackFn = function(location, taskId){
				//runtap.util.gps.onBackgroundSuccess(location);
				//window.plugins.backgroundGeoLocation.finish();
			};
			 
			var failureFn = function(error){
				alert('Geolocation Error');
			};
			 
			bgGeo.configure(callbackFn, failureFn, {
				desiredAccuracy: 10,
				stationaryRadius: 10,
				distanceFilter: 30,
				debug: true
			});*/
			
			var options = {
					desiredAccuracy: 0,
					stationaryRadius: 10,
					distanceFilter: 10,
					activityType: "Fitness",//"Fitness",       // <-- iOS-only
					debug: false 
			};
			  
			try{
				window.plugins.backgroundGeoLocation.configure(callbackFn, failureFn, options);
			}
			catch(err)
			{
				//alert(err);
			}
			// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
			window.plugins.backgroundGeoLocation.start();
		}
		catch(err)
		{
		
		}
        // If you wish to turn OFF background-tracking, call the #stop method.
        // window.plugins.backgroundGeoLocation.stop()

}


function failureFn(error) {
	console.log('BackgroundGeoLocation error');
	//alert("Error: " + error);
}

function callbackFn(location) {
	//console.log('[js] BackgroundGeoLocation callback:  ' + location.latitudue + ',' + location.longitude);
	// Do your HTTP request here to POST location to your server.
	//
	//
	showPos(location);
	 var yourAjaxCallback = function(response) {
		// Very important to call #finish -- it signals to the native plugin that it can destroy the background thread, which your callbackFn is running in.
		// IF YOU DON'T, THE OS CAN KILL YOUR APP FOR RUNNING TOO LONG IN THE BACKGROUND
		window.plugins.backgroundGeoLocation.finish();
	};
	
	yourAjaxCallback.call(this, {status: 200});
	
	//alert("Call Back");
	//yourAjaxCallback.call(this);
	
	
};

function showPos(location)
{
	try{
		//alert(location.accuracy);
	}
	catch(err)
	{
	
	}
	LocationCount_Total = LocationCount_Total + 1;

	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")");
	
	//document.getElementById('calories').innerHTML = "Location: " + LocationCount;
	
	//var mLastPosition = localStorage.getItem("CurrentRun_LastPosition");
	//LastPosition = mLastPosition;
	if(location.accuracy <= 10.0)
	{
		if(LastPosition == "")
		{
			LastPosition = location;
			var mCoordinate = localStorage.getItem("CurrentRun");
			if(mCoordinate == "")
			{
				mCoordinate = "" + location.latitude + "," + location.longitude;
			}
			else
			{
				mCoordinate = mCoordinate + "|" + location.latitude + "," + location.longitude;
			}
			localStorage.setItem("CurrentRun", mCoordinate);
				
			LocationCount_background = LocationCount_background + 1;
		}
		else
		{
			var distance = calculateDistance(LastPosition.latitude, LastPosition.longitude,
						location.latitude, location.longitude);
			distance = distance * 1000.0;
			if(distance >= 10.0)
			{
				TotalDistance = TotalDistance + distance;
				
				//document.getElementById('distance').innerHTML = TotalDistance;
				var mCoordinate = localStorage.getItem("CurrentRun");
				if(mCoordinate == "")
				{
					mCoordinate = "" + location.latitude + "," + location.longitude;
				}
				else
				{
					mCoordinate = mCoordinate + "|" + location.latitude + "," + location.longitude;
				}
				localStorage.setItem("CurrentRun", mCoordinate);
					
				LocationCount_background = LocationCount_background + 1;
				
				if(TotalDistance > 1000.0)
				{
					var d = TotalDistance / 1000.0;
					mdistance = Math.round(d * 100) / 100;
					document.getElementById('lbldistance').innerHTML = "Distance (km):";
					//$("#lbldistance").val("Distance (km)");
					$("#distance").val(mdistance + "");

				}
				else
				{
					mdistance = Math.round(TotalDistance * 100) / 100;
					//$("#lbldistance").val("Distance (meter)");
					document.getElementById('lbldistance').innerHTML = "Distance (meter):";
					$("#distance").val(mdistance + "");

				}
				
				LastPosition = location;	
				
				try{
						var weight = parseFloat("" + window.localStorage.getItem("userprofie_weight"));
						var dblTotalDistance = parseFloat("" + TotalDistance);
						var strCal = calculateCalories(dblTotalDistance, weight);
						TotalCalories = strCal;
						$("#calories").val(strCal);
					}
					catch(err){}
			}
		}
	}
	//$("#calories").val("" + LocationCount + "(" + LocationCount_background + ")" + "[" + LocationCount_Total + "]");
	//localStorage.setItem("CurrentRun_LastPosition", LastPosition);
}
//======================== stop watch =================================

	
function timecounter(starttime)
{
        currentdate = new Date();
        lapdetails = document.getElementById('lapdetails');
        stopwatch = document.getElementById('stopwatch');
         
        var timediff = currentdate.getTime() - starttime;
        if(runningstate == 0)
            {
            timediff = timediff + stoptime //stoptime=0
            }
        if(runningstate == 1)
        {
			mFormattedDuration = formattedtime(timediff);
			
            stopwatch.value = mFormattedDuration;
			stopwatch.innerHTML = mFormattedDuration;
            refresh = setTimeout('timecounter(' + starttime + ');',10);            
        }
        else
            {
            window.clearTimeout(refresh);
            stoptime = timediff;
            }
}
 
function marklap()
 {
 if(runningstate == 1)
	   {
	   if(lapdate != '')
                       {
                        var lapold = lapdate.split(':');
                        var lapnow = stopwatch.value.split(':');
                        var lapcount = new Array();
                        var x = 0
        for(x; x < lapold.length; x++)
             {
         lapcount[x] = new Array();
         lapcount[x][0] = lapold[x]*1;
         lapcount[x][1] = lapnow[x]*1;
              }
         if(lapcount[1][1] < lapcount[1][0])
              {
            lapcount[1][1] += 60;
              lapcount[0][1] -= 1;
             }
          if(lapcount[2][1] < lapcount[2][0])
             {
             lapcount[2][1] += 10;
             lapcount[1][1] -= 1;
              }
       var mzeros = (lapcount[0][1] - lapcount[0][0]) < 10?'0':'';
       var szeros = (lapcount[1][1] - lapcount[1][0]) < 10?'0':'';
       lapdetails.value += '\t+' + mzeros + (lapcount[0][1] - lapcount[0][0]) + ':'
        + szeros + (lapcount[1][1] - lapcount[1][0]) + ':'
           + (lapcount[2][1] - lapcount[2][0]) + '\n';
         }
       lapdate = stopwatch.value;
       lapdetails.value += (++lapcounter) + '. ' + stopwatch.value;
        }
     }
/*function startandstop()
      {
      var startandstop = document.getElementById('startandstopbutton');
      var startdate = new Date();
      var starttime = startdate.getTime();

      if(runningstate == 0)
    {      
     startandstop.value = 'Stop running';
     runningstate = 1;      
     timecounter(starttime);
     }
 else
      {    
        startandstop.value = 'Start my run';
        runningstate = 0;     
        lapdate = '';
      }
   }*/
   
 function startDuration()
 {
	   var startdate = new Date();
      var starttime = startdate.getTime();
	   runningstate = 1;      
	 timecounter(starttime);
 }
 function stopDuration()
 {
	   var startdate = new Date();
      var starttime = startdate.getTime();
	   runningstate = 0;
	lapdate = '';
 }
 
function resetstopwatch()
        {
      lapdetails.value = '';
      lapcounter = 0;
       stoptime = 0;
      lapdate = '';
      window.clearTimeout(refresh);
     if(runningstate == 1)
   {
   var resetdate = new Date();
   var resettime = resetdate.getTime();
   timecounter(resettime);
  }
else
  {
stopwatch.value = "00:00:00"; //reset stopwatch value
  }
 }
 function formattedtime(unformattedtime)
  {    
    var sec = Math.floor(unformattedtime/1000) % 60;
    var min = Math.floor(unformattedtime/(1000 * 60)) % 60;
    var hour = Math.floor(unformattedtime/(1000 * 60 * 60)) % 24;
    
    if (sec < 10) {
        sec = '0' + sec;
    }
    else{
        sec= sec;
    }
    
    if (min < 10) {
        min = '0' + min;
    }
    else{
        min = min;
    }
    
    if (hour <10) {
        hour = '0' + hour;
    }
    else{
        hour = hour;
    }
    /*var min = sec / 60;
     var hour = min / 60;*/
   //var second = Math.floor(unformattedtime/1000);
    //var minute = Math.floor(unformattedtime/60000);
//decisec = decisec.charAt(decisec.length - 1);
//second = second - 60 * minute + '';
return hour + ':'  + min + ':' + sec;
}

function setInputButtonText(txt){
          $("#startandstopbutton").prev('a').find('span.ui-btn-text').text(txt);
}