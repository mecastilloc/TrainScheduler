var config = {
    apiKey: "AIzaSyCwxpb4tsDeDn1GrobbppFZdELY69Ajtlw",
    authDomain: "train-schedule-mecastilloc.firebaseapp.com",
    databaseURL: "https://train-schedule-mecastilloc.firebaseio.com",
    projectId: "train-schedule-mecastilloc",
    storageBucket: "train-schedule-mecastilloc.appspot.com",
    messagingSenderId: "370768070785"
};

var trainFirst;
var away;

firebase.initializeApp(config);

var dB = firebase.database();

$("#submitbtn").on("click", function(event) {
    event.preventDefault();

// $("#submitbtn").click(function (event) {
//     event.preventDefault();
    var trainName = $("#trainname").val().trim();
    var destination = $("#traindestiny").val().trim();
    trainFirst = $("#trainfirst").val().trim();
    console.log(trainFirst);
    var trainFrec = $("#trainfrec").val().trim();

    dB.ref().push({
        trainName: trainName,
        destination: destination,
        trainFirst: trainFirst,
        trainFrec: trainFrec,
    });
    
});

// Firebase watcher + initial loader  .on("value")
dB.ref().on("child_added", function (snapshot) {
    var tr = $("<tr>");
    var tdName = $("<td>");
    var tdDestiny = $("<td>");
    var tdFrec = $("<td>");
    var tdNext = $("<td>");
    var tdAway = $("<td>");

       // Assumptions
       var tFrequency = 3;

       // Time is 3:30 AM
       var firstTime = "03:30";
   
       // First Time (pushed back 1 year to make sure it comes before current time)
       var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
       console.log(firstTimeConverted);
   
       // Current Time
       var currentTime = moment();
       console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
   
       // Difference between the times
       var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
       console.log("DIFFERENCE IN TIME: " + diffTime);
   
       // Time apart (remainder)
       var tRemainder = diffTime % tFrequency;
       console.log(tRemainder);
   
       // Minute Until Train
       var tMinutesTillTrain = tFrequency - tRemainder;
       console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
   
       // Next Train
       var nextTrain = moment().add(tMinutesTillTrain, "minutes");
       console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Change the HTML to reflect
    tdName.text(snapshot.val().trainName);
    tdDestiny.text(snapshot.val().destination);
    tdFrec.text(snapshot.val().trainFrec);



    tdNext.text("prueba");
    tdAway.text("prueba");

    tr.append(tdName);
    tr.append(tdDestiny);
    tr.append(tdFrec);
    tr.append(tdNext);
    tr.append(tdAway);
    $("tbody").append(tr);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
