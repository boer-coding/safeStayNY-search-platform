import { useEffect, useState, useRef } from "react";
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
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListingCard from "../components/ListingCard";
import NeighborhoodInfo from "../components/NeighborhoodInfo";
import { useNavigate } from "react-router-dom";
// import { CrimePage } from "./CrimePage";

const config = require("../config.json");
// const navigate = useNavigate();

//query neighborhood group, nb, accommodate, days, room-type, bed, bath
export function RecommendationPage() {
  const [pageSize, setPageSize] = useState(10);

  //state hooks for fetching
  const [recommendationData, setRecommendation] = useState([]);
  const [neighborhoodData, setNeighborhoods] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);

  //necessary filters
  const [neighborhoodGroup, setNeighborhoodGroup] = useState("Any");
  const [neighborhood, setNeighborhood] = useState("Any");
  const [accommodates, setAccommodates] = useState(1);
  const [stayLength, setStayLength] = useState(2);

  //additional filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [price, setPriceRange] = useState([1, 100000]);
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  //redirects
  const [selectedListingId, setSelectedListingId] = useState(null);
  // const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  //content display
  const [showResults, setShowResults] = useState(false);

  //handleChange
  const handleNeighborhoodGroupChange = (event) => {
    // console.log("neighborhoodGroup changed");
    setNeighborhoodGroup(event.target.value);
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

  const handlePriceChange = (event, newValue) => {
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

  // const handleNeighborhoodClick = (locationId) => {
  //   navigate(`/crime?locationId=${locationId}`);
  // };

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

  //fetch one feature listing base on neighborhood group
  const fetchFeatureListing = async () => {
    fetch(`http://${config.server_host}:${config.server_port}/feature_listing`)
      .then((res) => res.json())
      .then((resJson) => {
        const featuredListings = resJson.flat().map((airbnb) => ({
          id: airbnb.listing_id,
          ...airbnb,
        }));
        setFeaturedListings(featuredListings);
      })
      .catch((error) => {
        console.error("Failed to fetch feature listing", error);
      });
  };

  //fetch recommendation listing base on filters
  const search = () => {
    console.log("Search initiated with filters:", {
      neighborhoodGroup,
      neighborhood,
      accommodates,
      stayLength,
      roomType,
      priceLow: price[0],
      priceHigh: price[1],
      beds,
      bathrooms,
    });
    const queryParams = new URLSearchParams({
      neighborhoodGroup,
      neighborhood,
      accommodates,
      stayLength,
      roomType,
      priceLow: price[0],
      priceHigh: price[1],
      beds,
      bathrooms,
    });

    fetch(
      `http://${config.server_host}:${config.server_port}/recommendations?
        ${queryParams.toString()}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        const recommendationData = resJson.map((a) => ({
          id: a.listing_id,
          ...a,
        }));
        setRecommendation(recommendationData);
        setShowResults(true);
      })
      .catch((error) => {
        console.error("Failed to fetch recommendation", error);
      });
  };

  //always apply fetch neighborhoods, feature listing
  useEffect(() => {
    fetchFeatureListing();
    fetchNeighborhoods();
  }, [neighborhoodGroup]);

  const columns = [
    {
      field: "listing_des",
      headerName: "Recommended Stay",
      width: 500,
      renderCell: (params) => (
        <Link onClick={() => setSelectedListingId(params.row.listing_id)}>
          {params.value}
        </Link>
      ),
    },
    {
      field: "neighborhoodGroup",
      width: 300,
      // renderCell: (params) => params.row.neighborhood,
      renderCell: (params) => `${params.row.neighborhoodGroup}`,
    },
    {
      field: "neighborhood,",
      headerName: "Neighborhood",
      width: 300,
      // renderCell: (params) => params.row.neighborhood,
      renderCell: (params) => {
        console.log(params.row);
        // const neighborhoodGroup = params.row.neighborhood_group || "Any";
        return (
          <NeighborhoodInfo
            neighborhood={params.row.neighborhood}
            neighborhoodGroup={params.row.neighborhoodGroup}
          />
        );
      },
    },
    {
      field: "crime.crime_rate",
      headerName: "Crime Rate",
      width: 175,
      renderCell: (params) => `${params.row.crime_rate.toFixed(3)}%`,
    },
    {
      field: "price,",
      headerName: "Price",
      width: 175,
      renderCell: (params) => `$${params.row.price}`,
    },
  ];

  return (
    <Container>
      {selectedListingId && (
        <ListingCard
          listingId={selectedListingId}
          handleClose={() => setSelectedListingId(null)}
        />
      )}
      {/* {setNeighborhood && <href neighborhoodId={selectedNeighborhood} />} */}
      <h2>Find Your Safe Stay at NY!</h2>
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
                <MenuItem key={index} value={item}>
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
                <div style={{ padding: "20px" }}>
                  <Typography>
                    Price range: ${price[0]} - $
                    {price[1] === 1000 ? "1000+" : `${price[1]}`}
                  </Typography>
                </div>
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
              <div style={{ padding: "20px" }}>
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
              </div>
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
      {/* dynamically show search results */}
      {showResults && (
        <>
          <h2>Here is a list of stays ranked by crime rate:</h2>

          <DataGrid
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#124116",
                fontSize: "1rem",
                fontWeight: "bold",
              },
            }}
            rows={recommendationData}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
          />
        </>
      )}
      {/* show featuredListings */}
      <Box
        sx={{
          mt: showResults ? 5 : 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          // justifyContent: "space-around",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>Featured Listings</h2>
          </Grid>
          {featuredListings.map((listing, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                key={index}
                elevation={3}
                sx={{
                  mb: 2,
                  p: 2,
                  flexShrink: 0,
                  flexGrow: 1,
                  height: 330,
                  // maxWidth: "calc(33.333% - 16px)",
                  backgroundColor: "#f5fbfe",
                }}
              >
                <h2>{listing.neighborhood_group}</h2>
                <Box
                  component="img"
                  sx={{
                    height: 233,
                    width: "100%",
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                  }}
                  alt={`Listing image for ${listing.neighborhood_group}`}
                  src={`/feature_listing/${listing.neighborhood_group}.jpeg`}
                />{" "}
                <Link href={listing.listing_url} target="_blank" rel="noopener">
                  <Typography>{listing.listing_des}</Typography>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
