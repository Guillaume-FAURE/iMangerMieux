const user = {
  id: Number,
  email: String,
  nom: String,
  prenom: String,
  date: Date,

  password: String,
};
var global = 0;
var edit = false;

function toUser(nom, prenom, date, email, password) {
  let guy = Object.create(user);
  guy.email = email;
  guy.nom = nom;
  guy.prenom = prenom;
  guy.date = date;
  guy.password = password;
  return guy;
}

var list = new Array();

function formattedDate(d = new Date()) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${year}-${month}-${day}`;
}

function getUser() {
  return toUser(
    $("#inputNom").val(),
    $("#inputPrenom").val(),
    $("#inputDate").val(),
    $("#inputEmail").val(),
    $("#inputPass").val()
  );
}

$(document).ready(function () {
  const btnCreate = document.getElementById("btnCreate");
  btnCreate.addEventListener("click", () => {
    console.log(getUser());
    event.preventDefault();
    const user = getUser();
    postData(user);
  });
});

// const btnLogin = document.getElementById("btnLogin");
// btnCreate.addEventListener("click", () => {
//   event.preventDefault();
//   var user = getUser();
//   postData(user);
// });
var selectedRowId;
function updateRow(id, index) {
  selectedRowId = id;
  const element = document.getElementById(`row${index}`);
  for (let j = 0; j < list.length; j++) {
    if (index === j) {
      element.style.background = "red";
    } else {
      document.getElementById(`row${j}`).style.background = "none";
    }
  }

  document.getElementById("inputNom").value = list[index].nom;
  document.getElementById("inputPrenom").value = list[index].prenom;
  document.getElementById("inputRem").value = list[index].rem;
  document.getElementById("inputDate").value = list[index].date;
  document.getElementById("inputLike").checked =
    list[index].like == 1 ? true : false;

  edit = true;
  global = index;
}

function double(repeat) {
  let i = 0;
  for (i; i < list.length; i++) {
    if (list[i].Email == repeat) {
      return true;
    }
  }
  return false;
}

function postData(person) {
  console.log("ok");
  if (double(person.email) || person.Email == "" || person.password == "") {
    alert("Invalide");
  } else {
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
      },
    }).done(function (data) {
      getData();
      // document.location.href = "./journal.html";
    });
  }
}

function updateData(person) {
  $.ajax({
    method: "POST",
    url: `../backend/user.ph?id=${selectedRowId}`,
    data: {
      type: "update",
      id: selectedRowId,
      nom: person.nom,
      prenom: person.prenom,
      date: person.date,
      email: person.email,
      password: person.password,
    },
  }).done(function (data) {
    getData();
  });
}

function getData() {
  $.ajax({
    method: "GET",
    url: "../backend/user.php",
  })
    .then((response) => {
      list = JSON.parse(response);
      console.log(list);
    })
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