<?php
// Endpoint for retrieving all songs uploaded by the current user.
// Used in the library page to display the user's own uploaded tracks.
// Includes like counts and whether the current user has liked each song.

require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songs = getCurrentUserSongs($conn);

if ($songs === null) {
    echo json_encode(["error" => true]);
} else {
    echo json_encode(["songs" => $songs]);
}

$conn->close();
?>