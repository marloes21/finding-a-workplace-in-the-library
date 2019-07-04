let estimated = [];
let estimated_for_chart = [];
let times = [];
times[0] = [];
let date = $.urlParam('datePicker');
let url;
let chart;

//check at which date the visualisation needs to shwo.
if(date == false){
    url = '/get_measurements_graph';
} else {
    url = '/get_measurements_graph?date=' + date;
}

//transfrom the JSON object into workable data needed for the visualisation
$.getJSON(url, function (data) {

    for (let i in data) {
        var dateArray = data[i].Date.split(" ");
        var timeArray = dateArray[1].split(":");

        //check if the measuremetns are in the opening hours of the library
        if (timeArray[0] >= 8 && timeArray[0] <= 24) {
            if (typeof estimated[data[i].AP_ID] == "undefined") {
                estimated[data[i].AP_ID] = [];
            }

            // transform the a date format that also apple devices understand
            date = data[i].Date.replace(/\-/g, "/");

            //calculate the presentages and cap them at 0% and 100%
            let chairs = parseInt(data[i].numberOfChairs);
            let people  = parseInt(data[i].estimated_people);
            let presentage =  Math.round((( chairs - people)/chairs)*100);
            if(presentage < 0){
                presentage = 0;
            } else if(presentage > 100){
                presentage = 100;
            }

            //add the data and the date to an array to be used for the visualistaion
            estimated[data[i].AP_ID].push([
                Date.parse(date),
                presentage
            ]);

        }

    }
    // To use colors that are also see able for color blind people
    let colorArray = [[1, '#e6194B'], [2, '#ffffff'],[3, '#f58231'], [4, '#ffe119'], [5, '#bfef45'], [6, '#3cb44b'],
        [7, '#800000'], [8, '#9A6324'],[9, '#808000'], [10, '#469990'], [11, '#000075'], [12, '#42d4f4'],
        [13, '#4363d8'], [14, '#f45b5b'], [15, '#911eb4'], [16, '#f032e6']];

    //Create an array that contains all the data for the visualisation. Each access point is one index of the array
    // and a name and color is added to this access point
    for (let i in estimated) {
        let lineColor;
        for(let j in colorArray){

            if(i == colorArray[j][0]){
                lineColor = colorArray[j][1]
            }
        }
        estimated_for_chart.push({
            name: "Area " + i,
            data: estimated[i],
            type: 'spline',
            color: lineColor
        })
    }

    lineGraph(true, estimated_for_chart);
});

//creat the line graph, and tweak the look and interaction of the chart.
var lineGraph = function(enableMouse, data){
    chart =  Highcharts.chart('line-chart', {
        chart:{
            scrollablePlotArea:{
                minWidth: 1500,
                scrollPositionX: 1
            },
            animation: false,
            events: {
                load: function(event) {
                    graphReady = true;
                    removeOverlay();
                }
            }
        },

        exporting: {
            enabled: false
        },
        plotOptions: {
            series:{
                marker:{
                    enabled: false
                },
                //here the interaction with the other visualisation is done. With mouseOver the mouse is on a line in
                //the graph. On mouseOut, the mouse is no longer on a line in the chart.
                events: {
                    mouseOver: function (){
                        let ap_id = apStringToInt(this.name);
                        floor1.highlightArea(ap_id);
                        floor2.highlightArea(ap_id);
                        updateCounterForArea(ap_id);
                    },
                    mouseOut: function () {
                        let ap_id = apStringToInt(this.name);
                        floor1.clearHighlight(ap_id);
                        floor2.clearHighlight(ap_id);
                        updateCounterForArea(0);
                    }
                },

                enableMouseTracking: enableMouse
            }
        },


        title: {
            text:''
        },

        tooltip:{
            xDateFormat: '%d-%m-%Y %H:%M'
        },

        credits: {
            enabled: false
        },
        time: {
            useUTC: false
        },
        xAxis:{
            type: 'datetime',
            dateTimeLabelFormats:{
                hour:'%H:%M'
            },
        },

        yAxis: {
            title: {
                text: 'Estimated amount of free chairs'
            },
            labels: {
                format: '{value}%'
            },
            min: 0,
            max: 100,
            floor: 0,
            ceiling: 100,
        },
        series: data,
        responsive: {
            rules: [{
                condition: {
                  // maxWidth: 100
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}