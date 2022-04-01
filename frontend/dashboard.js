const id = sessionStorage.getItem("id");

function apportOMS(gender, weight, age) {
    gender === "femme"
        ? (document.getElementById("gender").innerHTML = "une femme")
        : "un homme";
    document.getElementById("weight").innerHTML = weight;
    document.getElementById("age").innerHTML = age;
    let energieGender = 2500;
    if (gender === "homme") {
        age <= 3 ? (energieGender = weight * 90) : energieGender;
        age >= 3 && age <= 5 ? (energieGender = 1650) : energieGender;
        age >= 5 && age <= 10 ? (energieGender = 2000) : energieGender;
        age >= 10 && age <= 18 ? (energieGender = 2900) : energieGender;
        age >= 19 && age <= 30 ? (energieGender = 2700) : energieGender;
        age >= 31 && age <= 50 ? (energieGender = 2600) : energieGender;
        age >= 51 && age <= 70 ? (energieGender = 2350) : energieGender;
        age >= 71 ? (energieGender = 2200) : energieGender;
    } else {
        age <= 3 ? (energieGender = weight * 90) : energieGender;
        age >= 3 && age <= 5 ? (energieGender = 1650) : energieGender;
        age >= 5 && age <= 10 ? (energieGender = 2000) : energieGender;
        age >= 10 && age <= 18 ? (energieGender = 2350) : energieGender;
        age >= 19 && age <= 30 ? (energieGender = 2100) : energieGender;
        age >= 31 && age <= 50 ? (energieGender = 2000) : energieGender;
        age >= 51 && age <= 70 ? (energieGender = 1850) : energieGender;
        age >= 71 ? (energieGender = 1750) : energieGender;
    }
    document.getElementById("energyOMS").innerHTML = energieGender * 7;
    let ratioProtein = 0.8;
    age <= 18 && age > 12 ? (ratioProtein = 1.2) : ratioProtein;
    age <= 12 ? (ratioProtein = 2) : ratioProtein;
    age >= 60 ? (ratioProtein = 1) : ratioProtein;
    document.getElementById("proteinOMS").innerHTML = (
        ratioProtein *
        7 *
        weight
    ).toFixed(1);
    document.getElementById("glucidOMS").innerHTML = (
        energieGender / 8
    ).toFixed(1);
    document.getElementById("lipidOMS").innerHTML = (
        (energieGender * 0.35) /
        9
    ).toFixed(1);
    document.getElementById("fatOMS").innerHTML = (26 / 2000) * energieGender;
    document.getElementById("sugarOMS").innerHTML = 25 * 7;
    document.getElementById("fibreOMS").innerHTML = 35 * 7;
    document.getElementById("cholesterolOMS").innerHTML = 300;
    document.getElementById("saltOMS").innerHTML = 35;
}

function apportPersonnel(goal) {
    if (!goal.energy) {
        document.getElementById("energyPerso").innerHTML =
            document.getElementById("energyOMS").innerHTML;
    }
    if (!goal.protein) {
        document.getElementById("proteinPerso").innerHTML =
            document.getElementById("proteinOMS").innerHTML;
    }
    if (!goal.glucid) {
        document.getElementById("glucidPerso").innerHTML =
            document.getElementById("glucidOMS").innerHTML;
    }
    if (!goal.sugar) {
        document.getElementById("sugarPerso").innerHTML =
            document.getElementById("sugarOMS").innerHTML;
    }
    if (!goal.lipid) {
        document.getElementById("lipidPerso").innerHTML =
            document.getElementById("lipidOMS").innerHTML;
    }
    if (!goal.fat) {
        document.getElementById("fatPerso").innerHTML =
            document.getElementById("fatOMS").innerHTML;
    }
    if (!goal.fibre) {
        document.getElementById("fibrePerso").innerHTML =
            document.getElementById("fibreOMS").innerHTML;
    }
    if (!goal.cholesterol) {
        document.getElementById("cholesterolPerso").innerHTML =
            document.getElementById("cholesterolOMS").innerHTML;
    }
    if (!goal.salt) {
        document.getElementById("saltPerso").innerHTML =
            document.getElementById("saltOMS").innerHTML;
    }
}

const emptyGoal = {
    energy: undefined,
    protein: undefined,
    glucid: undefined,
    sugar: undefined,
    lipid: undefined,
    fat: undefined,
    fibre: undefined,
    cholesterol: undefined,
    salt: undefined,
};
document.getElementById("addGoal").addEventListener("click", () => {
    document.querySelector(".contentDiv").style.opacity = 0.2;
    document.getElementById("addGoalWrapper").innerHTML = `
        <div class="addPersonnalGoal goal column">
            <h2 class="titleGoal">Objectif personnel hebdomadaire</h2>
            <div class="row apportWrapper">
                <h3 class="titleApport">Energie :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewEnergy" /> kcal/semaine
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("energyOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">Protéines :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewProtein" /> g/semaine
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("proteinOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">Glucides :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewGlucid" /> g/semaine
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("glucidOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">dont sucres :</h3>
                <div>
                    <div class=" inputMiniWrapper">
                        <div>
                            <input type="text" id="inputNewSugar" /> g/semaine
                            max
                        </div>
                        <div class="recommandationPopup">recommandé ${
                            document.getElementById("sugarOMS").innerHTML
                        }</div>
                    </div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">Lipides :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewLipid" /> g/semaine
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("lipidOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">dont gras saturé :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewFat" /> g/semaine max
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("fatOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">Fibres :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewFibres" /> g/semaine
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("fibreOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">Cholestérol :</h3>
                <div class="inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewCholesterol" /> g/semaine
                        max
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("cholesterolOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row apportWrapper">
                <h3 class="titleApport">Sel :</h3>
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewSalt" /> g/semaine max
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("saltOMS").innerHTML
                    }</div>
                </div>
            </div>
            <div class="row buttonPopup">
                <button type="button" id="confirmGoal" class="soloButton" onclick='updateGoal()'>
                    Valider votre nouvelle objectif
                </button>
                <button type="button" id="cancelGoal" class="soloButton" onClick='cancel()'>
                    Annuler
                </button>
            </div>
        </div>
        `;
});

function updateGoal() {
    const goal = {
        energy: $("#inputNewEnergy").val(),
        protein: $("#inputNewProtein").val(),
        glucid: $("#inputNewGlucid").val(),
        sugar: $("#inputNewSugar").val(),
        lipid: $("#inputNewLipid").val(),
        fat: $("#inputNewFat").val(),
        fibre: $("#inputNewFibres").val(),
        cholesterol: $("#inputNewCholesterol").val(),
        salt: $("#inputNewSalt").val(),
    };
    for (const [key, value] of Object.entries(goal)) {
        !value
            ? (goal[key] = document.getElementById(`${key}Perso`).innerHTML)
            : value;
    }
    console.log(goal);
    $.ajax({
        method: "POST",
        url: "../backend/goal.php",
        data: {
            id: id,
            energy: goal.energy,
            protein: goal.protein,
            glucid: goal.glucid,
            lipid: goal.lipid,
            sugar: goal.sugar,
            fibre: goal.fibre,
            saturatedFat: goal.fat,
            cholesterol: goal.cholesterol,
            salt: goal.salt,
        },
    }).done(function (data) {
        console.log(data);
        if (data === "success") {
            console.log("data sent");
        } else {
            console.log("data not sent");
        }
    });
}

function cancel() {
    document.querySelector(".contentDiv").style.opacity = 1;
    document.getElementById("addGoalWrapper").innerHTML = "";
}
apportOMS("homme", 75, 21);
apportPersonnel(emptyGoal);
