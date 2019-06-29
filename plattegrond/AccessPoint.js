class AccessPoint {

    constructor(id, name, latitude, longitude, floor, mapVertices, numOfChairs) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.floor = floor;
        this.mapVertices = mapVertices;
        this.averageColors = [0, 0, 0];
        this.numOfChairs = numOfChairs;
    }

    isOnFloor(floor) {
        return this.floor == floor;
    }


    addColor(colors) {
        this.averageColors = colors;
    }

    getAverageColors() {
        return this.averageColors;
    }

    getMapVerticesWithOffset(scaleX, scaleY) {
        let newVertices = [];
        for (let k = 0; k < this.mapVertices.length; k++) {
            newVertices.push([
                (this.mapVertices[k][0] * scaleX * 1.520) + (170 * scaleX),
                (this.mapVertices[k][1] * scaleY * 1.35) + (0 * scaleY)
            ]);
        }
        return newVertices;
    }
}
