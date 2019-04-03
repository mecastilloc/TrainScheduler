//initial firebase app data
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
var trainFrec;

//initialize firebase app
firebase.initializeApp(config);
//firebase var
var dB = firebase.database();


$("#submitbtn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#trainname").val().trim();
    var destination = $("#traindestiny").val().trim();
    trainFirst = $("#trainfirst").val().trim();
    trainFrec = $("#trainfrec").val().trim();

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

    // this sv variable to write less code
    var sv = snapshot.val();
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(sv.trainFirst, "hh:mm").subtract(1, "years");
    console.log("trainfirst" + sv.trainFirst)
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    away = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + away);
    // Time apart (remainder)
    var tRemainder = away % sv.trainFrec;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = sv.trainFrec - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    // Change the HTML to reflect
    tdName.text(sv.trainName);
    tdDestiny.text(sv.destination);
    tdFrec.text(sv.trainFrec);
    tdNext.text(moment(nextTrain).format("hh:mm"));
    tdAway.text(moment.duration(tMinutesTillTrain, "minutes").format("hh:mm"));

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
