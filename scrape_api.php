<?php
//json_mysql.php
$servername = 'localhost';
$username = 'caniworkinthelibrary_nl_afstuderen';
$password = 'po3aPwhGYuhk';
$database = 'caniworkinthelibrary_nl_afstuderen';

$url_wifi = 'http://iotdata01.utwente.nl/cgi-bin/aps-geojson.cgi';
$json_wifi = json_decode(file_get_contents($url_wifi), true);


$date = date('Y-m-d H:i:s', time());

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$ap_array = array();
$access_points = "SELECT ap.ID, ap.Name from access_points ap";
$result = $conn->query($access_points);
while($row = $result->fetch_assoc()) {
    $ap_array[$row['Name']] = $row['ID'];
}

for ($i = 0; $i <= 850; $i++) {
    $estimated_people = $json_wifi['features'][$i]['properties']['estimated_people'];
    $AP_name = $json_wifi['features'][$i]['properties']['name'];
    if (!array_key_exists($AP_name, $ap_array)) {
        continue;
    }
    $AP_id = $ap_array[$AP_name];
    $sql = "INSERT INTO measurements(estimated_people,Date, AP_ID) VALUES ('$estimated_people', '$date', '$AP_id')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
$conn->close();

