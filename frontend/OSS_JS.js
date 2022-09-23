// ---------------------------
// initialize global variables
// ---------------------------

// set-up data object --> all key values will be the headers on the output csv
var thisData = {
	"subjID":[],
	"experimentName":[],
	"versionName":[],
	"windowWidth":[],
	"windowHeight":[],
	"screenWidth":[],
	"screenHeight":[],
	"startDate":[],
	"startTime":[],
	"pracTries":[],
	"trialNum":[],
	"sceneCategory":[],
	"objectCategory":[],
	"sceneImage":[],
	"objectImage":[],
	"semanticMatch":[],
	"sceneZoom":[],
	"keyPress":[],
	"accuracy":[],
	"RT":[]
};

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var endExpTime, startExpTime, RT, key, fixTime, startTrialTime, thisTrialSceneCat, thisTrialMatch, thisTrialZoom, zoom, match;


var sceneDict = {
	"bathroom":{"zi":["b0_zi.png","b1_zi.png","b2_zi.png","b3_zi.png","b4_zi.png","b5_zi.png"],
				"zc":["b0_zc.png","b1_zc.png","b2_zc.png","b3_zc.png","b4_zc.png","b5_zc.png"],
				"zo":["b0_zo.png","b1_zo.png","b2_zo.png","b3_zo.png","b4_zo.png","b5_zo.png"]},
	"classroom":{"zi":["c0_zi.png","c1_zi.png","c2_zi.png","c3_zi.png","c4_zi.png","c5_zi.png"],
				"zc":["c0_zc.png","c1_zc.png","c2_zc.png","c3_zc.png","c4_zc.png","c5_zc.png"],
				"zo":["c0_zo.png","c1_zo.png","c2_zo.png","c3_zo.png","c4_zo.png","c5_zo.png"]},
	"gym": {"zi":["g0_zi.png","g1_zi.png","g2_zi.png","g3_zi.png","g4_zi.png","g5_zi.png"],
			"zc":["g0_zc.png","g1_zc.png","g2_zc.png","g3_zc.png","g4_zc.png","g5_zc.png"],
			"zo":["g0_zo.png","g1_zo.png","g2_zo.png","g3_zo.png","g4_zo.png","g5_zo.png"]},
	"kitchen": {"zi":["k0_zi.png","k1_zi.png","k2_zi.png","k3_zi.png","k4_zi.png","k5_zi.png"],
				"zc":["k0_zc.png","k1_zc.png","k2_zc.png","k3_zc.png","k4_zc.png","k5_zc.png"],
				"zo":["k0_zo.png","k1_zo.png","k2_zo.png","k3_zo.png","k4_zo.png","k5_zo.png"]}
}

var condsDict = {
	"bathroom":{"zi":[0,1],"zc":[0,1],"zo":[0,1]},
	"classroom":{"zi":[0,1],"zc":[0,1],"zo":[0,1]},
	"gym":{"zi":[0,1],"zc":[0,1],"zo":[0,1]},
	"kitchen":{"zi":[0,1],"zc":[0,1],"zo":[0,1]}
}

var objDict = {
	"bathroom":["b_hairbrush.png", "b_hairdryer.png", "b_plunger.png", "b_soap.png", "b_toiletpaper.png", "b_toothpaste.png"],
	"classroom":["c_computer.png", "c_eraser.png", "c_mouse.png", "c_notebook.png", "c_backpack.png", "c_scissors.png"],
	"gym":["g_boxingglove.png", "g_dumbell.png", "g_gymbag.png", "g_jumprope.png", "g_sneaker.png", "g_yogamat.png"],
	"kitchen":["k_kettle.png", "k_mug.png", "k_ovenmitt.png", "k_grater.png", "k_knife.png", "k_spatula.png"]
};

var totalObjNum = Object.values(sceneDict).length;
var sceneCats = Object.keys(sceneDict);
var zoomCats = Object.keys(sceneDict.bathroom);

