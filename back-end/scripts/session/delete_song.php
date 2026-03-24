<?php
// Endpoint for deleting a song.
// Takes a song ID from the POST request and calls the delete function.
// The delete function checks ownership before removing the song from the database.

require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songId = $_POST["songId"];

$result = deleteSong($conn, $songId);

echo json_encode($result);

$conn->close();
?>