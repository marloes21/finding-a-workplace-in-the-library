let urlMeas = "/get_measurements_chairs.php";
let urlAP = "/get_access_points.php";
let totalNumberStudent = 0;
let totalNumberOfChairs = 0;
let seatCounter;

let startSeatCounter = function () {
    seatCounter = new CountUp('available-seats', 0, {
        duration: 3
    });
    seatCounter.start();

    updateFunction();
    setInterval(updateFunction, 15000);
};

let updateFunction = function () {
    totalNumberStudent = 0;
    totalNumberOfChairs = 0;

    $.getJSON(urlMeas, function (data) {
        for (let i in data) {
            totalNumberStudent += parseInt(data[i].estimated_people);
        }
        updateCounter();
    });

    $.getJSON(urlAP, function (data) {
        for (let i in data) {
            //  console.log(data[i].NumberOfChairs);
            totalNumberOfChairs += parseInt(data[i].NumberOfChairs);
        }
        updateCounter();
    });
};

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