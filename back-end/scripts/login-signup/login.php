<?php
// Handles user login requests by validating credentials against the database.
// Verifies username existence and password correctness before starting a session.
// Returns appropriate error messages for invalid usernames or passwords.

date_default_timezone_set("UTC");

require_once "../session/session.php";
startSession();

header("Content-Type: application/json");

$username = trim($_POST["username"]);
$password = $_POST["password"];

$res = [];

// Checks that both username and password were provided.
if (!isset($_POST["username"], $_POST["password"])) {
    $res["nullParameters"] = true;
    echo json_encode($res);
    exit;
}

require_once "../database-connection/conn.php";

// Prepares a query to find the user by username.
$stat = $conn->prepare("SELECT userId, username, encryptedPassword FROM users WHERE username = ? LIMIT 1");
if ($stat === false) {
    $res["loginSuccessful"] = false;
    $res["error"] = "Database error";
    echo json_encode($res);
    exit;
}

$stat->bind_param("s", $username);
$stat->execute();
$result = $stat->get_result();

// No user found with the provided username.
if ($result->num_rows === 0) {
    $res["usernameError"] = true;
    echo json_encode($res);
    $stat->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

// Verifies the password using the built-in password verification function.
if (password_verify($password, $user["encryptedPassword"])) {
    logIn($user["userId"]);
    
    $res["loginSuccessful"] = true;
    echo json_encode($res);

} else {
    $res["passwordError"] = true;
    echo json_encode($res);
}

$stat->close();
$conn->close();

exit;

?>