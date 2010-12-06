<?
session_start();
include_once('../includes/functions.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
    <head>
        <title><?echo $_POST['page_title'];?></title>
        <link rel="stylesheet" type="text/css" href="../includes/reset.css" />
        <link rel="stylesheet" type="text/css" href="../includes/master.css" />
        <link rel="stylesheet" type="text/css" href="../includes/manual_layout.css" />
        <script type="text/javascript" src="../includes/jquery-1.4.3.min.js"></script>
        <script type="text/javascript" src="../includes/classes.jquery.js"></script>
        <script type="text/javascript" src="../includes/forms.jquery.js"></script>
        <script type="text/javascript" src="../includes/functions.jquery.js"></script>
    </head>
    <body>
        <div id="wrapper">
            <div id="messages"></div>
            <h1><?echo $_POST['page_title'];?></h1>