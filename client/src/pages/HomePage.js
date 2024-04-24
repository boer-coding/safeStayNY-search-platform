import { useEffect, useState } from "react";
import { Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import Carousel from "../components/Carousel";
import "../app.css";

import LazyTable from "../components/LazyTable";
const config = require("../config.json");

export default function HomePage() {
  const [appAuthor, setAppAuthor] = useState("");
  const position = { lat: 40.6970192, lng: -74.3093451 };
  const sliderData = [
    {
      name: "ny1",
      image:
        "https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Embrace the life of being a New Yorker.",
    },
    {
      name: "ny2",
      image:
        "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "A comprehensive analysis of New York's safety.",
    },
    {
      name: "safety",
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Your safety matters to us. ",
    },
    {
      name: "airbnb",
      image:
        "https://images.pexels.com/photos/10511470/pexels-photo-10511470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Provide insights into excellent Airbnb hosts.",
    },
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
    },
  ];

  return (
    <Container>
      {/* Image slider*/}
      <div>
        {" "}
        <Carousel images={sliderData} />
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
        We slected poppular and the safetest neighborhoods for you! Check
        detailed listings <NavLink to="/recommendations">here</NavLink>.
      </p>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top_5_neighbors`}
        columns={top5Neighbors}
        defaultPageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Divider />
      <Container class="map-container">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.0361875295!2d-74.30934563260514!3d40.69753994303477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1713945864592!5m2!1sen!2sus" 
        width="1000" height="450" 
        style= {{border: "0"}}
        allowfullscreen="" 
        loading="lazy" 
        eferrerpolicy="no-referrer-when-downgrade"></iframe>
      </Container>
      {/* app authors */}
      <p style={{ fontWeight: "bold" }}>{appAuthor}</p>
    </Container>
  );
}
