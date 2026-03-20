<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('UTC');

require_once "../session/session.php";
startSession();

header("Content-Type: application/json");

$username = trim($_POST["username"]);
$password = $_POST["password"];

$res = [];

if (!isset($_POST["username"], $_POST["password"])) {
    $res["nullParameters"] = true;
    echo json_encode($res);
    exit;
}

require_once "../database-connection/conn.php";

$stat = $conn->prepare("SELECT userId, username, encryptedPassword FROM users WHERE username = ? LIMIT 1");
if ($stat === false) {
    $res["loginSuccessful"] = false;
    $res["error"] = "Database error";
    echo json_encode($res);
    exit;
}

$stat->bind_param("s", $username);
$stat->execute();
$result = $stat->get_result();

if ($result->num_rows === 0) {
    $res["usernameError"] = true;
    echo json_encode($res);
    $stat->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['encryptedPassword'])) {
    logIn($user['userId']);
    
    $res["loginSuccessful"] = true;
    echo json_encode($res);

} else {
    $res["passwordError"] = true;
    echo json_encode($res);
}

$stat->close();
$conn->close();

exit;

?>