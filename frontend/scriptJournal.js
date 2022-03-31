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
                      <td >${list[i].quantity}</td>
                      <td >${list[i].time} </td>
                      <td>
                          <button class="delBtn" onclick="deleteRow(${list[i].food_id}, '${list[i].time}')">Delete</button>
                      </td>
                  </tr>`
    );
  }
}
function searchOnChange() {
  const name = $("#inputFood").val();
  //   $.ajax({
  //     method: "POST",
  //     url: "../backend/food.php",
  //     data: {
  //       type: "search",
  //       name: name,
  //     },
  //   }).done(function (data) {
  //     if (data === "ko") {
  //     } else {
  //       listAlways = JSON.parse(data);
  //       displayList(check(date));
  //     }
  //   });
}
document.getElementById("inputFood").addEventListener("input", () => {
  const name = $("#inputFood").val();
  const select = document.getElementById("select");

  $.ajax({
    method: "POST",
    url: "../backend/food.php",
    data: {
      type: "search",
      name: name,
    },
  }).done(function (data) {
    if (data === "ko") {
      console.log("ça ressemble à r");
    } else {
      $("#select").empty();
      const result = JSON.parse(data);
      for (let i = 0; i < result.length; i++) {
        console.log(result[i].name);
        var option = document.createElement("option");
        option.value = result[i].name;
        select.appendChild(option);
      }
    }
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
