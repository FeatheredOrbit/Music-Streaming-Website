<?php

require_once "session.php";

startSession();

header("Content-Type: application/json");

$password = $_POST["password"];

$res = [];

if (!isset($_POST["password"])) {
    $res["emptyPassword"] = true;
    echo json_encode($res);
    exit;
}

if (strlen($password) < 8 || strlen($password) > 128) {
    $res["passwordInvalid"] = true;
    echo json_encode($res);
    exit;
}

$specialCharacterRegex = '/[!@#$%^&*()_+\-=\[\]{};:\'\"\\|,.<>\/?]/';
$capitalLetterRegex = '/[A-Z]/';

if (!preg_match($specialCharacterRegex, $password)) {
    $res["passwordNotSpecial"] = true;
    echo json_encode($res);
    exit;
}

if (!preg_match($capitalLetterRegex, $password)) {
    $res["passwordNotCapital"] = true;
    echo json_encode($res);
    exit;
}

require_once "../database-connection/conn.php";

if (changePassword($conn, $password)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$conn->close();
exit;

?>