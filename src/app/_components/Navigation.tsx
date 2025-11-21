"use client";

import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session, status } = useSession();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {isMobile && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={Link} href="/">
                  Home
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/events">
                  All Events
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/promoters">
                  Promoters
                </MenuItem>
                {session ? (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      void signOut();
                    }}
                  >
                    Sign Out ({session.user?.name ?? session.user?.email})
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      void signIn("discord");
                    }}
                  >
                    Sign In
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
          <Box
            component={Link}
            href="/"
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              textDecoration: "none", 
              color: "inherit",
              gap: 1
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="North GA Running Logo"
              sx={{ height: 40, width: "auto" }}
            />
          </Box>
        </Box>

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button color="inherit" component={Link} href="/events">
              All Events
            </Button>
            <Button color="inherit" component={Link} href="/promoters">
              Promoters
            </Button>
            {status === "loading" ? (
              <Typography sx={{ ml: 2 }}>Loading...</Typography>
            ) : session ? (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Typography sx={{ mr: 1 }}>
                  {session.user?.name ?? session.user?.email}
                </Typography>
                <Button color="inherit" onClick={() => void signOut()}>
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Button
                color="inherit"
                onClick={() => void signIn("discord")}
                sx={{ ml: 2 }}
              >
                Sign In
              </Button>
            )}
          </Box>
        )}


      </Toolbar>
    </AppBar>
  );
}
