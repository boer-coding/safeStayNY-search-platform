const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function (req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = "Boer Liu, Ying Zhang";
  const pennKey = "liuboer";

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === "name") {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === "pennkey") {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res
      .status(400)
      .send(
        `'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`
      );
  }
};

// Route 2: GET /random
const random = async function (req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === "true" ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(
    `
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `,
    (err, data) => {
      if (err || data.length === 0) {
        // If there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
        // return type you may need to return an empty array [] instead.
        res.json({});
      } else {
        // Here, we return results of the query as an object, keeping only relevant data
        // being song_id and title which you will add. In this case, there is only one song
        // so we just directly access the first element of the query results array (data)
        // TODO (TASK 3): also return the song title in the response
        res.json({
          song_id: data[0].song_id,
          title: data[0].title,
        });
      }
    }
  );
};

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function (req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data[0]
  // Most of the code is already written for you, you just need to fill in the query
  const song = req.params.song_id;

  connection.query(
    `

  SELECT * 
  FROM Songs
  WHERE song_id = '${song}'
  
`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  );
};

// Route 4: GET /album/:album_id
const album = async function (req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const album_id = req.params.album_id;

  connection.query(
    `

  SELECT * 
  FROM Albums
  WHERE album_id = '${album_id}'
  
`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  );
};

// Route 5: GET /albums
const albums = async function (req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(
    `

  SELECT *
  FROM Albums
  ORDER BY release_date DESC

`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

// Route 6: GET /album_songs/:album_id
const album_songs = async function (req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const album_id = req.params.album_id;

  connection.query(
    `

  SELECT song_id, title, number, duration, plays
  FROM Songs
  WHERE album_id = '${album_id}'
  ORDER BY number ASC

`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function (req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well

    connection.query(
      `

    SELECT Songs.song_id AS song_id, Songs.title AS title, Songs.album_id AS album_id, Albums.title AS album, plays
    FROM Songs JOIN Albums
    ON Songs.album_id = Albums.album_id
    ORDER BY plays DESC

  `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      }
    );
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    const offSet = (page - 1) * pageSize;
    connection.query(
      `

    SELECT Songs.song_id AS song_id, Songs.title AS title, Songs.album_id AS album_id, Albums.title AS album, plays
    FROM Songs JOIN Albums
    ON Songs.album_id = Albums.album_id
    ORDER BY plays DESC
    LIMIT ${pageSize} OFFSET ${offSet}
    
  `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      }
    );
  }
};

// Route 8: GET /top_albums
const top_albums = async function (req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(
      `

    SELECT Albums.album_id AS album_id, Albums.title AS title, SUM(plays) AS plays
    FROM Albums JOIN Songs
    ON Albums.album_id = Songs.album_id
    GROUP BY Albums.album_id, Albums.title
    ORDER BY SUM(plays) DESC

  `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      }
    );
  } else {
    const offSet = (page - 1) * pageSize;
    connection.query(
      `

    SELECT Albums.album_id AS album_id, Albums.title AS title, SUM(plays) AS plays
    FROM Albums JOIN Songs
    ON Albums.album_id = Songs.album_id
    GROUP BY Albums.album_id, Albums.title
    ORDER BY SUM(plays) DESC
    LIMIT ${pageSize} OFFSET ${offSet}
    
  `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      }
    );
  }
};

