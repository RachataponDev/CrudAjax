<?php
try {

    require_once "../server/server.php";
    require_once "../server/main.php";
    function validateArray($arr)
    {
        foreach ($arr as $value) {
            if (!is_numeric($value) || strlen($value) !== 3) {
                return false;
            }
        }
        return true;
    }
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $req = json_decode(file_get_contents("php://input"), true);
        if ($req !== "" && count($req) !== 0) {
            $sql = "";
            if (isset($req["serch"])) {
                $serch = $req["serch"];
                $val = $serch["val"];
                $check = $serch["check"];
                $datef = $serch["datef"];
                $datel = $serch["datel"];
                $sortArr = $serch["sortArr"];
                if ($val !== "") {
                    if (isValidAll($val) == 1) {
                        $sql .= "WHERE (username LIKE '%$val%' OR email LIKE '%$val%' OR phone LIKE '%$val%') ";
                    } else {
                        http_response_code(200);
                        echo json_encode(array("status" => false, "message" => "Server Error!!"));
                        exit;
                    }
                }
                if (count($check) !== 0) {
                    if (validateArray($check)) {
                        if ($sql !== "") {
                            $sql .= "AND status  IN (" . implode(",", $check) . ") ";
                        } else {
                            $sql .= "WHERE status  IN (" . implode(",", $check) . ") ";
                        }
                    } else {
                        http_response_code(200);
                        echo json_encode(array("status" => false, "message" => "Server Error!!"));
                        exit;
                    }

                }
                if (count($datef) !== 0 && count($datel) !== 0) {
                    if (isDateValid($datef[0]) == 1 && isTimeValid($datef[1]) == 1 && isDateValid($datel[0]) == 1 && isTimeValid($datel[1]) == 1) {
                        if ($sql !== "") {
                            $sql .= "AND Date BETWEEN '$datef[0]' AND '$datel[0]' AND Time BETWEEN '$datef[1]' AND '$datel[1]'";
                        } else {
                            $sql .= "WHERE Date BETWEEN '$datef[0]' AND '$datel[0]' AND Time BETWEEN '$datef[1]' AND '$datel[1]'";
                        }
                    } else {
                        http_response_code(200);
                        echo json_encode(array("status" => false, "message" => "Server Error!!"));
                        exit;
                    }
                }

                if (count($sortArr) !== 0) {
                    $orderBy = "";
                    for ($i = 0; $i < count($sortArr); $i++) {
                        if ($sortArr[$i]["type"] == "Date") {
                            $orderBy .= ($orderBy == "") ? "ORDER BY Date " . $sortArr[$i]["sort"] . ", Time " . $sortArr[$i]["sort"] : ", Date " . $sortArr[$i]["sort"] . ", Time " . $sortArr[$i]["sort"];
                        } else {
                            $orderBy .= ($orderBy == "") ? "ORDER BY " . $sortArr[$i]["type"] . " " . $sortArr[$i]["sort"] : ", " . $sortArr[$i]["type"] . " " . $sortArr[$i]["sort"];
                        }
                    }
                    $sql .= $orderBy;
                }
            }
            $page = $req["page"];
            $limit = $req["limit"];
            $page_start = ($page - 1) * $limit;
            $select_smtp = $db->prepare("SELECT ID,username,email,phone,avatar,Date,Time,status FROM user " . $sql . " LIMIT $page_start, $limit");
            $select_row = $db->prepare("SELECT count(ID) FROM user " . $sql);
            if ($select_row->execute()) {
                $totalrow = $select_row->fetchColumn();
                if ($totalrow == 0) {
                    $totalpage = 0;
                } else {
                    $totalpage = ceil($totalrow / $limit);
                }
                if ($select_smtp->execute()) {
                    $res = array();
                    while ($row = $select_smtp->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);
                        $Newdate = DateTime::createFromFormat('Y-m-d', $Date);
                        $formattedDate = $Newdate->format('F d, Y');
                        $time = DateTime::createFromFormat('H:i', $Time);
                        $formattedTime = $time->format('h:i A');
                        $arr = array(
                            "ID" => $ID,
                            "username" => $username,
                            "email" => $email,
                            "phone" => $phone,
                            "avatar" => $avatar,
                            "Date" => $formattedDate,
                            "Time" => $formattedTime,
                            "status" => $status,
                        );
                        array_push($res, $arr);
                    }
                    http_response_code(200);
                    echo json_encode(array("status" => true, "message" => "success", "data" => $res, "total" => $totalpage));
                }
            }
        } else {
            http_response_code(200);
            echo json_encode(array("status" => true, "message" => "Data exist!!"));
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
