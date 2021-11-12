import s from "./Layout.module.css";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const Layout = ({ children }) => {
  return (
    <main className={s.mainRoot}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mapbox Training Sandbox
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </main>
  );
};
