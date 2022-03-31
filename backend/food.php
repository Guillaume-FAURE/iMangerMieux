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
    case 'GET':
        $sql = "SELECT * FROM foods";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $array_values[] = $row;
            }
        } else {
            echo "0 results";
        }

        echo json_encode($array_values);
        $conn->close();
        break;
    case 'DELETE':
        // DELETE from eaten WHERE person_id=37 AND food_id=21509 AND TIME='2022-03-31'
        $id = $_GET['id'];
        $food_id = $_GET['food'];
        $date = $_GET['date'];
        $sql = "DELETE FROM eaten WHERE person_id =  $id  AND food_id = $food_id AND time = '$date'";
        if ($conn->query($sql) === TRUE) {
            echo "success";
        } else {
            echo "erreur";
        }
        $conn->close();
        break;
    case 'POST':

        if ($_POST['type'] == "update") {
            $nom  = $_POST['nom'];
            $prenom  = $_POST['prenom'];
            $date  = $_POST['date'];
            $password = $_POST['password'];
            $email = $_POST['email'];
            $sql = "update personne set nom = '$nom', prenom = '$prenom', date = '$date', personne.like = '$like', rem = '$rem' where personne.id = '$id'";
            if ($conn->query($sql) === TRUE) {
                echo "Record updated successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        } else if ($_POST['type'] == "create") {
            $name  = $_POST['name'];
            $energy  = $_POST['energy'];
            $protein  = $_POST['protein'];
            $glucid = $_POST['glucid'];
            $lipid = $_POST['lipid'];
            $sugar = $_POST['sugar'];
            $fibre = $_POST['fibre'];
            $saturatedFat = $_POST['saturatedFat'];
            $cholesterol = $_POST['cholesterol'];
            $salt = $_POST['salt'];
            $check = "SELECT * FROM personne WHERE name='$name'";
            $result = mysqli_query($conn, $check);

            if (mysqli_num_rows($result) > 0) {
                echo 0;
            } else {
                $sql    = "INSERT INTO foods (name) values ('$name')  ";
                if ($conn->query($sql) === TRUE) {
                    echo "Food added successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
            $conn->close();
        } else if ($_POST['type'] == "eaten") {
            $id = $_POST['id'];
            $sql = "SELECT food_id,name,eaten.time,eaten.quantity FROM eaten INNER JOIN foods ON foods.id=eaten.food_id WHERE eaten.person_id='$id'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $array_values[] = $row;
                }
                echo json_encode($array_values);
            } else {
                echo "empty";
            }
        } else if ($_POST['type'] == "search") {
            $name = $_POST['name'];
            $sql = 'SELECT name FROM foods WHERE name LIKE "%' . $name . '%" LIMIT 5';
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $array_values[] = $row;
                }
                echo json_encode($array_values);
            } else {
                echo "`ko`";
            }
        }
        break;
}