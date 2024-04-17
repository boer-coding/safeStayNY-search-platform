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
// import SongCard from "../components/SongCard";

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
  const handleAccommodatesChange = (event) => {
    const value = event.target.value;
    setAccommodates(value === "8+" ? 8 : value);
  };
  const handleStayLengthChange = (event) => {
    const value = event.target.value;
    setStayLength(value === "8+" ? 8 : value);
  };
  const handleRoomTypeChange = (event) => {
    // console.log("rommtype changed");
    setRoomType(event.target.value);
  };
  // const handlePriceChange = (event) => {
  //   // const value = event.target.value;
  //   // setPriceRange(value === "1000+" ? 1000 : value);
  //   setPriceRange(event.target.value);
  // };
  const handlePriceChange = (event, newValue) => {
    // newValue is an array: [minPrice, maxPrice]
    setPriceRange(newValue);
  };

  const handleBedsChange = (event) => {
    const value = event.target.value;
    setBeds(value === "8+" ? 8 : value);
  };
  const handleBathroomsChange = (event) => {
    const value = event.target.value;
    setBathrooms(value === "8+" ? 8 : value);
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
      `http://${config.server_host}:${config.server_port}/crime?
        ${queryParams.toString()}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const recommendationData = resJson.map((a) => ({
          id: a.listing_id,
          ...a,
        }));
        setRecommendation(recommendationData);
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
    accommodates,
    stayLength,
    roomType,
    price[0],
    price[1],
    beds,
    bathrooms,
  ]);

  const columns = [
    {
      field: "listing_des",
      headerName: "Recommended Stay",
      width: 600,
      renderCell: (params) => (
        <Link
          onClick={() => setSelectedRecommendationId(params.row.listing_id)}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "neighborhood,",
      headerName: "Neighborhood",
      width: 180,
      renderCell: (params) => params.row.neighborhood,
    },
    {
      field: "safety.safety_score",
      headerName: "Safety",
      width: 180,
      renderCell: (params) => params.row.safety_score,
    },
    {
      field: "price,",
      headerName: "Price",
      width: 180,
      renderCell: (params) => params.row.price,
    },
  ];

  return (
    <Container>
      {/* {setSelectedRecommendationId && (
        <SongCard
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

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Guests</InputLabel>
            <Select
              value={accommodates}
              label="Guests"
              onChange={handleAccommodatesChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={"8+"}>8+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Stay Length</InputLabel>
            <Select
              value={stayLength}
              label="Stay Length"
              onChange={handleStayLengthChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={"8+"}>8+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          {/* <h3>Additional Filters</h3> */}
          <Button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            {showAdvancedFilters
              ? "Hide Advanced Filters"
              : "Show Advanced Filters"}
          </Button>
          {showAdvancedFilters && (
            <>
              <Grid item xs={12}>
                <Typography>
                  Price range: ${price[0]} - $
                  {price[1] === 1000 ? "1000+" : `${price[1]}`}
                </Typography>
                <Slider
                  value={price}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={1}
                  max={1000}
                  marks={[
                    { value: 1, label: "$1" },
                    { value: 250, label: "$250" },
                    { value: 500, label: "$500" },
                    { value: 750, label: "$750" },
                    { value: 1000, label: "$1000+" },
                  ]}
                />
              </Grid>
              <Grid container spacing={6}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={roomType}
                      label="Room Type"
                      onChange={handleRoomTypeChange}
                    >
                      <MenuItem value={"Entire home/apt"}>
                        Entire home/apt
                      </MenuItem>
                      <MenuItem value={"Hotel room"}>Hotel room</MenuItem>
                      <MenuItem value={"Private room"}>Private room</MenuItem>
                      <MenuItem value={"Shared room"}>Shared room</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Beds</InputLabel>
                    <Select
                      value={beds}
                      label="Beds"
                      onChange={handleBedsChange}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={"8+"}>8+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Bathrooms</InputLabel>
                    <Select
                      value={bathrooms}
                      label="Bathrooms"
                      onChange={handleBathroomsChange}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={"8+"}>8+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
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
        rows={recommendationData}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
