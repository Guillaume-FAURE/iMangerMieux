const id = sessionStorage.getItem("id");
var listAlways = new Array();
listEaten(today());

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
document.getElementById("today").innerHTML = today();
check(today());
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

$(document).ready(() => {
  const btnAdd = document.getElementById("btnAdd");
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
        date: today(),
        number: number,
      },
    }).done(function (data) {
      if (data === "created") {
        listEaten(today());
      } else {
        const result = JSON.parse(data);
        console.log(result);
        // $("#inputQuantity").val(number + result);
      }
    });
  });

  document.getElementById("inputFood").addEventListener("input", () => {
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
        listEaten(today());
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
