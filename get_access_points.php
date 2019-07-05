<?php
include 'config.php';
header("Access-Control-Allow-Origin: *");

//concet with the database
$conn = new mysqli($db_config->servername, $db_config->username, $db_config->password, $db_config->database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$ap_array = array();

//get the correct data from the database
$access_points = "SELECT ap.ID, ap.Floor, ap.numberOfChairs, ap.MapVertices FROM access_points ap";
$result = $conn->query($access_points);

//transform the data from the database into json object so that the visualizers can use them.
while($row = $result->fetch_assoc()) {
    $ap_data = new class{};
    $ap_data->ID = $row['ID'];
    $ap_data->Floor = $row['Floor'];
    $ap_data->MapVertices = json_decode($row['MapVertices']);
    $ap_data->NumberOfChairs = json_decode($row['numberOfChairs']);

    $ap_array[] = $ap_data;
}
print(json_encode($ap_array));