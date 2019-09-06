/* Drop all tables if they exist */

DROP TABLE IF EXISTS `Heroes`;
DROP TABLE IF EXISTS `Villains`;
DROP TABLE IF EXISTS `Planets`;
DROP TABLE IF EXISTS `Teams`;
DROP TABLE IF EXISTS `Abilities`;
DROP TABLE IF EXISTS `TeamMembers`;
DROP TABLE IF EXISTS `HeroAbilities`;

/* Create Planets table */

CREATE TABLE `Planets` (
	`planet_id` 		INT(9) 		AUTO_INCREMENT NOT NULL,
	`name`			VARCHAR(50)	NOT NULL,
	`populationSize`	BIGINT(20)	NOT NULL,
	PRIMARY KEY (`planet_id`)
)Engine=INNODB DEFAULT CHARSET=latin1;

/* Create Heroes table */

CREATE TABLE `Heroes` (
	`hero_id` 	INT(20) 	AUTO_INCREMENT NOT NULL,
	`firstName`	VARCHAR(20)	NOT NULL,
	`lastName`	VARCHAR(20)	DEFAULT NULL,
	`species`	VARCHAR(50)	NOT NULL,
	`age`		BIGINT(20)	DEFAULT NULL,
	`alias`		VARCHAR(20)	DEFAULT NULL,
	`loveInterest`	VARCHAR(50)	DEFAULT NULL,
	`homePlanet`	INT(9)		NOT NULL,
	PRIMARY KEY (`hero_id`),
	FOREIGN KEY (`homePlanet`) REFERENCES `Planets`(`planet_id`) ON UPDATE CASCADE ON DELETE CASCADE
)Engine=InnoDB DEFAULT CHARSET=latin1;

/* Create Villains table */

CREATE TABLE `Villains` (
	`villain_id` 		INT(9) 		AUTO_INCREMENT NOT NULL,
	`vfirstName`		VARCHAR(20),
	`vlastName`		VARCHAR(20)	DEFAULT NULL,
	`vspecies`		VARCHAR(50)	NOT NULL,
	`vage`			BIGINT(20)	DEFAULT NULL,
	`valias`		VARCHAR(20)	DEFAULT NULL,
	`enemy`			INT(9)		NOT NULL,
	PRIMARY KEY (`villain_id`),
	FOREIGN KEY (`enemy`) REFERENCES `Heroes`(`hero_id`) ON UPDATE CASCADE ON DELETE CASCADE
)Engine=INNODB DEFAULT CHARSET=latin1;

/* Create Teams table */

CREATE TABLE `Teams` (
	`team_id` 		INT(9) 		AUTO_INCREMENT NOT NULL,
	`name`			VARCHAR(50)	NOT NULL,
	`size`			BIGINT(20)	NOT NULL,
	PRIMARY KEY (`team_id`)
)Engine=INNODB DEFAULT CHARSET=latin1;

/* Create Abilities table */

CREATE TABLE `Abilities` (
	`ability_id` 		INT(9) 		AUTO_INCREMENT NOT NULL,
	`name`			VARCHAR(50)	NOT NULL,
	PRIMARY KEY (`ability_id`)
)Engine=INNODB DEFAULT CHARSET=latin1;

/* Create TeamMembers table */

CREATE TABLE `TeamMembers` (
	`tid` 	INT(9) 		NOT NULL,
	`hid` 	INT(9) 		NOT NULL,
	PRIMARY KEY (`tid`, `hid`),
	FOREIGN KEY (`tid`) REFERENCES `Teams`(`team_id`) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (`hid`) REFERENCES `Heroes`(`hero_id`) ON UPDATE CASCADE ON DELETE CASCADE
)Engine=INNODB DEFAULT CHARSET=latin1;

/* Create AbilityMembers table */

CREATE TABLE `AbilityMembers` (
	`aid` 		INT(9) 		NOT NULL,
	`hid` 		INT(9) 		NOT NULL,
	PRIMARY KEY (`aid`, `hid`),
	FOREIGN KEY (`aid`) REFERENCES `Abilities`(`ability_id`) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (`hid`) REFERENCES `Heroes`(`hero_id`) ON UPDATE CASCADE ON DELETE CASCADE
)Engine=INNODB DEFAULT CHARSET=latin1;





