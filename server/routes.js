

/* Creates MySQL connection using database credential provided in config.json */
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.RDS_HOST || config.rds_host,
  port: process.env.RDS_PORT || config.rds_port,
  user: process.env.RDS_USER || config.rds_user,
  password: process.env.RDS_PASSWORD || config.rds_password,
  database: process.env.RDS_DB || config.rds_db,
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Successfully connected to the database');
  }
});


/* Route 1: GET /author/:type */
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

/* Route 2: host page */
const star_host = async function (req, res) {
  const neighborhoodGroup = req.query.neighborhood_group ?? "Any";
  const neighborhood = req.query.neighborhood ?? "Any";
  const superHost = req.query.super_host === "true" ? 0 : 1;
  console.log(superHost);

  let query = `SELECT host.host_id AS host_id, host_name, super_host, neighborhood_group, neighborhood,  sum(review_num) AS num, AVG(review_rating) AS rating, AVG(review_accuracy) AS accuracy,AVG(review_communication) AS communication, AVG(review_clean) AS clean, AVG(review_location) AS location, AVG(review_value) AS value
  FROM host
      JOIN airbnb ON host.host_id = airbnb.host_id
      JOIN review ON airbnb.review_id = review.review_id
      JOIN location ON airbnb.location_id = location.location_id
  `;

  if (superHost == 1) {
    if (neighborhoodGroup == "Any" && neighborhood == "Any") {
      query += `WHERE super_host = 1
        GROUP BY host_id, host_name
    `;
      console.log(query);
      connection.query(query, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      // Optional filters
      console.log({ neighborhood, neighborhoodGroup });
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
        query += `WHERE ${optionalFilters.join(" AND ")} AND super_host = 1
      `;
      }

      if (neighborhood == "Any") {
        query += `GROUP BY host_id, neighborhood_group
      `;
      } else if (neighborhood != "Any") {
        query += `
      GROUP BY host_id, neighborhood_group, neighborhood
      `;
      }

      console.log(query);
      connection.query(query, params, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else {
    if (neighborhoodGroup == "Any" && neighborhood == "Any") {
      query += `GROUP BY host_id, host_name
    `;
      console.log(query);
      connection.query(query, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      // Optional filters
      console.log({ neighborhoodGroup, neighborhood });
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
        query += `
      WHERE ${optionalFilters.join(" AND ")}
      `;
      }

      if (neighborhood == "Any") {
        query += `
      GROUP BY host_id, neighborhood_group
      `;
      } else if (neighborhood != "Any") {
        query += `
      GROUP BY host_id, neighborhood_group, neighborhood
      `;
      }

      console.log(query);
      connection.query(query, params, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  }
};

/* Route 3: host page pop up */
const host_listing = async function (req, res) {
  const hostId = req.query.host_id;

  connection.query(
    `
    SELECT listing_id, listing_des, listing_url, host_name, host_url, pic_url
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

/* helper function for Route 4, trim all parameters */
const cleanParams = (params) => {
  let cleaned = {};
  for (let key in params) {
    cleaned[key.trim()] = params[key].trim();
  }
  return cleaned;
};

/* Route 4: GET /recommendation 
return listing details base on filters selected */
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

  //Store crime rate at each location in a CTE named CrimeRates
  let query = `WITH TotalArrests AS (
      SELECT SUM(count) AS total_arrests FROM crime_count
  ),
  CrimeRates AS (
      SELECT
          c.location_id,
          (c.count / total_arrests) * 100 AS crime_rate
      FROM
          crime_count c,
          TotalArrests
  )
  SELECT
      l.neighborhood_group,
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
      CrimeRates crime ON l.location_id = crime.location_id
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

  //Debug
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

/* Route 5: GET /neighborhoods 
return neighborhood list based on neighborhoodGroup selected */
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

/* Route 6: GET /listing
return listing info based on listing_id selected */
const listing = async function (req, res) {
  const listingId = req.query.listing_id;

  console.log(listingId);

  connection.query(
    `
  
    SELECT room_type, beds, bathrooms, listing_url, price, mini_nights, max_nights, accommodates, host.host_id
    FROM airbnb JOIN host ON airbnb.host_id=host.host_id
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

/* Route 7: GET /feature_listing
return one feature listing from each of the 5 neighborhood group */
const feature_listing = async function (req, res) {
  connection.query(
    `
    (SELECT airbnb.listing_id, listing_des, neighborhood_group, listing_url 
    FROM crime_count JOIN airbnb ON crime_count.location_id = airbnb.location_id
    WHERE neighborhood_group = 'Bronx' 
    ORDER BY count ASC, price ASC LIMIT 1) UNION ALL
    (SELECT airbnb.listing_id, listing_des, neighborhood_group, listing_url 
    FROM crime_count JOIN airbnb ON crime_count.location_id = airbnb.location_id
    WHERE neighborhood_group = 'Brooklyn' 
    ORDER BY count ASC, price ASC LIMIT 1) UNION ALL
    (SELECT airbnb.listing_id, listing_des, neighborhood_group, listing_url 
    FROM crime_count JOIN airbnb ON crime_count.location_id = airbnb.location_id
    WHERE neighborhood_group = 'Manhattan' 
    ORDER BY count ASC, price ASC LIMIT 1) UNION ALL
    (SELECT airbnb.listing_id, listing_des, neighborhood_group, listing_url 
    FROM crime_count JOIN airbnb ON crime_count.location_id = airbnb.location_id
    WHERE neighborhood_group = 'Queens' 
    ORDER BY count ASC, price ASC LIMIT 1) UNION ALL
    (SELECT airbnb.listing_id, listing_des, neighborhood_group, listing_url 
    FROM crime_count JOIN airbnb ON crime_count.location_id = airbnb.location_id
    WHERE neighborhood_group = 'Staten Island' 
    ORDER BY count ASC, price ASC LIMIT 1);
    `,
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        console.log("No data found");
        return res.status(404).json({ message: "No listings found" });
      }
      console.log("Query results:", results);
      res.json(results);
    }
  );
};

/* Route 8: GET /crime 
   Return top 10 offense in a certain region*/

const crime = async function (req, res) {
  //console.log("Received query params:", req.query);
  const { neighborhoodGroup = "Any", neighborhood = "Any" } = req.query;

  //console.log("Received query params:", req.query);
  let query = `With ranking as (SELECT location_id, COUNT(*) as count, RANK() OVER (ORDER By COUNT(*)) AS \`rank\`
  FROM arrest_list
  GROUP BY location_id
  ORDER BY count
)SELECT l.location_id, ofns_type, \`rank\`, count(*) as offense_count
FROM arrest_list al JOIN location l ON al.location_id = l.location_id JOIN offense_description ON offense_description.ky_cd = al.ky_cd JOIN ranking ON l.location_id = ranking.location_id

`;

  let params = [];

  // Optional filters
  const optionalFilters = [];
  //console.log("neighborhoodGroup", neighborhoodGroup);
  if (neighborhoodGroup && neighborhoodGroup !== "Any") {
    optionalFilters.push(`WHERE l.neighborhood_group = ?`);
    params.push(neighborhoodGroup);
  }
  if (neighborhood && neighborhood !== "Any") {
    optionalFilters.push(`l.neighborhood = ?`);
    params.push(neighborhood);
  }
  // console.log(
  //   "optionalFilterlength: ",
  //   optionalFilters.length,
  //   " params: ",
  //   params
  // );

  // Add the optional filters to the query if they exist
  if (optionalFilters.length > 0) {
    query += ` 
    ${optionalFilters.join(" AND ")}`;
  }

  // Add the GROUP BY clause
  query += `
  GROUP BY ofns_type
  ORDER BY offense_count DESC
  LIMIT 10;`;
  //console.log(query);

  connection.query(query, params, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

/* Route 9: GET /crimeDemographic */
// Return top 10 demographic in certain region
const crimeDemographic = async function (req, res) {
  console.log("Received query params:", req.query);
  const { neighborhoodGroup = "Any", neighborhood = "Any" } = req.query;

  console.log("Received query params:", req.query);
  let query = `SELECT suspect.type_id, CONCAT(age_group, ' ', gender, ' ', race) AS type, count(*) as count
  FROM arrest_list JOIN suspect ON arrest_list.type_id = suspect.type_id JOIN location ON arrest_list.location_id = location.location_id

`;

  let params = [];

  // Optional filters
  const optionalFilters = [];
  console.log("neighborhoodGroup", neighborhoodGroup);
  const ngboolean = neighborhoodGroup && neighborhoodGroup !== "Any";
  const nbboolean = neighborhood && neighborhood !== "Any";
  if (ngboolean) {
    optionalFilters.push(`WHERE location.neighborhood_group = ?`);
    params.push(neighborhoodGroup);
  }
  if (nbboolean) {
    optionalFilters.push(`location.neighborhood = ?`);
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
  GROUP BY suspect.type_id
ORDER BY COUNT DESC
LIMIT 10;`;
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

/* Route 10: /top_5_neighbors */
const top_5_neighbors = async function (req, res) {
  connection.query(
    `
    With safetest_nb AS (
      SELECT location_id,neighborhood,neighborhood_group, count AS crime_count
      FROM crime_count
      ORDER BY count
      LIMIT 60
    )
  
    SELECT s.neighborhood,s.neighborhood_group,s.crime_count ,COUNT(a.listing_id) AS num_listings
    FROM safetest_nb s JOIN airbnb a ON s.location_id = a.location_id
    GROUP BY s.neighborhood,s.neighborhood_group, s.crime_count
    HAVING COUNT(a.listing_id) > 10
    ORDER BY s.crime_count
    Limit 5;
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        const jsonArray = data.map((row) => ({
          neighborhood: row.neighborhood,
          neighborhood_group: row.neighborhood_group,
        }));
        res.json(jsonArray);
      }
    }
  );
};

/* Route 11: /neighborhood_group_crime */
const neighborhood_group_crime = async function (req, res) {
  connection.query(
    `
    SELECT neighborhood_group,sum(count) as crime_count
    FROM crime_count
    GROUP BY neighborhood_group
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        const jsonArray = data.map((row) => ({
          neighborhood_group: row.neighborhood_group,
          crime_count: row.crime_count,
        }));
        res.json(jsonArray);
      }
    }
  );
};

module.exports = {
  author,
  top_5_neighbors,
  star_host,
  host_listing,
  listing,
  feature_listing,
  recommendation,
  neighborhoods,
  crime,
  neighborhood_group_crime,
  crimeDemographic,
};
