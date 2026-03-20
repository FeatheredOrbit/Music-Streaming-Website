<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $servername = "localhost";
    $db_user = "root";
    $db_password = "root";
    $dbname = "musicDB";

    $conn = new mysqli($servername, $db_user, $db_password, $dbname);

    if ($conn -> connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>