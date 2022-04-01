<?php
$host         = "localhost";
$username     = "root";
$password     = "";
$dbname       = "manger_mieux";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection to database failed: " . $conn->connect_error);
}
switch ($_SERVER["REQUEST_METHOD"]) {
    case 'POST':
        echo nl2br("Requete post goal \n");
        $id  = $_POST['id'];
        $energy  = $_POST['energy'];
        $protein  = $_POST['protein'];
        $glucid = $_POST['glucid'];
        $lipid = $_POST['lipid'];
        $sugar = $_POST['sugar'];
        $fibre = $_POST['fibre'];
        $fat = $_POST['saturatedFat'];
        $cholesterol = $_POST['cholesterol'];
        $salt = $_POST['salt'];
        $updateGoalSql = "UPDATE goal SET energy=$energy, protein=$protein, glucid=$glucid, lipid=$lipid, sugar=$sugar, fibre=$fibre, saturated_fat=$fat, cholesterol=$cholesterol, salt=$salt WHERE id=$id;";
        if ($conn->query($updateGoalSql) == TRUE) {
            echo nl2br("Goal updated successfully \n");
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        $conn->close();
} 