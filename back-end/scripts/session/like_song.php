<?php
// Endpoint for toggling a like on a song.
// If the user has already liked the song, it removes the like.
// If the user has not liked the song, it adds a new like record.
// Returns the action taken along with success status.

require_once "session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songId = $_POST["songId"];

$result = toggleLike($conn, $songId);
echo json_encode($result);

$conn->close();
?>