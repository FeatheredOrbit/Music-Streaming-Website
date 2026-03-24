<?php
// Endpoint for changing the user's password.
// Validates password length, special character requirements, and capital letter requirements
// before updating the database with a new hashed password.

require_once "session.php";

startSession();

header("Content-Type: application/json");

$password = $_POST["password"];

$res = [];

// Ensures a password was provided.
if (!isset($_POST["password"])) {
    $res["emptyPassword"] = true;
    echo json_encode($res);
    exit;
}

// Validates password length constraints.
if (strlen($password) < 8 || strlen($password) > 128) {
    $res["passwordInvalid"] = true;
    echo json_encode($res);
    exit;
}

$specialCharacterRegex = "/[!@#$%^&*()_+\-=\[\]{};:\'\"\\|,.<>\/?]/";
$capitalLetterRegex = "/[A-Z]/";

// Ensures password contains at least one special character.
if (!preg_match($specialCharacterRegex, $password)) {
    $res["passwordNotSpecial"] = true;
    echo json_encode($res);
    exit;
}

// Ensures password contains at least one capital letter.
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