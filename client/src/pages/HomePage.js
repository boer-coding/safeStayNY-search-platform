import { useEffect, useState } from "react";
import { Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import Carousel from "../components/Carousel";
import { SliderData } from "../components/Data";
import "../app.css";
import {
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";

import LazyTable from "../components/LazyTable";
const config = require("../config.json");

export default function HomePage() {
  const [appAuthor, setAppAuthor] = useState("");
  const position = [
    { lat: 40.6970192, lng: -74.3093451 },
  ];

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then((res) => {
        return res.text();
      })
      .then((appAuthor) => {
        setAppAuthor(appAuthor);
      });
  }, [appAuthor]);

  const top5Neighbors = [
    {
      field: "neighborhood",
      headerName: "Neighborhood",
      renderCell: (row) => (
        <a
          href={`https://en.wikipedia.org/wiki/${row.neighborhood.replace(
            " ",
            "_"
          )},_${row.neighborhood_group}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.neighborhood}
        </a>
      ),
    },
    {
      field: "neighborhood_group",
      headerName: "Neighborhood Group",
      renderCell: (row) => (
        <a
          href={`https://en.wikipedia.org/wiki/${row.neighborhood_group}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.neighborhood_group}
        </a>
      ),
    }
  ];

  return (
    <Container>
      {/* Image slider*/}
      <div>
        {" "}
        <Carousel images={SliderData} />
      </div>
      <Container class="video-test-container">
        <div>
          <section id="video-test-container">
            <div>
              <iframe
                class="video-container"
                id="first viedo"
                width="450"
                height="374"
                src="https://www.youtube.com/embed/yD-CPM02GF0"
                title="NEW YORK - Cinematic Travel"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
            <div>
              <iframe
                class="video-container"
                width="450"
                height="374"
                src="https://www.youtube.com/embed/v86r22gGvRA?&si=nxA2Uy3KlPnz9a6h&amp;start=25"
                title="I LIKE ME BETTER WITH YOU"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </section>
        </div>
      </Container>

      {/* list saftest neighbors */}
      <h2>Top 5 Safetest Neighbors:&nbsp;</h2>
      <p>
        We slected poppular and the safetest neighborhoods for you! Check detailed listings <NavLink to="/recommendations">here</NavLink>.
      </p>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top_5_neighbors`}
        columns={top5Neighbors}
        defaultPageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Divider />
      <Container class="map-container">
        <APIProvider apiKey="AIzaSyCYHonDUWTua7kF363vtOtnp1aYtoRrvBM">
          <Map zoom={12} center={position[0]}>
          </Map>
        </APIProvider>
      </Container>
      {/* app authors */}
      <p style={{ fontWeight: 'bold' }}>{appAuthor}</p>
    </Container>
  );
}
