<?php
//This file enables users to create events
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");

//Get post info
$username = $_SESSION['username'];
$title = (string) $_POST['title'];
$date = (string) $_POST['date'];
$category = (string) $_POST['category'];
$time = (string) $_POST['time'];
$group_event = (string) $_POST['group_event'];

//Exit if the session username is null
if ($username == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Have to be logged in to add event"
	));
	exit;
}

//If any of the required fields are null, then exit
if ($title == null  || $date == null || $time == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Fill all the fields."
	));
	exit;
}

//Insert event information into the events table
$stmt = $mysqli->prepare("insert into events (username, title, date, time, category, group_event) values (?,?,?,?,?,?)");
	if(!$stmt){
		echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
	));
	exit;

}
$stmt->bind_param('ssssss', $username, $title, $date, $time, $category, $group_event);
$stmt->execute();
$stmt->close();
echo json_encode(array(
		"success" => true,
		"message" => $date
	));
	exit;

?>