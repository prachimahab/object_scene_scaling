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
	"objectSize":[],
	"objectCategory":[],
	"object":[],
	"objectScene1SemanticCongruency":[],
	"scene1ZoomName":[],
	"scene1Category":[],
	"scene1":[],
	"scene2SizeCong":[],
	"scene2SemCong":[],
	"scene2ZoomName":[],
	"scene2Category":[],
	"scene2":[],
	"keyPress":[],
	"accuracy":[],
	"RT":[]
};

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = (start.getMonth()+1) + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var endExpTime, startExpTime, RT, key, fixTime, thisTrialObj, thisTrialScene, thisTrialSceneCat, thisTrialMatch, thisTrialZoom, zoom, match, practice_scenes, practice_objDict, thisObjCat,thisTrialSemCong,thisTrialScene2SemCong,thisTrialScene2SizeCong,thisTrialScene1Zoom, thisTrialScene1Cat, thisTrialScene2Cat,thisTrialScene1ZoomName, thisTrialScene1ZoomName, thisTrialScene1, thisTrialScene2, thisTrialObj, thisTrialObjSizeName, innerFail, fail;

var age_recorded = false;

var maskArray = ["mask_0.jpg", "mask_1.jpg", "mask_2.jpg", "mask_3.jpg", "mask_4.jpg", "mask_5.jpg", "mask_6.jpg",
								"mask_7.jpg", "mask_8.jpg", "mask_9.jpg", "mask_10.jpg", "mask_11.jpg", "mask_12.jpg", "mask_13.jpg",
								"mask_14.jpg", "mask_15.jpg", "mask_16.jpg", "mask_17.jpg", "mask_18.jpg", "mask_19.jpg", "mask_20.jpg",
								"mask_21.jpg", "mask_22.jpg", "mask_23.jpg"];

var sceneDict = {
	"bathroom":{"zi":["b0_zi.png","b1_zi.png","b2_zi.png","b3_zi.png","b4_zi.png","b5_zi.png"],
				"zo":["b0_zo.png","b1_zo.png","b2_zo.png","b3_zo.png","b4_zo.png","b5_zo.png"]},
	"classroom":{"zi":["c0_zi.png","c1_zi.png","c2_zi.png","c3_zi.png","c4_zi.png","c5_zi.png"],
				"zo":["c0_zo.png","c1_zo.png","c2_zo.png","c3_zo.png","c4_zo.png","c5_zo.png"]},
	"laundromat": {"zi":["l0_zi.png","l1_zi.png","l2_zi.png","l3_zi.png","l4_zi.png","l5_zi.png"],
			"zo":["l0_zo.png","l1_zo.png","l2_zo.png","l3_zo.png","l4_zo.png","l5_zo.png"]},
	"kitchen": {"zi":["k0_zi.png","k1_zi.png","k2_zi.png","k3_zi.png","k4_zi.png","k5_zi.png"],
				"zo":["k0_zo.png","k1_zo.png","k2_zo.png","k3_zo.png","k4_zo.png","k5_zo.png"]}
}

var objDict = {
	"bathroom":{"small":["floss.png","nailclipper.png","lipstick.png"],"large":["hairdryer.png","loofah.png","tissuebox.png"]},
	"classroom":{"small":["binderclip.png","eraser.png","paperclip.png"],"large":["computer.png","notebook.png","powerstrip.png"]},
	"laundromat":{"small":["coins.png","socks.png","tidepod.png"],"large":["detergent.png","shirt.png","shorts.png"]},
	"kitchen":{"small":["saltshaker.png","sponge.png","spoon.png"],"large":["kettle.png","pot.png","toaster.png"]}
};

var condsArray = [ //obj size, size cong, sem congruency
	[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1],[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1]
];

var sceneCats = Object.keys(sceneDict);
var zoomCats = Object.keys(sceneDict.bathroom);
var objCats = Object.keys(objDict);

// practice variables
var pracTries = 1; // everyone does the practice at least once
var pracTrialNum = 0;
var pracTotalTrials = 6

// block var
var thisBlockNum = 0;
var totalTrials = 16;

// timing variables
var objTime = 250;
var scene1Time = 1000;
var maskTime = 400;
var scene2Time = 2000;

