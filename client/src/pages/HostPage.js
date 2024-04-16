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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SongCard from "../components/SongCard";

const config = require("../config.json");

export function HostPage() {
  const [pageSize, setPageSize] = useState(10);
  const [hostData, setHost] = useState([]);
  const [selectedHostId, setSelectedHostId] = useState(null);

  const [listing_count, setListingCount] = useState([1, 4]);
  const [review_num, setReviewNum] = useState([0, 550]);
  const [review_rating, setReviewRating] = useState([0, 5]);
  const [review_accuracy, setReviewAccuracy] = useState([0, 5]);
  const [review_clean, setReviewClean] = useState([0, 5]);
  const [review_checkin, setReviewCheckin] = useState([0, 5]);
  const [review_communication, setReviewCommunication] = useState([0, 5]);
  const [review_location, setReviewLocation] = useState([0, 5]);
  const [review_value, setReviewValue] = useState([0, 5]);
  const [review_pmonth, setReviewPmonth] = useState([0, 6.5]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/list_host`)
      .then((res) => res.json())
      .then((resJson) => {
        const hostId = resJson.map((host) => ({ id: host.host_id, ...host }));
        setHost(hostId);
      });
  }, []);

  const search = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/list_host?
    &count_low=${listing_count[0]}&count_high=${listing_count[1]}` +
        `&num_low=${review_num[0]}&num_high=${review_num[1]}` +
        `&rating_low=${review_rating[0]}&rating_high=${review_rating[1]}` +
        `&accuracy_low=${review_accuracy[0]}&accuracy_high=${review_accuracy[1]}` +
        `&clean_low=${review_clean[0]}&clean_high=${review_clean[1]}` +
        `&checkin_low=${review_checkin[0]}&checkin_high=${review_checkin[1]}` +
        `&communication_low=${review_communication[0]}&communication_high=${review_communication[1]}` +
        `&location_low=${review_location[0]}&location_high=${review_location[1]}` +
        `&value_low=${review_value[0]}&value_high=${review_value[1]}` +
        `&pmonth_low=${review_pmonth[0]}&pmonth_high=${review_pmonth[1]}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const hostId = resJson.map((host) => ({ id: host.host_id, ...host }));
        setHost(hostId);
      });
  };

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    {
      field: "host_id",
      headerName: "host_id",
      width: 300,
      renderCell: (params) => (
        <Link onClick={() => setSelectedHostId(params.row.host_id)}>
          {params.value}
        </Link>
      ),
    },
    { field: "host_name", headerName: "host_name" },
    { field: "listing_count", headerName: "listing_count" },
    { field: "review_count", headerName: "review_count" },
    { field: "avg_rating", headerName: "avg_rating" },
    { field: "avg_accuracy", headerName: "avg_accuracy" },
    { field: "avg_clean", headerName: "avg_clean" },
    { field: "avg_checkin", headerName: "avg_checkin" },
    { field: "avg_communication", headerName: "avg_communication" },
    { field: "avg_location", headerName: "avg_location" },
    { field: "avg_value", headerName: "avg_value" },
    { field: "avg_pmonth", headerName: "avg_pmonth" },
  ];

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {selectedHostId && (
        <SongCard
          songId={selectedHostId}
          handleClose={() => setSelectedHostId(null)}
        />
      )}

      <h2>Search Songs</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <p>listing_count</p>
          <Slider
            value={listing_count}
            min={1}
            max={4}
            step={1}
            onChange={(e, newValue) => setListingCount(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_count</p>
          <Slider
            value={review_num}
            min={0}
            max={550}
            step={10}
            onChange={(e, newValue) => setReviewNum(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_rating</p>
          <Slider
            value={review_rating}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewRating(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_accuracy</p>
          <Slider
            value={review_accuracy}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewAccuracy(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_clean</p>
          <Slider
            value={review_clean}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewClean(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_checkin</p>
          <Slider
            value={review_checkin}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewCheckin(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_communication</p>
          <Slider
            value={review_communication}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewCommunication(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_location</p>
          <Slider
            value={review_location}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewLocation(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_value</p>
          <Slider
            value={review_value}
            min={0}
            max={5}
            step={0.1}
            onChange={(e, newValue) => setReviewValue(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={6}>
          <p>review_pmonth</p>
          <Slider
            value={review_pmonth}
            min={0}
            max={6.5}
            step={0.1}
            onChange={(e, newValue) => setReviewPmonth(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
      <Button
        onClick={() => search()}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
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
