let ctx = document.getElementById("line-chart");
//console.log(ctx);

let estimated = [];
let estimated_for_chart = [];
let times = [];
times[0] = [];
var boolIsAlreadyInArray = false;
$.getJSON('https://marloes-afstuderen.jonathanj.nl/get_measurements_graph', function (data) {
 //   console.log(data);

    for (let i in data) {
        var dateArray = data[i].Date.split(" ");
        var timeArray = dateArray[1].split(":");
        if (timeArray[0] >= 8 && timeArray[0] <= 24 ) {
       //     console.log(timeArray);
            if (typeof estimated[data[i].AP_ID] == "undefined") {
                estimated[data[i].AP_ID] = [];
            }
           // if(timeArray[1] == 0|| timeArray[1] == 30) {
                estimated[data[i].AP_ID].push(parseInt(data[i].estimated_people));
            //}

            if (data[i].AP_ID == 1 ){//&& (timeArray[1] == 0|| timeArray[1] == 30) ) {
                //boolIsAlreadyInArray = true;
                //times[0].push(timeArray[0] + ":" + timeArray[1]);
                times[0].push(data[i].Date);
            }
           //
           // console.log(data[i].Date);
           //  console.log(timeArray[1] == 00 || timeArray[1] == 30)
           //
           //  if (boolIsAlreadyInArray && (timeArray[1] == '00'|| timeArray[1] == 30)) {
           //      times[0].push(timeArray[0] + ":" + timeArray[1]);
           //      boolIsAlreadyInArray = false;
           //  }
        }
    }
    //console.log(times);


    for (let i in estimated) {
        estimated_for_chart.push({
            label: "AP " + i,
            data: estimated[i],
            fill: false,
            borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16)
        })
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: times[0],
            datasets: estimated_for_chart
        },
        options: {
            title: {
                display: true,
                text: 'World population per region (in millions)'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'hour'
                    }
                }]
            }
        },
        onAnimationComplete: function(){
            var sourceCanvas = this.chart.ctx.canvasl
            var copyWidth = this.scale.xScalePaddingLeft -5;
            var copyHeight = this.scale.endPoint + 5;
            var targetCtx = document.getElementById("line-chartAxis").getContext("2d");
            targetCtx.canvas.width = copyWidth;
            targetCtx.drawImage(sourceCanvas, 0,0,copyWidth,copyHeight,0,0, copyWidth, copyHeight);
        }

    });

});