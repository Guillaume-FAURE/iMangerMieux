const id = sessionStorage.getItem("id");
var listAlways = new Array();
var listToday = new Array();
listEaten();
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

function checkToday() {
  let i = 0;
  let j = 0;
  for (i; i < listAlways.length; i++) {
    if (list[i].time === today()) {
      listToday[j] = listAlways[i];
      j += 1;
    }
  }
  console.log(listToday);
}
function displayList(list) {
  $("#foodTableBody tr").remove();
  for (let i = 0; i < list.length; i++) {
    $("#foodTableBody").append(
      `<tr id="row${i}">
                      <td id="nom${i}">${list[i].name}</td>
                      <td id="date${i}">${list[i].time} </td>
                      <td>
                          <button class="updBtn" onclick="updateRow(${list[i].id}, ${i})">Update</button>
                          <button class="delBtn" onclick="deleteUser(${list[i].id})">Delete</button>
                      </td>
                  </tr>`
    );
  }
}
function listEaten() {
  $.ajax({
    method: "POST",
    url: "../backend/food.php",
    data: {
      type: "eaten",
      id: id,
    },
  }).done(function (data) {
    if (data === "empty") {
      alert("aucun résultat");
    } else {
      listAlways = JSON.parse(data);
      console.log(listAlways);
      displayList();
    }
  });
}
function listEaten() {
  $.ajax({
    method: "POST",
    url: "../backend/food.php",
    data: {
      type: "eaten",
      id: id,
    },
  }).done(function (data) {
    if (data === "empty") {
      alert("aucun résultat");
    } else {
      list = JSON.parse(data);
      console.log(list);
      displayList();
    }
  });
}
