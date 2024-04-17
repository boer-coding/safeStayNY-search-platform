import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function HostListing({ hostId, handleClose }) {
  const [listingData, setListingData] = useState({});
  const [loading, setLoading] = useState(true);

  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/host_listing/host_id=${hostId}`);
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
        <h2>Host Listings</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <ul>
          {listingData.map((listingData) => (
            <li key={listingData.listing_id}>
              <strong>Listing ID:</strong> {listingData.listing_id}<br />
              <strong>Description:</strong> {listingData.listing_des}<br />
              <strong>URL:</strong> <a href={listingData.listing_url} target="_blank" rel="noopener noreferrer">{listingData.listing_url}</a>
            </li>
          ))}
        </ul>
      )}
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );


}
