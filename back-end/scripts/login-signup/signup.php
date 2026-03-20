<?php

date_default_timezone_set('UTC');

require_once "../session/session.php";
startSession();

header("Content-Type: application/json");

$username = trim($_POST["username"]);
$password = $_POST["password"];
$conPassword = $_POST["conPassword"];

$res = [];

if (!isset($_POST["username"], $_POST["password"], $_POST["conPassword"])) {
    $res["nullParameters"] = true;
    echo json_encode($res);
    exit;
}

if (strlen($username) <= 0 || strlen($username) > 100) {
    $res["usernameInvalid"] = true;
    echo json_encode($res);
    exit;
}

if (strlen($password) < 8 || strlen($password) > 128) {
    $res["passwordInvalid"] = true;
    echo json_encode($res);
    exit;
}

if ($password != $conPassword) {
    $res["conPasswordInvalid"] = true;
    echo json_encode($res);
    exit;
}


require_once "../database-connection/conn.php";


$stat = $conn -> prepare("SELECT 1 FROM users WHERE username = ? LIMIT 1");
$stat -> bind_param("s", $username);
$stat -> execute();
$stat -> store_result();

$res["usernameExists"] = $stat -> num_rows > 0;

$stat -> close();

if ($res["usernameExists"] === true) {
    echo json_encode($res);
        
    $conn -> close();
    exit;
}

$hash_pass = password_hash($password, PASSWORD_DEFAULT);

$currentDateTime = date('Y-m-d H:i:s');

$stat = $conn -> prepare("INSERT INTO users (username, encryptedPassword, dateJoined) VALUES (?, ?, ?)");
$stat -> bind_param("sss", $username, $hash_pass, $currentDateTime);

if ($stat -> execute()) {
    $user_id = $conn->insert_id;

    logIn($user_id);

    $res["signupSuccessful"] = true;
    echo json_encode($res);
} else {
    $res["signupSuccessful"] = false;
    $res["error"] = $stat -> error;
    echo json_encode($res);
}

$stat -> close();
$conn -> close();

exit;

?>