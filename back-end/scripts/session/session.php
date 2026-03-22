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

    $stmt = $conn->prepare("SELECT userId, username, dateJoined, encryptedPassword, pathToProfilePicture, extra FROM users WHERE userId = ? LIMIT 1");
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

function changeUsername($conn, $username) {
    $user = getCurrentUser($conn);

    if (!$user) {
        return ["notLoggedIn" => true];
    }

    $checkStmt = $conn->prepare("SELECT userId FROM users WHERE username = ? AND userId != ?");
    $checkStmt->bind_param("si", $username, $user["userId"]);
    $checkStmt->execute();
    $checkStmt->store_result();
    
    if ($checkStmt->num_rows > 0) {
        $checkStmt->close();
        return ["usernameTaken" => true];
    }
    $checkStmt->close();

    $stmt = $conn->prepare("UPDATE users SET username = ? WHERE userId = ?");

    if (!$stmt) {
        return ["error" => true]; 
    }

    $stmt->bind_param("si", $username, $user["userId"]);

    $result = ["success" => $stmt->execute()];
    $stmt->close();

    return $result;
}

function changePassword($conn, $password) {
    $user = getCurrentUser($conn);

    if (!$user) {
        return false;
    }

    $stmt = $conn->prepare("UPDATE users SET encryptedPassword = ? WHERE userId = ?");

    if (!$stmt) {
        return false; 
    }

    $encryptedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt->bind_param("si", $encryptedPassword, $user["userId"]);

    $result = $stmt->execute();
    $stmt->close();

    return $result;
}

function changeExtraInformation($conn, $information) {
    $user = getCurrentUser($conn);

    if (!$user) {
        return false;
    }

    $stmt = $conn->prepare("UPDATE users SET extra = ? WHERE userId = ?");

    if (!$stmt) {
        return false; 
    }

    $stmt->bind_param("si", $information, $user["userId"]);

    $result = $stmt->execute();
    $stmt->close();

    return $result;
}

function uploadProfilePicture($conn, $file) {
    $user = getCurrentUser($conn);
    
    if (!$user) {
        return null;
    }
    
    $username = $user['username'];
    $userId = $user['userId'];
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    
    $date = date('Y-m-d_H-i-s');
    $filename = $username . '_' . $date . '.' . $extension;
    
    $relativePath = 'Music-Streaming-Website/back-end/uploads/pfp/' . $filename;
    $fullPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $relativePath;
    
    if (move_uploaded_file($file['tmp_name'], $fullPath)) {

        $pathToStore = 'Music-Streaming-Website/back-end/uploads/pfp/' . $filename;
        $stmt = $conn->prepare("UPDATE users SET pathToProfilePicture = ? WHERE userId = ?");
        $stmt->bind_param("si", $pathToStore, $userId);
        
        if ($stmt->execute()) {
            $stmt->close();
            return $pathToStore;

        } else {
            $stmt->close();
            unlink($fullPath);
            return null;
        }
    }
    
    return null;
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