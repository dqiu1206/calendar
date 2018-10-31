<?php
//This file returns all of the user's events on a particular day
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$username = $_SESSION['username'];
$date = (string) $_POST['date'];
$category_input = (string) $_POST['category'];

//Arrays used later to store query results
$title_array = array();
$event_id_array = array();

//Exit if session username is null
if ($username == null) {
    echo json_encode(array(
        "success" => false
	));
    exit;
}

//Get title and event id for all the user's events on a specific day, as well as all the group events
if($category_input == null){
	$stmt = $mysqli->prepare("select title,event_id from events where date=? and (username=? or group_event='true')");
	if(!$stmt){
	    echo json_encode(array(
	        "success" => false,
			"message" => "Query Prep failed"
		));
		exit;
	}
	$stmt->bind_param('ss', $date,$username);
} else{
	$stmt = $mysqli->prepare("select title,event_id from events where date=? and (username=? or group_event='true') and category=?");
	if(!$stmt){
	    echo json_encode(array(
	        "success" => false,
			"message" => "Query Prep failed"
		));
		exit;
	}
	$stmt->bind_param('sss', $date, $username, $category_input);
}

$stmt->execute();
$stmt->bind_result($title, $event_id);

//Store the results of the query into the appropriate arrays
while($stmt->fetch()) {
    array_push($title_array, $title);
	array_push($event_id_array, $event_id);
}

$stmt->close();

//As long as $title is not null, send the json data
if ($title != null) {
    echo json_encode(array(
        "success" => true,
        "title" => $title_array,
		"id" => $event_id_array
	));
	exit;
} else {
    echo json_encode(array(
        "success" => false
	));
	exit;
}


?>