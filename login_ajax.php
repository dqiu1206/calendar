<?php
//This file allows users to log in

require 'database.php';
header("Content-Type: application/json"); 


$username = (string) $_POST['username'];
$pwd_guess = (string) $_POST['password'];


//get the username and hashed password that is stored in the table for the username that was submitted
$stmt = $mysqli->prepare("SELECT COUNT(*), username, hashed_pass FROM users WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();

//Verify the password.  If the password is correct, start the session and create a token
if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
	ini_set("session.cookie_httponly", 1);
    session_start();
	$_SESSION['username'] = $username;
	$_SESSION['token'] = substr(md5(rand()), 0, 10);

	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>