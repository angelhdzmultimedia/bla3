<?php
// Set headers for API response
header('Content-Type: application/json');

// Get the request URI and method
$uri = strtok($_SERVER['REQUEST_URI'], '?');
$method = $_SERVER['REQUEST_METHOD'];

// Remove any leading or trailing slashes and the '/api/' prefix
$uri = trim(str_replace('/api/', '', $uri), '/');

// Build the path to the PHP file based on the URI
$path = 'server/api/' . $uri;

// Check if the URI is a directory or a file
if (is_dir($path)) {
    // If the URI points to a directory, look for an 'index.php' file inside it.
    $path .= '/index.php';
} else {
    // If the URI points to a file, add the .php extension
    $path .= '.php';
}

// Check if the file exists and is a readable file
if (file_exists($path) && is_file($path)) {
    // Include the file, which contains your handler logic
    require_once $path;
} else {
    // If no matching file is found, it's a 404 Not Found
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}

// In your included handler files (e.g., login.php), you would have access to
// the original request data like `$_POST`, `file_get_contents('php://input')`, etc.
?>
