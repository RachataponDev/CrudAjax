<?php
try {
    require_once "server/server.php";
    require_once "server/main.php";
    ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <?php require_once "server/setting.php";?>
</head>

<body>
    <?php require_once "module/index/index.php";?>
    <?php require_once "server/script.php";?>
</body>

</html>
<?php
} catch (PDOException $exception) {
    $err = "Failed To Loading Page";
    include "server/err.php";
    exit;
};
?>