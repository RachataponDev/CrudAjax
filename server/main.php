<?php
function ranChar($lenght)
{
    $seed = str_split('abcdefghijklmnopqrstuvwxyz'
        . 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        . '0123456789'); 
    shuffle($seed); 
    $rand = '';
    foreach (array_rand($seed, $lenght) as $k) {
        $rand .= $seed[$k];
    }

    return $rand;
}
function ClearSession()
{
    $helper = array_keys($_SESSION);
    foreach ($helper as $key) {
        unset($_SESSION[$key]);
    }
}
function isValidString($input)
{
    $allowedCharactersPattern = '/^[0-9a-zA-Z@]+$/';
    return preg_match($allowedCharactersPattern, $input);
}
function isThaiString($str) {
    $pattern = '/^[\x{0E00}-\x{0E7F}]+$/u';
    return preg_match($pattern, $str) === 1;
}
function isValidAll($input)
{
    $allowedCharactersPattern = '/^[0-9a-zA-Zก-ฮะาิีุูึืเัแโไใฤๅฦๅๆำํ๊้็่์ฯ๋@. ]+$/';
    return preg_match($allowedCharactersPattern, $input);
}
function isTimeValid($timeString) {
    $format = 'H:i'; 

    $time = DateTime::createFromFormat($format, $timeString);

    return $time && $time->format($format) === $timeString;
}
function isDateValid($dateString) {
    $format = 'Y-m-d'; 

    $date = DateTime::createFromFormat($format, $dateString);

    return $date && $date->format($format) === $dateString;
}
function checkEmail($email) {
    $emailParts = explode('@', $email);
    if (count($emailParts) !== 2) {
        return false;
    }
    list($firstMail, $domain) = $emailParts;
    if (!preg_match('/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/', $firstMail)) {
        return false;
    }

    $domainParts = explode('.', $domain);

    if (count($domainParts) < 2 || !endsWith($domain, '.com')) {
        return false;
    }
    foreach ($domainParts as $part) {
        if (!preg_match('/^[a-zA-Z0-9]+$/', $part)) {
            return false;
        }
    }
    return true;
}
function endsWith($haystack, $needle) {
    return substr($haystack, -strlen($needle)) === $needle;
}
function Checkchar($input)
{
    $allowedCharactersPattern = '/^[0-9a-zA-Z]+$/';
    return preg_match($allowedCharactersPattern, $input);
}
