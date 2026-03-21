<?php

require_once "session.php";

startSession();

header("Content-Type: application/json");

require_once "../database-connection/conn.php";

$information = trim($_POST["extraInfo"]);

if (changeExtraInformation($conn, $information)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$conn->close();
exit;

?>