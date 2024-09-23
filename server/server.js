const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "https://safestayny.vercel.app", // Your Vercel frontend URL
  })
);

// Define your routes
app.get("/author/:type", routes.author);
app.get("/top_5_neighbors", routes.top_5_neighbors);
app.get("/star_host", routes.star_host);
app.get("/host_listing", routes.host_listing);
app.get("/recommendations", routes.recommendation);
app.get("/neighborhoods", routes.neighborhoods);
app.get("/listing", routes.listing);
app.get("/feature_listing", routes.feature_listing);
app.get("/crime", routes.crime);
app.get("/crime/neighborhood_group", routes.neighborhood_group_crime);
app.get("/crimeDemographic", routes.crimeDemographic);

// Use Heroku's dynamic port or fallback to 8080 for local development
const port = process.env.PORT || config.server_port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

