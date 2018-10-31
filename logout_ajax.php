<?php
//This file enables users to log out
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];

//Destroy the session if the session username is not null
if ($username != null) {
    session_destroy();
    echo json_encode(array(
        "success" => true
	));
	exit;
} else {
    echo json_encode(array(
        "success" => false
	));
    exit;

}

?>