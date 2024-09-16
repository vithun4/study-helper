import Image from "next/image";
import { Toolbar, Button, Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <div>
      <Toolbar
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          border: '2px solid #3f51b5', // Blue outline
          backgroundColor: '#f5f5f5', // Light gray background
          padding: '10px', // Optional padding to make it look nicer
          borderRadius: '8px', // Optional: Rounding the corners of the outline
        }}
      >
        {/* You can add a logo or title here */}
        <Typography variant="h6" component="div">
          Study Helper
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none' }} // Removes uppercase text
        >
          Login
        </Button>
      </Toolbar>

      {/* Rest of your content */}
      <div>
        {/* Add your main content here */}
      </div>
    </div>
  );
}