// accuracy variables
var prevAcc = 1;
var trialNum = 0;
var trialInBlockNum = 0;

// key info
// c = category match; m = category mis-match
var keyDict = {"c": 1, "m": 0, "none": "none"}

// ----------------
// set-up functions
// ----------------

$(document).ready(function(){
	// on open, add this text to the startingInstructions div and pre-load all stimuli

	// $("#startingInstructions").append( //have to append here instead of setting in html because variables are included
	// 	"<p>Thank you for your interest in this <strong>Human Intelligence Task (HIT)</strong>. Please read the instructions very carefully</p>"
	// 	+ "<p>In this task you will see different objects on top of different scenes. On each trial you will a fixation cross followed by a scene with an object placed in the center. This image will appear for a brief amount of time, followed by an image of colored squares. Once this image disappears you will see another scene. </p>"
	// 	+ "<p>Your task is to respond <strong>'Do the two scenes belong to the same category?'</strong></p>"
	// 	+ "<p> In the experiment, scenes will be from one of four categories: kitchen, bathroom, classroom, or laundromat (see examples below).Your task is to respond if the two scenes belong to the same or different category from this list. </p>"
	// 	+ "<p> For the practice, scenes will either be indoor or outdoor. </p>"		
	// 	+ "<p>If you believe the two scenes are of the same category, press the 'c' key on your keyboard. If the scenes are of different categories, then press the 'm' key on your keyboard.</p>"
	// 	+ "<p>For example, if you see two bedroom scenes then you should respond 'c'. If the first scene is a bedroom, and the second is living room then you should respond 'm'.</p>"
	// 	+ "<p>Please respond as quickly and accurately as possible. When you answer incorrectly, the fixation cross will turn red ("+"<font color=red>+</font>"+"). Try to slow down if you see you are getting many wrong!</p>"
	// 	+ "<br><p>When you are ready to begin the practice section, click the button below.</p>");
	document.getElementById("subjID").value = subjID;
	document.getElementById("startDate").value = startDate;
	document.getElementById("startTime").value = startTime;

	preloadStimuli();

	$("#startPracticeButton").show();

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

	for (var masks=0; masks<maskArray.length; masks++){
		var thisMask = maskArray[masks]
		img.src = "masks/" + thisMask;
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
			+ "<br><p>Please read the instructions very carefully</p>"
			+ "<p>In this task you will see different objects on top of different scenes. On each trial you will a fixation cross followed by a scene with an object placed in the center. This image will appear for a brief amount of time, followed by an image of colored squares. Once this image disappears you will see another scene. </p>"
			+ "<p>Your task is to respond <strong>'Do the two scenes belong to the same category?'</strong></p>"
			+ "<p>If you believe the two scenes are of the same category, press the 'c' key on your keyboard. If the scenes are of different categories, then press the 'm' key on your keyboard. </p>"
			+ "<p>For example, if you see two bedroom scenes then you should respond 'c'. If the first scene is a bedroom, and the second is living room then you should respond 'm'.</p>"
			+ "<p>Please respond as quickly and accurately as possible. When you answer incorrectly, the fixation cross will turn red (<font color=red>+</font>). Try to slow down if you see you are getting many wrong!</p>"
			+ "<br><p>When you are ready to redo the practice section, click the button below.</p>");
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
		getAge();
		// $("#lastBlockInstructions").append(
		// 	"<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
		// 	+"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
		// $("#lastBlockInstructions").show();
		// $("#revealCodeButton").show();
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
	var trialNum = 0;
}

function prepareForFirstPracticeTrial(){
	// get rid of instructions page and show experiment box

	$(".instructions").hide();
	$(".buttonDiv").hide();
	$("#experimentBox").show();

	practice_sceneDict = {"outside":["o0.png","o1.png","o2.png","o3.png","o4.png","o5.png","o6.png","o7.png","o8.png","o9.png","o10.png","o11.png"],
						"inside":["i0.png","i1.png","i2.png","i3.png","i4.png","i5.png","i6.png","i7.png","i8.png","i9.png","i10.png","i11.png"]};
	// practice_objDict = {
	// 	"outside":["apple.png", "butterfly.png", "pinecone.png"],
	// 	"inside":["bed.png", "chair.png", "fridge.png"]};

	practice_objs = ["acorn.png","apple.png","bed.png","butterfly.png","chair.png","couch.png","dresser.png","flower.png","lamp.png","leaf.png","pinecone.png","table.png"];

	practiceConds = [0,1,0,1,0,1]; //either same scenes or diff scenes, idc about the objects
	// practice_scenes = ["p0.png","p1.png","p2.png","p3.png","p4.png","p5.png"]
	// practice_objDict = {
	// 	"outside":["apple.png", "butterfly.png", "pinecone.png"],
	// 	"inside":["bed.png", "chair.png", "fridge.png"]};
	pracTrialNum = 0

	numCorr = 0; //reset number correct for next block
	prevAcc = 1; //reset accuracy for next block so fixation is neutral and 400ms
}

function prepareForPracticeTrial(){

	//get condition (same category scene or different category scene)
	thisTrialScene2SemCong = shuffle(practiceConds).pop();

	// get scene1
	var thisPracticeScene1Category = shuffle(Object.keys(practice_sceneDict))[0];
	var thisPracticeTrialScene1 = shuffle(practice_sceneDict[thisPracticeScene1Category]).pop();
	$("#scene1Image").attr("src","stimuli/practice/scenes/" + thisPracticeScene1Category + "/" + thisPracticeTrialScene1);

	// get scene2
	if (thisTrialScene2SemCong == 0){
		if (thisPracticeScene1Category == "inside"){
			var thisPracticeScene2Category = "outside";
		}
		else if (thisPracticeScene1Category == "outside"){
			var thisPracticeScene2Category = "inside";
		}
	}
	else{
		var thisPracticeScene2Category = thisPracticeScene1Category;
	}
	var thisPracticeTrialScene2 = shuffle(practice_sceneDict[thisPracticeScene2Category]).pop();
	$("#scene2Image").attr("src","stimuli/practice/scenes/" + thisPracticeScene2Category + "/" + thisPracticeTrialScene2);


	// randomly select whether the object will be from the incongruent or congruent list 
	var thisPracticeTrialObj = shuffle(practice_objs).pop();
	// if the list of objects of a particular category have all been sampled remove that key from the dict
	// then select the remaining one 
	// if (practice_objDict[thisPracticeTrialObj].length == 0){
	// 	delete practice_objDict[thisTrialObjCat]
	// 	thisTrialObjCat = Object.keys(practice_objDict)[0]
	// }
	$("#objectImage").attr("src","stimuli/practice/objects/" + thisPracticeTrialObj);

	var thisTrialMaskInd = getRandomInt(23);
	var thisTrialMask = maskArray[thisTrialMaskInd];
	$("#maskImage").attr("src","masks/" + thisTrialMask);

	fixTime = showFixation(prevAcc); //show fixation based on previous accuracy
	key = "none"; //"resetting" key press from previous trial, doesn't change if no button is pressed
}

function prepareForTrial(){
	// get trial info, including category, condition, objects, and target

	[thisTrialObjSize, thisTrialSizeCong,thisTrialSemCong] = getConds();

	do{ //check that these conditions can be fulfilled with the random category choice, if not, do again (choose new category)
		[thisTrialObjCat, thisTrialObjSizeName, thisTrialScene1Cat, thisTrialScene1ZoomName, fail] = condChecker(thisTrialObjSize,thisTrialSizeCong,thisTrialSemCong);
	}
	while (fail == true);


	thisTrialObj = chooseSetObject(thisTrialObjCat);
	thisTrialScene1 = chooseSetScene1(thisTrialScene1Cat, thisTrialScene1ZoomName);
	[thisTrialScene2SemCong, thisTrialScene2SizeCong, thisTrialScene2Cat, thisTrialScene2ZoomName, thisTrialScene2] = chooseSetScene2(thisTrialObjCat, thisTrialScene1Cat, thisTrialScene1);

	// [thisTrialScene1, thisTrialScene2, thisTrialScene1Cat, thisTrialScene2Cat] = chooseSetScenes(thisTrialObjCat, thisTrialObjSize, thisTrialSizeCong,thisTrialSemCong,thisTrialScene2SemCong,thisTrialScene2SizeCong);

	// var thisTrialObj = chooseSetObject(sceneCat,match);
	var thisTrialMask = chooseSetMask();

	fixTime = showFixation(prevAcc); //show fixation based on previous accuracy
	key = "none"; //"resetting" key press from previous trial, doesn't change if no button is pressed
}

function getConds(){

	if (condsArray.length == 0){
		showInstructions();
	}
	else{
		condsArray = shuffle(condsArray);
		thisTrialConds = condsArray.pop();
		thisTrialObjSize = thisTrialConds[0];
		thisTrialSizeCong = thisTrialConds[1];
		thisTrialSemCong = thisTrialConds[2];// 0=zo, 1=zi
	}

    return [thisTrialObjSize, thisTrialSizeCong,thisTrialSemCong];
}

function condChecker(thisTrialObjSize,thisTrialSizeCong,thisTrialSemCong){

	// OBJECT CHOOSING
	//set object size
	if (thisTrialObjSize == 0){
		thisTrialObjSizeName = "small";
	}
	else {
		thisTrialObjSizeName = "large"
	}

	// set object category
	do {
		thisTrialObjCat = shuffle(objCats)[0];
	}
	while(typeof(objDict[thisTrialObjCat][thisTrialObjSizeName]) == 'undefined')

	// SCENE CHOOSING
	// set zoom level for scene 1
	if (thisTrialSizeCong == 0){
		if (thisTrialObjSize == 0){
			thisTrialScene1ZoomName = "zo";
		}
		else {
			thisTrialScene1ZoomName = "zi"
		}
	}
	else {
		if (thisTrialObjSize == 0){
			thisTrialScene1ZoomName = "zi";
		}
		else {
			thisTrialScene1ZoomName = "zo"
		}
	}

	//set scene1category
	if (thisTrialSemCong == 0){
		theseTrialScene1Cats = arrayRemove(sceneCats, thisTrialObjCat);
		thisTrialScene1Cat = shuffle(theseTrialScene1Cats)[0];
	}
	else {
		thisTrialScene1Cat = thisTrialObjCat;
	}

	if (sceneDict[thisTrialScene1Cat]=='undefined'){
		fail = true;
	}
	else{
		if (typeof(sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName]) == 'undefined'){
			fail = true;
		}
		else{
			fail = false;
		}
	}

	return [thisTrialObjCat, thisTrialObjSizeName, thisTrialScene1Cat, thisTrialScene1ZoomName, fail];

}


