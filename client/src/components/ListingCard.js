import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Modal, Link } from "@mui/material";

import { NavLink } from "react-router-dom";

import { formatDuration } from "../helpers/formatter";
import HostListing from "./HostListing";
const config = require("../config.json");

export default function ListingCard({ listingId, handleClose }) {
  const [listingData, setListingData] = useState({});
  const [showHostDetail, setShowHostDetail] = useState(false);

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

  const handleViewHost = () => {
    setShowHostDetail(true);
  };

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
          background: "#e3f2fd",
          borderRadius: "16px",
          border: "2px solid #687785",
          width: "400",
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
            <Link
              href={listingData.listing_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Listing
            </Link>
          </strong>
        </p>
        <p>
          <strong>
            <strong />
            <Link
              href={listingData.host_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Host
            </Link>
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
