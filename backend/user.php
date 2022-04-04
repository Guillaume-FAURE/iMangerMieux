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
        $sql = "SELECT * FROM persons";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while ($rowGet = mysqli_fetch_assoc($result)) {
                $array_values[] = $rowGet;
            }
        } else {
            echo "0 results";
        }

        echo json_encode($array_values);
        $conn->close();
        break;
    case 'DELETE':
        $sql = "DELETE FROM persons WHERE id = " . $_GET['id'];
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
            $sql = "UPDATE persons SET name = '$nom', surname = '$prenom', time = '$date' WHERE persons.id = '$id'";
            if ($conn->query($sql) == TRUE) {
                echo "Record updated successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        } else if ($_POST['type'] == "idOMS") {
            $id = $_POST['id'];
            $sql = "select YEAR(time) as born,gender, weight, id FROM persons WHERE id='$id'";
            $result = mysqli_query($conn, $sql);
            echo json_encode(mysqli_fetch_assoc($result));
        } else if ($_POST['type'] == "infoOMS") {
            $email = $_POST['email'];
            $sqlId = "SELECT id FROM persons WHERE email = '$email'";
            $result = mysqli_query($conn, $sqlId);
            if (mysqli_num_rows($result) > 0) {
                $rowOMS = mysqli_fetch_array($result);
                $id = $rowOMS[0];
                $checkOMS = "select YEAR(time) as born,gender, weight, id FROM persons WHERE id='$id'";
                $res = mysqli_query($conn, $checkOMS);
                echo json_encode(mysqli_fetch_assoc($res));
            }
        } else if ($_POST['type'] == "create") {
            $nom  = $_POST['nom'];
            $prenom  = $_POST['prenom'];
            $date  = $_POST['date'];
            $password = $_POST['password'];
            $email = $_POST['email'];
            $gender = $_POST['gender'];
            $weight = $_POST['weight'];
            $checkEmail = "select * FROM persons WHERE email='$email'";
            $result = mysqli_query($conn, $checkEmail);
            if (mysqli_num_rows($result) > 0) {
                echo "double";
            } else {
                if (!$date) {
                    $sql    = "INSERT INTO persons (email, name, surname, time, password,gender,weight) values ('$email','$nom','$prenom',null,PASSWORD('$password'), '$gender', '$weight')";
                } else {
                    $sql    = "INSERT INTO persons (email, name, surname, time, password, gender, weight) values ('$email','$nom','$prenom','$date',PASSWORD('$password'), '$gender', '$weight')";
                }
                if ($conn->query($sql) === TRUE) {
                    echo "New record created successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
            $conn->close();
        } else if ($_POST['type'] == "check") {
            $email = $_POST['email'];
            $password = $_POST['password'];
            $sql = "SELECT id FROM persons WHERE persons.email='$email' AND persons.password=PASSWORD('$password')";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_array($result);
                echo $row[0];
            } else {
                echo "failure";
            }
        }
        break;
}