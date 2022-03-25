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
getData();

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

function onFormSubmit() {
  event.preventDefault();
  var user = getUser();
  if (edit === false) {
    addRow(user);
  } else {
    updateData(user);
  }
}

function displayTab() {
  $("#studentsTableBody tr").remove();
  for (let i = 0; i < list.length; i++) {
    $("#studentsTableBody").append(
      `<tr id="row${i}">
                      <td id="id${i}">${list[i].Personne_Id}</td>
                      <td id="email${i}">${list[i].Email} </td>
                      <td id="nom${i}">${list[i].Nom}</td>
                      <td id="prenom${i}">${list[i].Prenom}</td>
                      <td id="date${i}">${list[i].date} </td>   
                      <td id="pass${i}">${list[i].password} </td>
                      <td>
                          <button class="updBtn" onclick="updateRow(${list[i].id}, ${i})">Update</button>
                          <button class="delBtn" onclick="deleteUser(${list[i].id})">Delete</button>
                      </td>
                  </tr>`
    );
  }
}

function addRow(person) {
  if (person.nom === "" || person.prenom === "") {
    alert("Nom invalide");
  } else {
    postData(person);
  }
}

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

function postData(person) {
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
  });
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
    edit = false;
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
      displayTab();
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
