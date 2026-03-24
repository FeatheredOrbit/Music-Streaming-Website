<?php
// Endpoint for retrieving every song in the database.
// Used by the home page to display all uploaded tracks.
// Includes like counts and whether the current user has liked each song.

require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songs = getAbsolutelyAllSongs($conn);

if ($songs === null) {
    echo json_encode(["error" => true]);
} else {
    echo json_encode(["songs" => $songs]);
}

$conn->close();
?>