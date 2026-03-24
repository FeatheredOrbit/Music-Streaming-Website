<?php
// Endpoint for changing the user's username.
// Validates that the username is provided and within the allowed length constraints
// before calling the function that checks for uniqueness and performs the update.

require_once "session.php";

startSession();

header("Content-Type: application/json");

require_once "../database-connection/conn.php";

$username = trim($_POST["username"]);

// Ensures a username was provided.
if (!isset($_POST["username"])) {
    echo json_encode(["emptyUsername" => true]);
    $conn->close();
    exit;
}

// Validates username length constraints.
if (strlen($username) <= 0 || strlen($username) > 100) {
    echo json_encode(["usernameInvalid" => true]);
    $conn->close();
    exit;
}

echo json_encode(changeUsername($conn, $username));

$conn->close();
exit;

?>