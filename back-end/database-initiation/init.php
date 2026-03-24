<?php
    // Initialization script that checks if the music database exists and creates it if needed.
    // Reads the SQL schema from init.sql and executes all queries to set up tables and relationships.
    // This script runs automatically when the application starts.

    $servername = "localhost";
    $db_username = "root";
    $db_password = "root";

    $conn = new mysqli($servername, $db_username, $db_password);

    if ($conn -> connect_error) {
        die("Connection error: " . $conn->connect_error);
    }

    $dbname = "musicDB";

    // Checks if the database already exists in the MySQL server.
    $sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$dbname'";

    $result = $conn -> query($sql);

    if ($result -> num_rows === 0) {
        // Database does not exist. Read and execute the SQL file to create everything.
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