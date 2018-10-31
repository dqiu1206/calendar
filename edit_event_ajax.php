<?php
//This file is used to edit events
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");

//Prevent CSRF attacks
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	echo json_encode(array(
        "success" => false,
        "message" => "Request forgery detected"
	));
	exit;
}

//Get post info
$username = $_SESSION['username'];
$title = (string) $_POST['title'];
$date = (string) $_POST['date'];
$category = (string) $_POST['category'];
$time = (string) $_POST['time'];
$group_event = (string) $_POST['group_event'];
$id = $_POST['id'];

//Exit if session username is null
if ($username == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Have to be logged in to edit/delete event"
	));
	exit;
}

//Exit if required fields are empty
if ($title == null  || $date == null || $time == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Fill all the fields."
	));
	exit;
}

//Update events table
$stmt = $mysqli->prepare("update events set username=?, title=?, date=?, time=?, category=?, group_event=? where event_id=? and username=?");
	if(!$stmt){
		echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
	));
	exit;

}

$stmt->bind_param('ssssssis', $username, $title, $date, $time, $category, $group_event, $id, $username);
$stmt->execute();
$stmt->close();
echo json_encode(array(
		"success" => true,
		"message" => $id
	));
	exit;

?>