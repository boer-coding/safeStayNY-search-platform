import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Modal, Link } from "@mui/material";
const config = require("../config.json");
const serverUrl = process.env.NODE_ENV === "production" 
    ? config.production_server_url 
    : `http://${config.server_host}:${config.server_port}`;

export default function HostListing({ hostId, handleClose }) {
  const [listingData, setListingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 10;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          // `http://${config.server_host}:${config.server_port}/host_listing?host_id=${hostId}`
          `${serverUrl}/host_listing?host_id=${hostId}`
        );
        const data = await response.json();
        setListingData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [hostId]);

  // Logic to get current listings
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listingData.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log(listingData);

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
          border: "2px solid #000",
          width: 600,
        }}
      >
        <h2 style={{ display: "flex", alignItems: "center" }}>
          {/* Host image */}
          {currentListings.length > 0 && (
            <img
              src={currentListings[0].pic_url}
              alt="Host"
              style={{
                width: "30%",
                height: "auto",
                marginBottom: 20,
                marginRight: 20,
              }}
            />
          )}
          {/* Host link */}
          <div>
            <Link
              href={
                currentListings.length > 0 ? currentListings[0].host_url : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentListings.length > 0
                ? currentListings[0].host_name
                : "Unknown"}
            </Link>{" "}
            Listings
          </div>
        </h2>

        {loading ? (
          <CircularProgress />
        ) : (
          <ul>
            {Array.isArray(currentListings) && currentListings.length > 0 ? (
              currentListings.map((listing) => (
                <li key={listing.listing_id}>
                  <Link
                    href={listing.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {listing.listing_des}
                    <br />
                  </Link>
                </li>
              ))
            ) : (
              <li>No listings found</li>
            )}
          </ul>
        )}

        {/* Pagination buttons */}
        {listingData.length > listingsPerPage && (
          <Box mt={2}>
            {Array.from(
              { length: Math.ceil(listingData.length / listingsPerPage) },
              (_, i) => (
                <Button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  size="small" // Add this line to set the button size to small
                  style={{
                    minWidth: "unset",
                    margin: "0 3px",
                    padding: "4px 8px",
                  }} // Custom styles for button size
                >
                  {i + 1}
                </Button>
              )
            )}
          </Box>
        )}

        <Button
          onClick={handleClose}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "10px",
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
