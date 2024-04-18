import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Modal } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function HostListing({ hostId, handleClose }) {
  const [listingData, setListingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/host_listing?host_id=${hostId}`);
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

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h2><a href={listingData.length > 0 ? listingData[0].host_url : '#'} target="_blank" rel="noopener noreferrer">{listingData.length > 0 ? listingData[0].host_name : 'Unknown'}</a> Listings</h2>

        {loading ? (
          <CircularProgress />
        ) : (
          <ul>
            {Array.isArray(listingData) && listingData.length > 0 ? (
              listingData.map((listing) => (
                <li key={listing.listing_id}>
                  <a href={listing.listing_url} target="_blank" rel="noopener noreferrer">{listing.listing_des}<br /></a>
                </li>
              ))
            ) : (
              <li>No listings found</li>
            )}
          </ul>
        )}
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
