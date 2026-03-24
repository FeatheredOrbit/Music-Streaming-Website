<?php
require_once "../session/session.php";
require_once "../database-connection/conn.php";

startSession();
header("Content-Type: application/json");

$result = deleteCurrentUser($conn);

echo json_encode($result);

$conn->close();
?>