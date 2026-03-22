<?php

require_once "session.php";

startSession();

header("Content-Type: application/json");

require_once "../database-connection/conn.php";

$username = trim($_POST["username"]);

if (!isset($_POST["username"])) {
    echo json_encode(["emptyUsername" => true]);
    $conn->close();
    exit;
}

if (strlen($username) <= 0 || strlen($username) > 100) {
    echo json_encode(["usernameInvalid" => true]);
    $conn->close();
    exit;
}

echo json_encode(changeUsername($conn, $username));

$conn->close();
exit;

?>