function chooseSetObject(thisTrialObjCat){

	// //set object size
	// if (thisTrialObjSize == 0){
	// 	thisTrialObjSizeName = "small";
	// }
	// else {
	// 	thisTrialObjSizeName = "large"
	// }

	// // set object category
	// do {
	// 	thisTrialObjCat = shuffle(objCats)[0];
	// }
	// while(objDict[thisTrialObjCat][thisTrialObjSizeName] == undefined)

	// get possible objects and set this object
	var theseTrialObjs = shuffle(objDict[thisTrialObjCat][thisTrialObjSizeName]); //shuffle objs
	var thisTrialObj = theseTrialObjs.pop(); //randomly pop out one obj
	$("#objectImage").attr("src","stimuli/" + thisTrialObjCat + "/objects/" + thisTrialObjSizeName + "/" + thisTrialObj); //set obj image

	//get rid of categories that have all their images used
	if (theseTrialObjs.length == 0){
		delete objDict[thisTrialObjCat][thisTrialObjSizeName]; //get rid of category from dictionary
	}

	if (Object.keys(objDict[thisTrialObjCat]).length == 0){
		objCats = arrayRemove(objCats,thisTrialObjCat) //get rid of from future categories to choose from
		delete objDict[thisTrialObjCat];
	}

	return thisTrialObj;

}


