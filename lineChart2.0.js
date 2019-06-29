let estimated = [];
let estimated_for_chart = [];
let times = [];
times[0] = [];
let date = $.urlParam('datePicker');
let url;
let chart;
if(date == false){
    url = '/get_measurements_graph';
} else {
    url = '/get_measurements_graph?date=' + date;
}
$.getJSON(url, function (data) {

    for (let i in data) {
        var dateArray = data[i].Date.split(" ");
        var timeArray = dateArray[1].split(":");
        if (timeArray[0] >= 8 && timeArray[0] <= 24) {
            if (typeof estimated[data[i].AP_ID] == "undefined") {
                estimated[data[i].AP_ID] = [];
            }
            date = data[i].Date.replace(/\-/g, "/");
            let chairs = parseInt(data[i].numberOfChairs);
            let people  = parseInt(data[i].estimated_people);
            let presentage =  Math.round((( chairs - people)/chairs)*100);
            if(presentage < 0){
                presentage = 0;
            } else if(presentage > 100){
                presentage = 100;
            }
            estimated[data[i].AP_ID].push([
                Date.parse(date),
                presentage
            ]);

            // if (data[i].AP_ID == 1) {
            //     times[0].push(data[i].Date);
            // }

        }

    }
   // console.log(estimated);
    let colorArray = [[1, '#e6194B'], [2, '#ffffff'],[3, '#f58231'], [4, '#ffe119'], [5, '#bfef45'], [6, '#3cb44b'],
        [7, '#800000'], [8, '#9A6324'],[9, '#808000'], [10, '#469990'], [11, '#000075'], [12, '#42d4f4'],
        [13, '#4363d8'], [14, '#f45b5b'], [15, '#911eb4'], [16, '#f032e6']];
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
                events: {
                    mouseOver: function (){
                        floor1.highlightArea(apStringToInt(this.name));
                        floor2.highlightArea(apStringToInt(this.name));
                    },
                    mouseOut: function () {
                        floor1.clearHighlight();
                        floor2.clearHighlight();
                    }
                },

                enableMouseTracking: enableMouse
            }
        },


        title: {
            text:''
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
            // categories: times[0],
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
            // minorGridLineWidth: 0,
            // gridLineWidth: 0,
            // alternateGridColor: null,
            // plotBands: [{
            //     color: '#fff',
            //     from: 55,
            //     to: 100,
            //     label: {
            //         text: 'Mostly empty',
            //         verticalAlign: 'top'
            //     }
            // }, {
            //     color: '#fafafa',
            //     from: 10,
            //     to: 55,
            //     label: {
            //         text: 'Busy',
            //         verticalAlign: 'top'
            //     }
            // }, {
            //     color: '#fff',
            //     from: 10,
            //     to: 0,
            //     label: {
            //         text: 'Likely full',
            //         verticalAlign: 'top'
            //     }
            // }]
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