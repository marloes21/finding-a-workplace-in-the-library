class AccessPoint {

    //the data elements that is needed for every access point
    constructor(id, floor, mapVertices, numOfChairs) {
        this.id = id;
        this.floor = floor;
        this.mapVertices = mapVertices;
        this.averageColors = [0, 0, 0];
        this.numOfChairs = numOfChairs;
    }

    //return wether the floor of the access point is the same as the desired floor
    isOnFloor(floor) {
        return this.floor == floor;
    }

    //add the color that that area needs t obe
    addColor(colors) {
        this.averageColors = colors;
    }

    //give teh color that the area is
    getAverageColors() {
        return this.averageColors;
    }

    //create new map vertices with an offset so that they vertices allign with the images.
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
