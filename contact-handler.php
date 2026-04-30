<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection settings
$servername = "localhost";
$port = 3308;  // XAMPP port 3308
$username = "root";
$password = "";
$database = "travel_db";

// Debug: Log received data
$debug_log = fopen("debug_log.txt", "a");
if ($debug_log === false) {
    die("Debug log error: Could not create log file");
}

fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Request Method: " . $_SERVER["REQUEST_METHOD"] . "\n");
fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Received POST: " . print_r($_POST, true) . "\n");
fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Received GET: " . print_r($_GET, true) . "\n");

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get POST data and sanitize
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Parsed data - name: $name, email: $email, phone: $phone, subject: $subject\n");
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Validation failed: missing required fields\n");
        fclose($debug_log);
        echo "<script>
            alert('Please fill in all required fields (name, email, message).');
            window.history.back();
        </script>";
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Validation failed: invalid email\n");
        fclose($debug_log);
        echo "<script>
            alert('Please enter a valid email address.');
            window.history.back();
        </script>";
        exit;
    }
    
    // Create connection with error reporting
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    try {
        $conn = new mysqli($servername, $username, $password, $database, $port);
        
        // Verify connection is truly established
        if ($conn->connect_error) {
            fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Connection error: " . $conn->connect_error . "\n");
            fclose($debug_log);
            echo "<script>
                alert('Database connection failed: " . addslashes($conn->connect_error) . "');
                window.history.back();
            </script>";
            exit;
        }
        
        // Log connection info
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Database connected successfully\n");
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Server info: " . $conn->server_info . "\n");
    } catch (Exception $e) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Connection exception: " . $e->getMessage() . "\n");
        fclose($debug_log);
        echo "<script>
            alert('Database connection failed: " . addslashes($e->getMessage()) . "');
            window.history.back();
        </script>";
        exit;
    }
    
    // Check if table exists (using 'contacts' as you specified)
    $result = $conn->query("SHOW TABLES LIKE 'contacts'");
    if ($result->num_rows == 0) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Table 'contacts' does not exist. Creating table...\n");
        
        // Create table if it doesn't exist
        $createTable = "CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            subject VARCHAR(200),
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        if ($conn->query($createTable)) {
            fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Table 'contacts' created successfully\n");
        } else {
            fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Error creating table: " . $conn->error . "\n");
        }
    }
    
    // Prepare SQL statement (inserting into 'contacts' table)
    $insertSql = "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] SQL: " . $insertSql . "\n");
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Values - name: '" . $name . "', email: '" . $email . "', phone: '" . $phone . "', subject: '" . $subject . "', message: '" . substr($message, 0, 50) . "...'\n");
    
    $stmt = $conn->prepare($insertSql);
    
    if ($stmt === false) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Prepare error: " . $conn->error . "\n");
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Prepare errno: " . $conn->errno . "\n");
        fclose($debug_log);
        echo "<script>
            alert('Error preparing statement: " . addslashes($conn->error) . "');
            window.history.back();
        </script>";
        exit;
    }
    
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Statement prepared successfully\n");
    
    // Bind parameters with error checking
    $bindResult = $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);
    
    if ($bindResult === false) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Bind_param error: " . $stmt->error . "\n");
        fclose($debug_log);
        echo "<script>
            alert('Error binding parameters: " . addslashes($stmt->error) . "');
            window.history.back();
        </script>";
        exit;
    }
    
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Parameters bound successfully\n");
    
    // Execute with detailed error reporting
    $executeResult = $stmt->execute();
    
    if ($executeResult === false) {
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Execute error: " . $stmt->error . "\n");
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Execute errno: " . $stmt->errno . "\n");
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Insert ID: " . $stmt->insert_id . "\n");
        fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Affected rows: " . $stmt->affected_rows . "\n");
        fclose($debug_log);
        echo "<script>
            alert('Error inserting data: " . addslashes($stmt->error) . "');
            window.history.back();
        </script>";
        exit;
    }
    
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Data inserted successfully. Insert ID: " . $stmt->insert_id . "\n");
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Affected rows: " . $stmt->affected_rows . "\n");
    fclose($debug_log);
    
    $stmt->close();
    $conn->close();
    
    // Success - redirect back to contact page
    header("Location: contact.html?success=1");
    exit;
    
} else {
    fwrite($debug_log, "[" . date("Y-m-d H:i:s") . "] Not a POST request\n");
    fclose($debug_log);
    // Redirect if not POST request
    header("Location: contact.html");
    exit;
}

// Ensure debug log is closed on script end
if ($debug_log !== false && $debug_log !== null) {
    fclose($debug_log);
}
?>