// Route 9: GET /search_airbnb
const search_airbnb = async function (req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const numLow = req.query.num_low ?? 0;
  const numHigh = req.query.num_high ?? 1900;
  const ratingLow = req.query.rating_low ?? 0;
  const ratingHigh = req.query.rating_high ?? 5;
  const accuracyLow = req.query.accuracy_low ?? 0;
  const accuracyHigh = req.query.accuracy_high ?? 5;
  const cleanLow = req.query.clean_low ?? 0;
  const cleanHigh = req.query.clean_high ?? 5;
  const checkinLow = req.query.checkin_low ?? 0;
  const checkinHigh = req.query.checkin_high ?? 5;
  const communicationLow = req.query.communication_low ?? 0;
  const communicationHigh = req.query.communication_high ?? 5;
  const locationLow = req.query.location_low ?? 0;
  const locationHigh = req.query.location_high ?? 5;
  const valueLow = req.query.value_low ?? 0;
  const valueHigh = req.query.value_high ?? 5;
  const pmonthLow = req.query.pmonth_low ?? 0;
  const pmonthHigh = req.query.pmonth_high ?? 70;

  connection.query(
    `

    SELECT DISTINCT listing_id, listing_des
    FROM airbnb JOIN review 
      ON airbnb.review_id = review.review_id
    WHERE (review_num BETWEEN ${numLow} AND ${numHigh})
      AND (review_rating BETWEEN ${ratingLow} AND ${ratingHigh})
      AND (review_accuracy BETWEEN ${accuracyLow} AND ${accuracyHigh})
      AND (review_clean BETWEEN ${cleanLow} AND ${cleanHigh})
      AND (review_checkin BETWEEN ${checkinLow} AND ${checkinHigh})
      AND (review_communication BETWEEN ${communicationLow} AND ${communicationHigh})
      AND (review_location BETWEEN ${locationLow} AND ${locationHigh})
      AND (review_value BETWEEN ${valueLow} AND ${valueHigh})
      AND (review_pmonth BETWEEN ${pmonthLow} AND ${pmonthHigh})
    ORDER BY review_num

  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

// Route 9: GET /list_host
const list_host = async function (req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const countLow = req.query.count_low ?? 1;
  const countHigh = req.query.count_high ?? 4;
  const numLow = req.query.num_low ?? 0;
  const numHigh = req.query.num_high ?? 550;
  const ratingLow = req.query.rating_low ?? 0;
  const ratingHigh = req.query.rating_high ?? 5;
  const accuracyLow = req.query.accuracy_low ?? 0;
  const accuracyHigh = req.query.accuracy_high ?? 5;
  const cleanLow = req.query.clean_low ?? 0;
  const cleanHigh = req.query.clean_high ?? 5;
  const checkinLow = req.query.checkin_low ?? 0;
  const checkinHigh = req.query.checkin_high ?? 5;
  const communicationLow = req.query.communication_low ?? 0;
  const communicationHigh = req.query.communication_high ?? 5;
  const locationLow = req.query.location_low ?? 0;
  const locationHigh = req.query.location_high ?? 5;
  const valueLow = req.query.value_low ?? 0;
  const valueHigh = req.query.value_high ?? 5;
  const pmonthLow = req.query.pmonth_low ?? 0;
  const pmonthHigh = req.query.pmonth_high ?? 6.5;

  connection.query(
    `

  SELECT airbnb.host_id AS host_id, host_name,
  CAST(COUNT(listing_id) AS DECIMAL(4,0)) as listing_count,
  CAST(SUM(review_num) AS DECIMAL(5,0)) as review_count,
  CAST(AVG(review_rating)AS DECIMAL(3,2)) as avg_rating,
  CAST(AVG(review_accuracy) AS DECIMAL(3,2)) as avg_accuracy,
  CAST(AVG(review_clean) AS DECIMAL(3,2)) as avg_clean,
  CAST(AVG(review_checkin) AS DECIMAL(3,2)) as avg_checkin,
  CAST(AVG(review_communication) AS DECIMAL(4,2)) as avg_communication,
  CAST(AVG(review_location) AS DECIMAL(3,2)) as avg_location,
  CAST(AVG(review_value) AS DECIMAL(3,2)) as avg_value,
  CAST(AVG(review_pmonth)  AS DECIMAL(3,2)) as avg_pmonth
    FROM airbnb
        JOIN review ON airbnb.review_id = review.review_id
        JOIN host ON airbnb.host_id = host.host_id
    GROUP BY host_id, host_name
    HAVING (COUNT(listing_id) BETWEEN ${countLow} AND ${countHigh})
      AND (SUM(review_num) BETWEEN ${numLow} AND ${numHigh})
      AND (AVG(review_rating)  BETWEEN ${ratingLow} AND ${ratingHigh})
      AND (AVG(review_accuracy) BETWEEN ${accuracyLow} AND ${accuracyHigh})
      AND (AVG(review_clean) BETWEEN ${cleanLow} AND ${cleanHigh})
      AND (AVG(review_checkin) BETWEEN ${checkinLow} AND ${checkinHigh})
      AND (AVG(review_communication)  BETWEEN ${communicationLow} AND ${communicationHigh})
      AND (AVG(review_location) BETWEEN ${locationLow} AND ${locationHigh})
      AND (AVG(review_value) BETWEEN ${valueLow} AND ${valueHigh})
      AND (AVG(review_pmonth) BETWEEN ${pmonthLow} AND ${pmonthHigh})
    ORDER BY review_count DESC
    LIMIT 50;

  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

// WORKING Route 10: GET /recommendation
const recommendation_work = async function (req, res) {
  console.log("Received query params:", req.query);
  const {
    neighborhoodGroup = "Manhattan",
    neighborhood = "SoHo",
    accommodates = 1,
    stayLength = 1,
    roomType = "Private room", //should be optional, hardcoded for now
    priceLow = 0,
    priceHigh = 100000,
    beds = 1, //should be optional, hardcoded for now
    bathrooms = 1, //should be optional, hardcoded for now
  } = req.query;

  console.log("Received query params:", req.query);
  connection.query(
    `
      SELECT
      a.listing_id,
      a.listing_des,
      l.neighborhood,
      a.price,
      a.room_type,
      a.accommodates,
      a.bathrooms,
      a.beds,
      a.mini_nights,
      a.max_nights,
      safety.safety_score
    FROM
      airbnb a
    JOIN
      location l ON a.location_id = l.location_id
    JOIN
      (SELECT
          l.location_id,
          1 / (1 + COUNT(a.arrest_date)) AS safety_score
        FROM
          location l
        LEFT JOIN
          arrest_list a ON l.location_id = a.location_id
        GROUP BY
          l.location_id) AS safety
      ON l.location_id = safety.location_id
    WHERE
      l.neighborhood_group = '${neighborhoodGroup}'
      AND (l.neighborhood = '${neighborhood}')
      AND (a.accommodates >= ${accommodates})
      AND ${stayLength} BETWEEN a.mini_nights AND a.max_nights
      AND (a.room_type = '${roomType}')
      AND a.price BETWEEN ${priceLow} AND ${priceHigh}
      AND (a.beds >= ${beds})
      AND (a.bathrooms >= ${bathrooms})
        ORDER BY
     safety.safety_score DESC,
      a.price ASC;
    `,

    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

// v2 working optimization-needed Route 10: GET /recommendation
const recommendation = async function (req, res) {
  console.log("Received query params:", req.query);
  const {
    neighborhoodGroup = "Any",
    neighborhood = "Any",
    accommodates = 1,
    stayLength = 1,
    roomType = null, //should be optional, hardcoded for now
    priceLow = 0,
    priceHigh = 100000,
    beds = 1, //should be optional, hardcoded for now
    bathrooms = 1, //should be optional, hardcoded for now
  } = req.query;

  console.log("Received query params:", req.query);

  let query = `SELECT
  a.listing_id,
  a.listing_des,
  l.neighborhood,
  a.price,
  a.room_type,
  a.accommodates,
  a.bathrooms,
  a.beds,
  a.mini_nights,
  a.max_nights,
  safety.safety_score
FROM
  airbnb a
JOIN
  location l ON a.location_id = l.location_id
JOIN
  (SELECT
      l.location_id,
      1 / (1 + COUNT(al.arrest_date)) AS safety_score
    FROM
      location l
    LEFT JOIN
      arrest_list al ON l.location_id = al.location_id
    GROUP BY
      l.location_id) AS safety
  ON l.location_id = safety.location_id
WHERE
  a.accommodates >= ?
  AND ? BETWEEN a.mini_nights AND a.max_nights
`;

  let params = [accommodates, stayLength];

  // Optional filters
  const optionalFilters = [];
  if (neighborhoodGroup && neighborhoodGroup !== "Any") {
    optionalFilters.push(`l.neighborhood_group = ?`);
    params.push(neighborhoodGroup);
  }
  if (neighborhood && neighborhood !== "Any") {
    optionalFilters.push(`l.neighborhood = ?`);
    params.push(neighborhood);
  }
  if (roomType) {
    optionalFilters.push(`a.room_type = ?`);
    params.push(roomType);
  }
  if (beds) {
    optionalFilters.push(`a.beds = ?`);
    params.push(beds);
  }
  if (bathrooms) {
    optionalFilters.push(`a.bathrooms = ?`);
    params.push(bathrooms);
  }

  // Add the optional filters to the query if they exist
  if (optionalFilters.length > 0) {
    query += ` AND ${optionalFilters.join(" AND ")}`;
  }

  // Add the price range condition
  query += ` AND a.price BETWEEN ? AND ?`;
  params.push(priceLow, priceHigh);

  // Add the ORDER BY clause
  query += ` ORDER BY safety.safety_score DESC, a.price ASC;`;

  connection.query(query, params, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// need to fix, return nb list based on nb_group Route 11: GET /neighborhood_list
const neighborhood_list = async function (req, res) {
  const { neighborhoodGroup = "" } = req.query;
  let query;
  const queryParams = [];
  if (neighborhoodGroup === "Any" || neighborhoodGroup === "") {
    query = `
    SELECT neighborhood 
    FROM location 
    ORDER BY neighborhood;`;
  } else {
    query = `
    SELECT neighborhood
    FROM location 
    WHERE neighborhood_group=?
    ORDER BY neighborhood;
    `;
    queryParams = [neighborhoodGroup];
  }

  connection.query(query, queryParams, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.status(500).json({ error: "Internal server error or no data found" });
    } else {
      res.json(data.map((item) => item.neighborhood));
      // res.json(data);
    }
  });
};

// WORKING Route 12: GET /neighborhoods
const neighborhoods = async function (req, res) {
  const query = `
    SELECT DISTINCT neighborhood 
    FROM location 
    ORDER BY neighborhood;`;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.status(500).json({ error: "Internal server error or no data found" });
    } else {
      res.json(data.map((item) => item.neighborhood));
    }
  });
};

module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_airbnb,
  list_host,
  recommendation,
  neighborhood_list,
  neighborhoods,
};
