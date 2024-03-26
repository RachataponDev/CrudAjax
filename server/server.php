<?php 
    session_start();
  error_reporting(E_ALL);
  date_default_timezone_set('Asia/Bangkok');
  $host = "localhost";
  $dbname = "projectAjax";
  $username = "root";
  $password = "root";
  $db;
  
  try {
    $db = new PDO("mysql:host={$host}; dbname={$dbname}", $username, $password);
    $db->exec("set names utf8");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exception) {  
    $err = "Database Connection Lost !!";
    include("server/err.php");
    exit;
};
  