<?php
// Endpoint for updating the user's extra information field.
// Takes the new information from the POST request and applies it to the current user's profile.

require_once "session.php";

startSession();

header("Content-Type: application/json");

require_once "../database-connection/conn.php";

$information = trim($_POST["extraInfo"]);

if (changeExtraInformation($conn, $information)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$conn->close();
exit;

?>