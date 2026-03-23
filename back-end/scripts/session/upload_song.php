<?php
date_default_timezone_set('UTC');

require_once "../session/session.php";

startSession();
header("Content-Type: application/json");

$songName = $_POST['songName'];
$artist = $_POST['artist'];
$songFile = $_FILES['songFile'];
$coverFile = isset($_FILES['coverFile']) ? $_FILES['coverFile'] : null;

if (!isset($songName, $artist, $songFile)) {
    echo json_encode(["nullParameters" => true]);
    exit;
}

if (empty(trim($songName))) {
    echo json_encode(['emptySongName' => true]);
    exit;
}

if (empty(trim($artist))) {
    echo json_encode(['emptyArtistName' => true]);
    exit;
}

if ($songFile['error'] !== UPLOAD_ERR_OK) {
    // Handle different upload errors
    if ($songFile['error'] === UPLOAD_ERR_NO_FILE) {
        echo json_encode(['noSongFile' => true]);
    } else {
        echo json_encode(['songUploadError' => true]);
    }
    exit;
}

if ($coverFile && $coverFile['error'] !== UPLOAD_ERR_NO_FILE) {
    if ($coverFile['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['coverUploadError' => true]);
        exit;
    }
    
    if ($coverFile['size'] > 5 * 1024 * 1024) {
        echo json_encode(['coverTooLarge' => true]);
        exit;
    }
}

require_once "../database-connection/conn.php";

$result = uploadSong($conn, $songFile, $coverFile, $songName, $artist);

echo json_encode($result);

$conn->close();
exit;

?>