<?php
// This file enables users to register for the website

require 'database.php';
header("Content-Type: application/json"); 

$username = $_POST['username'];
$password = $_POST['password'];

//Exit if the username or password is null
if ($username == null || $password == null) {
	echo json_encode(array(
		"success" => false,
        "message" => "Username/password can't be blank."
	));
	exit;
}

// Hash the password
$hashed_pass = password_hash($password, PASSWORD_BCRYPT);

//This query checks if the inputted username already exists
$stmt = $mysqli->prepare("select username from users where username = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($user);
$stmt->fetch();
$stmt->close();

//Exits if the username already exists
if ($user != null) {
      echo json_encode(array(
		"success" => false,
        "message" => "Username already exists"
	));
	exit;
}

//Inserts new user and hashed password into the table if it doesn't exists
else {
	$stmt = $mysqli->prepare("insert into users (username, hashed_pass) values (?, ?)");
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
}
$stmt->bind_param('ss', $username, $hashed_pass);
$stmt->execute();
$stmt->close();
echo json_encode(array(
		"success" => true
	));
	exit;

}

?>