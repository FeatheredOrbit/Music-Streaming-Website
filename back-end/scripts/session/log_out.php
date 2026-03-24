<?php
// Endpoint for logging out the current user.
// Destroys the session and clears all session data, effectively ending the user's authenticated session.

require_once "session.php";

startSession();
logOut();

exit;

?>