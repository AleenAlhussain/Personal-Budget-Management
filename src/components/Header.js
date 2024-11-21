import { AppBar, Toolbar, IconButton, Badge, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Notifications } from "@mui/icons-material";

const Header = ({ handleDrawerOpen }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerOpen}
        >
          <MenuIcon sx={{ color: "#003a66" }} />
        </IconButton>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications sx={{ color: "#003a66" }} />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Avatar alt="User" src="/static/images/avatar/1.jpg" />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
