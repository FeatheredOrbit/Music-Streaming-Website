<?php
// Password verification script used before allowing sensitive actions like profile changes
// or account deletion. Compares the provided password against the current user's stored hash.

require_once "../session/session.php";

startSession();

header("Content-Type: application/json");

$password = $_POST["password"];

$res = [];

require_once "../database-connection/conn.php";

$user_data = getCurrentUser($conn);

// Ensures the user is logged in before attempting verification.
if (!isset($user_data)) {
    $res["notLoggedIn"] = true;
    echo json_encode($res);
    exit;
}

$res["passwordResult"] = password_verify($password, $user_data["encryptedPassword"]);

echo json_encode($res);

$conn -> close();
exit;

?>