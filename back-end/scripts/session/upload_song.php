<?php
// Endpoint for uploading a new song to the platform.
// Validates all required fields including song name, artist, and the audio file.
// Performs checks on file upload errors and size limits before calling the upload function.
// The cover image is optional and has its own validation for size.

date_default_timezone_set("UTC");

require_once "../session/session.php";

startSession();
header("Content-Type: application/json");

$songName = $_POST["songName"];
$artist = $_POST["artist"];
$songFile = $_FILES["songFile"];
$coverFile = isset($_FILES["coverFile"]) ? $_FILES["coverFile"] : null;

// Ensures all required fields are present.
if (!isset($songName, $artist, $songFile)) {
    echo json_encode(["nullParameters" => true]);
    exit;
}

// Validates song name is not empty.
if (empty(trim($songName))) {
    echo json_encode(["emptySongName" => true]);
    exit;
}

// Validates artist name is not empty.
if (empty(trim($artist))) {
    echo json_encode(["emptyArtistName" => true]);
    exit;
}

// Checks for song file upload errors.
if ($songFile["error"] !== UPLOAD_ERR_OK) {
    if ($songFile["error"] === UPLOAD_ERR_NO_FILE) {
        echo json_encode(["noSongFile" => true]);
    } else {
        echo json_encode(["songUploadError" => true]);
    }
    exit;
}

// Validates cover image if one was provided.
if ($coverFile && $coverFile["error"] !== UPLOAD_ERR_NO_FILE) {
    if ($coverFile["error"] !== UPLOAD_ERR_OK) {
        echo json_encode(["coverUploadError" => true]);
        exit;
    }
    
    // Restricts cover image size to 5 megabytes.
    if ($coverFile["size"] > 5 * 1024 * 1024) {
        echo json_encode(["coverTooLarge" => true]);
        exit;
    }
}

require_once "../database-connection/conn.php";

$result = uploadSong($conn, $songFile, $coverFile, $songName, $artist);

echo json_encode($result);

$conn->close();
exit;

?>