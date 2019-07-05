let urlMeas = "/get_measurements_chairs.php";
let urlAP = "/get_access_points.php";
let totalNumberStudent = 0;
let totalNumberOfChairs = 0;
let freeChairsPerAp = [];
let seatCounter;
let currentAreaForCounter = 0;


let startSeatCounter = function () {
    seatCounter = new CountUp('available-seats', 0, {
        duration: 2
    });
    seatCounter.start();

    updateFunction();
    //setInterval(updateFunction, 15000);
};

let updateFunction = function () {
    totalNumberStudent = 0;
    totalNumberOfChairs = 0;

    //get the measurements and add all this to the an array to count how many empty chairs there are
    $.getJSON(urlMeas, function (data) {
        for (let i in data) {
            totalNumberStudent += parseInt(data[i].estimated_people);
            free_chairs = parseInt(data[i].number_of_chairs) - parseInt(data[i].estimated_people);
            freeChairsPerAp[data[i].AP_ID] = free_chairs > 0 ? free_chairs : 0;
        }
        updateCounter();
    });

    //get the total number of chairs availble.
    $.getJSON(urlAP, function (data) {
        for (let i in data) {
            //  console.log(data[i].NumberOfChairs);
            totalNumberOfChairs += parseInt(data[i].NumberOfChairs);
        }
        updateCounter();
    });
};

//Update the counter to the correct number of chairs. Only when there is data is loaded.
updateCounter = function () {
    if (totalNumberOfChairs != 0 && totalNumberStudent != 0) {
        let numberFreeChairs = totalNumberOfChairs - totalNumberStudent;
        seatCounter.update(numberFreeChairs);
    }
    countReady = true;
    removeOverlay();
};

$(document).ready(function () {
    startSeatCounter();
});

let updateCounterForArea = function (ap_id) {
    if (ap_id != currentAreaForCounter) {
        currentAreaForCounter = ap_id;
        if (ap_id == 0) {
            updateCounter();
            $("#display-area-name").hide();
        } else {
            seatCounter.update(freeChairsPerAp[ap_id]);
            $("#area-name").text(ap_id);
            $("#display-area-name").show();
        }
    }
};