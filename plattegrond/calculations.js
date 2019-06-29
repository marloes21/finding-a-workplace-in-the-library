class Calculations {
    constructor(xScalingFactor, yScalingFactor, offsetFactor) {
        this.xScalingFactor = xScalingFactor;
        this.yScalingFactor = yScalingFactor;
    }

    getFloor(ap, floor) {
        let floor2AP = [];
        let j = 0;
        for (let i = 0; i < ap.length; i++) {
            if (ap[i].isOnFloor(floor)) {
                floor2AP[j] = ap[i].id;
                j++;
            }
        }
        return floor2AP;
    }

    calculateAverage(apIDOn2ndFloor, measurementsForOneHour) {
        let apAndEstPeople = [];
        let averageEstimatedPeoplePerAP = [];
        for (let j = 0; j < apIDOn2ndFloor.length; j++) {
            apAndEstPeople[j] = [null, 0, 0,];
            for (let i = 0; i < measurementsForOneHour.length; i++) {
                if (measurementsForOneHour[i].apID == apIDOn2ndFloor[j]) {
                    apAndEstPeople[j][0] = measurementsForOneHour[i].apID;
                    apAndEstPeople[j][1] += parseInt(measurementsForOneHour[i].estimatedPeople);
                    apAndEstPeople[j][2]++;
                }
            }
        }

        for (let i = 0; i < apAndEstPeople.length; i++) {
            averageEstimatedPeoplePerAP[i] = [];
            averageEstimatedPeoplePerAP[i][0] = apAndEstPeople[i][0];
            averageEstimatedPeoplePerAP[i][1] = apAndEstPeople[i][1] / apAndEstPeople[i][2];
        }

        return averageEstimatedPeoplePerAP;
    }

    calculateFill(presentages, alpha) {
        let colors = [];
        if (presentages < 45) {
            colors[0] = 102;
            colors[1] = 255;
            colors[2] = 102;
        } else if (presentages < 90) {
            colors[0] = 255;
            colors[1] = 153;
            colors[2] = 0;
        } else {
            colors[0] = 255;
            colors[1] = 51;
            colors[2] = 0;

        }
        return colors;  //`rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    mouseInPointCheck(posX, posY, ap) {
        let i;
        let j;
        let result = false;

        let vertices = ap.getMapVerticesWithOffset(this.xScalingFactor, this.yScalingFactor);

        for (i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            let xVertI = vertices[i][0];
            let xVertJ = vertices[j][0];
            let yVertI = vertices[i][1];
            let yVertJ = vertices[j][1];


            if (((((yVertI) <= posY) && (posY < (yVertJ))) || (((yVertJ) <= posY) && (posY < (yVertI)))) &&
                (posX < ((xVertJ) - (xVertI)) * (posY - (yVertI)) / ((yVertJ) - (yVertI)) + (xVertI))) {
                result = !result;
            }
        }
        return result;
    }
}