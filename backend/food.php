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
        } else if ($_POST['type'] == "eaten") {
            $id = $_POST['id'];
            $date = $_POST['date'];
            $sql = "SELECT food_id,name,eaten.time,eaten.quantity FROM eaten INNER JOIN foods ON foods.id=eaten.food_id WHERE eaten.person_id='$id' AND time='$date'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $array_values[] = $row;
                }
                echo json_encode($array_values);
            } else {
                echo "empty";
            }
        } else if ($_POST['type'] == "goal") {
            $id = $_POST['id'];
            $sql = "SELECT energy FROM goal WHERE goal.id='$id'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $array_values[] = $row;
                }
                echo json_encode($array_values);
            } else {
                echo "error";
            }
        } else if ($_POST['type'] == "kcal") {
            $id = $_POST['id'];
            $dateStart = $_POST['dateStart'];
            $dateEnd = $_POST['dateEnd'];
            $sql = "SELECT COALESCE(sum(value),0) AS 'sum' FROM composition 
            INNER JOIN eaten ON
            composition.food_id=eaten.food_id WHERE composition.nutrient_id=5
            AND eaten.time BETWEEN '$dateStart' AND '$dateEnd' 
            AND eaten.person_id='$id'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $array_values[] = $row;
                }
                echo json_encode($array_values);
            } else {
                echo "error";
            }
        } else if ($_POST['type'] == "kcal") {
            $id = $_POST['id'];
            $dateStart = $_POST['dateStart'];
            $dateEnd = $_POST['dateEnd'];
            $sql = "SELECT COALESCE(sum(value),0) AS 'sum' FROM composition 
            INNER JOIN eaten ON
            composition.food_id=eaten.food_id WHERE composition.nutrient_id=5
            AND eaten.time BETWEEN '$dateStart' AND '$dateEnd' 
            AND eaten.person_id='$id'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $array_values[] = $row;
                }

                echo json_encode($array_values);
            } else {
                echo "error";
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
                echo "error";
            }
        } else if ($_POST['type'] == "newEaten") {
            $name = $_POST['food'];
            $id = $_POST['id'];
            $number = $_POST['number'];
            $date = $_POST['date'];
            $sqlId = "SELECT id FROM foods WHERE foods.name='$name'";
            $res = mysqli_query($conn, $sqlId);
            if (mysqli_num_rows($res) > 0) {
                $row = mysqli_fetch_array($res);
                $food_id = $row[0];
            }
            $sqlCheck = "SELECT quantity FROM eaten WHERE eaten.person_id='$id' AND eaten.food_id='$food_id' AND eaten.time='$date'";
            $resultCheck = mysqli_query($conn, $sqlCheck);
            if (mysqli_num_rows($resultCheck) > 0) {
                $row = mysqli_fetch_array($resultCheck);
                $quantity = $row[0];
                $number += $quantity;
            }

            if (mysqli_num_rows($resultCheck) > 0) {
                $sqlUpdate = "UPDATE eaten SET quantity = '$number' WHERE eaten.person_id='$id' AND eaten.food_id='$food_id' AND eaten.time='$date'";
                if ($conn->query($sqlUpdate) === TRUE) {
                    echo "updated";
                } else {
                    echo "error";
                }
            } else {
                $sql = "INSERT INTO eaten (person_id, food_id, quantity, time) 
                    VALUES ('$id', '$food_id', '$number', '$date')";
                if ($conn->query($sql) === TRUE) {
                    echo "created";
                }
            }
        }
        $conn->close();
        break;
}