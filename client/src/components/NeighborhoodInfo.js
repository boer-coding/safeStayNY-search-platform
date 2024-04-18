import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";

function NeighborhoodInfo({ neighborhood, neighborhoodGroup }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/crime?neighborhoodGroup=${encodeURIComponent(
        neighborhoodGroup
      )}&neighborhood=${encodeURIComponent(neighborhood)}`
    );
  };

  return <Link onClick={handleClick}>{neighborhood}</Link>;
}

export default NeighborhoodInfo;
