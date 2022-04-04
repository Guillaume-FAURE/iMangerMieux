const id = sessionStorage.getItem("id");
let date = new Date();
date = today();

//Function which convert date to string
function dateToString(date) {
    return date.toISOString().substring(0, 10);
}
//Function which returns today's date
function today() {
    return dateToString(new Date());
}

function apportOMS(id) {
    $.ajax({
        method: "POST",
        url: "../backend/user.php",
        data: {
            type: "infoOMS",
            id: id,
        },
    }).done((data) => {
        const infoOMS = JSON.parse(data);
        const currentYear = new Date().getFullYear();
        const gender = infoOMS.gender;
        const weight = infoOMS.weight;
        const age = currentYear - infoOMS.born;
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
        document.getElementById("fatOMS").innerHTML =
            (26 / 2000) * energieGender;
        document.getElementById("sugarOMS").innerHTML = 25 * 7;
        document.getElementById("fibreOMS").innerHTML = 35 * 7;
        document.getElementById("cholesterolOMS").innerHTML = 300;
        document.getElementById("saltOMS").innerHTML = 35;
    });
}

function getGoal(id) {
    $.ajax({
        method: "POST",
        url: "../backend/goal.php",
        data: {
            type: "getGoal",
            id: id,
        },
    }).done((data) => {
        data = JSON.parse(data);
        document.getElementById("energyPerso").innerHTML = data.energy;
        document.getElementById("proteinPerso").innerHTML = data.protein;
        document.getElementById("glucidPerso").innerHTML = data.glucid;
        document.getElementById("lipidPerso").innerHTML = data.lipid;
        document.getElementById("sugarPerso").innerHTML = data.sugar;
        document.getElementById("fibrePerso").innerHTML = data.fibre;
        document.getElementById("fatPerso").innerHTML = data.saturated_fat;
        document.getElementById("cholesterolPerso").innerHTML =
            data.cholesterol;
        document.getElementById("saltPerso").innerHTML = data.salt;
    });
}

function getBeginningOfTheWeek(strDate) {
    const dateTmp = new Date(strDate);
    const day = dateTmp.getDay();
    const diff = dateTmp.getDate() - day + (day == 0 ? -6 : 1);
    return dateToString(new Date(dateTmp.setDate(diff)));
}

function eatenWeek() {
    const dateStart = getBeginningOfTheWeek(date);
    const parsedDate = new Date(dateStart);
    parsedDate.setDate(parsedDate.getDate() + 6);
    const dateEnd = dateToString(parsedDate);
    $.ajax({
        method: "POST",
        url: "../backend/food.php",
        data: {
            type: "eatenWeek",
            id: id,
            dateStart: dateStart,
            dateEnd: dateEnd,
        },
    }).done((data) => {
        const nutrientConsumption = JSON.parse(data);
        const consumption = {
            5: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
        };
        for (let i = 0; i < nutrientConsumption.length; i++) {
            consumption[nutrientConsumption[i].nutrient_id] = parseFloat(
                nutrientConsumption[i].sum
            ).toFixed(1);
        }
        document.getElementById("consumptionEnergy").innerHTML = consumption[5];
        document.getElementById("consumptionProtein").innerHTML =
            consumption[8];
        document.getElementById("consumptionGlucid").innerHTML = consumption[9];
        document.getElementById("consumptionLipid").innerHTML = consumption[10];
        document.getElementById("consumptionSugar").innerHTML = consumption[11];
        document.getElementById("consumptionFibre").innerHTML = consumption[12];
        document.getElementById("consumptionFat").innerHTML = consumption[13];
        document.getElementById("consumptionCholesterol").innerHTML =
            consumption[14];
        document.getElementById("consumptionSalt").innerHTML = consumption[15];
        //Objectif restant
        document.getElementById("resultEnergy").innerHTML = (
            document.getElementById("energyPerso").innerHTML - consumption[5]
        ).toFixed(1);
        document.getElementById("resultProtein").innerHTML = (
            document.getElementById("proteinPerso").innerHTML - consumption[8]
        ).toFixed(1);
        document.getElementById("resultGlucid").innerHTML = (
            document.getElementById("glucidPerso").innerHTML - consumption[9]
        ).toFixed(1);
        document.getElementById("resultLipid").innerHTML = (
            document.getElementById("lipidPerso").innerHTML - consumption[10]
        ).toFixed(1);
        document.getElementById("resultSugar").innerHTML = (
            document.getElementById("sugarPerso").innerHTML - consumption[11]
        ).toFixed(1);
        document.getElementById("resultFibre").innerHTML = (
            document.getElementById("fibrePerso").innerHTML - consumption[12]
        ).toFixed(1);
        document.getElementById("resultFat").innerHTML = (
            document.getElementById("fatPerso").innerHTML - consumption[13]
        ).toFixed(1);
        document.getElementById("resultCholesterol").innerHTML = (
            document.getElementById("cholesterolPerso").innerHTML -
            consumption[14]
        ).toFixed(1);
        document.getElementById("resultSalt").innerHTML = (
            document.getElementById("saltPerso").innerHTML - consumption[15]
        ).toFixed(1);
    });
}

document.getElementById("addMeal").addEventListener("click", () => {
    document.location.href = "./journal.html";
});
document.getElementById("deco").addEventListener("click", () => {
    sessionStorage.clear();
    location.href = "profil.html";
});
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
                <div class=" inputMiniWrapper">
                    <div>
                        <input type="text" id="inputNewSugar" /> g/semaine
                        max
                    </div>
                    <div class="recommandationPopup">recommandé ${
                        document.getElementById("sugarOMS").innerHTML
                    }
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
        id: id,
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
    $.ajax({
        method: "POST",
        url: "../backend/goal.php",
        data: {
            type: "updateGoal",
            id: goal.id,
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
    }).done(() => {
        location.reload();
    });
}

function cancel() {
    document.querySelector(".contentDiv").style.opacity = 1;
    document.getElementById("addGoalWrapper").innerHTML = "";
}

async function main() {
    await getGoal(id);
    await apportOMS(id);
    await eatenWeek();
}
main();
