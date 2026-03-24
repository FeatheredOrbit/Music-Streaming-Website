<?php
require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$songId = $_POST['songId'];

$result = deleteSong($conn, $songId);

echo json_encode($result);

$conn->close();
?>