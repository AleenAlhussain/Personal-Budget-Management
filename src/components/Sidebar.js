import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentIcon from "@mui/icons-material/Assessment";

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : undefined}
      onClose={isMobile ? onClose : undefined}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#003a66",
          color: "#fff",
        },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      )}
      <Typography variant="h6" sx={{ padding: 2, color: "#fff" }}>
        Budget Management
      </Typography>
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          sx={{ padding: 2, color: "#fff" }}
          onClick={onClose}
        >
          <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
          {isMobile && <ChevronRightIcon sx={{ color: "#fff" }} />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/transactions"
          sx={{ padding: 2, color: "#fff" }}
          onClick={onClose}
        >
          <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
          {isMobile && <ChevronRightIcon sx={{ color: "#fff" }} />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/reports"
          sx={{ padding: 2, color: "#fff" }}
          onClick={onClose}
        >
          <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
          {isMobile && <ChevronRightIcon sx={{ color: "#fff" }} />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
