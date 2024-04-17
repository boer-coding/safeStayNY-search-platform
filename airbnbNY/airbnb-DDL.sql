CREATE DATABASE project;

USE project;

CREATE TABLE host (
    host_id   	INT,
    host_name   VARCHAR(50)         NOT NULL,
	PRIMARY KEY (host_id)
);


CREATE TABLE location (
    location_id             INT,
    neighborhood            VARCHAR(100)           NOT NULL,
    neighborhood_group 	    VARCHAR(20)            NOT NULL,
	PRIMARY KEY (location_id)
);


CREATE TABLE review (
    review_id          		INT,
    review_num         		INT,
    review_rating      		DECIMAL(3, 2),
    review_accuracy    		DECIMAL(3, 2),
    review_clean	 		DECIMAL(3, 2),
    review_checkin      	DECIMAL(3, 2),
    review_communication 	DECIMAL(3, 2),
    review_location 		DECIMAL(3, 2),
    review_value 			DECIMAL(3, 2),
    review_pmonth 			DECIMAL(3, 2),
	PRIMARY KEY (review_id)
);


CREATE TABLE airbnb (
    listing_id    	INT,
    listing_des 	VARCHAR(120),
    host_id			INT                    NOT NULL,
    room_type		ENUM ('Entire home/apt',
                            'Private room',
                            'Hotel room',
                            'Shared room') NOT NULL,
    price			INT,
    mini_nights 	INT,
    location_id     INT                    NOT NULL,
	latitude       	DECIMAL(7, 5)          NOT NULL,
	longitude      	DECIMAL(7, 5)          NOT NULL,
	review_id 		INT                    NOT NULL,
	PRIMARY KEY (listing_id),
	FOREIGN KEY (host_id) REFERENCES host(host_id),
    FOREIGN KEY (location_id) REFERENCES location (location_id),
	FOREIGN KEY (review_id) REFERENCES review (review_id)
);

CREATE TABLE offense_description (
    ky_cd    INT,
    ofns_type VARCHAR(60)	NOT NULL,
	PRIMARY KEY (ky_cd)
);

CREATE TABLE police_department_description (
    pd_cd    INT,
    pd_type VARCHAR(120),
	PRIMARY KEY (pd_cd)
);

CREATE TABLE suspect (
    type_id     INT,
    age_group   ENUM ('<18','18-24','25-44','45-64','65+')      	  NOT NULL,
	gender 		ENUM ('F', 'M','U')									  NOT NULL,
	race        ENUM ('BLACK', 'WHITE','WHITE HISPANIC',
						'BLACK HISPANIC','ASIAN / PACIFIC ISLANDER',
						'UNKNOWN','AMERICAN INDIAN/ALASKAN NATIVE')   NOT NULL,
	PRIMARY KEY (type_id)
);

CREATE TABLE arrest_list (
    arrest_id      INT,
	arrest_date    VARCHAR(10) 		NOT NULL,
	latitude       DECIMAL(8, 6)	NOT NULL,
	longitude      DECIMAL(8, 6)	NOT NULL,
	type_id		   INT				NOT NULL,
	ky_cd          INT,
	pd_cd          INT				NOT NULL,
    location_id    INT              NOT NULL,
	PRIMARY KEY (arrest_id),
	FOREIGN KEY (ky_cd) REFERENCES offense_description (ky_cd),
	FOREIGN KEY (pd_cd) REFERENCES police_department_description (pd_cd),
	FOREIGN KEY (type_id) REFERENCES suspect (type_id),
    FOREIGN KEY (location_id) REFERENCES location (location_id)
);
