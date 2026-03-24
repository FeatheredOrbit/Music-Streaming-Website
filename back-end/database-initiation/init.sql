-- Database initialization script for my website!
-- Drops any existing database and creates a fresh one with all required tables.
-- Sets up users, songs, and likes with proper foreign key relationships.

-- Drop and recreate the musicDB.
DROP DATABASE IF EXISTS musicDB;
CREATE DATABASE musicDB;

USE musicDB;

-- Stores user account information including credentials and profile data.
-- Username must be unique to prevent duplicate accounts.
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    encryptedPassword VARCHAR(255) NOT NULL,
    dateJoined DATE NOT NULL,
    extra VARCHAR(2048),
    pathToProfilePicture VARCHAR(256)
);
    
-- Stores song metadata and links each track to its uploader.
-- uploadedBy is a foreign key referencing userId in the users table.
-- When a user is deleted, all their uploaded songs are automatically removed.
DROP TABLE IF EXISTS songs;
CREATE TABLE IF NOT EXISTS songs (
    songId INT AUTO_INCREMENT PRIMARY KEY,
    songName VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    pathToCover VARCHAR(256),
    pathToSong VARCHAR(256),
    datePosted DATE NOT NULL,

    uploadedBy INT NOT NULL,
    FOREIGN KEY (uploadedBy) REFERENCES users(userId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tracks which users have liked which songs.
-- Uses a composite primary key to prevent duplicate likes.
-- When a user is deleted or a song is removed, associated likes are also removed.
DROP TABLE IF EXISTS likes;
CREATE TABLE IF NOT EXISTS likes (
    likedBy INT NOT NULL,
    likedSong INT NOT NULL,

    PRIMARY KEY (likedBy, likedSong),

    FOREIGN KEY (likedBy) REFERENCES users(userId)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    FOREIGN KEY (likedSong) REFERENCES songs(songId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);