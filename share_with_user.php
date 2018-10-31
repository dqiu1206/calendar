<?php
//This file enables users to share their events with another user
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json"); 

$username = $_SESSION['username'];
$date = (string) $_POST['date'];
$category_input = (string) $_POST['category'];

//Arrays to store results from database queries
$sharedwith_array = array();
$title_array = array();
$event_id_array = array();

//Exits if the session username is null
if ($username == null) {
    echo json_encode(array(
        "success" => false
	));
    exit;
}

//Get the list of users that shared their events with the current session user
$stmt = $mysqli->prepare("select sharing_user from share where target_user=?");
if(!$stmt){
	echo json_encode(array(
	    "success" => false,
		"message" => "Query Prep failed"
	));
	exit;
}
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($sharing_user);

//Store the results into an array
while($stmt->fetch()) {
    array_push($sharedwith_array,$sharing_user);
}
$stmt->close();



//Variable used to check if an event is global or not.  In this case it is set to false to prevent
//global events from printing twice
$checkGlobal="false";

for($i=0;$i<count($sharedwith_array);$i++){

//Query the database depending on whether or not a category is selected
if($category_input==null){
	$stmt = $mysqli->prepare("select title,event_id from events where date=? and username=? and group_event=?");
	if(!$stmt){
	    echo json_encode(array(
	        "success" => false,
			"message" => "Query Prep failed"
		));
		exit;
	}
	$stmt->bind_param('sss', $date,$sharedwith_array[$i],$checkGlobal);
} else{
	$stmt = $mysqli->prepare("select title,event_id from events where date=? and username=? and category=? and group_event=?");
	if(!$stmt){
	    echo json_encode(array(
	        "success" => false,
			"message" => "Query Prep failed"
		));
		exit;
	}
	$stmt->bind_param('ssss', $date,$sharedwith_array[$i],$category_input,$checkGlobal);
}

$stmt->execute();
$stmt->bind_result($title, $event_id);

//Store event titles and ids into the appropriate arrays
while($stmt->fetch()) {
    array_push($title_array,$title);
	array_push($event_id_array,$event_id);
}
$stmt->close();
}

//As long as  $title isn't null, send the json data
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