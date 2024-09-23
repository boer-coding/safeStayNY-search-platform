import { useEffect, useState } from "react";
import { Box, Button, Modal, Link } from "@mui/material";
import {
  Hotel,
  Bed,
  Bathtub,
  AttachMoney,
  Group,
  Event,
  Visibility,
  Person2,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const config = require("../config.json");
const serverUrl = process.env.NODE_ENV === "production" 
    ? config.production_server_url 
    : `http://${config.server_host}:${config.server_port}`;

export default function ListingCard({ listingId, handleClose }) {
  const [listingData, setListingData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log(listingId);
    const fetchListing = async () => {
      // const url = `http://${config.server_host}:${config.server_port}/listing?listing_id=${listingId}`;
      const url = `${serverUrl}/listing?listing_id=${listingId}`;

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
    navigate("/hosts", {
      state: { hostId: listingData.host_id, openModal: true },
    });
  };

  const [isHovered, setIsHovered] = useState(false);

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
          <Box display="flex" alignItems="center" gap={1}>
            <Hotel />
            <strong>Room Type:</strong>
            {listingData.room_type}
          </Box>
        </p>
        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <Bed />
            <strong>Beds:</strong>
            {listingData.beds}
          </Box>
        </p>
        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <Bathtub />
            <strong>Bathrooms:</strong>
            {listingData.bathrooms}
          </Box>
        </p>
        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoney />
            <strong>Price:</strong>${listingData.price}
          </Box>
        </p>
        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <Group />
            <strong>Accommodates:</strong>
            {listingData.accommodates}
          </Box>
        </p>
        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <Event />
            <strong>Stay Length:</strong>
            {listingData.mini_nights} - {listingData.max_nights} nights
          </Box>
        </p>

        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <Visibility />
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
          </Box>
        </p>
        <p>
          <Box display="flex" alignItems="center" gap={1}>
            <Person2 />
            <strong>
              <Button
                onClick={handleViewHost}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  backgroundColor: "transparent",
                  textDecoration: isHovered ? "underline" : "none",
                  color: isHovered ? "#124116" : "#2e7031",

                  padding: 0,
                  minWidth: 0,
                  boxShadow: "none",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "inherit",
                }}
                disableRipple
              >
                View Host
              </Button>
            </strong>
          </Box>
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
