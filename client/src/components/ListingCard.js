import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Modal } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { NavLink } from "react-router-dom";

import { formatDuration } from "../helpers/formatter";
const config = require("../config.json");

export default function ListingCard({ listingId, handleClose }) {
  const [listingData, setListingData] = useState({});

  useEffect(() => {
    console.log(listingId);
    const fetchListing = async () => {
      const url = `http://${config.server_host}:${config.server_port}/listing?listing_id=${listingId}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setListingData(data);
      } catch (error) {
        console.error("Failed to fetch neighborhood list", error);
      }
    };
    fetchListing();
  }, [listingId]);

  //room type, beds, bath, url
  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        p={3}
        style={{
          background: "white",
          borderRadius: "16px",
          border: "2px solid #000",
          width: 600,
        }}
      >
        <h1>{listingData.listingId}</h1>
        <p>
          <strong>
            Room Type:
            <strong /> {listingData.room_type}
          </strong>
        </p>
        <p>
          <strong>
            Beds:
            <strong /> {listingData.beds}
          </strong>
        </p>
        <p>
          <strong>
            Bathrooms:
            <strong /> {listingData.bathrooms}
          </strong>
        </p>
        <p>
          <strong>
            <strong />
            <a
              href={listingData.listing_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Listing
            </a>
          </strong>
        </p>
        <p>
          <strong>
            <strong />
            <a
              href={`http://${config.server_host}:3000/list_host`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Host
            </a>
          </strong>
        </p>

        <div style={{ margin: 20 }}>{}</div>
        <Button
          onClick={handleClose}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
