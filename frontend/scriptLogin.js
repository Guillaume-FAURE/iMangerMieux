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

function getUser() {
  return toUser(
    $("#inputNom").val(),
    $("#inputPrenom").val(),
    $("#inputDate").val(),
    $("#inputEmail").val(),
    $("#inputPass").val()
  );
}
$(document).ready(() => {
  const btnReturn = document.getElementById("return");
  const info = document.getElementById("createInfo");
  const btnCreate = document.getElementById("btnCreate");
  btnReturn.addEventListener("click", () => {
    event.preventDefault();
    info.style.display = "none";
    btnCreate.innerHTML = "Don't have an acccount";
    document.getElementById("return").style.display = "none";
    document.getElementById("btnLogin").style.display = "block";
  });
});
$(document).ready(function () {
  const btnCreate = document.getElementById("btnCreate");

  btnCreate.addEventListener("click", () => {
    event.preventDefault();
    const info = document.getElementById("createInfo");
    console.log(info.style.display);
    if (info.style.display === "" || info.style.display === "none") {
      info.style.display = "block";
      btnCreate.innerHTML = "Create account";
      document.getElementById("return").style.display = "block";
      document.getElementById("btnLogin").style.display = "none";
    } else {
      const user = getUser();
      if (user.email == "" || user.password == "") {
        alert("Email ou password invalide");
      } else {
        postData(user);
      }
    }
  });
});
$(document).ready(function () {
  const btnLogin = document.getElementById("btnLogin");
  btnLogin.addEventListener("click", () => {
    event.preventDefault();
    const user = getUser();
    if (user.email == "" || user.password == "") {
      alert("Email ou password invalide");
    } else {
      login();
    }
  });
});

function login() {
  const user = getUser();
  $.ajax({
    method: "POST",
    url: "../backend/user.php",
    data: {
      type: "check",
      email: user.email,
      password: user.password,
    },
  }).done(function (data) {
    if (data === "success") {
      console.log("logged in");
    } else {
      console.log("pas logged in");
    }
  });
  // document.location.href = "./journal.html";
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
    if (data == 0) {
      alert("Mail dejà utilisé");
    } else {
      console.log("created successfully");
    }
    // document.location.href = "./journal.html";
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
  }).done(function (data) {});
}

function getData() {
  $.ajax({
    method: "GET",
    url: "../backend/user.php",
  })
    .then((response) => {
      // list = JSON.parse(response);
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