function chooseSetScene1(thisTrialScene1Cat, thisTrialScene1ZoomName){
	var theseTrialScenes1 = shuffle(sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName]);
	var thisTrialScene1 = theseTrialScenes1.pop();
	$("#scene1Image").attr("src","stimuli/" + thisTrialScene1Cat + "/scenes/" + thisTrialScene1ZoomName + "/" + thisTrialScene1);

	if (theseTrialScenes1.length == 0){
		delete sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName]
	}

	if (Object.keys(sceneDict[thisTrialScene1Cat]).length == 0){
		sceneCats = arrayRemove(sceneCats,thisTrialScene1Cat) //get rid of from future categories to choose from
		delete sceneDict[thisTrialScene1Cat];
	}

	return thisTrialScene1;

}

function chooseSetScene2(thisTrialObjCat, thisTrialScene1Cat, thisTrialScene1){

	do{
		thisTrialScene2SemCong = randomIntFromInterval(0,1);
		thisTrialScene2SizeCong = randomIntFromInterval(0,1);

		console.log("thisTrialScene2SemCong: "+thisTrialScene2SemCong);
		console.log("thisTrialScene2SizeCong: "+thisTrialScene2SizeCong);
		
		// choose scene 2 category
		if (thisTrialScene2SemCong == 0){
			theseSceneCats = arrayRemove(sceneCats, thisTrialObjCat);
			if (thisTrialObjCat != thisTrialScene1Cat){
				theseSceneCats = arrayRemove(theseSceneCats, thisTrialScene1Cat);
			}
			thisTrialScene2Cat = shuffle(theseSceneCats)[0];
		}
		else {
			thisTrialScene2Cat = thisTrialScene1Cat;
		}

		//choose scene 2 zoom
		if (thisTrialScene2SizeCong == 0){
			if (thisTrialScene1ZoomName == "zi"){
				thisTrialScene2ZoomName = "zo";
			}
			else{
				thisTrialScene2ZoomName = "zi";
			}
		}
		else{
			thisTrialScene2ZoomName = thisTrialScene1ZoomName;
		}

		if (typeof(sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName]) == 'undefined'){
			innerFail = true;
		}
		else{
			theseTrialScenes2 = shuffle(sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName]);
			thisTrialScene2 = theseTrialScenes2[theseTrialScenes2.length - 1];
			if (thisTrialScene2SizeCong == 0){
				if (thisTrialScene1.slice(0, 2) == thisTrialScene2.slice(0, 2)){
					innerFail = true;
				}
				else {
					innerFail = false;
				}
			}
			else{
				if (thisTrialScene2SemCong == 1){
					if (typeof(sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName]) == 'undefined'){
						innerFail = true;
					}
					else {
						innerFail = false;
					}
				}
				else {
					innerFail = false;
				}
			}
		}
	}
	while(innerFail == true);

	thisTrialScene2 = theseTrialScenes2.pop();

	$("#scene2Image").attr("src","stimuli/" + thisTrialScene2Cat + "/scenes/" + thisTrialScene2ZoomName + "/" + thisTrialScene2);

	if (theseTrialScenes2.length == 0){
		delete sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName]
	}

	if (Object.keys(sceneDict[thisTrialScene2Cat]).length == 0){
		sceneCats = arrayRemove(sceneCats,thisTrialScene2Cat) //get rid of from future categories to choose from
		delete sceneDict[thisTrialScene2Cat];
	}

	return [thisTrialScene2SemCong, thisTrialScene2SizeCong, thisTrialScene2Cat, thisTrialScene2ZoomName, thisTrialScene2];
}

