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

function deleteCurrentUser($conn) {
    $user = getCurrentUser($conn);
    
    if (!$user) {
        return ["notLoggedIn" => true];
    }
    
    $userId = $user['userId'];
    
    $stmt = $conn->prepare("DELETE FROM users WHERE userId = ?");
    $stmt->bind_param("i", $userId);
    
    if ($stmt->execute()) {
        $stmt->close();
        logOut();
        return ['success' => true];
    } else {
        $stmt->close();
        return ['success' => false];
    }
}

function uploadSong($conn, $songFile, $coverFile, $songName, $artist) {
    $user = getCurrentUser($conn);
    
    if (!$user) {
        return ['notLoggedIn' => true];
    }
    
    $username = $user['username'];
    $userId = $user['userId'];
    $date = date('Y-m-d');
    $dateTime = date('Y-m-d_H-i-s');
    
    $songExtension = pathinfo($songFile['name'], PATHINFO_EXTENSION);
    $songFilename = $username . '_' . $dateTime . '.' . $songExtension;
    $songRelativePath = 'Music-Streaming-Website/back-end/uploads/songs/' . $songFilename;
    $songFullPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $songRelativePath;
    
    if (!move_uploaded_file($songFile['tmp_name'], $songFullPath)) {
        return ['uploadFailed' => true];
    }
    
    $coverPath = null;
    if ($coverFile && $coverFile['error'] !== UPLOAD_ERR_NO_FILE) {
        $coverExtension = pathinfo($coverFile['name'], PATHINFO_EXTENSION);
        $coverFilename = $username . '_cover_' . $dateTime . '.' . $coverExtension;
        $coverRelativePath = 'Music-Streaming-Website/back-end/uploads/covers/' . $coverFilename;
        $coverFullPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $coverRelativePath;
        
        if (move_uploaded_file($coverFile['tmp_name'], $coverFullPath)) {
            $coverPath = $coverRelativePath;
        }
    }
    
    $stmt = $conn->prepare("INSERT INTO songs (songName, artist, pathToCover, pathToSong, datePosted, uploadedBy) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssi", $songName, $artist, $coverPath, $songRelativePath, $date, $userId);
    
    if ($stmt->execute()) {

        $stmt->close();
        return ['success' => true];
    } else {

        $stmt->close();
        
        unlink($songFullPath);
        if ($coverPath && file_exists($coverFullPath)) {
            unlink($coverFullPath);
        }
        return ['uploadFailed' => true];
    }
}

function toggleLike($conn, $songId) {
    $user = getCurrentUser($conn);
    
    if (!$user) {
        return ['notLoggedIn' => true];
    }
    
    $userId = $user['userId'];
    
    $checkStmt = $conn->prepare("SELECT * FROM likes WHERE likedBy = ? AND likedSong = ?");
    $checkStmt->bind_param("ii", $userId, $songId);
    $checkStmt->execute();
    $checkStmt->store_result();
    
    $isLiked = $checkStmt->num_rows > 0;
    $checkStmt->close();
    
    if ($isLiked) {
        $stmt = $conn->prepare("DELETE FROM likes WHERE likedBy = ? AND likedSong = ?");
        $stmt->bind_param("ii", $userId, $songId);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            return ['success' => true, 'unliked' => true];
        } else {
            return ['success' => false];
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO likes (likedBy, likedSong) VALUES (?, ?)");
        $stmt->bind_param("ii", $userId, $songId);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            return ['success' => true, 'liked' => true];
        } else {
            return ['success' => false];
        }
    }
}

function getAllSongs($conn, $userId = null) {
    $currentUserId = null;
    $user = getCurrentUser($conn);
    if ($user) {
        $currentUserId = $user['userId'];
    }
    
    if ($userId) {
        
        $stmt = $conn->prepare("
            SELECT s.*, u.username as uploadedByUsername,
                COUNT(DISTINCT l.likedBy) as likeCount,
                CASE WHEN myLike.likedBy IS NOT NULL THEN 1 ELSE 0 END as isLiked
            FROM songs s 
            JOIN users u ON s.uploadedBy = u.userId 
            LEFT JOIN likes l ON l.likedSong = s.songId
            LEFT JOIN likes myLike ON myLike.likedSong = s.songId AND myLike.likedBy = ?
            WHERE s.uploadedBy = ? 
            GROUP BY s.songId
            ORDER BY s.datePosted DESC
        ");
        
        $stmt->bind_param("ii", $currentUserId, $userId);
    } else {
        
        $stmt = $conn->prepare("
            SELECT s.*, u.username as uploadedByUsername,
                COUNT(l.likedBy) as likeCount,
                CASE WHEN myLike.likedBy IS NOT NULL THEN 1 ELSE 0 END as isLiked
            FROM songs s 
            JOIN users u ON s.uploadedBy = u.userId 
            LEFT JOIN likes l ON l.likedSong = s.songId
            LEFT JOIN likes myLike ON myLike.likedSong = s.songId AND myLike.likedBy = ?
            GROUP BY s.songId
            ORDER BY s.datePosted DESC
        ");
        
        $stmt->bind_param("i", $currentUserId);
    }
    
    if (!$stmt) {
        return null;
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $songs = [];
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
    
    $stmt->close();
    return $songs;
}

function getCurrentUserLikedSongs($conn) {
    $user = getCurrentUser($conn);
    
    if (!$user) {
        return null;
    }
    
    $currentUserId = $user['userId'];
    
    $stmt = $conn->prepare("
        SELECT s.*, u.username as uploadedByUsername,
            COUNT(DISTINCT l.likedBy) as likeCount,
            CASE WHEN myLike.likedBy IS NOT NULL THEN 1 ELSE 0 END as isLiked
        FROM songs s 
        JOIN users u ON s.uploadedBy = u.userId 
        INNER JOIN likes liked ON liked.likedSong = s.songId
        LEFT JOIN likes l ON l.likedSong = s.songId
        LEFT JOIN likes myLike ON myLike.likedSong = s.songId AND myLike.likedBy = ?
        WHERE liked.likedBy = ?
        GROUP BY s.songId
        ORDER BY liked.likedBy DESC, s.datePosted DESC
    ");
    
    if (!$stmt) {
        return null;
    }
    
    $stmt->bind_param("ii", $currentUserId, $currentUserId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $songs = [];
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
    
    $stmt->close();
    return $songs;
}

function getCurrentUserSongs($conn) {
    $user = getCurrentUser($conn);
    
    if (!$user) {
        return null;
    }
    
    return getAllSongs($conn, $user['userId']);
}

function getAbsolutelyAllSongs($conn) {
    $currentUserId = null;
    $user = getCurrentUser($conn);
    if ($user) {
        $currentUserId = $user['userId'];
    }
    
    $stmt = $conn->prepare("
        SELECT s.*, u.username as uploadedByUsername,
            COUNT(l.likedBy) as likeCount,
            CASE WHEN myLike.likedBy IS NOT NULL THEN 1 ELSE 0 END as isLiked
        FROM songs s 
        JOIN users u ON s.uploadedBy = u.userId 
        LEFT JOIN likes l ON l.likedSong = s.songId
        LEFT JOIN likes myLike ON myLike.likedSong = s.songId AND myLike.likedBy = ?
        GROUP BY s.songId
        ORDER BY s.datePosted DESC
    ");
    
    if (!$stmt) {
        return null;
    }
    
    $stmt->bind_param("i", $currentUserId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $songs = [];
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
    
    $stmt->close();
    return $songs;
}

?>