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

  const [selectedHostId, setSelectedHostId] = useState(null); // State to store the selected host_id for the popup


  // Fetch neighborhoods based on selected neighborhood group
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (neighborhoodGroup !== "Any") {
        try {
          const response = await fetch(
            `http://${config.server_host}:${config.server_port}/neighborhoods?neighborhoodGroup=${encodeURIComponent(
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
    }
    try {
      const response = await fetch(url);
      const data = await response.json();

      setHostData(
        data.map((host) => ({ id: host.host_id, ...host }))
      );
    } catch (error) {
      console.error("Failed to fetch host data", error);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    fetchHosts();
  };

  const columns=[
    { field: "host_id", headerName: "Host ID", width: 160, renderCell: (params) => (
      <Link onClick={() => setSelectedHostId(params.row.host_id)}>{params.value}</Link>
  ),},
    { field: "host_name", headerName: "Host Name", width: 160 },
    { field: "neighborhood_group", headerName: "Neighborhood Group", width: 160 },
    { field: "neighborhood", headerName: "Neighborhood", width: 160 },
    { field: "review_count", headerName: "Count", width: 160 },
    { field: "avg_rating", headerName: "Average Rating", width: 10 },
  ];

  return (
    <Container>
      {selectedHostId && <HostListing hostId={selectedHostId} handleClose={() => setSelectedHostId(null)} />}
      <h2>Filters</h2>
        <Grid item xs={3}>
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
        </Grid>

      <Grid item xs={3}>
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
      </Grid>

      <Button onClick={handleSearch}>Search</Button>

      <h2>Star Host</h2>
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
