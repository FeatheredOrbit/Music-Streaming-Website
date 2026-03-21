<?php

date_default_timezone_set('UTC');

require_once "session.php";

startSession();

header("Content-Type: application/json");

require_once "../database-connection/conn.php";

$file = $_FILES['profilePicture'];

if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'No file uploaded']);
    $conn->close();
    exit;
}

if (!file_exists($file['tmp_name'])) {
    echo json_encode(['error' => 'Invalid file']);
    $conn->close();
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) {
    echo json_encode(['error' => 'File too large. Max 5MB']);
    $conn->close();
    exit;
}

$imageInfo = getimagesize($file['tmp_name']);
if ($imageInfo === false) {
    echo json_encode(['error' => 'File is not an image']);
    $conn->close();
    exit;
}

$uploadResult = uploadProfilePicture($conn, $file);

if ($uploadResult === null) {
    echo json_encode(['error' => 'Failed to upload profile picture']);
} else {
    echo json_encode([
        'pathToProfilePicture' => $uploadResult
    ]);
}

$conn->close();
exit;

?>