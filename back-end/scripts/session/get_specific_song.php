<?php
require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songId = $_POST['songId'];

$currentUserId = null;
$user = getCurrentUser($conn);
if ($user) {
    $currentUserId = $user['userId'];
}

$stmt = $conn->prepare("
    SELECT s.*, u.username as uploadedByUsername,
        COUNT(l.likedBy) as likeCount,
        CASE WHEN myLike.likedBy IS NOT NULL THEN 1 ELSE 0 END as isLiked
    FROM songs s 
    JOIN users u ON s.uploadedBy = u.userId 
    LEFT JOIN likes l ON l.likedSong = s.songId
    LEFT JOIN likes myLike ON myLike.likedSong = s.songId AND myLike.likedBy = ?
    WHERE s.songId = ?
    GROUP BY s.songId
");

$stmt->bind_param("ii", $currentUserId, $songId);
$stmt->execute();
$result = $stmt->get_result();

if ($song = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'song' => $song]);
} else {
    echo json_encode(['error' => 'song_not_found']);
}

$stmt->close();
$conn->close();
?>