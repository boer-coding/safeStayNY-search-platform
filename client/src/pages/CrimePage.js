import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import HostListing from "../components/HostListing";

const config = require("../config.json");

//query neighborhood group, nb, accommodate, days, room-type, bed, bath
export function CrimePage() {
  const [pageSize, setPageSize] = useState(10);

  //state hooks for fetching
  const [crimeData, setCrimeData] = useState([]);
  const [neighborhoodData, setNeighborhoods] = useState([]);

  //necessary filters
  const [neighborhoodGroup, setNeighborhoodGroup] = useState("Any");
  const [neighborhood, setNeighborhood] = useState("Any");
  //const [accommodates, setAccommodates] = useState(1);
  //const [stayLength, setStayLength] = useState(2);

  //additional filters
  //const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  //const [roomType, setRoomType] = useState("");
  //const [price, setPriceRange] = useState([0, 100000]);
  //const [beds, setBeds] = useState("");
  //const [bathrooms, setBathrooms] = useState("");

  //redirects
  //const [selectedRecommendationId, setSelectedRecommendationId] =    useState(null);

  //handleChange
  const handleNeighborhoodGroupChange = (event) => {
    setNeighborhoodGroup(event.target.value);
    // If 'Any' is selected for neighborhoodGroup, set neighborhood to 'Any' as well
    if (event.target.value === "Any") {
      setNeighborhood("Any");
    }
  };
  const handleNeighborhoodChange = (event) => {
    setNeighborhood(event.target.value);
  };

  //fetch neighborhoods base on neighborhood group
  const fetchNeighborhoods = async () => {
    const url = `http://${config.server_host}:${config.server_port}/neighborhoods?neighborhoodGroup=${encodeURIComponent(neighborhoodGroup)}`;
    // const url = `http://${config.server_host}:${config.server_port}/neighborhoods`;

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
      neighborhood
    });
    const queryParams = new URLSearchParams({
      neighborhoodGroup,
      neighborhood
    });

    fetch(
      `http://${config.server_host}:${config.server_port}/crime?${queryParams.toString()}`
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
  };


  //fetch recs based on filter
  useEffect(() => {
    fetchNeighborhoods();
    search();
  }, [
    neighborhoodGroup,
    neighborhood,
    
  ]);

  const columns = [
    {
      field: "listing_des",
      headerName: "Recommended Stay",
      width: 600,
      renderCell: (params) => (
        <Link
          
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "neighborhood,",
      headerName: "Neighborhood",
      width: 180,
      renderCell: (params) => params.row.location_id,
    },
    {
      field: "safety.safety_score",
      headerName: "Safety",
      width: 180,
      renderCell: (params) => params.row.ofns_type,
    },
    {
      field: "price,",
      headerName: "Price",
      width: 180,
      renderCell: (params) => params.row.offense_count,
    },
  ];

  return (
    <Container>
      {/* {setSelectedRecommendationId && (
        <HostListing
          songId={selectedRecommendationId}
          handleClose={() => setSelectedRecommendationId(null)}
        />
      )} */}

      <h2>Filters</h2>
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

        

        
      </Grid>
      <Button
        onClick={() => search()}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        Search
      </Button>
      <h2>Recommended Stays</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={crimeData}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
