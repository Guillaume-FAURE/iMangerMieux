//
const id = sessionStorage.getItem("id");
let listAlways = new Array();

let date = new Date();
date = today();
listEaten(date);
$("#inputDate").val(today());

function today() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
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
  let listDate = new Array();
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
    let yyyy = parseInt(date.split("-")[0]);
    let mm = parseInt(date.split("-")[1]);
    let dd = parseInt(date.split("-")[2]);
    //List of the month with 30 days
    let month30 = [4, 6, 9, 11];
    //List of month with 31 days
    let month31 = [1, 3, 5, 7, 8, 10, 12];
    if (dd == 30 && month30.includes(mm)) {
      mm += 1;
      dd = 1;
    } else if (dd === 31 && month31.includes(mm)) {
      mm += 1;
      dd = 1;
    } else if (dd === 29 && mm === 2 && yyyy % 4 === 0) {
      mm += 1;
      dd = 1;
    } else if (dd === 28 && mm === 2 && yyyy % 4 !== 0) {
      mm += 1;
      dd = 1;
    } else {
      dd += 1;
    }
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    date = `${yyyy}-${mm}-${dd}`;
    listEaten(date);
    $("#inputDate").val(date);
  });
  downArrow.addEventListener("click", () => {
    let yyyy = parseInt(date.split("-")[0]);
    let mm = parseInt(date.split("-")[1]);
    let dd = parseInt(date.split("-")[2]);
    let month30 = [2, 4, 6, 9, 11];
    let month31 = [1, 5, 7, 8, 10, 12];
    if (dd == 1 && month30.includes(mm)) {
      mm -= 1;
      dd = 31;
    } else if (dd === 1 && month31.includes(mm)) {
      mm -= 1;
      dd = 30;
    } else if (dd === 1 && mm === 3 && yyyy % 4 === 0) {
      mm -= 1;
      dd = 29;
    } else if (dd === 1 && mm === 3 && yyyy % 4 !== 0) {
      mm -= 1;
      dd = 28;
    } else {
      dd -= 1;
    }
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    date = `${yyyy}-${mm}-${dd}`;
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
