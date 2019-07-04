let plattegrondForFloor = function (floor) {

    return function (p) {
        p.floor = floor;

        p.measurements = [];
        p.accessPoints = [];
        p.mouseWasInPologyon = false;

        let map_image;
        let doubleClick = 0;
        let polygonID = 0;

        p.preload = function () {
            map_image = p.loadImage("plattegrond/floor_" + p.floor + ".png");
        }
        let widthImage = 1266;
        let heightImage = 1356;

        p.setup = function () {
            p.widthWindow = $("#floor-1").width();
            p.heightWindow = parseInt((parseInt(p.widthWindow) / widthImage) * heightImage);
            p.scalingFactorX = p.widthWindow / widthImage;
            p.scalingFactory = p.heightWindow / heightImage;

            p.createCanvas(p.widthWindow, p.heightWindow);
            p.image(map_image, 0, 0, p.widthWindow, p.heightWindow);
            p.cal = new Calculations(p.scalingFactorX, p.scalingFactory);

            p.date = $.urlParam('datePicker');
            if (p.date == false) {
                p.loadJSON('/get_measurements_map', p.parseMeasurementData);
            } else {
                p.loadJSON('/get_measurements_map?date=' + p.date, p.parseMeasurementData);
            }
            p.loadJSON('/get_access_points', p.parseAccessPointData);
        };


        p.draw = function () {
            let polygonID = p.getPolygonID();

            if (polygonID != 0 && p.vis != undefined) {

                p.highlightArea(polygonID);
                p.highlightLineChart(polygonID);
                updateCounterForArea(polygonID);
                p.mouseWasInPologyon = true;
                //console.log(p.mouseWasInPologyon);
                //p.updateChart(false);
            } else if (p.vis != undefined && p.mouseWasInPologyon) {
                p.clearHighlight();
                p.clearHighlightLineChart();
                updateCounterForArea(0);
            }

        };

        p.getPolygonID = function () {
            return p.mouseInPologyon();
        };

        p.highlightArea = function (polygonID) {
            p.clear();
            p.image(map_image, 0, 0, p.widthWindow, p.heightWindow);
            p.vis.drawAreasClicked(polygonID, p.accessPoints);
        }

        p.clearHighlight = function () {
            p.clear();
            p.image(map_image, 0, 0, p.widthWindow, p.heightWindow);
            p.vis.calculateOverlayColor(p.measurements, p.accessPoints);
        }

        p.highlightLineChart = function (polygonID) {

            for (series in chart.series) {
                if (apStringToInt(chart.series[series].name) == polygonID) {
               ///     console.log("in hover if statement");
                    chart.series[series].setState("hover");
                } else {
                    chart.series[series].setState("inactive");
                }


            }
        };
        p.clearHighlightLineChart = function () {

            if (floor1.getPolygonID() == 0 && floor2.getPolygonID() == 0 && p.mouseWasInPologyon) {
                p.mouseWasInPologyon = false;
             //   console.log("in the if statement");
                for (series in chart.series) {
                    chart.series[series].setState("hover");
                }
            }
        }

        // p.updateChart = function (allowed) {
        //
        //     chart.update({
        //         plotOptions: {
        //             series: {
        //                 enableMouseTracking: allowed
        //             }
        //         }
        //     });
        // }

        p.mouseInPologyon = function () {
            for (let i = 0; i < p.accessPoints.length; i++) {
                if (p.accessPoints[i].floor == this.floor && p.cal.mouseInPointCheck(p.mouseX, p.mouseY, p.accessPoints[i])) {
                    return p.accessPoints[i].id;
                }
            }
            return 0;
        }


        p.parseAccessPointData = function (data) {
            for (let i in data) {
                let numOfChairs = data[i].NumberOfChairs;
                let id = data[i].ID;
                let floor = data[i].Floor;
                let mapVertices = data[i].MapVertices;
                p.accessPoints[i] = new AccessPoint(id, null, 0, 0, floor, mapVertices, numOfChairs);
            }
            p.makeVisualization();
        }

        p.parseMeasurementData = function (data) {
            for (let i in data) {
                p.id = data[i].ID;
                p.apID = data[i].AP_ID;
                p.date = data[i].Date;
                p.estimatedPeople = data[i].estimated_people;
                p.measurements[i] = new Measurement(p.id, p.apID, p.date, p.estimatedPeople);
            }
            p.makeVisualization();
        }


        p.makeVisualization = function () {
            if (p.accessPoints.length != 0 && p.measurements.length != 0) {
                p.vis = new Vizualisatie(p.accessPoints, p.measurements, p, p.scalingFactorX, p.scalingFactory, p.cal, p.floor);
            }
        }

        p.setFloor = function (floor) {
            this.floor = floor;
            p.makeVisualization();
        }
    };


}

