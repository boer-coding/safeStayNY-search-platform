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
  LinearProgress,
  Typography
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
      
    const queryParams = [];
  
    if (neighborhoodGroup !== "Any") {
      queryParams.push(`neighborhood_group=${encodeURIComponent(neighborhoodGroup)}`);
      if (neighborhood !== "Any") {
        queryParams.push(`neighborhood=${encodeURIComponent(neighborhood)}`);
      }
    }
  
    
      queryParams.push(`super_host=true`);
  
  
    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }
  
    console.log(url);
    
    
  
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
        acScore: calculateAcScore(host), 
        cleanScore: calculateCleanScore(host), 
        valScore: calculateValScore(host), 
        comScore: calculateComScore(host),
      }));
      processedHostData.sort((a, b) => b[selectedScore] - a[selectedScore]);
      setHostData(processedHostData);
      
    } catch (error) {
      console.error("Failed to fetch host data", error);
    }
  };

    // Fetch hosts based on selected neighborhood and neighborhood group
    const fetchHosts2 = async () => {

        let url = `http://${config.server_host}:${config.server_port}/star_host`;
      
        const queryParams = [];
      
        if (neighborhoodGroup !== "Any") {
          queryParams.push(`neighborhood_group=${encodeURIComponent(neighborhoodGroup)}`);
          if (neighborhood !== "Any") {
            queryParams.push(`neighborhood=${encodeURIComponent(neighborhood)}`);
          }
        }
      
     
          queryParams.push(`super_host=${encodeURIComponent(superHost)}`);
        
      
        if (queryParams.length > 0) {
          url += `?${queryParams.join("&")}`;
        }
      
        console.log("2", url);
      
      try {
        const response = await fetch(url);
        const data = await response.json();
  
             // Calculate composite score for each host based on aggregated review data
            // Map each host to include an id property
        const processedHostData = data.map((host) => ({
          id: host.host_id, // Using host_id as the unique identifier
          ...host,
          avgScore: calculateAvgScore(host), 
          acScore: calculateAcScore(host), 
          cleanScore: calculateCleanScore(host), 
          valScore: calculateValScore(host), 
          comScore: calculateComScore(host),
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

  const calculateComScore = (host) => {
    const { num, rating, accuracy, communication, clean, location, value } = host;
    // Calculate the composite score using your desired formula
    const comScore = communication * 8 + num /500 + (rating + accuracy + location + clean + value) * 2;
    // Return the calculated composite score
    return parseFloat(comScore.toFixed(2)); // Format the score to display only two decimal places
  };

  const calculateAcScore = (host) => {
    const {num, rating, accuracy, communication, clean, location, value } = host;
    // Calculate the composite score using your desired formula
    const acScore = accuracy * 8 + num /500 + (rating + location + communication + clean + value) * 2;
    // Return the calculated composite score
    return parseFloat(acScore.toFixed(2)); // Format the score to display only two decimal places
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
    setSuperHost(false);
  };
  
  const ScoreBar = ({ value }) => {
    const maxValue = 10;
    const width = (value / maxValue) * 100;
  
    return (
      <div>
        <LinearProgress
          variant="determinate"
          value={value}
          style={{ width: `${width}%`, height: 20 }}
        />
      <Typography variant="body2" align="center" style={{ color: "#002884" }}>
          {value}
        </Typography>
      </div>
    );
  };
  const columns = [
    {
      field: "super_host",
      headerName: 
      <FormControlLabel
      label='SuperHost'
      control={<Checkbox
        checked={superHost}
        onChange={(e) => {
          setSuperHost(e.target.checked)
          fetchHosts2();
     // Trigger the search immediately after updating superHost state
        }}
      />}
    />,
      width: 200,
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
          <Select
          value={selectedScore}
          onChange={(e) => setSelectedScore(e.target.value)}
          style={{ minWidth: '100%' }} // Adjust the width here
        >
            <MenuItem value="avgScore">Overall</MenuItem>
            <MenuItem value="acScore">Accuracy</MenuItem>
            <MenuItem value="cleanScore">Cleanliness</MenuItem>
            <MenuItem value="comScore">Communication</MenuItem>
            <MenuItem value="valScore">Value</MenuItem>
          </Select>
        </FormControl>
      ),
      width: 500,
      renderCell: (params) => <ScoreBar value={params.value} />,
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
  <h2>Discover hosts who prioritize what matters most to you!</h2>
  {/* filters */ }
  <Grid container spacing={2} justifyContent="center">
    {/* filter 1 */ }
    <Grid item xs={4}>
      <div style={{ padding: "20px" }}>
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
     {/* filter 1 */ }
    <Grid item xs={4}>
      <div style={{ padding: "20px" }}>
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
          {/* search handle */ }
          <Grid item xs={4}>
        <div style={{ padding: "20px" }}>
          <Button onClick={handleSearch} variant="contained" color="primary">
            Search
          </Button>
        </div>
    </Grid>
  </Grid>



<h4>Select the factors:</h4>
  
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