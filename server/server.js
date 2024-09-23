const express = require("express");
const cors = require("cors");
// const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
// app.get('/', (req, res) => {
//   res.send('Welcome to SafeStayNY API');
// });
// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get("/author/:type", routes.author);
app.get("/top_5_neighbors", routes.top_5_neighbors);
app.get("/star_host", routes.star_host);
app.get("/host_listing", routes.host_listing);
app.get("/recommendations", routes.recommendation);
app.get("/neighborhoods", routes.neighborhoods);
app.get("/listing", routes.listing);
app.get("/feature_listing", routes.feature_listing);
app.get("/crime", routes.crime);
app.get("/crime/neighborhood_group",routes.neighborhood_group_crime);
app.get("/crimeDemographic", routes.crimeDemographic);

const port = process.env.PORT || 8080; // Use Heroku's provided port or default to 8080

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
