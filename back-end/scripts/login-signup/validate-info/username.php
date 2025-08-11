<?php
header("Content-Type: application/json");

include "../../database-connection/conn.php";

$username = $_POST["username"] ?? $_GET["username"] ?? null;

if (!$username) {
    exit;
}

$res = [];

// Prepares an SQL command safely to prevent injections (who would inject MY database anyway)
if ($username) {
    $stat = $conn -> prepare("SELECT 1 FROM users WHERE username = ? LIMIT 1");
    $stat -> bind_param("s", $username);
    $stat -> execute();
    $stat -> store_result();

    $res["UsernameExists"] = $stat -> num_rows > 0;

    $stat -> close();
}

echo json_encode($res);

$conn -> close();

exit;

?>