<?php
    // Database connection convenience file.
    // Creates a MySQL connection with credentials and selects the music database.
    // This file is included by all other PHP scripts to avoid repeating connection logic.

    $servername = "localhost";
    $db_user = "root";
    $db_password = "root";
    $dbname = "musicDB";

    $conn = new mysqli($servername, $db_user, $db_password, $dbname);

    if ($conn -> connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>