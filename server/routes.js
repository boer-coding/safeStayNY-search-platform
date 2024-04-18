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
  const name = "Yuqing Guo, Boer Liu, Hannah Luan, Ying Zhang";

  if (req.params.type === "name") {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res
      .status(400)
      .send(
        `'${req.params.type}' is not a valid author type. Valid type is 'name'.`
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


const star_host1 = async function (req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album

  const neighborhoodGroup = req.query.neighborhood_group ?? "Any";
  const neighborhood = req.query.neighborhood ?? "Any";
 
  if (neighborhoodGroup == "Any" && neighborhood == "Any") {
    console.log("Constructed SQL Query 1:", req.query);
    connection.query(
      `
      SELECT host.host_id AS host_id, host_name, neighborhood, neighborhood_group, sum(review_num) AS review_count, CAST(AVG(review_rating)AS DECIMAL(3,2)) AS avg_rating
      FROM host
          JOIN airbnb ON host.host_id = airbnb.host_id
          JOIN review ON airbnb.review_id = review.review_id
          JOIN location ON airbnb.location_id = location.location_id
      GROUP BY host_id, host_name, neighborhood, neighborhood_group
      ORDER BY review_count DESC
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
    let query = `WITH host_ranking AS (
    SELECT host.host_id AS host_id, host_name, location_id, sum(review_num) AS review_count ,avg(review_rating) AS avg_rating
    FROM host JOIN airbnb ON host.host_id = airbnb.host_id
        JOIN review ON airbnb.review_id = review.review_id
    GROUP BY host_id, host_name, location_id
    ORDER BY review_count DESC, avg_rating DESC
    )
    SELECT host_id, host_name, neighborhood,neighborhood_group, review_count, avg_rating
    FROM host_ranking
    JOIN location ON host_ranking.location_id = location.location_id
`;


  // Optional filters
  let params = [];
  const optionalFilters = [];
  if (neighborhoodGroup && neighborhoodGroup != "Any") {
    optionalFilters.push(`neighborhood_group = ?`);
    params.push(neighborhoodGroup);
  }
  if (neighborhood && neighborhood != "Any") {
    optionalFilters.push(`neighborhood = ?`);
    params.push(neighborhood);
  }


  // Add the optional filters to the query if they exist
  if (optionalFilters.length > 0) {
    query += ` WHERE ${optionalFilters.join(" AND ")}
    ORDER BY review_count DESC, avg_rating DESC`;
  }

  connection.query(query,params, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
} 
};
// host page
const star_host = async function (req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album

  const neighborhoodGroup = req.query.neighborhood_group ?? "Any";
  const neighborhood = req.query.neighborhood ?? "Any";
 
  if (neighborhoodGroup == "Any" && neighborhood == "Any") {
    console.log("Constructed SQL Query 1:", req.query);
    connection.query(
      `
      SELECT host.host_id AS host_id, host_name, sum(review_num) AS review_count, CAST(AVG(review_rating)AS DECIMAL(3,2)) AS avg_rating
      FROM host
          JOIN airbnb ON host.host_id = airbnb.host_id
          JOIN review ON airbnb.review_id = review.review_id
          join location ON airbnb.location_id = location.location_id
      GROUP BY host_id, host_name
      ORDER BY review_count DESC, avg_rating DESC;
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
    let query = `
    SELECT host.host_id AS host_id, host_name, sum(review_num) AS review_count, CAST(AVG(review_rating)AS DECIMAL(3,2)) AS avg_rating
    FROM host JOIN airbnb ON host.host_id = airbnb.host_id
              JOIN review ON airbnb.review_id = review.review_id
              JOIN location ON airbnb.location_id = location.location_id
    
`;

  // Optional filters
  let params = [];
  const optionalFilters = [];
  if (neighborhoodGroup && neighborhoodGroup != "Any") {
    optionalFilters.push(`neighborhood_group = ?`);
    params.push(neighborhoodGroup);
  }
  if (neighborhood && neighborhood != "Any") {
    optionalFilters.push(`neighborhood = ?`);
    params.push(neighborhood);
  }


  // Add the optional filters to the query if they exist
  if (optionalFilters.length > 0) {
    query += 
    `
    WHERE ${optionalFilters.join(" AND ")}
    `
  }
  
  if (neighborhood == "Any"){
    query += 
    `
    GROUP BY host_id, neighborhood_group
    ORDER BY review_count DESC, avg_rating DESC;
    `
  } else if (neighborhood != "Any"){
    query += 
    `
    GROUP BY host_id, neighborhood_group, neighborhood
    ORDER BY review_count DESC, avg_rating DESC;
    `
  }

  console.log(query)
  connection.query(query, params,(err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
} 
};
// host page pop up
const host_listing = async function (req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const hostId = req.query.host_id;
  console.log("print", hostId)
  connection.query(
    `
    SELECT listing_id, listing_des, listing_url, host_name, host_url
    FROM airbnb JOIN host
    ON airbnb.host_id = host.host_id
    WHERE airbnb.host_id = '${hostId}'

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

const cleanParams = (params) => {
  let cleaned = {};
  for (let key in params) {
    cleaned[key.trim()] = params[key].trim();
  }
  return cleaned;
};

// v2 working optimization-needed Route 10: GET /recommendation
const recommendation = async function (req, res) {
  const cleanQuery = cleanParams(req.query);
  console.log("Received query params:", req.query);
  const {
    neighborhoodGroup = "Any",
    neighborhood = "Any",
    accommodates = 1,
    stayLength = 2,
    roomType = null,
    priceLow = 0,
    priceHigh = 100000,
    beds = null,
    bathrooms = null,
  } = cleanQuery;

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
  crime.crime_rate
FROM
  airbnb a
JOIN
  location l ON a.location_id = l.location_id
JOIN
  (SELECT
      c.location_id,
      (c.count/total_arrests)*100 AS crime_rate
    FROM
      crime_count c, (SELECT SUM(count) AS total_arrests FROM crime_count)AS total
    ) AS crime
  ON l.location_id = crime.location_id
WHERE
  a.accommodates >= ?
  AND ? BETWEEN a.mini_nights AND a.max_nights
`;

  let params = [accommodates, stayLength];

  // Optional filters
  const optionalFilters = [];
  if (neighborhoodGroup.trim() !== "Any" && neighborhoodGroup) {
    optionalFilters.push(`l.neighborhood_group = ?`);
    params.push(neighborhoodGroup.trim());
  }
  if (neighborhood !== "Any" && neighborhood) {
    optionalFilters.push(`l.neighborhood = ?`);
    params.push(neighborhood);
  }
  if (roomType) {
    optionalFilters.push(`a.room_type = ?`);
    params.push(roomType);
  }
  if (beds) {
    optionalFilters.push(`a.beds >= ?`);
    params.push(beds);
  }
  if (bathrooms) {
    optionalFilters.push(`a.bathrooms >= ?`);
    params.push(bathrooms);
  }

  // Add the optional filters to the query if they exist
  if (optionalFilters.length > 0) {
    query += ` AND ${optionalFilters.join(" AND ")}`;
  }

  // Add the price range condition
  let priceCondition = "";

  if (priceHigh >= 1000) {
    priceCondition = "AND a.price >= ? ";
    params.push(priceLow);
  } else {
    priceCondition = "AND a.price BETWEEN ? AND ?";
    params.push(priceLow, priceHigh);
  }

  query += priceCondition;

  // Add the ORDER BY clause
  query += ` ORDER BY crime.crime_rate ASC, a.price ASC;`;

  console.log("final rec query: ", query);
  connection.query(query, params, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// return neighborhood list based on nb_group selected Route 11: GET /neighborhoods
const neighborhoods = async function (req, res) {
  // console.log("Received neighborhoodGroup params:", req.query);
  const queryParams = [];
  const { neighborhoodGroup = "Any" } = req.query;

  let query = `
  SELECT DISTINCT l.neighborhood
  FROM location l JOIN  airbnb a ON a.location_id=l.location_id
  `;
  if (neighborhoodGroup !== "Any" && neighborhoodGroup) {
    queryParams.push(neighborhoodGroup);
    query += " WHERE neighborhood_group = ?";
  }

  query += " ORDER BY l.neighborhood;";
  // console.log("final nblist query:", query);

  connection.query(query, queryParams, (err, data) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (data.length === 0) {
      res.status(404).json({ error: "No neighborhoods found" });
      return;
    }
    res.json(data.map((item) => item.neighborhood));
    // res.json(data);
  });
};

// return listing info based on listing_id selected Route 12: GET /listing
const listing = async function (req, res) {
  const listingId = req.query.listing_id;

  console.log(listingId);

  connection.query(
    `
  
    SELECT room_type, beds, bathrooms, listing_url, host_id
    FROM airbnb
    WHERE listing_id = '${listingId}'
    
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data[0]);
      }
    }
  );
};

const crime = async function (req, res) {
  console.log("Received query params:", req.query);
  const { neighborhoodGroup = "Any", neighborhood = "Any" } = req.query;

  console.log("Received query params:", req.query);
  let query = `With ranking as (SELECT location_id, COUNT(*) as count, RANK() OVER (ORDER By COUNT(*)) AS \`rank\`
  FROM arrest_list
  GROUP BY location_id
  ORDER BY count
)SELECT l.location_id, al.ky_cd, ofns_type, \`rank\`, count(*) as offense_count, suspect.age_group,suspect.gender, suspect.race
FROM arrest_list al JOIN location l ON al.location_id = l.location_id JOIN suspect ON suspect.type_id = al.type_id JOIN offense_description ON offense_description.ky_cd = al.ky_cd JOIN ranking ON l.location_id = ranking.location_id`;

  let params = [];

  // Optional filters
  const optionalFilters = [];
  console.log("neighborhoodGroup", neighborhoodGroup);
  if (neighborhoodGroup && neighborhoodGroup !== "Any") {
    optionalFilters.push(`WHERE l.neighborhood_group = ?`);
    params.push(neighborhoodGroup);
  }
  if (neighborhood && neighborhood !== "Any") {
    optionalFilters.push(`l.neighborhood = ?`);
    params.push(neighborhood);
  }
  console.log(
    "optionalFilterlength: ",
    optionalFilters.length,
    " params: ",
    params
  );

  // Add the optional filters to the query if they exist
  if (optionalFilters.length > 0) {
    query += ` 
    ${optionalFilters.join(" AND ")}`;
  }

  // Add the GROUP BY clause
  query += `
  GROUP BY ofns_type;`;
  console.log(query);

  connection.query(query, params, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

const top_5_neighbors = async function (req, res) {
  const result = [
    {
      neighborhood: "Belle Harbor",
      neighborhood_group: "Queens",
    },
    {
      neighborhood: "Lighthouse Hill",
      neighborhood_group: "Staten Island",
    },
    {
      neighborhood: "Breezy Point",
      neighborhood_group: "Queens",
    },
    {
      neighborhood: "Shore Acres",
      neighborhood_group: "Staten Island",
    },
    {
      neighborhood: "Fort Wadsworth",
      neighborhood_group: "Staten Island",
    },
  ];
  res.send(result);
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
  star_host,
  host_listing,
  listing,
  recommendation,
  neighborhoods,
  crime,
  top_5_neighbors,
};
