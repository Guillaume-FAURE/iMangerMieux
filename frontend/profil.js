//Get the user input in the form
function getUser() {
    return {
        nom: $("#inputNom").val(),
        prenom: $("#inputPrenom").val(),
        date: $("#inputDate").val(),
        email: $("#inputEmail").val(),
        password: $("#inputPass").val(),
    };
}

$(document).ready(() => {
    const btnReturn = document.getElementById("return");
    const info = document.getElementById("createInfo");
    const btnCreate = document.getElementById("btnCreate");
    const btnLogin = document.getElementById("btnLogin");

    //Hide the form and display the login form
    btnReturn.addEventListener("click", () => {
        event.preventDefault();
        info.style.display = "none";
        btnCreate.innerHTML = "Don't have an acccount";
        document.getElementById("return").style.display = "none";
        document.getElementById("btnLogin").style.display = "block";
    });

    //Display the form for the user signup and check that the input are correct
    btnCreate.addEventListener("click", () => {
        event.preventDefault();
        const info = document.getElementById("createInfo");
        if (info.style.display === "" || info.style.display === "none") {
            info.style.display = "block";
            btnCreate.innerHTML = "Create account";
            document.getElementById("return").style.display = "block";
            document.getElementById("btnLogin").style.display = "none";
        } else {
            const user = getUser();
            if (user.email === "" || user.password === "") {
                document.getElementById("failText").innerHTML =
                    "Email ou mot de passe vide";
                document.getElementById("fail").style.display = "block";
            } else {
                postData(user);
            }
        }
    });

    //Login if the input are correct
    btnLogin.addEventListener("click", () => {
        event.preventDefault();
        const user = getUser();
        if (user.email === "" || user.password === "") {
            document.getElementById("failText").innerHTML =
                "Email ou mot de passe vide";
            document.getElementById("fail").style.display = "block";
        } else {
            login();
        }
    });
});

//Login if email and password are correct
function login() {
    const user = getUser();
    $.ajax({
        method: "POST",
        url: "../backend/user.php",
        data: {
            type: "check",
            email: user.email,
            password: user.password,
        },
    }).done(function (data) {
        if (data === "failure") {
            document.getElementById("failText").innerHTML =
                "Votre email et mot de passe ne correspondent pas";
            document.getElementById("fail").style.display = "block";
        } else {
            sessionStorage.setItem("id", data);
            document.location.href = "./dashboard.html";
        }
    });
}

//Create a new user if email is not yet used
function postData(person) {
    $.ajax({
        method: "POST",
        url: "../backend/user.php",
        data: {
            type: "create",
            id: person.id,
            nom: person.nom,
            prenom: person.prenom,
            date: person.date,
            email: person.email,
            password: person.password,
        },
    }).done(function (data) {
        if (data === "double") {
            document.getElementById("failText").innerHTML =
                "Il y a déjà un compte associé à cette adresse mail.";
            document.getElementById("fail").style.display = "block";
        } else {
            sessionStorage.setItem("id", data);
            document.location.href = "./dashboard.html";
        }
    });
}

function getData() {
    $.ajax({
        method: "GET",
        url: "../backend/user.php",
    })
        .then((response) => {})
        .catch(function (error) {
            console.log(error);
        });
}

function deleteUser(id) {
    $.ajax({
        method: "DELETE",
        url: `../backend/user.php?id=${id}`,
    })
        .done((response) => {
            getData();
        })
        .catch(function (error) {
            console.log(error);
        });
}
