<?php
// Endpoint for retrieving detailed information about a specific song.
// Used by the overlay component to fetch song metadata including like count,
// uploader username, and whether the current user has liked the song.
// Returns complete song details for playback and display.

require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songId = $_POST["songId"];

if ($song = getSpecificSong($conn, $songId)->fetch_assoc()) {
    echo json_encode(["success" => true, "song" => $song]);
} else {
    echo json_encode(["error" => "song_not_found"]);
}

$stmt->close();
$conn->close();
?>