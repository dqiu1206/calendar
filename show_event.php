<?php
// This file gets the information for a single event 
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$username = $_SESSION['username'];
$id = $_POST['id'];

//Exit if session username is null
if ($username == null) {
    echo json_encode(array(
		"success" => false,
        "message" => "Not logged in"
	));
	exit;
}

//Get event information from the database based on event id
$stmt = $mysqli->prepare("select date,time,title,category,group_event,username from events where event_id = ?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
        "message" => "Query prep failed"
	));
	exit;
}
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->bind_result($date,$time,$title,$category,$group_event,$event_creator);
$stmt->fetch();
$stmt->close();

//Variable used to check whether the current user is the same as the event creator
$same_user = false;

//If the username returned by the query is the same as the session username, set $same_user to true
if ($event_creator == $username) {
	$same_user = true;
}
//Return json data 
echo json_encode(array(
		"success" => true,
        "date" => $date,
        "time" => $time,
        "title" => $title,
        "category" => $category,
        "group_event" => $group_event,
		"same_user" => $same_user

	));
	exit;
?>