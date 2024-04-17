import { useEffect, useState } from "react";
import { Container, Divider, Link } from "@mui/material";
import { NavLink } from "react-router-dom";

import LazyTable from "../components/LazyTable";
const config = require("../config.json");

export default function HomePage() {
  const [appAuthor, setAppAuthor] = useState("");

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
    {
      headerName: "Star Host",
    },
  ];

  return (
    <Container>
      {/* list saftest neighbors */}
      <h2>Top 5 Safetest Neighbors:&nbsp;</h2>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top_5_neighbors`}
        columns={top5Neighbors}
        defaultPageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
      <Divider />
      {/* app authors */}
      <p>{appAuthor}</p>
    </Container>
  );
}
