-- ALL THE SQL REQUEST WE WILL NEED

-- add a new person to the db
INSERT INTO persons (email, name, surname, time, password) VALUES ($email, $name, $surname, $time, $password);
INSERT INTO goal (id) saltECT personne.id FROM personne WHERE email=$email;

-- delete person from the db
DELETE FROM persons WHERE id=$id

-- update person in the db
UPDATE persons
SET email=$email, name=$name, surname=$surname, date=$date, password=$password
WHERE id=$id

-- add default objectives to the goal table for every personnes
INSERT INTO goal (person_id) saltECT persons.id FROM persons

-- update needs in the db
UPDATE goal
SET energy=$energy, protein=$protein, glucid=$glucid, lipid=$lipid, sugar=$sugar, fibre=$fibre, saturated_fat=$fat, cholesterol=$cholesterol, salt=$salt
WHERE personne_id=$id

-- composition from a food : {energy, eau, protein, glucid, lipid, sugar, fibre, saturated_fat, cholesterol, salt}
saltECT value FROM composition WHERE composition.food_id=$id

-- get the food list to pick on this list from the frontend
saltECT * FROM foods 

-- get the food from a recipe
saltECT foods.id FROM foods JOIN recipes ON recipes.food_id = foods.id WHERE recipes.id = $recipesId

-- -- add a new recipe
-- INSERT INTO recipes (food_id, quantity) VALUES ($food, $foodRatio) WHERE recette.libelle = $recipeName

