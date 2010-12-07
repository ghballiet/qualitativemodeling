<?
include_once('functions.php');

$name=$_REQUEST['name'];

echo trim(file_get_contents("json/$name.json"));
?>