// function chooseSetScenes(thisTrialObjCat, thisTrialObjSize, thisTrialSizeCong,thisTrialSemCong,thisTrialScene2SemCong,thisTrialScene2SizeCong){

// 	// get scenes 1 and 2
// 	do{
// 		// set zoom level for scene 1
// 		if (thisTrialSizeCong == 0){
// 			if (thisTrialObjSize == 0){
// 				thisTrialScene1ZoomName = "zo";
// 			}
// 			else {
// 				thisTrialScene1ZoomName = "zi"
// 			}
// 		}
// 		else {
// 			if (thisTrialObjSize == 0){
// 				thisTrialScene1ZoomName = "zi";
// 			}
// 			else {
// 				thisTrialScene1ZoomName = "zo"
// 			}
// 		}

// 		//set category for scene 1
// 		if (thisTrialSemCong == 0){
// 			theseTrialScenes1 = sceneCats.filter((value)=>value!=thisTrialObjCat);
// 			thisTrialScene1Cat = theseTrialScenes1.pop();
// 		}
// 		else {
// 			thisTrialScene1Cat = thisTrialObjCat;
// 		}


// 		// set zoom level for scene 2
// 		if (thisTrialScene2SizeCong == 0){
// 			if (thisTrialScene1ZoomName == "zo"){
// 				thisTrialScene2ZoomName = "zi";
// 			}
// 			else {
// 				thisTrialScene2ZoomName = "zo";
// 			}
// 		}
// 		else {
// 			thisTrialScene2ZoomName = thisTrialScene1ZoomName;
// 		}

