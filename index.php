<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>📚 Can I work in the university library?</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.js"></script>

    <script language="javascript" type="text/javascript" src="helpers.js"></script>

    <script language="javascript" type="text/javascript" src="countUp.js"></script>

    <script language="javascript" type="text/javascript" src="plattegrond/AccessPoint.js"></script>
    <script language="javascript" type="text/javascript" src="plattegrond/Measurment.js"></script>
    <script language="javascript" type="text/javascript" src="plattegrond/vizualisatie.js"></script>
    <script language="javascript" type="text/javascript" src="plattegrond/plattegrond.js"></script>
    <script language="javascript" type="text/javascript" src="plattegrond/calculations.js"></script>

    <!-- libraries for line chart in highchart.js -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="lineChart2.0.js"></script>

    <script src="estimatedChairs.js"></script>

    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.9.0/css/all.css">

    <style type="text/css">
        @media (min-width: 768px) {
            .collapse.dont-collapse-sm {
                display: block;
                height: auto !important;
                visibility: visible;
            }
        }

        .loading_overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .highcharts-fixed {
            top: auto !important;
            left: auto !important;
        }

        .red {
            color: rgb(255, 51, 0);
        }

        .orange {
            color: rgb(255, 153, 0);
        }

        .green {
            color: rgb(102, 255, 102);
        }

        button, button:focus {
            outline: 0;
        }

    </style>

</head>

<body>
<!-- Create the header of the layout -->
<section class="jumbotron jumbotron-fluid text-center bg-dark text-white" style="padding: 30px 0 20px 0 !important;">
    <div class="container">

        <h1 class="jumbotron-heading card-link" data-toggle="collapse">
            Find a workplace in the library
        </h1>
        <button class="btn btn-outline-blue text-white d-block d-sm-none justify-content-center col-sm-4 mb-2"
                type="button" data-toggle="collapse"
                data-target="#collapseExample"
                aria-expanded="false" aria-controls="collapseExample">Show me more information
        </button>
        <div class="collapse dont-collapse-sm" id="collapseExample">
            <p class="lead">
                Here you can find an overview of an estimation of the available places in the library,
                always live thanks to data provided by the university!
                It currently shows you occupation of <strong class="text-primary"><?php
                    $date = isset($_GET['datePicker']) ? strtotime($_GET['datePicker']) : date('U');
                    echo date('l F j, Y', $date);
                    ?></strong>, but you can always select a different day below.
            </p>

            <p class="font-italic mt-4" style="font-size: 11px;">
                <i class="fas fa-info-circle"></i>
                All figures on this page are estimations based on the number of wireless devices present in the
                library. We've made every effort to make the data as accurate as possible, but there is no
                guarantee.
            </p>


            <hr class="mt-4 mb-4" style="border-color: #fff;">
        </div>
        <form method="get">
            <div class="row justify-content-center">
                <div class="col-sm-4 col-md-3 col-xl-2 mb-2">
                    <input type="date" id="picker" class="form-control" name="datePicker"
                           max="<?= date('Y-m-d') ?>" min="2019-04-29"
                           value="<?= isset($_GET['datePicker']) ? $_GET['datePicker'] : date('Y-m-d') ?>">
                </div>
                <div class="col-sm-4 col-md-4 col-xl-2 mb-2">
                    <button type="submit" class="btn btn-primary btn-block">Tell me about it!</button>
                </div>
                <div class="col-sm-4 col-md-4 col-xl-2">
                    <a href="/" class="btn btn-default btn-block text-white">How about today?</a>
                </div>
            </div>
        </form>
    </div>
</section>


<div class="container-fluid">

<!--    Create the estimate number of workplace visualisation -->
    <div class="row mb-4 row-eq-height">

        <div class="col-12">

            <div class="card bg-dark">
                <div class="card-body text-center text-white" style="padding: 0;">

                    <h5 class="font-weight-bold mt-4">
                        Estimated number of workplaces available<span id="display-area-name" style="display: none;"> in area <span
                                    id="area-name">0</span></span>:
                    </h5>

                    <h1>
                                <span class="badge badge-primary badge-pill mb-4">
                                    <i class="fas fa-fw fa-chair-office mr-2"></i>
                                    <span id="available-seats">0</span>
                                </span>
                    </h1>

                </div>
            </div>

        </div>

    </div>

    <div class="row">
        <!--    Create the map visualisation for the main floor-->
        <div class="col-xl-3 col-md-6 col-sm-12 mb-3">

            <div class="card">
                <div class="card-header bg-dark text-white">
                    <i class="fas fa-fw fa-map mr-2"></i>
                    Library Main Floor <i class="fa-fw ml-3 fal fa-clock"></i> <?= date('H:i') ?>
                    <p class="float-right mb-0">
                        <i class="fal fa-info-circle" data-toggle="tooltip" data-placement="bottom" data-html="true"
                           title="Legend: <span class='red'>likely full</span>, <span class='orange'>busy</span> and <span class='green'>mostly empty</span>.">
                        </i>
                    </p>
                </div>
                <div class="card-body" id="floor-2"></div>
            </div>
        </div>

        <!--    Create the map visualisation for the lower floor-->
        <div class="col-xl-3 col-md-6 col-sm-12 mb-3">

            <div class="card">
                <div class="card-header bg-dark text-white">
                    <i class="fas fa-chevron-double-down fa-fw"></i>
                    Library Lower Section <i class="fa-fw ml-3 fal fa-clock"></i> <?= date('H:i') ?>
                    <p class="float-right mb-0">
                        <i class="fal fa-info-circle" data-toggle="tooltip" data-placement="bottom" data-html="true"
                           title="Legend: <span class='red'>likely full</span>, <span class='orange'>busy</span> and <span class='green'>mostly empty</span>.">
                        </i>
                    </p>
                </div>
                <div class="card-body" id="floor-1"></div>
            </div>

        </div>

        <!--    Create the line graph visualisation-->
        <div class="col-xl-6 col-md-12 col-sm-12 mb-3">

            <div class="card">
                <div class="card-header bg-dark text-white">
                    <i class="fas fa-fw fa-chart-line mr-2"></i>
                    Workplace availability throughout the day
                </div>
                <div class="card-body" id="line-chart"></div>
            </div>

        </div>

    </div>

</div>

<!--    Create the overlay when the visualisation are loading -->
<div class="loading_overlay bg-dark text-white">

    <h1 class="mt-5 text-center"><i class="fas fa-spinner fa-spin"></i></h1>

</div>

<script type="text/javascript">

    //Some javascript to make sure all the visualisation are called
    // To be able to have the two differnt floors of the library
    let floor1;
    let floor2;

    let graphReady = false;
    let countReady = false;

    //So that it is possible to check if highlighted line ahs the same id as an area
    function apStringToInt(string) {
        return parseInt(string.replace("Area", ""));
    }

    //show the visualizations when they are ready to be shwon
    let removeOverlay = function () {
        if (graphReady && countReady) {
            $(".loading_overlay").fadeOut();
        }
    };


    $(document).ready(function () {
        //create two instances of the map visualisations
        floor1 = new p5(plattegrondForFloor(1), 'floor-1');
        floor2 = new p5(plattegrondForFloor(2), 'floor-2');

        $('[data-toggle="tooltip"]').tooltip()
    });

</script>

</body>
</html>