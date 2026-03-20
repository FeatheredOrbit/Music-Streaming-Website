<?php

// Function that starts a sessions with all the appropriate settings for security.
function startSession() {
    session_set_cookie_params(
        3600, // It lasts an hour.
        '/',
        $_SERVER['HTTP_HOST'],
        true, // It will send only over HTTPS, so it's encrypted.
        true // Can't be accessed through Javascript, such as through "document.cookie".
    );
    
    // Starts the session, duh.
    session_start();
    
    // Code that avoid session fixation by regenerating a session id every 30 minutes.
    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();

    } else if (time() - $_SESSION['created'] > 1800) {
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
}

// Function that gets the current user by using the stored id and a database connection to extract user data.
function getCurrentUser($conn) {
    if (!isset($_SESSION['user_id'])) {
        return null;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT userId, username, dateJoined FROM users WHERE userId = ? LIMIT 1");
    $stmt->bind_param("i", $user_id);

    if (!$stmt) {
        return null;
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $user = $result->fetch_assoc();

    if (!$user) {
        unset($_SESSION['user_id']);
        return null;
    }

    $stmt->close();

    return $user;
}

function logIn($id) {
    $_SESSION["user_id"] = $id;
}

// Function that logs the user out by destroying the session.
function logOut() {
    $_SESSION = array();
    
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}
?>