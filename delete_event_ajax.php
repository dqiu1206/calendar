<?php
//This file deletes an event
require 'database.php';
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();

//Prevent CSRF attack
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	echo json_encode(array(
        "success" => false,
        "message" => "Request forgery detected"
	));
	exit;
}

$username = $_SESSION['username'];
$event_id = $_POST['id'];

//Exit if session username is null
if ($username == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Have to be logged in to delete event"
	));
	exit;
}

//Delete event based on id and session username
$stmt = $mysqli->prepare("delete from events where event_id=? and username=?");
	if(!$stmt){
		echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
	));
	exit;
}

$stmt->bind_param('is', $event_id, $username);
$stmt->execute();
$stmt->close();
echo json_encode(array(
		"success" => true,
	));
	exit;

?>