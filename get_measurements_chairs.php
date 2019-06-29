<?php
include 'config.php';
header("Access-Control-Allow-Origin: *");
$conn = new mysqli($db_config->servername, $db_config->username, $db_config->password, $db_config->database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//$measDate = isset($_GET['date']) ? $_GET['date'].':%' : date('Y-m-d').':%';

//$measDate = isset($_GET['date']) ? $_GET['date'].':%' : date('Y-m-d').':%';
$measDate = isset($_GET['date']) ? $_GET['date'].' %' : date('Y-m-d').' %';
$measurement_array = array();
$measurements ="SELECT meas.ID, meas.AP_ID, meas.Date, meas.estimated_people FROM measurements meas 
ORDER BY `meas`.`Date` DESC LIMIT 17 ";

$result = $conn->query($measurements);
//var_dump($result);
while($row = $result->fetch_assoc()) {
    $meas_data = new class{};
    $meas_data->ID = $row['ID'];
    $meas_data->AP_ID = json_decode($row['AP_ID']);
    $meas_data->Date = $row['Date'];
    $meas_data->estimated_people = $row['estimated_people'];
    $measurement_array[] = $meas_data;
}

print(json_encode($measurement_array));