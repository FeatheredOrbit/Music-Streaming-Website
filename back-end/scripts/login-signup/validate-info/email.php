<?php
header("Content-Type: application/json");

include "../../database-connection/conn.php";

$email = $_POST["email"] ?? $_GET["email"] ?? null;

if (!$email) {
    exit;
}

$res = [];

// Prepares an SQL command safely to prevent injections (who would inject MY database anyway)
if ($email) {
    $stat = $conn -> prepare("SELECT 1 FROM users WHERE email = ? LIMIT 1");
    $stat -> bind_param("s", $email);
    $stat -> execute();
    $stat -> store_result();

    $res["emailExists"] = $stat -> num_rows > 0;

    $stat -> close();
}

echo json_encode($res);

$conn -> close();

exit;

?>