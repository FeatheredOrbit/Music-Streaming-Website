<?php
// Endpoint for deleting the current user's account.
// Calls the delete function which removes the user and all associated data from the database.
// The user is automatically logged out after successful deletion.

require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$result = deleteCurrentUser($conn);

echo json_encode($result);

$conn->close();
?>