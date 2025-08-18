<?php
header("Content-Type: application/json");

$username = trim($_POST["username"]);
$email = trim($_POST["email"]);
$password = $_POST["password"];
$conPassword = $_POST["conPassword"];

$res = [];

if (!isset($_POST["username"], $_POST["email"], $_POST["password"], $_POST["conPassword"])) {
    $res["nullParameters"] = true;
    echo json_encode($res);
    exit;
}

if (strlen($username) <= 0 || strlen($username) > 100) {
    $res["usernameInvalid"] = true;
    echo json_encode($res);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $res["emailInvalid"] = true;
    echo json_encode($res);
    exit;
}

if (strlen($email) > 320) {
    $res["emailInvalid"] = true;
    echo json_encode($res);
    exit;
}

if (strlen($password) < 8 || strlen($password) > 128) {
    $res["passwordInvalid"] = true;
    echo json_encode($res);
    exit;
}

if (strpos($password, " ") !== false) {
    $res["passwordInvalid"] = true;
    echo json_encode($res);
    exit;
}

if ($password != $conPassword) {
    $res["conPasswordInvalid"] = true;
    echo json_encode($res);
    exit;
}


include "../database-connection/conn.php";


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



$stat = $conn -> prepare("SELECT 1 FROM users WHERE email = ? LIMIT 1");
$stat -> bind_param("s", $email);
$stat -> execute();
$stat -> store_result();

$res["emailExists"] = $stat -> num_rows > 0;

$stat -> close();

if ($res["emailExists"] === true) {
    echo json_encode($res);

    $conn -> close();
    exit;
}

$hash_pass = password_hash($password, PASSWORD_DEFAULT);

$currentDateTime = date('Y-m-d H:i:s');

$stat = $conn -> prepare("INSERT INTO users (username, email, encryptedPassword, dateJoined) VALUES (?, ?, ?, ?)");
$stat -> bind_param("ssss", $username, $email, $hash_pass, $currentDateTime);

if ($stat -> execute()) {
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