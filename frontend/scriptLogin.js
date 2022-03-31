function toUser(nom, prenom, date, email, password) {
    return {
        email: email,
        nom: nom,
        prenom: prenom,
        date: date,
        password: password,
    };
}

function getUser() {
    return toUser(
        $("#inputNom").val(),
        $("#inputPrenom").val(),
        $("#inputDate").val(),
        $("#inputEmail").val(),
        $("#inputPass").val()
    );
}

$(document).ready(() => {
    const btnReturn = document.getElementById("return");
    const info = document.getElementById("createInfo");
    const btnCreate = document.getElementById("btnCreate");
    btnReturn.addEventListener("click", () => {
        event.preventDefault();
        info.style.display = "none";
        btnCreate.innerHTML = "Don't have an acccount";
        document.getElementById("return").style.display = "none";
        document.getElementById("btnLogin").style.display = "block";
    });
});

$(document).ready(function () {
    const btnCreate = document.getElementById("btnCreate");
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
});

$(document).ready(function () {
    const btnLogin = document.getElementById("btnLogin");
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
                "Votre email et mot de passe ne corresponde pas";
            document.getElementById("fail").style.display = "block";
        } else {
            sessionStorage.setItem("id", data);
            document.location.href = "./journal.html";
        }
    });
}

function postData(person) {
    $.ajax({
        method: "POST",
        url: "../backend/user.php",
        data: {
            type: "create",
            nom: person.nom,
            prenom: person.prenom,
            date: person.date,
            email: person.email,
            password: person.password,
        },
    }).done(function (data) {
        console.log("data");
        if (data === "Mail deja utilise") {
            alert("Mail dejà utilisé");
        } else {
            console.log("created successfully");
        }
        // document.location.href = "./journal.html";
    });
}

function updateData(person) {
    $.ajax({
        method: "POST",
        url: `../backend/user.ph?id=${selectedRowId}`,
        data: {
            type: "update",
            id: selectedRowId,
            nom: person.nom,
            prenom: person.prenom,
            date: person.date,
            email: person.email,
            password: person.password,
        },
    }).done(function (data) {});
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
