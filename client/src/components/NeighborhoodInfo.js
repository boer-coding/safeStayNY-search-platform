import React from "react";
// import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";

function NeighborhoodInfo({ neighborhood, neighborhoodGroup }) {
  const url = `/crime?neighborhoodGroup=${encodeURIComponent(
    neighborhoodGroup
  )}&neighborhood=${encodeURIComponent(neighborhood)}`;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      {neighborhood}
    </Link>
  );
}

export default NeighborhoodInfo;
