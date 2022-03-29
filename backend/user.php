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
            if ($conn->query($sql) === TRUE) {
                echo "Record updated successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        } else if ($_POST['type'] == "create") {
            $nom  = $_POST['nom'];
            $prenom  = $_POST['prenom'];
            $date  = $_POST['date'];
            $password = $_POST['password'];
            $email = $_POST['email'];
            $check = "SELECT * FROM persons WHERE email='$email'";
            $result = mysqli_query($conn, $check);

            if (mysqli_num_rows($result) > 0) {
                echo 0;
            } else {
                $sql    = "INSERT INTO persons (email, name, surname, time, password) values ('$email','$nom','$prenom','$date','$password')  ";
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
            $sql = "SELECT id FROM persons WHERE persons.email='$email' AND persons.password='$password'";
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