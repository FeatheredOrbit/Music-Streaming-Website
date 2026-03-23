<?php
require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songs = getCurrentUserSongs($conn);

if ($songs === null) {
    echo json_encode(['error' => true]);
} else {
    echo json_encode(['songs' => $songs]);
}

$conn->close();
?>