<?php
// Handles new user registration with a metric ton of validation on both client and server side.
// Checks username length, password strength including special characters and capital letters,
// ensures passwords match, and verifies username uniqueness before inserting into the database.
// Upon successful creation, automatically logs the user in.

date_default_timezone_set("UTC");

require_once "../session/session.php";
startSession();

header("Content-Type: application/json");

$username = trim($_POST["username"]);
$password = $_POST["password"];
$conPassword = $_POST["conPassword"];

$res = [];

// Verifies all required fields are present.
if (!isset($_POST["username"], $_POST["password"], $_POST["conPassword"])) {
    $res["nullParameters"] = true;
    echo json_encode($res);
    exit;
}

// Validates username length constraints.
if (strlen($username) <= 0 || strlen($username) > 100) {
    $res["usernameInvalid"] = true;
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

// Confirms that both password fields match.
if ($password != $conPassword) {
    $res["conPasswordInvalid"] = true;
    echo json_encode($res);
    exit;
}


require_once "../database-connection/conn.php";

// Checks if the username is already taken.
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

// Hashes the password securely before storing.
$hash_pass = password_hash($password, PASSWORD_DEFAULT);

$currentDateTime = date("Y-m-d H:i:s");

// Inserts the new user into the database.
$stat = $conn -> prepare("INSERT INTO users (username, encryptedPassword, dateJoined) VALUES (?, ?, ?)");
$stat -> bind_param("sss", $username, $hash_pass, $currentDateTime);

if ($stat -> execute()) {
    $user_id = $conn->insert_id;

    // Automatically logs the user in after successful signup.
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