// practice variables
var pracTries = 0;
// make a dict that has a list of scenes and objects --> randomly pair together 
// all outdoor scenes 
// objects (fridge, bed, pinecone, apple, butterfly, chair)
// 5/6 correct to continue 
var practice_scenes = ["p0.png","p1.png","p2.png","p3.png","p4.png","p5.png"]
var practice_objDict = {
	"outside":["b_hairbrush.png", "b_hairdryer.png", "b_plunger.png", "b_soap.png", "b_toiletpaper.png", "b_toothpaste.png"],
	"inside":["c_computer.png", "c_eraser.png", "c_mouse.png", "c_notebook.png", "c_backpack.png", "c_scissors.png"]};

var pracTotalTrials = practice_scenes.length


	// timing variables
var presTime = 2000;

// accuracy variables
var prevAcc = 1;
var trialNum = 0;

// key info
var keyDict = {"c": 1, "m": 0, "none": "none"}

// ----------------
// set-up functions
// ----------------

$(document).ready(function(){
	// on open, add this text to the startingInstructions div and pre-load all stimuli

	$("#startingInstructions").append( //have to append here instead of setting in html because variables are included
		"<p>Thank you for your participation in this experiment. Please read the instructions very carefully.</p>"
		+ "<p>INSERT INSTRUCTIONS HERE</p>");
	document.getElementById("subjID").value = subjID;
	document.getElementById("startDate").value = startDate;
	document.getElementById("startTime").value = startTime;

	preloadStimuli();

	$("#startExperimentButton").show();

});

function preloadStimuli(){
	// loads all stimuli into document under hidden div so there is no lag when calling them

	for (var sceneNum=0; sceneNum<sceneCats.length; sceneNum++){ //for each scene category
		var sceneImgDict = sceneDict[sceneCats[sceneNum]]; //3 dictionaries of images per zoom
		for (var zoomNum=0; zoomNum<Object.keys(sceneImgDict).length; zoomNum++){//for each zoom
			var thisZoom = zoomCats[zoomNum];
			var thisZoomImgs = sceneImgDict[thisZoom]; //these 6 images in one zoom
			for (var zoomImg = 0; zoomImg<thisZoomImgs.length; zoomImg++){ //for each image
				var img = document.createElement("img");
				img.src = "stimuli/" + sceneCats[sceneNum] + "/scenes/" + thisZoom + "/" + thisZoomImgs[zoomImg];
			}
		}
	}
}

