<?php
//This file updates the share table 
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");


$username = $_SESSION['username'];
$share_with = $_POST['user'];

//Exit if user tries to share with himself/herself
if ($username == $share_with) {
     echo json_encode(array(
        "success" => false,
        "message" => "Can't share with yourself."
	));
	exit;
}

//Exit if session username if null
if ($username == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Have to be logged in to share events"
	));
	exit;
}

//Exit if inputted username is null
if ($share_with == null) {
    echo json_encode(array(
        "success" => false,
        "message" => "Input can't be blank"
	));
	exit;
}


//Get the count 
$stmt = $mysqli->prepare("select count(*) from share where target_user=? and sharing_user=?");
	if(!$stmt){
		echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
	));
	exit;

}
$stmt->bind_param('ss', $share_with, $username);
$stmt->execute();
$stmt->bind_result($count);
$stmt ->fetch();
$stmt->close();

//If the count is 1, then the user has already shared their events with the typed user, so the program exits
if ($count == 1) {
    echo json_encode(array(
    		"success" => false,
            "message" => "Already shared"
    	));
    	exit;
}

//Check if the entered username exists.
$stmt = $mysqli->prepare("select count(*) from users where username=? ");
	if(!$stmt){
		echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
	));
	exit;

}
$stmt->bind_param('s', $share_with);
$stmt->execute();
$stmt->bind_result($count2);
$stmt ->fetch();
$stmt->close();

//If user does not exist, exit
if ($count2 == 0){
    echo json_encode(array(
        "success" => false,
        "message" => "User does not exist"
	));
    exit;
}

//Insert into share table
$stmt = $mysqli->prepare("insert into share (sharing_user,target_user) values (?,?)");
	if(!$stmt){
		echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
	));
	exit;

}
$stmt->bind_param('ss', $username, $share_with);
$stmt->execute();
$stmt->close();
echo json_encode(array(
		"success" => true
	));
	exit;

?>