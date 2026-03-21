-- Drop and recreate the musicDB for debugging
DROP DATABASE IF EXISTS musicDB;
CREATE DATABASE musicDB;

USE musicDB;

-- Creates users table to store user credentials and registration date
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    encryptedPassword VARCHAR(255) NOT NULL,
    dateJoined DATE NOT NULL,
    extra VARCHAR(2048),
    pathToProfilePicture VARCHAR(256)
);
    
-- Creates songs table to stores song metadata and links to the uploading user
-- uploadedBy is a foreign key referencing userID in the users table
DROP TABLE IF EXISTS songs;
CREATE TABLE IF NOT EXISTS songs (
    songId INT AUTO_INCREMENT PRIMARY KEY,
    songName VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    extra VARCHAR(2048),
    cover VARCHAR(256)
    datePosted DATE NOT NULL,

    uploadedBy INT NOT NULL,
    FOREIGN KEY (uploadedBy) REFERENCES users(userId)
        ON DELETE CASCADE -- Delete songs if the user is deleted
        ON UPDATE CASCADE
);

DROP TABLE IF EXISTS likes;
CREATE TABLE IF NOT EXISTS likes {
    likedBy INT NOT NULL PRIMARY KEY,
    FOREIGN KEY (likedBy) REFERENCES users(userId)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
    
    likedSong INT NOT NULL PRIMARY,
    FOREIGN KEY (likedSong) REFERENCES songs(songId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
}

