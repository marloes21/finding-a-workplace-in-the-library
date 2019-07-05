<?php
include 'config.php';
header("Access-Control-Allow-Origin: *");

//connect to the database
$conn = new mysqli($db_config->servername, $db_config->username, $db_config->password, $db_config->database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$measDate = isset($_GET['date']) ? $_GET['date'].' %' : date('Y-m-d').' %';
$measurement_array = array();

//get the correct infromation from the database
$measurements = "SELECT meas.ID, meas.AP_ID, meas.Date, meas.estimated_people, ap.numberOfChairs
FROM measurements meas
LEFT JOIN access_points ap
ON meas.AP_ID = ap.ID
WHERE meas.Date like  '$measDate' ORDER BY meas.Date ASC";

$result = $conn->query($measurements);
//create json object so that graph visualizer can use the data
while($row = $result->fetch_assoc()) {
    $meas_data = new class{};
    $meas_data->ID = $row['ID'];
    $meas_data->AP_ID = json_decode($row['AP_ID']);
    $meas_data->Date = $row['Date'];
    $meas_data->estimated_people = $row['estimated_people'];
    $meas_data->numberOfChairs = $row['numberOfChairs'];
    $measurement_array[] = $meas_data;
}

print(json_encode($measurement_array));