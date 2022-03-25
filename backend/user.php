<?php
$host         = "localhost";
$username     = "root";
$password     = "";
$dbname       = "mangermieux";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection to database failed: " . $conn->connect_error);
}
switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        $sql = "select * from personne";
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
        $sql = "DELETE FROM personne WHERE id = " . $_GET['id'];
        if ($conn->query($sql) === TRUE) {
            echo "success";
        } else {
            echo "erreur";
        }
        $conn->close();
        break;
    case 'POST':
        $nom  = $_POST['nom'];
        $prenom  = $_POST['prenom'];
        $date  = $_POST['date'];
        $password = $_POST['password'];
        $email = $_POST['email'];
        if ($_POST['type'] == "update") {
            $sql = "update personne set nom = '$nom', prenom = '$prenom', date = '$date', personne.like = '$like', rem = '$rem' where personne.id = '$id'";
            if ($conn->query($sql) === TRUE) {
                echo "Record updated successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        } else {
            $check = "select * FROM personne WHERE Email='$email'";
            $result = mysqli_query($conn, $check);

            if (mysqli_num_rows($result) > 0) {
                echo 0;
            } else {
                $sql    = "insert into personne (Email, Nom, Prenom, date, password) values ('$email','$nom','$prenom','$date','$password')  ";
                if ($conn->query($sql) === TRUE) {
                    echo "New record created successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
            $conn->close();
        }
        break;
}