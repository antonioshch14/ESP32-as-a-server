// UNO INTERFACE internTemp, internHumid, outTemp, outHumid, sun, air, status, mq135test, mq9test
//HTML INTERFACE internTemp, internHumid, outTemp, outHumid, sun, air, mq135test, mq9test
//HTML INTERFACE light1, light1State, light2, light2State
//STATUS NAMES man_invalidData, fan_on, blind_open, blind_automatedOperation, light_light1, light_light2, Fan_sLow, Fan_low, Fan_medium, Fan_intence, Fan_sIntence, fan.remoteFanOn
//STATUS NAMES man_invalidData 0, fan_on 1, blind_open 2, blind_automatedOperation 3, light_light1 4, light_light2 5, 
//STATUS MANE automatedOperation 6, automatedOperationWithOutHumanActiv 7

// JavaScript source code
var Socket;
var var1, var2, var3;
var IDforli = 0; //sets IDs for appended li
var maxAppLi = 4;
var newLiElement = [];
var UNOlineElement = [];
var messageLi = document.getElementById("messages"); 
var htmlentryUNO = document.getElementById("UNOdata");
var UNO = {
	"internTemp": 0.0, //internTemp, internHumid, outTemp, outHumid, air, mq135test, mq9test
	"internHumid": 0.0,
	"outTemp": 0.0, 
	"outHumid": 0.0,
	"air": 0,
	"sun":0,
	"mq135test": 0,
	"mq9test": 0, 
	"man_invalidData": false,
	"fan_on": false,
	"blind_open": false,
	"blind_automatedOperation": false,
	"light_light1": false,
	"light_light2": false,
	"Fan_sLow": false,
	"Fan_low": false,
	"Fan_medium": false,
	"Fan_intence": false,
	"Fan_sIntence": false,
	"fan_remoteFanOn": false, 
	"automatedOperation": false,
	"automatedOperationWithOutHumanActiv": false,
	"fan_pauseOn": false
};
{
	let i = 0;
	for (const [key, value] of Object.entries(UNO)) {
		let newLi = document.createElement("h4");
		newLi.innerHTML = key + ': ' + value;
		htmlentryUNO.appendChild(newLi);
		newLi.setAttribute('id', "UNO" + key);
		UNOlineElement[i] = document.getElementById("UNO" + key);
		
		console.log(UNOlineElement[i].innerHTML)
		i++;
	 }
}
var temp;
var humid;
var humidAver;

var stateBin=[];


function init() {
	Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
	Socket.onmessage = function (event) { processReceivedCommand(event); };
}

