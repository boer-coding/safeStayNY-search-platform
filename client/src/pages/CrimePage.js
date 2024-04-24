import { useEffect, useState } from "react";
import "../app.css";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import BarChartComponent from "../components/BarChart";
import { useSearchParams } from "react-router-dom";

const config = require("../config.json");

//query neighborhood group, nb, accommodate, days, room-type, bed, bath
export function CrimePage() {

  //state hooks for fetching
  const [crimeData, setCrimeData] = useState([]);
  const [neighborhoodData, setNeighborhoods] = useState([]);
  const [demoData, setdemoData] = useState([]);
  const [groupCrimeData, setGroupCrimeData] = useState([]);

  //necessary filters
  const [searchParams] = useSearchParams();
  const initialNeighborhoodGroup =
    searchParams.get("neighborhoodGroup") || "Any";
  const initialNeighborhood = searchParams.get("neighborhood") || "Any";
  const [neighborhoodGroup, setNeighborhoodGroup] = useState(
    initialNeighborhoodGroup
  );
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood);

  //handleChange
  const handleNeighborhoodGroupChange = (event) => {
    setNeighborhoodGroup(event.target.value);
  };
  const handleNeighborhoodChange = (event) => {
    setNeighborhood(event.target.value);
  };

  //fetch neighborhoods base on neighborhood group
  const fetchNeighborhoods = async () => {
    const url = `http://${config.server_host}:${
      config.server_port
    }/neighborhoods?neighborhoodGroup=${encodeURIComponent(neighborhoodGroup)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setNeighborhoods(data);
      } else {
        console.error("Received data is not an array:", data);
      }
    } catch (error) {
      console.error("Failed to fetch neighborhood list", error);
    }
  };

  //fetch recommendation listing base on filters
  const search = () => {
    console.log("Search initiated with filters:", {
      neighborhoodGroup,
      neighborhood,
    });
    const queryParams = new URLSearchParams({
      neighborhoodGroup,
      neighborhood,
    });

  fetch(`http://${config.server_host}:${config.server_port}/crime/neighborhood_group`)
    .then((res) => res.json())
    .then((resJson) => {
      const featuredListings = resJson.map((row) => ({
        id: row.group_crime_id, 
        ...row,
      }));
      setGroupCrimeData(featuredListings);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
  });

    fetch(
      `http://${config.server_host}:${
        config.server_port
      }/crime?${queryParams.toString()}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const crimeDataJson = resJson.map((a) => ({
          id: a.location_id,
          ...a,
        }));

        setCrimeData(crimeDataJson);
      })
      .catch((error) => {
        console.error("Failed to fetch recommendation", error);
      });
    console.log(queryParams);
    fetch(
      `http://${config.server_host}:${
        config.server_port
      }/crimeDemographic?${queryParams.toString()}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const demoDataJson = resJson.map((a) => ({
          id: a.type_id,
          ...a,
        }));

        setdemoData(demoDataJson);
      })
      .catch((error) => {
        console.error("Failed to fetch recommendation", error);
      });
  };

  //fetch recs based on filter
  useEffect(() => {
    fetchNeighborhoods();
    search();
  }, [neighborhoodGroup, neighborhood]);

  return (
    <div className="container">
      <div
        className="lower-left-table"
        style={{ width: "100%", height: "600px" }}
      >
        <h3>Neighborhood Group Crime Chart </h3>
        <div>
          <p>
            As you can see, Staten Island is the safest neighborhood group,
            while Brooklyn is the most dangerous one. So schedule your
            activities in Brooklyn during daylight hours as much as possible.
            Booking an Airbnb in Staten Island might be a good idea!
          </p>
        </div>
        <BarChartComponent data={groupCrimeData} />
      </div>
      <div className="upper-table">
        <h2>Top Crime type</h2>

        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={crimeData} width={50} height={80} layout="vertical">
            <YAxis dataKey="ofns_type" type="category" fontSize={10} />

            <XAxis type="number" />
            <Legend />
            <Bar dataKey="offense_count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="lower-table">
        <h2>Demographic Statistics</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={demoData} width={50} height={80} layout="vertical">
            <YAxis dataKey="type" type="category" fontSize={10} />

            <XAxis type="number" />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Container class="upper-left-table">
        <h2>Filters</h2>
        <p>
          Select neighborhood group and neighborhood to see crime statistics.
        </p>
        <Grid container spacing={6}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Neighborhood Group</InputLabel>
              <Select
                value={neighborhoodGroup}
                label="Neighborhood Group"
                onChange={handleNeighborhoodGroupChange}
              >
                <MenuItem value={"Any"}>Any</MenuItem>
                <MenuItem value={"Bronx"}>Bronx</MenuItem>
                <MenuItem value={"Brooklyn"}>Brooklyn</MenuItem>
                <MenuItem value={"Manhattan"}>Manhattan</MenuItem>
                <MenuItem value={"Queens"}>Queens</MenuItem>
                <MenuItem value={"Staten Island"}>Staten Island</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Neighborhood</InputLabel>
              <Select
                value={neighborhood}
                label="Neighborhood"
                onChange={handleNeighborhoodChange}
              >
                <MenuItem value={"Any"}>Any</MenuItem>
                {neighborhoodData.map((item, index) => (
                  <MenuItem key={`${item.neighborhood}-${index}`} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3} style={{ display: "flex", alignItems: "flex-end" }}>
            <Button onClick={() => search()} style={{ marginLeft: "auto" }}>
              Search
            </Button>
          </Grid>
        </Grid>
        <div class="image-container">
          <img src="https://images.pexels.com/photos/9364799/pexels-photo-9364799.jpeg?auto=compress&cs=tinysrgb&w=600" />
        </div>
      </Container>
    </div>
  );
}
