const id = sessionStorage.getItem("id");
var listAlways = new Array();
var date;
var date = new Date();
date = today();
console.log(Date(Date.parse(date)));
listEaten(date);
$("#inputDate").val(today());
function today() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

function check(date) {
  var listDate = new Array();
  let i = 0;
  let j = 0;
  for (i; i < listAlways.length; i++) {
    if (listAlways[i].time === date) {
      listDate[j] = listAlways[i];
      j += 1;
    }
  }
  return listDate;
}

function displayList(list) {
  $("#foodTableBody tr").remove();
  for (let i = 0; i < list.length; i++) {
    $("#foodTableBody").append(
      `<tr id="row${i}">
        <td >${list[i].name}</td>
        <td id="quantity${i}" >${list[i].quantity}</td>
        <td >${list[i].time} </td>
        <td>
            <button class="delBtn" onclick="deleteRow(${list[i].food_id}, '${list[i].time}')">Delete</button>
        </td>
    </tr>`
    );
  }
}
function changeDay(date, day) {
  var newDate =new Date(Date.parse(date));
  var dd = newDate.getDate() + day;
  var mm = newDate.getMonth() + 1;
  var yyyy = newDate.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  date = yyyy + "-" + mm + "-" + dd;
}
$(document).ready(() => {
  const inputDate = document.getElementById("inputDate");
  const upArrow = document.getElementById("up");
  const downArrow = document.getElementById("down");
  const btnAdd = document.getElementById("btnAdd");
  const inputFood = document.getElementById("inputFood");
  inputDate.addEventListener("change", () => {
    date = $("#inputDate").val();
    console.log(date);
    listEaten(date);
  });

  upArrow.addEventListener("click", () => {
    changeDay(date, 1);
    listEaten(date);
    $("#inputDate").val(date);
  });
  downArrow.addEventListener("click", () => {
    changeDay(-1);
    listEaten(date);
    $("#inputDate").val(date);
  });

  btnAdd.addEventListener("click", () => {
    event.preventDefault();
    const food = $("#inputFood").val();
    const number = $("#inputQuantity").val();
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
          var option = document.createElement("option");
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
    },
  }).done(function (data) {
    if (data === "empty") {
      $("#foodTableBody").append(
        `<tr>
        <td>Vous n'avez rien consommé</td>
        <td></td>
        <td></td>
        <td>
            <button class="updBtn">Update</button>
            <button class="delBtn">Delete</button>
        </td>
    </tr>`
      );
    } else {
      listAlways = JSON.parse(data);
      displayList(check(date));
    }
  });
}

function deleteRow(foodId, date) {
  console.log(date);
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
