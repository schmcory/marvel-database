{\rtf1\ansi\ansicpg1252\cocoartf1504\cocoasubrtf760
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww18620\viewh12500\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 \'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97 HEROES\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\
-- get all heroes and their home planet name for the Heroes page\
SELECT h.hero_id, h.firstName, h.lastName, h.species, h.age, h.alias, h.loveInterest, p.planet_id AS homePlanet FROM Heroes h\
INNER JOIN Planets p ON p.id = h.homePlanet\
\
-- get all Hero IDs and Names to populate the Home planet dropdown\
SELECT id, name FROM Planets\
\
-- add a new hero\
INSERT INTO Heroes (firstName, lastName, species, age, alias, loveInterest, homePlanet)\
VALUES (:firstNameInput, :lastNameInput, :speciesInput, :ageInput, :aliasInput, :loveInterestInput, :homePlanetIDFromDropdown)\
\
-- delete a hero\
DELETE FROM Heroes WHERE hero_id = :heroid\
\
\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97 VILLAINS\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\
-- get all villains and their enemy name for the Villains page\
SELECT v.id, v.firstName, v.lastName, v.species, v.age, v.alias, v.loveInterest, h.id AS enemy FROM Villains v\
INNER JOIN Heroes h ON h.id = v.enemy\
\
-- get all Hero IDs and Names to populate the Enemy dropdown\
SELECT id, name FROM Heroes\
\
-- add a new villain\
INSERT INTO Villains (firstName, lastName, species, age, alias, enemy)\
VALUES (:fnameInput, :lnameInput, :speciesInput, :ageInput, :aliasInput, :enemyIDFromDropdown)\
\
-- delete a villain\
DELETE FROM Villains WHERE id = :villainid\
\
\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97 PLANETS\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\
-- get all planets for the Planets page\
SELECT p.id, p.name, p.populationSize FROM Planets p\
\
-- add a new planet\
INSERT INTO Planets (name, size)\
VALUES (:nameInput, :sizeInput)\
\
-- delete a planet\
DELETE FROM Planets WHERE id = :planetid\
\
\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97 TEAMS\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\
-- get all teams for the Teams page\
SELECT t.id, t.name, t.size FROM Teams t\
\
-- add a new team\
INSERT INTO teams (name, size)\
VALUES (:nameInput, :sizeInput)\
\
-- delete a team\
DELETE FROM teams WHERE id = :teamid\
\
\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97 ABILITIES\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\'97\
-- get all abilities for the Abilities page\
SELECT a.id, a.name FROM Abilities a\
\
-- add a new ability\
INSERT INTO abilities (name)\
VALUES (:nameInput)\
\
-- delete an ability \
DELETE FROM abilities WHERE id = :abilityid\
\
 }