// 		//set category for scene 2
// 		if (thisTrialScene2SemCong == 0){
// 			theseTrialScenes2 = sceneCats.filter((value)=>value!=thisTrialObjCat); //filter out object category
// 			if (theseTrialScenes2.includes(thisTrialScene1Cat)){
// 				theseTrialScenes2 = theseTrialScenes1.filter((value)=>value!=thisTrialScene1Cat); //filter out scene 1 category
// 			}
// 			thisTrialScene2Cat = theseTrialScenes2.pop(); // choose random category from existing categories
// 		}
// 		else{
// 			// var index_counter = 0;
// 			// do{
// 				// thisTrialScene1Cat = sceneCats[index_counter]; //iterate through possible categories
// 			thisTrialScene2Cat = thisTrialScene1Cat; // second scene category is same as first
// 				// index_counter+=1; // go to next index if looped again
// 			// }
// 			// while(sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName].length < 2); // check that there are at least 2 scenes that fit this
// 		}
// 		var theseTrialScenes1 = sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName];
// 		var theseTrialScenes2 = sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName];
// 	}
// 	while(typeof(sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName]) == 'undefined' || typeof(sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName]) == 'undefined'); //while one of these categories doesn't exist

// 	//checked that both scenes exist in their respective conditions

// 	//choose scene images
// 	thisTrialScene1 = shuffle(theseTrialScenes1).pop();
// 	shuffledTheseTrialScenes2 = shuffle(theseTrialScenes2);
// 	thisTrialScene2 = shuffledTheseTrialScenes2[0]; //don't pop yet because we have to check that it is not the same as scene1
// 	console.log("scene1: ",thisTrialScene1);
// 	console.log("scene2: ",thisTrialScene2);
// 	if (thisTrialScene1.slice(0, 2) == thisTrialScene2.slice(0, 2)){
// 		thisTrialScene2 = shuffledTheseTrialScenes2[1];
// 	}

// 	// sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName]
// 	sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName] = sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName].filter((value)=>value!=thisTrialScene2); // manually "pop" scene2

// 	// remove zoom categories that may be empty
// 	if (theseTrialScenes1.length == 0){
// 		delete sceneDict[thisTrialScene1Cat][thisTrialScene1ZoomName];
// 	}
// 	else if (theseTrialScenes2.length == 0){
// 		delete sceneDict[thisTrialScene2Cat][thisTrialScene2ZoomName];
// 	}

// 	//remove scene categories that may be empty
// 	if (Object.keys(sceneDict[thisTrialScene1Cat]).length == 0){
// 		delete sceneDict[thisTrialScene1Cat];
// 	}
// 	else if (Object.keys(sceneDict[thisTrialScene2Cat]).length == 0){
// 		delete sceneDict[thisTrialScene2Cat];
// 	}

// 	//set scene images
// 	$("#scene1Image").attr("src","stimuli/" + thisTrialScene1Cat + "/scenes/" + thisTrialScene1ZoomName + "/" + thisTrialScene1);
// 	$("#scene2Image").attr("src","stimuli/" + thisTrialScene2Cat + "/scenes/" + thisTrialScene2ZoomName + "/" + thisTrialScene2);

// 	console.log("sceneDict: ", sceneDict)

//   	return [thisTrialScene1, thisTrialScene2, thisTrialScene1Cat, thisTrialScene2Cat];
// }

function chooseSetMask()
{
	var theseTrialMasks = shuffle(maskArray);
	var thisTrialMask = maskArray.pop();
	$("#maskImage").attr("src","masks/" + thisTrialMask);
}

// ----------------------
// presentation functions
// ----------------------

function showFixation(){
	// show fixation based on previous accuracy

	if (prevAcc==0){
		fixTime = 2000;
		$("#fixationRed").show();
	}
	if (prevAcc==1){
		fixTime = 1500;
		$("#fixationNeutral").show();
	}

	return fixTime
}

function showObj(){
	//show objects, hiding red fixation if necessary

	$(".fixationDiv").hide();

	$(document).ready(function(){
		$(".objectDiv").show();
		$(".circleDiv").show();
	})
}

function showScene1(){
	//show objects, hiding red fixation if necessary

	$(document).ready(function(){
		$(".objectDiv").show();
		$(".circleDiv").show();
		$(".scene1Div").show();
	})
}

function showMask(){
	// hide everything except experiment box, at end of each trial

	$("#experimentBox").children().hide();
	$(".maskDiv").show();
}

function showScene2(){
	// beginning point of trial RT 
	startTrialTime = new Date; 

	$(".maskDiv").hide();
	$("#fixationNeutral").show();
	$(".scene2Div").show();
}

function hideAll(){
	$("#experimentBox").children().hide();
}


// --------------------
// experiment functions
// --------------------

function startBlock(thisBlockNum) {
	// start running one block, onkeypress for button div

	if(thisBlockNum==0){
		prepareForFirstPracticeTrial(); 
		runTrial();
	}
	else{
		prepareForFirstTrial(); //get rid of instructions page and show experiment box
		runTrial(); //starts trial presentation, recursive function

	}
}

function runTrial(){
 	// run one trial --> recursive function (calls itself inside itself until some condition is met)

	if (thisBlockNum == 0){
		prepareForPracticeTrial();
	}
	else{
		prepareForTrial(); // get trial info, including category, condition, objects, and target, and set stimuli
	}
	// detectKeyPress(trialOver); //set keypress event listener, which times out end-of-trial timer if a valid key is pressed
	var objShown = setTimeout(function(){
		showObj();
	}, fixTime)
	var scene1Shown = setTimeout(function(){ //show objects after fixation time (400 or 800ms)
		showScene1();
	}, fixTime + objTime);
	var maskShown = setTimeout(function(){ //show gabors after fixation time + object time (4s)
		showMask();
	}, fixTime + objTime + scene1Time);
	var scene2Shown = setTimeout(function(){ //hide all stimuli and gabors after fixation time + object time + gabor timeout (2s)
		showScene2();
		detectKeyPress(trialOver);
	}, fixTime + objTime + scene1Time + maskTime)
	var trialOver = setTimeout(function(){ //show gabors after fixation time + object time (4s)
		nextTrial(); //set keypress event listener, which times out end-of-trial timer if a valid key is pressed
	}, fixTime + objTime + scene1Time + maskTime + scene2Time);
}

// function detectKeyPress(stimShown, maskShown, fixationShown, trialOver){
function detectKeyPress(trialOver){
	// see if key is pressed to end trial early

	// add event listener for keypress
	$(document).bind("keypress", function(event){
		if (event.which == 99){ //99 is js keycode for c
			key = "c";
			clearTimeout(trialOver); //get rid of end-of-trial timer
			nextTrial(); //since button was pressed, move onto next trial
		}
		else if (event.which == 109){ //109 is js keycode for m
			key = "m";
			clearTimeout(trialOver); //get rid of end-of-trial timer
			nextTrial(); //since button was pressed, move onto next trial
		}
	});
}

