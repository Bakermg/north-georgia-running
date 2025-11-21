"use client";

import { Container, Typography, Box, Paper } from "@mui/material";
import EventForm from "../_components/EventForm";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";

export default function PromotersPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navigation />
      
      <Box sx={{ flexGrow: 1, backgroundColor: "background.default", py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#2c3e50" }}>
              Promote Your Event
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "text.secondary", maxWidth: 600, mx: "auto" }}>
              Reach thousands of runners in North Georgia by listing your race with us.
            </Typography>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 3, 
              border: "1px solid rgba(0,0,0,0.08)",
              mb: 8 
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1, color: "#d97757" }}>
              Submit Your Race Details
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4, color: "text.secondary" }}>
              Fill out the form below to submit your event for review. Once approved, your race will be listed on our events calendar and searchable by our community.
            </Typography>
            
            <EventForm />
          </Paper>

          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: "center", mb: 4, color: "#2c3e50" }}>
              Why List With Us?
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
              {/* Targeted Audience Card */}
              <Box sx={{ 
                backgroundColor: "#d9e8f5", 
                p: 4, 
                borderRadius: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" }
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#2c3e50", fontWeight: 600 }}>
                  Targeted Audience
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
                  Connect directly with passionate runners looking for events in the North Georgia mountains and surrounding areas.
                </Typography>
              </Box>

              {/* Free Listing Card */}
              <Box sx={{ 
                backgroundColor: "#c8e6c9", 
                p: 4, 
                borderRadius: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" }
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#2c3e50", fontWeight: 600 }}>
                  Free Listing
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
                  Basic event listings are completely free. We believe in supporting the local running community.
                </Typography>
              </Box>

              {/* Easy Management Card */}
              <Box sx={{ 
                backgroundColor: "#fadadd", 
                p: 4, 
                borderRadius: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" }
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#2c3e50", fontWeight: 600 }}>
                  Easy Management
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
                  Simple submission process. Our team verifies all events to ensure quality and accuracy for our users.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
