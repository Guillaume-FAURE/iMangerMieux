//
const id = sessionStorage.getItem("id");
let listAlways = new Array();

let date = new Date();
date = today();
listEaten(date);
$("#inputDate").val(today());

function dateToString(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return `${yyyy}-${mm}-${dd}`;
}

function today() {
  return dateToString(new Date());
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
  inputDate.addEventListener("change", () => {
    date = $("#inputDate").val();
    console.log(date);
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
        console.log(data);
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
            <button class="updBtn">Update</button>
            <button class="delBtn">Delete</button>
        </td>
    </tr>`
      );
    } else {
      console.log(data);
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
