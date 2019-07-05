let plattegrondForFloor = function (floor) {

    return function (p) {
        p.floor = floor;

        //To have an array of different access points and measurements
        p.measurements = [];
        p.accessPoints = [];
        p.mouseWasInPologyon = false;

        let map_image;

        //Load the correct image
        p.preload = function () {
            map_image = p.loadImage("plattegrond/floor_" + p.floor + ".png");
        };

        //the width and hight of the image
        let widthImage = 1266;
        let heightImage = 1356;

        p.setup = function () {

            //calcualte the scalingfactors needed for the image
            p.widthWindow = $("#floor-1").width();
            p.heightWindow = parseInt((parseInt(p.widthWindow) / widthImage) * heightImage);
            p.scalingFactorX = p.widthWindow / widthImage;
            p.scalingFactory = p.heightWindow / heightImage;

            //load the image with the correct size
            p.createCanvas(p.widthWindow, p.heightWindow);
            p.image(map_image, 0, 0, p.widthWindow, p.heightWindow);

            //make instance of the calculations class
            p.cal = new Calculations(p.scalingFactorX, p.scalingFactory);

            //Depeding on the chosen date the measurement is called with a certian date.
            p.date = $.urlParam('datePicker');
            if (p.date == false) {
                p.loadJSON('/get_measurements_map', p.parseMeasurementData);
            } else {
                p.loadJSON('/get_measurements_map?date=' + p.date, p.parseMeasurementData);
            }
            p.loadJSON('/get_access_points', p.parseAccessPointData);
        };


        p.draw = function () {
            //Here the interaction is done wiht the other graphs. When the mouse is in an area interact with the other
            //visualisations, when the mouse is not in an area anymore than clear the interaction with the other area's
            let polygonID = p.getPolygonID();

            if (polygonID != 0 && p.vis != undefined) {

                p.highlightArea(polygonID);
                p.highlightLineChart(polygonID);
                updateCounterForArea(polygonID);
                p.mouseWasInPologyon = true;
            } else if (p.vis != undefined && p.mouseWasInPologyon) {
                p.clearHighlight();
                p.clearHighlightLineChart();
                updateCounterForArea(0);
            }

        };

        //check in which area the mouse is in.
        p.getPolygonID = function () {
            return p.mouseInPologyon();
        };

        //highilight the correct area
        p.highlightArea = function (polygonID) {
            p.clear();
            p.image(map_image, 0, 0, p.widthWindow, p.heightWindow);
            p.vis.drawAreasClicked(polygonID, p.accessPoints);
        };

        //de highlight the correct area.
        p.clearHighlight = function () {
            p.clear();
            p.image(map_image, 0, 0, p.widthWindow, p.heightWindow);
            p.vis.calculateOverlayColor(p.measurements, p.accessPoints);
        };

        //highlight the correct line in the linechart
        p.highlightLineChart = function (polygonID) {

            for (series in chart.series) {
                if (apStringToInt(chart.series[series].name) == polygonID) {
                    chart.series[series].setState("hover");
                } else {
                    chart.series[series].setState("inactive");
                }


            }
        };

        //de highlihgt all the lines in the linehcart
        p.clearHighlightLineChart = function () {

            if (floor1.getPolygonID() == 0 && floor2.getPolygonID() == 0 && p.mouseWasInPologyon) {
                p.mouseWasInPologyon = false;
             //   console.log("in the if statement");
                for (series in chart.series) {
                    chart.series[series].setState("hover");
                }
            }
        };


        // check for all areas if the mouse is in that area
        p.mouseInPologyon = function () {
            for (let i = 0; i < p.accessPoints.length; i++) {
                if (p.accessPoints[i].floor == this.floor && p.cal.mouseInPointCheck(p.mouseX, p.mouseY, p.accessPoints[i])) {
                    return p.accessPoints[i].id;
                }
            }
            return 0;
        };

        //get the access point data from the PHP script and load it into an array of accessPoints class
        p.parseAccessPointData = function (data) {
            for (let i in data) {
                let numOfChairs = data[i].NumberOfChairs;
                let id = data[i].ID;
                let floor = data[i].Floor;
                let mapVertices = data[i].MapVertices;
                p.accessPoints[i] = new AccessPoint(id, floor, mapVertices, numOfChairs);
            }
            p.makeVisualization();
        };


        //get the measurement data from the PHP script and load it into an array of measurement class
        p.parseMeasurementData = function (data) {
            for (let i in data) {
                p.id = data[i].ID;
                p.apID = data[i].AP_ID;
                p.date = data[i].Date;
                p.estimatedPeople = data[i].estimated_people;
                p.measurements[i] = new Measurement(p.id, p.apID, p.date, p.estimatedPeople);
            }
            p.makeVisualization();
        };

        //when all the data is loaded than start making the visualisation
        p.makeVisualization = function () {
            if (p.accessPoints.length != 0 && p.measurements.length != 0) {
                p.vis = new Vizualisatie(p.accessPoints, p.measurements, p, p.scalingFactorX, p.scalingFactory, p.cal, p.floor);
            }
        };

        p.setFloor = function (floor) {
            this.floor = floor;
            p.makeVisualization();
        }
    };
};

