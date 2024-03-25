<?php
try {

    require_once "../server/server.php";
    require_once "../server/main.php";

    $req = json_decode(file_get_contents("php://input"), true);
    if ($req !== "" && count($req) !== 0) {
        $type = $req["type"];

        if ($type == 100) {
            if (is_numeric((int)$id) && is_numeric($type)) {
                $id = $req["id"];
                $query = $db->prepare("SELECT avatar FROM user WHERE ID = :id");
                $query->bindParam(":id", $id,PDO::PARAM_INT);
                if ($query->execute()) {
                    $res = $query->fetch(PDO::FETCH_ASSOC);
                    $avatar = $res["avatar"];
                    $sql = $db->prepare("DELETE FROM user WHERE ID = :id");
                    $sql->bindParam(":id", $id,PDO::PARAM_INT);
                    if ($sql->execute()) {
                        if ($avatar !== "false") {
                            unlink("../file/avatar/" . $avatar);
                        }
                        http_response_code(200);
                        echo json_encode(array("status" => true, "message" => "success"));
                        exit;
                    }
                } else {
                    http_response_code(200);
                    echo json_encode(array("status" => false, "message" => "Server Error!!"));
                    exit;
                }
            } else {
                http_response_code(200);
                echo json_encode(array("status" => false, "message" => "Data Invalid!!"));
            }
        } else if ($type == 200) {
            $checked = $req["id"];
            for ($i = 0; $i < count($checked); $i++) {
                $id = $checked[$i];
                if (is_numeric((int)$id)) {
                    $query = $db->prepare("SELECT avatar FROM user WHERE ID = :id");
                    $query->bindParam(":id", $id,PDO::PARAM_INT);
                    if ($query->execute()) {
                        $res = $query->fetch(PDO::FETCH_ASSOC);
                        $avatar = $res["avatar"];
                        $sql = $db->prepare("DELETE FROM user WHERE ID = :id");
                        $sql->bindParam(":id", $id,PDO::PARAM_INT);
                        if ($sql->execute()) {
                            if ($avatar !== "false") {
                                unlink("../file/avatar/" . $avatar);
                            }
                        }
                    }
                }
            }
            http_response_code(200);
            echo json_encode(array("status" => true, "message" => "success"));
            exit;
        } else {
            http_response_code(200);
            echo json_encode(array("status" => false, "message" => "Data Invalid!!"));
            exit;
        }

    } else {
        http_response_code(200);
        echo json_encode(array("status" => true, "message" => "Method not Allow!!"));
        exit;
    }
} catch (Exception $e) {
    http_response_code(200);
    echo json_encode(array("status" => false, "message" => "Server Error!!"));
    exit;
}
