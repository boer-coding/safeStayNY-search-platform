import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import logo from './logo.svg';

function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? "h5" : "h7"}
      noWrap
      style={{
        marginRight: "30px",
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".3rem",
      }}
    >
      <NavLink
        to={href}
        style={{
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={logo} alt="logo" style={{ marginRight: "10px", height: "55px" }} />
          <NavText href="/" text="SafeStayNY" isMain />
          <NavText href="/albums" text="Crime" />
          <NavText href="/hosts" text="Host" />
          <NavText href="/recommendations" text="Recommendations" />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
