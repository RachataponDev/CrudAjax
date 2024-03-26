<?php
try {

    require_once "../server/server.php";
    require_once "../server/main.php";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST["username"];
        $password = $_POST["pass"];
        $email = $_POST["email"];
        $status = $_POST["status"];
        $date = $_POST["date"];
        $time = $_POST["time"];
        $phone = $_POST["phone"];
        $password = password_hash($password,PASSWORD_DEFAULT);
        if (isset($_FILES["file"])) {
            $file = $_FILES["file"];
            $file["name"] = rand(11111111, 99999999) . "." . pathinfo($file["name"], PATHINFO_EXTENSION);
            $filenamemain = $file["name"];
        }else {
            $file = false;
        }
       
        if ($file !== false) {
            $sql = $db->prepare("INSERT INTO user (username, password, email, phone, status, avatar, Date, Time) 
            VALUES (:username, :password, :email, :phone, :status, :avatar, :date, :time)");
            $sql->bindParam(':username', $username,PDO::PARAM_STR);
            $sql->bindParam(':password', $password,PDO::PARAM_STR);
            $sql->bindParam(':email', $email,PDO::PARAM_STR);
            $sql->bindParam(':phone', $phone,PDO::PARAM_STR);
            $sql->bindParam(':status', $status,PDO::PARAM_INT);
            $sql->bindParam(':avatar', $filenamemain,PDO::PARAM_STR);
            $sql->bindParam(':date', $date,PDO::PARAM_STR);
            $sql->bindParam(':time', $time,PDO::PARAM_STR);
            if (move_uploaded_file($file["tmp_name"],"../file/avatar/".$filenamemain)) {
                $sql->execute();
                http_response_code(200);
                echo json_encode(array("status" => true, "message" => "success"));
                exit;
            }else {
                http_response_code(200);
                echo json_encode(array("status" => false, "message" => "Server Error!"));
                exit;
            }
        }else {
            $file = "false";
            $sql = $db->prepare("INSERT INTO user (username, password, email, phone, status, avatar, Date, Time) 
            VALUES (:username, :password, :email, :phone, :status, :avatar, :date, :time)");
            $sql->bindParam(':username', $username,PDO::PARAM_STR);
            $sql->bindParam(':password', $password,PDO::PARAM_STR);
            $sql->bindParam(':email', $email,PDO::PARAM_STR);
            $sql->bindParam(':phone', $phone,PDO::PARAM_STR);
            $sql->bindParam(':status', $status,PDO::PARAM_INT);
            $sql->bindParam(':avatar', $file,PDO::PARAM_STR);
            $sql->bindParam(':date', $date,PDO::PARAM_STR);
            $sql->bindParam(':time', $time,PDO::PARAM_STR);
            if ($sql->execute()) {
                http_response_code(200);
                echo json_encode(array("status" => true, "message" => "success"));
                exit;
            }else {
                http_response_code(200);
                echo json_encode(array("status" => false, "message" => "Server Error!"));
                exit;
            }
        }
    } else {
        http_response_code(200);
        echo json_encode(array("status" => false, "message" => "Method not Allow!!"));
        exit;
    }
} catch (Exception $e) {
    http_response_code(200);
    echo json_encode(array("status" => false, "message" => "Server Error!!"));
    exit;
}
