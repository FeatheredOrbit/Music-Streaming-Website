<?php
// Endpoint for retrieving all songs that the current user has liked.
// Used in the library page to display the user's liked tracks collection.
// Includes like counts and confirms the liked status for each song.

require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songs = getCurrentUserLikedSongs($conn);

if ($songs === null) {
    echo json_encode(["error" => true]);
} else {
    echo json_encode(["songs" => $songs]);
}

$conn->close();
?>