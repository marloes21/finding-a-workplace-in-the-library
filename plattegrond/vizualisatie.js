class Vizualisatie {

    constructor(accessPoints, measurements, p, scalingFactorX, scalingFactorY, cal, floor, offsetFactor) {
        this.accessPoints = accessPoints;
        this.measurements = measurements;
        this.p = p;
        this.scalingFactorX = scalingFactorX;
        this.scalingFactory = scalingFactorY;
        this.cal = cal;
        this.floor = floor;
        this.offsetFactor = offsetFactor;

        // cal.calculateAverage(cal.getFloor(this.accessPoints), this.measurements); //this.getMeasurementForOneHour(this.measurements));
        this.calculateOverlayColor(this.measurements, this.accessPoints);
    }

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

    drawOverlay(ap, alpha) {
        let colorsISKUT = ap.getAverageColors();
        this.p.fill(colorsISKUT[0], colorsISKUT[1], colorsISKUT[2], alpha);
        this.p.strokeWeight(0);
        this.p.beginShape();

        let vertices = ap.getMapVerticesWithOffset(this.scalingFactorX, this.scalingFactory);
        for (let k = 0; k < vertices.length; k++) {
            this.p.vertex(vertices[k][0], vertices[k][1]);
        }
        this.p.endShape();

    }

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
