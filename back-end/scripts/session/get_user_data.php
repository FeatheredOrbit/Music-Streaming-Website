<?php
// Endpoint for retrieving the current user's profile data.
// Returns username, join date, extra information, and profile picture path.
// Used by the account page to display user information and by other components for navigation.

require_once "session.php";
require_once "../database-connection/conn.php";

startSession();

header("Content-Type: application/json");

$res = [];

$user_data = getCurrentUser($conn);

// Ensures the user is logged in before returning data.
if (!isset($user_data)) {
    $res["notLoggedIn"] = true;
    echo json_encode($res);
    exit;
}

// Checks if profile picture exists and verifies the file is actually present on the server.
$profilePicturePath = array_key_exists("pathToProfilePicture", $user_data) ? $user_data["pathToProfilePicture"] : null;
if ($profilePicturePath && !file_exists($_SERVER["DOCUMENT_ROOT"] . $profilePicturePath)) {
    $profilePicturePath = null;
}

$res["username"] = $user_data["username"];
$res["dateJoined"] = $user_data["dateJoined"];
$res["extra"] = array_key_exists("extra", $user_data) ? $user_data["extra"] : null;
$res["pathToProfilePicture"] = $profilePicturePath;

echo json_encode($res);

$conn -> close();
exit;
?>