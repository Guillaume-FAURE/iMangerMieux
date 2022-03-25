-- ALL THE SQL WE WILL NEED

-- add a new person to the db
INSERT INTO personne (Email, nom, prenom, date, password) VALUES ($email, $nom, $prenom, $date, $password)

-- delete person from the db
DELETE FROM personne WHERE Personne_id=$id

-- update person in the db
UPDATE personne
SET Email=$Email, nom=$nom, prenom=$prenom, date=$date, password=$password
WHERE Personne_id=$id