//Get person_id from profil.html
const id = sessionStorage.getItem("id");

//Global list containing everything eaten
let listAlways = new Array();

//Global variable containing the date taht the journal is displaying
let date = new Date();

date = today();
listEaten(date);
$("#inputDate").val(today());

//Function which convert date to string
function dateToString(date) {
    return date.toISOString().substring(0, 10);
}

//Function which returns today's date
function today() {
    return dateToString(new Date());
}

//Function which displays a list in the HTML table
function displayList(list) {
    $("#foodTableBody tr").remove();
    for (let i = 0; i < list.length; i++) {
        $("#foodTableBody").append(
            `<tr id="row${i}">
        <td >${list[i].name}</td>
        <td id="quantity${i}" >${list[i].quantity}</td>
        <td >${list[i].time} </td>
        <td>
            <button class="delBtn" onclick="deleteRow(${list[i].food_id}, '${list[i].time}')">Supprimer</button>
        </td>
    </tr>`
        );
    }
}

$(document).ready(() => {
    const returnBtn = document.getElementById("return");
    const inputDate = document.getElementById("inputDate");
    const upArrow = document.getElementById("up");
    const downArrow = document.getElementById("down");
    const btnAdd = document.getElementById("btnAdd");
    const inputFood = document.getElementById("inputFood");
    const addFood = document.getElementById("addFood");

    returnBtn.addEventListener("click", () => {
        addFoodForm.style.display = "none";
        addFood.style.display = "block";
    });

    addFood.addEventListener("click", () => {
        document.getElementById("addFoodForm").style.display = "block";
        addFood.style.display = "none";
    });

    //Change the display in the table on change of the date
    inputDate.addEventListener("change", () => {
        date = $("#inputDate").val();
        listEaten(date);
    });

    upArrow.addEventListener("click", () => {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() + 1);
        date = dateToString(parsedDate);
        listEaten(date);
        $("#inputDate").val(date);
    });
    downArrow.addEventListener("click", () => {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() - 1);
        date = dateToString(parsedDate);
        listEaten(date);
        $("#inputDate").val(date);
    });

    btnAdd.addEventListener("click", () => {
        event.preventDefault();
        const food = $("#inputFood").val();
        let number = $("#inputQuantity").val();
        if (food === "") {
            alert("Entrez un repas");
        }
        if (number === "") {
            number = "1";
        }
        $.ajax({
            method: "POST",
            url: "../backend/food.php",
            data: {
                type: "newEaten",
                id: id,
                food: food,
                date: date,
                number: number,
            },
        }).done(function (data) {
            if (data === "created" || data === "updated") {
                listEaten(date);
            } else {
                alert("error during the creation in the tab eaten");
            }
        });
    });

    inputFood.addEventListener("input", () => {
        const foodName = $("#inputFood").val();
        const select = document.getElementById("select");
        $.ajax({
            method: "POST",
            url: "../backend/food.php",
            data: {
                type: "search",
                name: foodName,
            },
        }).done(function (data) {
            if (data === "error") {
                console.log("ça ressemble à r");
            } else {
                $("#select").empty();
                const result = JSON.parse(data);
                for (let i = 0; i < result.length; i++) {
                    let option = document.createElement("option");
                    option.value = result[i].name;
                    select.appendChild(option);
                }
            }
        });
    });
});

function listEaten(date) {
    $.ajax({
        method: "POST",
        url: "../backend/food.php",
        data: {
            type: "eaten",
            id: id,
            date: date,
        },
    }).done(function (data) {
        if (data === "empty") {
            $("#foodTableBody tr").remove();
            $("#foodTableBody").append(
                `<tr>
        <td>Vous n'avez rien consommé</td>
        <td></td>
        <td></td>
        <td>
            <button class="delBtn">Supprimer</button>
        </td>
    </tr>`
            );
        } else {
            listAlways = JSON.parse(data);
            displayList(listAlways);
        }
    });
}

function deleteRow(foodId, date) {
    $.ajax({
        method: "DELETE",
        url: `../backend/food.php?id=${id}&food=${foodId}&date=${date}`,
    })
        .done((response) => {
            if (response === "success") {
                listEaten(date);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