function nextTrial(){ //requires input variable because it is not a global variable --> different for practice and experiment blocks
	// advance to next trial OR end block

	$(document).unbind("keypress"); //assuming there has already been a keypress, remove event so it can be added for next trial
	hideAll();

	console.log("key: ", key);

	// save accuracy for this trial and update number correct for block accuracy
	if (keyDict[key] == thisTrialScene2SemCong){
		prevAcc = 1;
		numCorr++;
	}
	else if (keyDict[key] != thisTrialScene2SemCong){
		prevAcc = 0;
	}

	console.log("acc: ",prevAcc);
	var prac_blockAcc = numCorr/pracTotalTrials; //update block accuracy before adding 1 to trial in block number
	var endTrialTime = new Date;
	RT = endTrialTime - startTrialTime;

	if (thisBlockNum == 0){ //if practice block
		pracTrialNum ++ 
		if (pracTrialNum >= 6){
			if (prac_blockAcc > .8){ //if task is understood
				thisBlockNum++; //move onto experiment
			
			}
			else { //if task isn't understood
				pracTries++; //note that practice has been repeated	
				// saveTrialData();
			}
			showInstructions();
		
		}
		else{
			runTrial(); //re-run function
		}
	}

	else if (thisBlockNum != 0){
		// if the experiment is over 
		if (trialNum >= (totalTrials-1)){
			thisBlockNum++;
			saveTrialData();
			trialNum ++;
			showInstructions();
		}
		// do not save practice data
		else if (trialNum >= 0){
			saveTrialData();
			trialNum ++;
			runTrial();
		}
		// trialNum ++ 
	}

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
	thisData["experimentName"].push("OSS");
	thisData["versionName"].push("v7");
	thisData["windowWidth"].push($(window).width());
	thisData["windowHeight"].push($(window).height());
	thisData["screenWidth"].push(screen.width);
	thisData["screenHeight"].push(screen.height);
	thisData["startDate"].push(startDate);
	thisData["startTime"].push(startTime);
	thisData["pracTries"].push(pracTries);

	// trial-by-trial variables, changes each time this function is called
	thisData["trialNum"].push(trialNum);
	thisData["objectSize"].push(thisTrialObjSizeName);
	thisData["objectCategory"].push(thisTrialObjCat);
	thisData["object"].push(thisTrialObj);
	thisData["objectScene1SemanticCongruency"].push(thisTrialSemCong);
	thisData["scene1ZoomName"].push(thisTrialScene1ZoomName);
	thisData["scene1Category"].push(thisTrialScene1Cat);
	thisData["scene1"].push(thisTrialScene1);
	thisData["scene2SizeCong"].push(thisTrialScene2SizeCong);
	thisData["scene2SemCong"].push(thisTrialScene2SemCong);
	thisData["scene2ZoomName"].push(thisTrialScene2ZoomName);
	thisData["scene2Category"].push(thisTrialScene2Cat);
	thisData["scene2"].push(thisTrialScene2);
	thisData["keyPress"].push(key);
	thisData["accuracy"].push(prevAcc);
	thisData["RT"].push(RT);

	// use to debug if there is an offest in the php saving 
	// for (var key in thisData){
	// 	console.log(key, thisData[key].length)
	// }
}

function saveAllData() {
	// saves last pieces of data that needed to be collected at the end, and calls sendToServer function

	// add experimentTime and totalTime to data dictionary
	var experimentTime = (endExpTime - startExpTime);
	var totalTime = ((new Date()) - start);
	thisData["experimentTime"]=Array(trialNum).fill(experimentTime);
	thisData["totalTime"]=Array(trialNum).fill(totalTime);
	thisData["age"]=Array(trialNum).fill(reported_age);
	thisData["gender"]=Array(trialNum).fill(reported_gender);

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

function getAge(){
	$(document).ready(function(){
    	$(".experimentBox").hide();
   		// $(".sceneDiv").hide();
    	// $(".maskDiv").hide();
    	// $(".responseDiv").hide();
    	// $(".practice_feedbackDiv").hide()
    	// $("#restart_trials").hide();
    	// $("#restartTrialsButton").hide();
    	$("#age").show();
	})
}

function lastInstructions(){ 
  if (age_recorded == false){
    reported_age = document.getElementById("age_numb").value;
    reported_gender = document.getElementById("gender").value;
    console.log(reported_gender)
    saveTrialData();
    age_recorded = true
  }

  if (age_recorded == true){
    $("#age").hide() 
    $("#container-questionnaire").hide();
    $("#lastBlockInstructions").append(
      "<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
      +"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
    $("#lastBlockInstructions").show();
    $("#revealCodeButton").show();

  }
 

}