function showInstructions(){
	// this is a generic function to show things in the instruction page format
	// have to append here instead of setting in html because variables are included

	$(".instructions").hide(); //hide all instructions
	$(".buttonDiv").hide(); //hide all buttons
	$("#experimentBox").hide(); //hide the experiment part

	if (thisBlockNum == 0){ //if its practice (because they did poorly first try)
		$("#practiceWrongInstructions").text("");
		$("#practiceWrongInstructions").append(
			"<p>You didn't do well enough on the practice section. Try again, and once you have shown an understanding of the task, the experiment will begin.</p><br>"
			+ "<p>Please read the instructions very carefully.</p>"
			+ "<br><p>You will begin with a short practice. Once you have shown an understanding of the task, the experiment will begin.</p>")
		$("#practiceWrongInstructions").show();
		$("#redoPracticeButton").show();
	}
	else if (thisBlockNum == 1){ //if its the beginning of the experiment
		$("#firstBlockInstructions").append(
			"<p style='text-align:center'>The practice section has ended, and you will now continue onto the main experiment.</p>"
			+ "<p style='text-align:center'>When you are ready to begin the experiment, click the button below.</p>")
		$("#firstBlockInstructions").show();
		$("#startExperimentButton").show();
	}
	else { //if last block
		endExpTime = new Date; //get time of end of last block to calculate total experiment time
		$("#lastBlockInstructions").append(
			"<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
			+"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
		$("#lastBlockInstructions").show();
		$("#revealCodeButton").show();
	}
}

function prepareForFirstTrial(){
	// get rid of instructions page and show experiment box

	$(".instructions").hide();
	$(".buttonDiv").hide();
	$("#experimentBox").show();

	numCorr = 0; //reset number correct for next block
	prevAcc = 1; //reset accuracy for next block so fixation is neutral and 400ms

	startExpTime = new Date;
	trialNum = 0;
}

function prepareForPracticeTrial(){
	// get rid of instructions page and show experiment box

	$(".instructions").hide();
	$(".buttonDiv").hide();
	$("#experimentBox").show();

	numCorr = 0; //reset number correct for next block
	prevAcc = 1; //reset accuracy for next block so fixation is neutral and 400ms

	// randomly select a practice scene from the list of paths
	thisTrialScene = shuffle(practice_scenes)[0];
	// randomly select whether the object will be from the incongruent or congruent list 
	thisTrialObjCat = shuffle(Object.keys(practice_objDict))[0];

	if (thisTrialObjCat=="outside"){
		var theseTrialObjs = shuffle(practice_objDict[thisTrialObjCat]);
		var thisTrialObj = theseTrialObjs.pop();
		$("#objectImage").attr("src","stimuli/" + "outside" + "/objects/" + thisTrialObj);
		
		console.log(theseTrialObjs);
		console.log(thisTrialObj);

	}
	else{
		var theseTrialObjs = shuffle(practice_objDict[thisTrialObjCat]);
		var thisTrialObj = theseTrialObjs.pop();
		$("#objectImage").attr("src","stimuli/" + "inside" + "/objects/" + thisTrialObj);
		
		console.log(theseTrialObjs);
		console.log(thisTrialObj);
	}

	fixTime = showFixation(prevAcc); //show fixation based on previous accuracy
	key = "none"; //"resetting" key press from previous trial, doesn't change if no button is pressed
}

function prepareForTrial(){
	// get trial info, including category, condition, objects, and target

	[sceneCat, zoom, match] = getConds();
	thisTrialScene = chooseSetScene(sceneCat, zoom);
	thisTrialObj = chooseSetObject(sceneCat,match);

	fixTime = showFixation(prevAcc); //show fixation based on previous accuracy
	key = "none"; //"resetting" key press from previous trial, doesn't change if no button is pressed
}

function getConds(){
	var thisTrialSceneCat = shuffle(sceneCats)[0];

  	var thisTrialZoom = shuffle(Object.keys(condsDict[thisTrialSceneCat]))[0];

 	if (condsDict[thisTrialSceneCat][thisTrialZoom].length > 0){
		var theseTrialMatches = shuffle(condsDict[thisTrialSceneCat][thisTrialZoom]);
      	var thisTrialMatch = theseTrialMatches.pop();
      	// return [thisTrialSceneCat, thisTrialZoom, thisTrialMatch]
	}
  	else{
      	delete condsDict[thisTrialSceneCat][thisTrialZoom];
		if (Object.keys(condsDict[thisTrialSceneCat]).length==0){
			delete condsDict[thisTrialSceneCat];
			sceneCats = Object.keys(condsDict);
			// delete sceneCats[thisTrialSceneCat];
		}
		if (Object.keys(condsDict).length>0){
    		[thisTrialSceneCat, thisTrialZoom, thisTrialMatch] = getConds();
    	}
      	else{
      		showInstructions();
      	}
    }
    return [thisTrialSceneCat, thisTrialZoom, thisTrialMatch]
}

function chooseSetScene(sceneCat,zoom){
    var theseTrialScenes = sceneDict[sceneCat][zoom];
    var thisTrialIndex = randomIntFromInterval(0,(sceneDict[sceneCat][zoom].length-1));
  	var thisTrialScene = sceneDict[sceneCat][zoom][thisTrialIndex];
  	$("#sceneImage").attr("src","stimuli/" + sceneCat + "/scenes/" + zoom + "/" + thisTrialScene);
  	var theseZooms = Object.keys(sceneDict[sceneCat]);
  	for (theseZoomNums=0; theseZoomNums<theseZooms.length; theseZoomNums++){
  		theseZoomImgs = sceneDict[sceneCat][theseZooms[theseZoomNums]];
  		thisSceneNum = thisTrialScene.slice(0,3) + theseZooms[theseZoomNums] +".png"
  		theseZoomImgs = arrayRemove(theseZoomImgs, thisSceneNum);
  		sceneDict[sceneCat][theseZooms[theseZoomNums]] = theseZoomImgs;
  	}
  	return thisTrialScene;
}

function chooseSetObject(sceneCat,match){
	if (match == 1){
		var theseTrialObjs = shuffle(objDict[sceneCat]);
		var thisTrialObj = theseTrialObjs.pop();
		var thisObjCat = sceneCat;
		$("#objectImage").attr("src","stimuli/" + thisObjCat + "/objects/" + thisTrialObj);
		
		console.log(theseTrialObjs);
		console.log(thisTrialObj);

		return thisTrialObj;
	}
	else{
		if (sceneCat=='bathroom'){
			var thisObjCat = 'kitchen';
		}
		else if (sceneCat=='kitchen'){
			var thisObjCat = 'bathroom';
		}
		else if (sceneCat=='gym'){
			var thisObjCat = 'classroom';
		}
		else if (sceneCat='classroom'){
			var thisObjCat = 'gym';
		}
		var theseTrialObjs = shuffle(objDict[thisObjCat]);
		var thisTrialObj = theseTrialObjs.pop();
		$("#objectImage").attr("src","stimuli/" + thisObjCat + "/objects/" + thisTrialObj);
		console.log(theseTrialObjs);
		console.log(thisTrialObj);
		
		return thisTrialObj;
	}
}
// ----------------------
// presentation functions
// ----------------------

function showFixation(){
	// show fixation based on previous accuracy

	if (prevAcc==0){
		fixTime = 800;
		$("#fixationRed").show();
	}
	if (prevAcc==1){
		fixTime = 400;
		$("#fixationNeutral").show();
	}

	return fixTime
}

function showSceneObject(){
	//show objects, hiding red fixation if necessary

	// if (prevAcc==0){
		$(".fixationDiv").hide();
		// $("#fixationNeutral").show();
	// }
	$(document).ready(function(){
		$(".objectDiv").show();
		$(".circleDiv").show();
		$(".sceneDiv").show();
	})
}

function hideSceneObject(){
	// hide everything except experiment box, at end of each trial

	$("#experimentBox").children().hide();
}


// --------------------
// experiment functions
// --------------------

function startPractice(){
	// start practice trials, on keypress 

	prepareForPracticeTrial();
	runTrial();
}

function startExp() {
	// start running one block, onkeypress for button div

	prepareForFirstTrial(); //get rid of instructions page and show experiment box
	runTrial(); //starts trial presentation, recursive function
}

function runTrial(){
 	// run one trial --> recursive function (calls itself inside itself until some condition is met)

	 if (thisBlockNum == 0){
		// set timeouts for presentation
		var sceneObjShown = setTimeout(function(){ //show objects after fixation time (400 or 800ms)
			showSceneObject();
			detectKeyPress(trialOver);
		}, fixTime);
		var trialOver = setTimeout(function(){ //show gabors after fixation time + object time (4s)
			nextTrial(); //set keypress event listener, which times out end-of-trial timer if a valid key is pressed
		}, fixTime + presTime);

	}

	if (thisBlockNum == 1){
		// set timeouts for presentation
		var sceneObjShown = setTimeout(function(){ //show objects after fixation time (400 or 800ms)
			showSceneObject();
			detectKeyPress(trialOver);
		}, fixTime);
		var trialOver = setTimeout(function(){ //show gabors after fixation time + object time (4s)
			nextTrial(); //set keypress event listener, which times out end-of-trial timer if a valid key is pressed
		}, fixTime + presTime);

	}
	else{
		prepareForTrial(); // get trial info, including category, condition, objects, and target, and set stimuli

		// set timeouts for presentation
		var sceneObjShown = setTimeout(function(){ //show objects after fixation time (400 or 800ms)
			showSceneObject();
			detectKeyPress(trialOver);
		}, fixTime);
		var trialOver = setTimeout(function(){ //show gabors after fixation time + object time (4s)
			nextTrial(); //set keypress event listener, which times out end-of-trial timer if a valid key is pressed
		}, fixTime + presTime);

	}
	// showInstructions(); //show either redo practice or experiment instructions, based on block number
}

function detectKeyPress(trialOver){
	// see if key is pressed to end trial early

	// add event listener for keypress
	$(document).bind("keypress", function(event){
		if (event.which == 99){ //99 is js keycode for c
			key = "c";
			nextTrial(); //since button was pressed, move onto next trial
			clearTimeout(trialOver); //get rid of end-of-trial timer
		}
		else if (event.which == 109){ //109 is js keycode for m
			key = "m";
			nextTrial(); //since button was pressed, move onto next trial
			clearTimeout(trialOver); //get rid of end-of-trial timer
		}
	});
}

function nextTrial(){ //requires input variable because it is not a global variable --> different for practice and experiment blocks
	// advance to next trial OR end block

	$(document).unbind("keypress"); //assuming there has already been a keypress, remove event so it can be added for next trial
	hideSceneObject();

	// save accuracy for this trial and update number correct for block accuracy
	if (keyDict[key] == match){
		prevAcc = 1;
		numCorr++;
	}
	else if (keyDict[key] != match){
		prevAcc = 0;
	}
	blockAcc = numCorr/(trialInBlockNum + 1); //update block accuracy before adding 1 to trial in block number
	endTrialTime = new Date;
	RT = endTrialTime - startTrialTime;

	// save data from this trial
	saveTrialData();

	// move onto next trial if there are more
	// if (trialNum<24){
	trialNum++; //increase total trial number
	runTrial(); //re-run function
	// }
	// trialNum++; //increase total trial number
	// runTrial(); //re-run function
}

function endExperiment(){
	// gives participant their unique code and saves data to server --> this page should look identical to redirect html (revealCode.html)
	$("#endExpInstructions").append("<br><p style='text-align:center'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
	$("#revealCodeButton").hide();
	saveAllData();
}

// ---------------------
// saving data functions
// ---------------------

function saveTrialData(){
	// at the end of each trial, appends values to data dictionary

	// global variables --> will be repetitive, same value for every row (each row will represent one trial)
	thisData["subjID"].push(subjID);
	thisData["experimentName"].push("SemanticSize");
	thisData["versionName"].push("v1");
	thisData["windowWidth"].push($(window).width());
	thisData["windowHeight"].push($(window).height());
	thisData["screenWidth"].push(screen.width);
	thisData["screenHeight"].push(screen.height);
	thisData["startDate"].push(startDate);
	thisData["startTime"].push(startTime);

	// trial-by-trial variables, changes each time this function is called
	thisData["trialNum"].push(trialNum);
	thisData["sceneCategory"].push(thisTrialSceneCat);
	thisData["objectCategory"].push();
	thisData["sceneImage"].push(thisTrialScene);
	thisData["objectImage"].push(thisTrialObj);
	thisData["semanticMatch"].push(thisTrialMatch);
	thisData["sceneZoom"].push(thisTrialZoom);
	thisData["keyPress"].push(key);
	thisData["accuracy"].push(prevAcc);
	thisData["RT"].push(RT);
}

function saveAllData() {
	// saves last pieces of data that needed to be collected at the end, and calls sendToServer function

	// add experimentTime and totalTime to data dictionary
	var experimentTime = (endExpTime - startExpTime);
	var totalTime = ((new Date()) - start);
	thisData["experimentTime"]=Array(trialNum).fill(experimentTime);
	thisData["totalTime"]=Array(trialNum).fill(totalTime);

	// change values for input divs to pass to php
	$("#experimentData").val(JSON.stringify(thisData));
	$("#completedTrialsNum").val(trialNum); //how many trials this participant completed

	sendToServer();
}

function sendToServer() {
	// send the data to the server as string (which will be parsed IN php)

	$.ajax({ //same as $.post, but allows for more options to be specified
		headers:{"Access-Control-Allow-Origin": "*", "Content-Type": "text/csv"}, //headers for request that allow for cross-origin resource sharing (CORS)
		type: "POST", //post instead of get because data is being sent to the server
		url: $("#saveData").attr("action"), //url to php
		data: $("#experimentData").val(), //not sure why specified here, since we are using the data from the input variable, but oh well

		// if it works OR fails, submit the form
		success: function(){
			document.forms[0].submit();
		},
		error: function(){
			document.forms[0].submit();
		}
	});
}

// ----------------------
// other random functions
// ----------------------

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkArrayValuesInCommon(arr1, arr2){
	for (var i=0; i < arr1.length; i++){
		var overlap = arr2.includes(arr1[i]);
		if (overlap == true){
			break;
		}
	}
	return overlap
}

function arrayRemove(arr, value) { 
	return arr.filter(function(ele){ 
		return ele != value; 
	});
}
