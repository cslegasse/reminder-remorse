import { Add, People, Insights, TaskAlt, GitHub } from "@mui/icons-material";
import { Button, IconButton, Link, Paper, Stack, useTheme } from "@mui/material";
import Logo from "@/assets/logo96.png";
import { Link as RouterLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useResponsiveDisplay } from "@/hooks/useResponsiveDisplay";

export const ProductLogo = () => {
  const theme = useTheme();
  return (
    <Link
      component={RouterLink}
      to="/"
      aria-label="landing page"
      sx={{
        display: "flex",
        alignItems: "center",
        margin: 1,
      }}
    >
      <img
        src={Logo}
        width={70}
        height={70}
        alt="Reminder Remorse Logo"
        style={{
          borderRadius: theme.shape.borderRadius,
        }}
      />
    </Link>
  );
};

export const Navbar = () => {
  const { isLoaded, isSignedIn } = useUser();
  return (
    <Stack
      component="nav"
      direction="row"
      alignItems="center"
      gap={2}
      sx={{ button: { whiteSpace: "nowrap" } }}
    >
      {isLoaded && isSignedIn && (
        <IconButton
          component={RouterLink}
          to="/tasks/add"
          color="primary"
          size="small"
          aria-label="add task page"
        >
          <Add />
        </IconButton>
      )}
      {isLoaded && isSignedIn && (
        <IconButton
          component={RouterLink}
          to="/tasks"
          color="primary"
          size="small"
          aria-label="tasks page"
        >
          <TaskAlt />
        </IconButton>
      )}
      {isLoaded && isSignedIn && (
        <IconButton
          component={RouterLink}
          to="/friends"
          color="primary"
          size="small"
          aria-label="friends page"
        >
          <People />
        </IconButton>
      )}
      {isLoaded && isSignedIn && (
        <IconButton
          component={RouterLink}
          to="/insights"
          color="primary"
          size="small"
          aria-label="insights page"
        >
          <Insights />
        </IconButton>
      )}
      <IconButton
        color="primary"
        size="small"
        aria-label="open github repository"
        href="https://github.com/crackalamoo/reminder-remorse"
        target="_blank"
      >
        <GitHub />
      </IconButton>
      {isLoaded && isSignedIn && <UserButton />}
      {(!isLoaded || !isSignedIn) && (
        <Button
          component={RouterLink}
          to="/sign-in"
          color="primary"
          variant="contained"
          aria-label="log in"
        >
          Sign In
        </Button>
      )}
      {(!isLoaded || !isSignedIn) && (
        <Button
          component={RouterLink}
          to="/sign-up"
          color="primary"
          variant="outlined"
          aria-label="sign up"
        >
          Sign Up
        </Button>
      )}
    </Stack>
  );
};

type HeaderProps = {
  style?: React.CSSProperties;
};

export const Header = ({ style }: HeaderProps) => {
  const isMobile = useResponsiveDisplay();

  if (isMobile) {
    return null;
  }

  return (
    <Paper elevation={5} component="header" style={style}>
      <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={2}>
        <ProductLogo />
        <Navbar />
      </Stack>
    </Paper>
  );
};
