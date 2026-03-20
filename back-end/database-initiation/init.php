<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $servername = "localhost";
    $db_username = "root";
    $db_password = "root";

    $conn = new mysqli($servername, $db_username, $db_password);

    if ($conn -> connect_error) {
        die("Connection error: " . $conn->connect_error);
    }

    $dbname = "musicDB";

    $sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$dbname'";

    $result = $conn -> query($sql);

    if ($result -> num_rows === 0) {
        $initSQL = file_get_contents("init.sql");

        if ($conn -> multi_query($initSQL)) {
            echo "Database initialized";
        } else {
            echo "Error initializing database: " . $conn -> error;
        }
    } else {
        echo "Database already exists";
    }

    $conn -> close();


?>


