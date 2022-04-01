function toFood(
    name,
    energy,
    protein,
    glucid,
    lipid,
    sugar,
    fibre,
    saturatedFat,
    cholesterol,
    salt
) {
    return {
        name: name,
        energy: energy,
        protein: protein,
        glucid: glucid,
        lipid: lipid,
        sugar: sugar,
        fibre: fibre,
        saturatedFat: saturatedFat,
        cholesterol: cholesterol,
        salt: salt,
    };
}

function getFood() {
    return toFood(
        $("#inputNameAdd").val(),
        $("#inputEnergy").val(),
        $("#inputProtein").val(),
        $("#inputGlucid").val(),
        $("#inputLipid").val(),
        $("#inputSugar").val(),
        $("#inputFibre").val(),
        $("#inputFat").val(),
        $("#inputCholesterol").val(),
        $("#inputSalt").val()
    );
}
const btnAddFood = document.getElementById("addFood");
const btnSearchFood = document.getElementById("searchFood");
const searchFoodWrapper = document.getElementById("researchFoodWrapper");
const addFoodWrapper = document.getElementById("addFoodWrapper");
const btnDisc = document.getElementById("deco");
btnDisc.addEventListener("click", () => {
    sessionStorage.clear();
    document.location.href("profil.html");
});
btnAddFood.addEventListener("click", () => {
    event.preventDefault();
    searchFoodWrapper.style.display = "none";
    addFoodWrapper.style.display = "flex";
});
btnSearchFood.addEventListener("click", () => {
    event.preventDefault();
    addFoodWrapper.style.display = "none";
    searchFoodWrapper.style.display = "flex";
});

function addFood() {
    event.preventDefault();
    console.log("addfood function initialized");
    const food = getFood();
    $.ajax({
        method: "POST",
        url: "../backend/food.php",
        data: {
            type: "create",
            name: food.name,
            energy: food.energy,
            protein: food.protein,
            glucid: food.glucid,
            lipid: food.lipid,
            sugar: food.sugar,
            fibre: food.fibre,
            saturatedFat: food.saturatedFat,
            cholesterol: food.cholesterol,
            salt: food.salt,
        },
    }).done(function (data) {
        if (data === "success") {
            console.log("data sent");
        } else {
            console.log("data not sent");
        }
    });
}

function getData() {
    $.ajax({
        method: "GET",
        url: "../backend/food.php",
    })
        .then((response) => {})
        .catch(function (error) {
            console.log(error);
        });
}

// var selectedRowId;
// function updateRow(id, index) {
//     selectedRowId = id;
//     const element = document.getElementById(`row${index}`);
//     for (let j = 0; j < list.length; j++) {
//         if (index === j) {
//             element.style.background = "red";
//         } else {
//             document.getElementById(`row${j}`).style.background = "none";
//         }
//     }

//     document.getElementById("inputNom").value = list[index].nom;
//     document.getElementById("inputPrenom").value = list[index].prenom;
//     document.getElementById("inputRem").value = list[index].rem;
//     document.getElementById("inputDate").value = list[index].date;
//     document.getElementById("inputLike").checked =
//         list[index].like == 1 ? true : false;

//     edit = true;
//     global = index;
// }

// function postData(person) {
//     $.ajax({
//         method: "POST",
//         url: "../backend/user.php",
//         data: {
//             type: "create",
//             id: person.id,
//             nom: person.nom,
//             prenom: person.prenom,
//             date: person.date,
//             email: person.email,
//             password: person.password,
//         },
//     }).done(function (data) {
//         if (data == 0) {
//             alert("Mail dejà utilisé");
//         } else {
//             console.log("created successfully");
//         }
//         // document.location.href = "./journal.html";
//     });
// }

// function updateData(person) {
//     $.ajax({
//         method: "POST",
//         url: `../backend/user.ph?id=${selectedRowId}`,
//         data: {
//             type: "update",
//             id: selectedRowId,
//             nom: person.nom,
//             prenom: person.prenom,
//             date: person.date,
//             email: person.email,
//             password: person.password,
//         },
//     }).done(function (data) {});
// }

// function getData() {
//     $.ajax({
//         method: "GET",
//         url: "../backend/user.php",
//     })
//         .then((response) => {
//             // list = JSON.parse(response);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }

// function deleteUser(id) {
//     $.ajax({
//         method: "DELETE",
//         url: `../backend/user.php?id=${id}`,
//     })
//         .done((response) => {
//             getData();
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }
