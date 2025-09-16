<?php 
$found_user = null;
$token = $_GET['token'];
foreach ($users as $user) {
    if ($user['token'] === $token) {
        $found_user = $user;
        break;
    }
}

if ($found_user !== null) {
    $found_user->isVerified = true;
    http_response_code(200); 
    echo json_encode(true);
    exit;
} else {
   http_response_code(200); 
    echo json_encode(false);
}

?>