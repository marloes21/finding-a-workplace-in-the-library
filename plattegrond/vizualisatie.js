class Vizualisatie {
    //Draw the overlay of the map visualisation
    constructor(accessPoints, measurements, p, scalingFactorX, scalingFactorY, cal, floor) {
        this.accessPoints = accessPoints;
        this.measurements = measurements;
        this.p = p;
        this.scalingFactorX = scalingFactorX;
        this.scalingFactory = scalingFactorY;
        this.cal = cal;
        this.floor = floor;

        this.calculateOverlayColor(this.measurements, this.accessPoints);
    }

    //loop through all the averages and than add the the correct color the to the data
    calculateOverlayColor(measurements, ap) {
        let averageEstimatedPeoplePerAP = this.cal.calculateAverage(this.cal.getFloor(ap, this.floor), measurements); // this.getMeasurementForOneHour(measurements));
        for (let i = 0; i < ap.length; i++) {
            for (let j = 0; j < averageEstimatedPeoplePerAP.length; j++) {
                if (averageEstimatedPeoplePerAP[j][0] == ap[i].id) {
                    let presenatage = (averageEstimatedPeoplePerAP[j][1] / ap[i].numOfChairs) * 100;
                    this.p.strokeWeight(2);
                    ap[i].addColor(this.cal.calculateFill(presenatage, 0.25));
                    this.drawOverlay(ap[i], 50);
                }
            }
        }
    }

    //draw the overlay of the image with each area the correct color
    drawOverlay(ap, alpha) {
        let colors = ap.getAverageColors();
        this.p.fill(colors[0], colors[1], colors[2], alpha);
        this.p.strokeWeight(0);
        this.p.beginShape();

        let vertices = ap.getMapVerticesWithOffset(this.scalingFactorX, this.scalingFactory);
        for (let k = 0; k < vertices.length; k++) {
            this.p.vertex(vertices[k][0], vertices[k][1]);
        }
        this.p.endShape();

    }

    //when an area is clicked increase the opacity of the color of the clicked area and decrease the opacity of the other areas
    drawAreasClicked(pologyonID, accessPoints) {
        for (let i = 0; i < accessPoints.length; i++) {
            if (accessPoints[i].floor == this.floor) {
                if (accessPoints[i].id == pologyonID) {
                    this.drawOverlay(accessPoints[i], 95);
                } else {
                    this.drawOverlay(accessPoints[i], 20);
                }
            }
        }
    }

}
