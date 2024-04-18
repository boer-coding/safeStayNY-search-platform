import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  Link,
  Checkbox,
  FormControlLabel,
  LinearProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import HostListing from "../components/HostListing";

const config = require("../config.json");

export function HostPage() {
  const [pageSize, setPageSize] = useState(10);
  const [hostData, setHostData] = useState([]);

  const [neighborhoodGroup, setNeighborhoodGroup] = useState("Any");
  const [neighborhood, setNeighborhood] = useState("Any");
  const [neighborhoods, setNeighborhoods] = useState([]);

  const [superHost, setSuperHost] = useState(false);

  const [selectedScore, setSelectedScore] = useState("avgScore");
  const [selectedHostId, setSelectedHostId] = useState(null); // State to store the selected host_id for the popup

  // Fetch neighborhoods based on selected neighborhood group
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (neighborhoodGroup !== "Any") {
        try {
          const response = await fetch(
            `http://${config.server_host}:${
              config.server_port
            }/neighborhoods?neighborhoodGroup=${encodeURIComponent(
              neighborhoodGroup
            )}`
          );
          const data = await response.json();
          setNeighborhoods(data);
        } catch (error) {
          console.error("Failed to fetch neighborhood list", error);
        }
      }
    };
    fetchNeighborhoods();
  }, [neighborhoodGroup]);

  // Fetch hosts based on selected neighborhood and neighborhood group
  const fetchHosts = async () => {
    let url = `http://${config.server_host}:${config.server_port}/star_host`;
    if (neighborhoodGroup !== "Any") {
      url += `?neighborhood_group=${encodeURIComponent(neighborhoodGroup)}`;
      if (neighborhood !== "Any") {
        url += `&neighborhood=${encodeURIComponent(neighborhood)}`;
      }
      url += `&super_host=${encodeURIComponent(superHost)}`;
    } else {
      url += `?super_host=${encodeURIComponent(superHost)}`;
    }
    
  
    console.log(url)
    try {
      const response = await fetch(url);
      const data = await response.json();

           // Calculate composite score for each host based on aggregated review data
          // Map each host to include an id property
      const processedHostData = data.map((host) => ({
        id: host.host_id, // Using host_id as the unique identifier
        ...host,
        avgScore: calculateAvgScore(host), 
        locScore: calculateLocScore(host), 
        cleanScore: calculateCleanScore(host), 
        valScore: calculateValScore(host), 
      }));
      processedHostData.sort((a, b) => b[selectedScore] - a[selectedScore]);
      setHostData(processedHostData);
      
    } catch (error) {
      console.error("Failed to fetch host data", error);
    }
  };


  const calculateAvgScore = (host) => {
    const { num, rating, accuracy, communication, clean, location, value } = host;
    // Calculate the composite score using your desired formula
    const avgScore = num * 14.3 / 5000 + (rating + accuracy + communication + clean + location + value) * 14.3 / 5;
    // Return the calculated composite score
    return parseFloat(avgScore.toFixed(2)); // Format the score to display only two decimal places
  };

  const calculateLocScore = (host) => {
    const { num, rating, accuracy, communication, clean, location, value } = host;
    // Calculate the composite score using your desired formula
    const locScore = location * 8 + num /500 + (rating + accuracy + communication + clean + value) * 2;
    // Return the calculated composite score
    return parseFloat(locScore.toFixed(2)); // Format the score to display only two decimal places
  };

  const calculateCleanScore = (host) => {
    const { num, rating, accuracy, communication, clean, location, value } = host;
    // Calculate the composite score using your desired formula
    const cleanScore = clean * 8 + num / 500 + (rating + accuracy + communication + location + value) * 2;
    // Return the calculated composite score
    return parseFloat(cleanScore.toFixed(2)); // Format the score to display only two decimal places
  };

  const calculateValScore = (host) => {
    const { num, rating, accuracy, communication, clean, location, value } = host;
    // Calculate the composite score using your desired formula
    const valScore = value * 8 + num / 500 + (rating + accuracy + communication + location + clean) * 2;
    // Return the calculated composite score
    return parseFloat(valScore.toFixed(2)); // Format the score to display only two decimal places
  };



  // Handle search button click
  const handleSearch = () => {
    fetchHosts();
  };

  const handleScoreChange = (event) => {
    setSelectedScore(event.target.value);
  };
  
  const columns = [
    {
      field: "super_host",
      headerName: "Super Host ",
      width: 130,
      renderCell: (params) => (
        params.value === 1 ? (
          <span style={{ color: 'gold' }}>⭐</span>
        ) : " "
      ),
    },

    {
      field: "host_name",
      headerName: "Host Name",
      width: 400,
      renderCell: (params) => (
        <Link onClick={() => setSelectedHostId(params.row.host_id)}>
          {params.value}
        </Link>
      ),
    },
    {
      field: selectedScore,
      headerName: (
        <FormControl fullWidth style={{ minWidth: '200px'}}> {/* Adjust the width here */}
          <InputLabel>What to you matter most?</InputLabel>
          <Select
          value={selectedScore}
          onChange={(e) => setSelectedScore(e.target.value)}
          style={{ minWidth: '100%' }} // Adjust the width here
        >
            <MenuItem value="avgScore">Overall</MenuItem>
            <MenuItem value="locScore">Location</MenuItem>
            <MenuItem value="cleanScore">Cleanliness</MenuItem>
            <MenuItem value="valScore">Value</MenuItem>
          </Select>
        </FormControl>
      ),
      width: 500,
    },
  ];

  return (
    <Container>
      {selectedHostId && (
        <HostListing
          hostId={selectedHostId}
          handleClose={() => setSelectedHostId(null)}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          
          <div style={{ padding: "50px" }}>
            <FormControl fullWidth>
              <InputLabel>Neighborhood Group</InputLabel>
              <Select
                value={neighborhoodGroup}
                label="Neighborhood Group"
                onChange={(e) => setNeighborhoodGroup(e.target.value)}
              >
                <MenuItem value="Any">Any</MenuItem>
                <MenuItem value="Bronx">Bronx</MenuItem>
                <MenuItem value="Brooklyn">Brooklyn</MenuItem>
                <MenuItem value="Manhattan">Manhattan</MenuItem>
                <MenuItem value="Queens">Queens</MenuItem>
                <MenuItem value="Staten Island">Staten Island</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div style={{ padding: "50px" }}>
            <FormControl fullWidth>
              <InputLabel>Neighborhood</InputLabel>
              <Select
                value={neighborhood}
                label="Neighborhood"
                onChange={(e) => setNeighborhood(e.target.value)}
                disabled={neighborhoodGroup === "Any"}
              >
                <MenuItem value="Any">Any</MenuItem>
                {neighborhoods.map((neighborhood, index) => (
                  <MenuItem key={index} value={neighborhood}>
                    {neighborhood}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <div style={{ padding: "20px" }}>
                <FormControlLabel
                  label='SuperHost'
                  control={<Checkbox checked={superHost} onChange={(e) => setSuperHost(e.target.checked)} />}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <div style={{ padding: "20px" }}>
                <Button onClick={handleSearch} variant="contained" color="primary">
                  Search
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>

      <h2>Star Host</h2>
      <Grid container spacing={2}>
    
      </Grid>
      <DataGrid
        rows={hostData}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}