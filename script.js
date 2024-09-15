// Your Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBUe4wiGjZRxn-ZrBRt4n1sPY8KHnOCOwI",
    authDomain: "smart-room16.firebaseapp.com",
    databaseURL: "https://smart-room16-default-rtdb.firebaseio.com",
    projectId: "smart-room16",
    storageBucket: "smart-room16.appspot.com",
    messagingSenderId: "1088790963748",
    appId: "1:1088790963748:web:07b99d59acaf28986b5ab1",
    measurementId: "G-WTR1TYFCF7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function(){
    var database = firebase.database();
    var Led1Status, Led2Status, Led3Status, Led4Status;
    var FanSpeed = 0; // Default fan speed

    // Fetch LED statuses and fan speed
    database.ref().on("value", function(snap){
        Led1Status = snap.val().Led1Status;
        Led2Status = snap.val().Led2Status;
        Led3Status = snap.val().Led3Status;
        Led4Status = snap.val().Led4Status;
        FanSpeed = snap.val().FanSpeed; // Retrieve FanSpeed from Firebase
        updateLEDDisplay(Led1Status, Led2Status, Led3Status, Led4Status);
        document.getElementById("fanPercentage").innerText = FanSpeed + " %"; // Update fan speed in HTML
    });

    // Toggle button click events for LEDs
    $(".toggle-btn").click(function(){
        toggleLedStatus('Led1Status', Led1Status);
    });
    $(".toggle-btn1").click(function(){
        toggleLedStatus('Led2Status', Led2Status);
    });
    $(".toggle-btn2").click(function(){
        toggleLedStatus('Led3Status', Led3Status);
    });
    $(".toggle-btn3").click(function(){
        toggleLedStatus('Led4Status', Led4Status);
    });

    function toggleLedStatus(ledKey, ledStatus) {
        var firebaseRef = firebase.database().ref().child(ledKey);
        firebaseRef.set(ledStatus == "1" ? "0" : "1");
    }

    function updateLEDDisplay(Led1Status, Led2Status, Led3Status, Led4Status) {
        // Update LED 1
        $("#unact").toggle(Led1Status != "1");
        $("#act").toggle(Led1Status == "1");

        // Update LED 2
        $("#unact1").toggle(Led2Status != "1");
        $("#act1").toggle(Led2Status == "1");

        // Update LED 3
        $("#unact2").toggle(Led3Status != "1");
        $("#act2").toggle(Led3Status == "1");

        // Update LED 4
        $("#unact3").toggle(Led4Status != "1");
        $("#act3").toggle(Led4Status == "1");
    }

    // Fetch Temperature and Humidity data from Firebase
    var tempRef = database.ref('Temperature');
    var humidityRef = database.ref('HumidityPercentage');

    tempRef.on("value", function(snapshot) {
        $(".temp").text("Temperature: " + snapshot.val() + "°C");
    });

    humidityRef.on("value", function(snapshot) {
        $(".humidity").text("Humidity: " + snapshot.val() + " %");
    });

    // Fan Speed control using - and + buttons
    $(".button").click(function(){
        if (FanSpeed > 0) {
            FanSpeed = Math.max(FanSpeed - 20, 0); // Decrease fan speed, min 0
        }
        database.ref('FanSpeed').set(FanSpeed); // Update Firebase
    });

    $(".button1").click(function(){
        if (FanSpeed < 100) {
            FanSpeed = Math.min(FanSpeed + 20, 100); // Increase fan speed, max 100
        }
        database.ref('FanSpeed').set(FanSpeed); // Update Firebase
    });
});
