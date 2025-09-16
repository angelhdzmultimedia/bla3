<?php
session_start();
require_once __DIR__ . '/../../data.php'; 

// Set the content type to application/json
header('Content-Type: application/json');

// Define a static array of users for demonstration purposes


// Read the raw JSON data from the request body
$json_data = file_get_contents('php://input');
$login_data = json_decode($json_data, true);

// Check if JSON decoding was successful and data exists
if ($login_data === null) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON data.']);
    exit;
}

// Get email and password from the decoded data
$email = $login_data['email'] ?? '';
$password = $login_data['password'] ?? '';
$firstName = $login_data['firstName'] ?? '';


// Find the user in the static array
$found_user = null;
foreach ($users as $user) {
    if ($user['email'] === $email && $user['id'] === $password) {
        $found_user = $user;
        break;
    }
}

// Check if a user was found
if ($found_user) {
   $_SESSION['user'] = $found_user['id'];
    http_response_code(409); // OK
    // Remove the password before sending the user data

    echo json_encode(['error' => 'User already exists.']);
} else {
  $token = uniqid();
    $user = [
        'id' => $id,
        'email' => $email,
        'password' => $password,
        'firstName' => $firstName,
        'id' => uniqid('user'),
        'token' => $token
    ];
    // Send email with verification link
    
    mail($email, 'AHdz Blog - Verify your email', "Click here to verify your email: https://angelhdz.infinityfreeapp.com/api/auth/verify?token=$token");
    $users[] = $user;
    http_response_code(201); // Unauthorized
    echo json_encode($user);
}








?>