/*
document.getElementById('testButton').addEventListener('click', testSubmitted);
function testSubmitted() {
	Socket = document.getElementById('testInput').value;
	parseDataFromESP(Socket);
	processReceivedCommand(Socket);
}
*/
function parseDataFromESP(data) { // UNO INTERFACE internTemp, internHumid, outTemp, outHumid, sun, air, status, mq135test, mq9test
	let beginning = data.indexOf('{');
	let fullEnd = data.indexOf('}');
	if (beginning != -1 && fullEnd != -1) {
		beginning += 1;
		let stateHex = '';
		if (beginning != 0 && fullEnd != 0) {
			let currentEnd = data.indexOf(',', beginning);
			UNO.internTemp = parseFloat(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			UNO.internHumid = parseFloat(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			UNO.outTemp = parseInt(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			UNO.outHumid = parseFloat(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			UNO.sun = parseInt(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			UNO.air = parseInt(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			stateHex = data.substring(beginning, currentEnd);
			beginning = currentEnd + 1;
			currentEnd = data.indexOf(',', beginning);
			UNO.mq135test = parseInt(data.substring(beginning, currentEnd));
			beginning = currentEnd + 1;
			UNO.mq9test = parseInt(data.substring(beginning, fullEnd));
		}
		function string2Bin(str) {
			let char = 0;
			let incr = 0;
			for (let i = str.length - 1; i >= 0; i--) {
				char += nibble(str.charCodeAt(i)) * Math.pow(16, incr);
				incr++;
			}
			char += 65536; //ad 1 0000 0000 0000 0000 to not loose data in  case if 0001. char at starts from highest bit, i.e. always 1
			return char.toString(2);

		}
		stateBin = string2Bin(stateHex);  //0-x. 1-7(L), 2-6,3-5,4-4,5-3,6-2,7-1, 9-7(H),10-6,11-5,12-4,13-3,14-2,15-1,16-0
		//console.log(stateBin);
		if (stateBin.charAt(8) == '1') UNO.man_invalidData = true;
		else UNO.man_invalidData = false;
		if (stateBin.charAt(7) == '1') UNO.fan_on = true;
		else UNO.fan_on = false;
		if (stateBin.charAt(6) == '1') UNO.blind_open = true;
		else UNO.blind_open = false;
		if (stateBin.charAt(5) == '1') UNO.blind_automatedOperation = true;
		else UNO.blind_automatedOperation = false;
		if (stateBin.charAt(4) == '1') UNO.light_light1 = true;
		else UNO.light_light1 = false;
		if (stateBin.charAt(3) == '1') UNO.light_light2 = true;
		else UNO.light_light2 = false;
		if (stateBin.charAt(2) == '1') UNO.automatedOperation = true;
		else UNO.automatedOperation = false;
		if (stateBin.charAt(1) == '1') UNO.automatedOperationWithOutHumanActiv = true;
		else UNO.automatedOperationWithOutHumanActiv = false;
		if (stateBin.charAt(16) == '1') UNO.Fan_sLow = true;
		else UNO.Fan_sLow = false;
		if (stateBin.charAt(15) == '1') UNO.Fan_low = true;
		else UNO.Fan_low = false;
		if (stateBin.charAt(14) == '1') UNO.Fan_medium = true;
		else UNO.Fan_medium = false;
		if (stateBin.charAt(13) == '1') UNO.Fan_intence = true;
		else UNO.Fan_intence = false;
		if (stateBin.charAt(12) == '1') UNO.Fan_sIntence = true;
		else UNO.Fan_sIntence = false;
		if (stateBin.charAt(11) == '1') UNO.fan_remoteFanOn = true;
		else UNO.fan_remoteFanOn = false;
		if (stateBin.charAt(10) == '1') UNO.fan_pauseOn = true;
		else UNO.fan_pauseOn = false;
		updateESPFront();

	}
}



function nibble(c)
{
	if (c >= 48 && c <= 57)
		return c-48;

	if (c >= 97 && c <= 102)
		return c - 87;

	if (c >= 65 && c <= 70)
		return c-55;

	return 0;  
}
function updateESPFront() {
	let i = 0;
	for (const [key, value] of Object.entries(UNO)) {
		UNOlineElement[i].innerHTML = key + ': ' + value;
		i++;
	}
	if (UNO.fan_on) {
		document.getElementById('fan1').innerHTML = 'Switch OFF';
		document.getElementById('fan1State').innerHTML = ' fan 1 is working';
	} else {
		document.getElementById('fan1').innerHTML = 'Switch ON';
		document.getElementById('fan1State').innerHTML = ' fan 1 is not working';
	}
	if (UNO.fan_remoteFanOn) {
		document.getElementById('fan2').innerHTML = 'Switch OFF';
		document.getElementById('fan2State').innerHTML = ' fan 2 is working';
	} else {
		document.getElementById('fan2').innerHTML = 'Switch ON';
		document.getElementById('fan2State').innerHTML = ' fan 2 is not working';
	}
	if (UNO.light_light1) {
	document.getElementById('light1').innerHTML = 'Switch OFF';
	document.getElementById('light1State').innerHTML = ' light 1 is ON';
	} else {
	document.getElementById('light1').innerHTML = 'Switch ON';
	document.getElementById('light1State').innerHTML = ' light 1 is unllit';
	}
	if (UNO.light_light2) {
		document.getElementById('light2').innerHTML = 'Switch OFF';
		document.getElementById('light2State').innerHTML = ' light 2 is ON';
	} else {
		document.getElementById('light2').innerHTML = 'Switch ON';
		document.getElementById('light2State').innerHTML = ' light 2 is unllit';
	}
	if (UNO.automatedOperation) {
		document.getElementById('lightSetAuto').innerHTML = 'Switch OFF';
		document.getElementById('lightSetAutoState').innerHTML = ' is ON';
	} else {
		document.getElementById('lightSetAuto').innerHTML = 'Switch ON';
		document.getElementById('lightSetAutoState').innerHTML = ' is OFF';
	}
	if (UNO.automatedOperationWithOutHumanActiv) {
		document.getElementById('lightAuto').innerHTML = 'Switch OFF';
		document.getElementById('lightAutoState').innerHTML = ' is ON';
	} else {
		document.getElementById('lightAuto').innerHTML = 'Switch ON';
		document.getElementById('lightAutoState').innerHTML = ' is OFF';
	}
	if (UNO.fan_pauseOn) { 
		document.getElementById('pause').innerHTML = 'PAUSE OFF';
		document.getElementById('pauseState').innerHTML = ' is ON';
	} else {
		document.getElementById('pause').innerHTML = 'PAUSE ON';
		document.getElementById('pauseState').innerHTML = ' is OFF';
	}
}

document.getElementById('fan1').addEventListener('click', startFan1);
//document.getElementById('fan2').addEventListener('click', startFan2);
document.getElementById('light1').addEventListener('click', light1);
document.getElementById('light2').addEventListener('click', light2);
document.getElementById('lightAuto').addEventListener('click', lightAuto); 
document.getElementById('lightSetAuto').addEventListener('click', lightSetAuto);
document.getElementById('pause').addEventListener('click', fanPause);


function getValueFromStr(string, field) {
	let beginning = string.indexOf(field) + field.length;
	let ending = string.indexOf(',', beginning);
	return string.substring(beginning, ending);
}
function addNewLi(message) {
	let newLi = document.createElement("li");
	newLi.innerHTML = message;
	newLi.setAttribute('id', "appendedLi" + IDforli);
	messageLi.appendChild(newLi);
	if (IDforli > maxAppLi) {
		newLiElement[0].parentNode.removeChild(newLiElement[0]);
		newLiElement.shift();
		newLiElement.push(document.getElementById("appendedLi" + IDforli));
		newLiElement.forEach(function (item, index) {
			item.setAttribute('id', "appendedLi" + index)
		});
	} else {
		newLiElement[IDforli] = document.getElementById("appendedLi" + IDforli);
		IDforli++;
	}
}
function processReceivedCommand(evt) {
	let recievedData = evt.data;
	parseDataFromESP(recievedData);
	document.getElementById('rd').innerHTML = recievedData;
	addNewLi(recievedData);
	


	//if (recievedData === 'L_ON') {
	//	document.getElementById('light').innerHTML = 'Switch OFF';
	//	document.getElementById('lightState').innerHTML = 'Light is ON';
	//}
}



function startFan1() {
	var btn = document.getElementById('fan1')
	var btnText = btn.innerText;
	if (btnText === 'Switch ON') {
		sendText('fanstart:600000;');
		document.getElementById('fan1').innerHTML = 'Switch OFF'; 
		
	} else {
		sendText('fanStop:;');
		document.getElementById('fan1').innerHTML = 'Switch ON';
		
	}

}
function fanPause() {
	var btn = document.getElementById('pause')
	var btnText = btn.innerText;
	if (btnText === 'PAUSE ON') {
		sendText('pauseActivate');
		btn.innerHTML = 'PAUSE OFF';

	} else {
		sendText('pauseReset');
		btn.innerHTML = 'PAUSE ON';

	}

}
 
function light1() { //set 0 to switch both off, 1: 1-on 2-off, 2: 1-off, 2-on, 3: both on, 
							//4-automated operation, 5-night mode; 6-day mode
	let btn = document.getElementById('light1')
	let btn2 = document.getElementById('light2')
	let btnText = btn.innerText;
	if (btnText === 'Switch ON') {
		if (btn2.innerText == 'Switch ON') sendText('lightset:2;');
		else sendText('lightset:0;');
		btn.innerHTML = 'Switch OFF';
		
	} else {
		if (btn2.innerText == 'Switch ON') sendText('lightset:3;');
		else sendText('lightset:1;');
		
		btn.innerHTML = 'Switch ON';
		
	}

}
function light2() { //set 0 to switch both off, 1: 1-on 2-off, 2: 1-off, 2-on, 3: both on, 
	//4-automated operation, 5-night mode; 6-day mode
	let btn = document.getElementById('light2')
	let btn2 = document.getElementById('light1')
	let btnText = btn.innerText;
	if (btnText === 'Switch ON') {
		if (btn2.innerText == 'Switch ON') sendText('lightset:2;');
		else sendText('lightset:0;');
		btn.innerHTML = 'Switch OFF';

	} else {
		if (btn2.innerText == 'Switch ON') sendText('lightset:3;');
		else sendText('lightset:2;');

		btn.innerHTML = 'Switch ON';

	}

}
//automatedOperationWithOutHumanActiv 
function lightAuto() {
	let btn = document.getElementById('lightAuto')
	let btnText = btn.innerText;
	if (btnText === 'Switch ON') {
		
		sendText('automatedOperationWithOutHumanActiv');
		btn.innerHTML = 'Switch OFF';

	} else {
		sendText('automatedOperationWithOutHumanActiv');

		btn.innerHTML = 'Switch ON';

	}
}
function lightSetAuto() {
	 sendText('lightset:4;');
}
//function pushAirVick() {
//	sendText('airvickPush:;');
//}
//function fanTimeSubmit() {
//	var time = document.getElementById('fanTime').value;
//	sendText('fanStart:' + time + ';');
//	document.getElementById('fanTime').value = '';
//}
function sendText(data) {
	Socket.send(data);
}
window.onload = function (e) {
	init();
}
