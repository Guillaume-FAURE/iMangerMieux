-- ALL THE SQL REQUEST WE WILL NEED

-- add a new person to the db
INSERT INTO personne (Email, Nom, Prenom, date, password) VALUES ($email, $nom, $prenom, $date, $password);
INSERT INTO objectif (personne_id) SELECT personne.Personne_id FROM personne WHERE Email=$email;

-- delete person from the db
DELETE FROM personne WHERE Personne_id=$id

-- update person in the db
UPDATE personne
SET Email=$Email, Nom=$nom, Prenom=$prenom, date=$date, password=$password
WHERE Personne_id=$id

-- add default objectives to the objectif table for every personnes
INSERT INTO objectif (personne_id) SELECT personne.Personne_Id FROM personne

-- update needs in the db
UPDATE objectif
SET calorie=$calorie, proteines=$proteines, glucides=$glucides, lipides=$lipides, sucres=$sucres, fibres=$fibres, gras_sature=$grasSature, cholesterol=$cholesterol, sel=$sel
WHERE personne_id=$id

-- composition from a food : {calorie, eau, proteines, glucides, lipides, sucres, fibres, gras_sature, cholesterol, sel}
SELECT valeur FROM composition WHERE composition.aliments_Id=$id

-- get the food list to pick on this list from the frontend
SELECT * FROM aliments 

-- get the food from a recipe
SELECT aliments.id FROM aliments JOIN recette ON recette.aliments_enfants_id = aliments.id WHERE recette.aliments_parents_id = $recetteId

-- add a new recipe
INSERT INTO recette (food_id, ratio) VALUES ($food, $foodRatio)