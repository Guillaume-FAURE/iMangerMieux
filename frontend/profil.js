//Get the user input in the form
function getUser() {
    const weight =
        $("#inputWeight").val() === "" ? 75 : $("#inputWeight").val();
    const date =
        $("#inputDate").val() === "" ? "2000-01-01" : $("#inputDate").val();
    const nom = $("#inputNom").val() === "" ? "Doe" : $("#inputNom").val();
    const prenom =
        $("#inputPrenom").val() === "" ? "John" : $("#inputPrenom").val();
    const gender =
        $("#inputGender").val() === "" ? "homme" : $("#inputGender").val();
    return {
        nom: nom,
        prenom: prenom,
        date: date,
        email: $("#inputEmail").val(),
        password: $("#inputPass").val(),
        gender: gender,
        weight: weight,
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
            } else if (
                user.gender === "homme" ||
                user.gender === "femme" ||
                user.gender === ""
            ) {
                postData(user);
            } else {
                document.getElementById("failText").innerHTML =
                    'Veuillez entrer "homme" ou "femme"';
                document.getElementById("fail").style.display = "block";
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
    console.log(person);
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
            gender: person.gender,
            weight: person.weight,
        },
    }).done(function (data) {
        if (data === "double") {
            document.getElementById("failText").innerHTML =
                "Il y a déjà un compte associé à cette adresse mail.";
            document.getElementById("fail").style.display = "block";
        } else {
            $.ajax({
                method: "POST",
                url: "../backend/user.php",
                data: {
                    type: "infoOMS",
                    email: person.email,
                },
            }).done((response) => {
                const infoOMS = JSON.parse(response);

                const currentYear = new Date().getFullYear();
                const gender = infoOMS.gender;
                const weight = infoOMS.weight;
                const age = currentYear - infoOMS.born;
                const id = infoOMS.id;
                let energieGender = 2500;
                if (gender === "homme") {
                    age <= 3 ? (energieGender = weight * 90) : energieGender;
                    age >= 3 && age <= 5
                        ? (energieGender = 1650)
                        : energieGender;
                    age >= 5 && age <= 10
                        ? (energieGender = 2000)
                        : energieGender;
                    age >= 10 && age <= 18
                        ? (energieGender = 2900)
                        : energieGender;
                    age >= 19 && age <= 30
                        ? (energieGender = 2700)
                        : energieGender;
                    age >= 31 && age <= 50
                        ? (energieGender = 2600)
                        : energieGender;
                    age >= 51 && age <= 70
                        ? (energieGender = 2350)
                        : energieGender;
                    age >= 71 ? (energieGender = 2200) : energieGender;
                } else {
                    age <= 3 ? (energieGender = weight * 90) : energieGender;
                    age >= 3 && age <= 5
                        ? (energieGender = 1650)
                        : energieGender;
                    age >= 5 && age <= 10
                        ? (energieGender = 2000)
                        : energieGender;
                    age >= 10 && age <= 18
                        ? (energieGender = 2350)
                        : energieGender;
                    age >= 19 && age <= 30
                        ? (energieGender = 2100)
                        : energieGender;
                    age >= 31 && age <= 50
                        ? (energieGender = 2000)
                        : energieGender;
                    age >= 51 && age <= 70
                        ? (energieGender = 1850)
                        : energieGender;
                    age >= 71 ? (energieGender = 1750) : energieGender;
                }
                let ratioProtein = 0.8;
                age <= 18 && age > 12 ? (ratioProtein = 1.2) : ratioProtein;
                age <= 12 ? (ratioProtein = 2) : ratioProtein;
                age >= 60 ? (ratioProtein = 1) : ratioProtein;
                const glucid = (energieGender / 8).toFixed(1);
                const lipid = ((energieGender * 0.35) / 9).toFixed(1);
                const energy = energieGender * 7;
                const fat = (26 / 2000) * energieGender;
                const protein = (ratioProtein * 7 * weight).toFixed(1);
                const sugar = 25 * 7;
                const fibre = 35 * 7;
                const cholesterol = 300;
                const salt = 35;

                $.ajax({
                    method: "POST",
                    url: "../backend/goal.php",
                    data: {
                        type: "createGoal",
                        id: id,
                        energy: energy,
                        protein: protein,
                        glucid: glucid,
                        lipid: lipid,
                        sugar: sugar,
                        fibre: fibre,
                        fat: fat,
                        cholesterol: cholesterol,
                        salt: salt,
                    },
                }).done((res) => {});
                sessionStorage.setItem("id", infoOMS.id);

                document.location.href = "./dashboard.html";
            });
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
