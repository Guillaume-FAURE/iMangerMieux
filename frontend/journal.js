//Get person_id from profil.html
const id = sessionStorage.getItem("id");

//Global list containing everything eaten
let listAlways = new Array();

//Global variable containing the date taht the journal is displaying
let date = new Date();

date = today();

//returns the day of the week between 1-7
function day(strDate) {
    const temp = new Date(Date.parse(strDate));
    return temp.getDay();
}

function getBeginningOfTheWeek(strDate) {
    const dateTmp = new Date(strDate);
    const day = dateTmp.getDay();
    const diff = dateTmp.getDate() - day + (day == 0 ? -6 : 1);
    return dateToString(new Date(dateTmp.setDate(diff)));
}

let listWeek = new Array();
//returns kcal consumed since the beginning of the week
function getKcal(date) {
    const dateStart = getBeginningOfTheWeek(date);
    const parsedDate = new Date(dateStart);
    parsedDate.setDate(parsedDate.getDate() + 6);
    const dateEnd = dateToString(parsedDate);
    document.getElementById(
        "weeks"
    ).innerHTML = `Semaine du ${dateStart} au ${dateEnd}`;
    $.ajax({
        method: "POST",
        url: "../backend/food.php",
        data: {
            type: "kcal",
            id: id,
            dateStart: dateStart,
            dateEnd: dateEnd,
        },
    }).done(function (data) {
        if (data === "error") {
        } else {
            result = JSON.parse(data);
            displayGoal(result[0].sum);
        }
    });
}

function displayGoal(kcal) {
    $.ajax({
        method: "POST",
        url: "../backend/food.php",
        data: {
            type: "goal",
            id: id,
        },
    }).done(function (data) {
        if (data === "error") {
        } else {
            let response = JSON.parse(data);
            const goal = document.getElementById("goal");
            let rest = parseInt(response[0].energy) - parseInt(kcal);
            goal.innerHTML = `objectif : ${response[0].energy} - consommation : ${kcal} = ${rest}kcal`;
        }
    });
}
listEaten(date);
$("#inputDate").val(today());

//Function which convert date to string
function dateToString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
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

    //Display the button, hide the form
    returnBtn.addEventListener("click", () => {
        addFoodForm.style.display = "none";
        addFood.style.display = "block";
    });

    //Display the form, hide the button
    addFood.addEventListener("click", () => {
        document.getElementById("addFoodForm").style.display = "block";
        addFood.style.display = "none";
    });

    //Change the display in the table on change of the date
    inputDate.addEventListener("change", () => {
        date = $("#inputDate").val();
        listEaten(date);
    });

    //Move to a day later
    upArrow.addEventListener("click", () => {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() + 1);
        console.log(parsedDate);
        console.log(dateToString(parsedDate));
        date = dateToString(parsedDate);
        listEaten(date);
        $("#inputDate").val(date);
    });

    //Move to a day earlier
    downArrow.addEventListener("click", () => {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() - 1);
        date = dateToString(parsedDate);
        listEaten(date);
        $("#inputDate").val(date);
    });

    //Add a thing you ate in the database
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

    //Dynamic search in the database
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

//Display the table
function listEaten(date) {
    getKcal(date);
    getBeginningOfTheWeek(date);
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
        <td></td>
    </tr>`
            );
        } else {
            listAlways = JSON.parse(data);
            displayList(listAlways);
        }
    });
}

//Delete a thing you ate
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
