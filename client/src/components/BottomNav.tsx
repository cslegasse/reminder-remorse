import { Add, People, Insights, TaskAlt } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from "@mui/material";
import { pulseAnimation, slideInBottom } from "../styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { UserButton } from "@clerk/clerk-react";

/**
 * Component for rendering the bottom navigation bar.
 */
export const BottomNav = () => {
  const isMobile = useResponsiveDisplay();
  const location = useLocation();
  const [value, setValue] = useState<number | undefined>();
  const theme = useTheme();
  const navigate = useNavigate();

  // useEffect hook to set the active button based on the current route
  useEffect(() => {
    const pathParts = location.pathname.split("/"); // Split the pathname by '/'
    if (pathParts[1] === "tasks") {
      setValue(0); // If the user is on a task page, set the value to 0
    } else {
      // Handle other routes as before
      switch (location.pathname) {
        case "/friends":
          setValue(1);
          break;
        case "/tasks/add":
          setValue(2);
          break;
        case "/insights":
          setValue(3);
          break;
        // case "/user":
        //   setValue(4);
        //   break;
        case "/":
          setValue(0);
          break;
        default:
          setValue(undefined); // Fallback for the undefined route
      }
    }
  }, [location.pathname]);

  // If it's a mobile device, render the navigation bar.
  if (!isMobile) {
    return null;
  }

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        animation: `${slideInBottom} 0.5s ease;`,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setValue(newValue);
          event.preventDefault();
        }}
      >
        <BottomNavigationAction onClick={() => navigate("/")} label="Tasks" icon={<TaskAlt />} />
        <BottomNavigationAction
          onClick={() => navigate("/friends")}
          label="Friends"
          icon={<People />}
        />
        <BottomNavigationAction
          onClick={() => navigate("/tasks/add")}
          showLabel={false}
          icon={
            <Add
              color="info"
              fontSize="large"
              sx={{
                border: `2px solid ${theme.palette.primary};`,
                backgroundColor: "#232e58",
                borderRadius: "100px",
                padding: "6px",
                animation: `${pulseAnimation} 1.2s infinite`,
              }}
            />
          }
        />
        <BottomNavigationAction
          onClick={() => navigate("insights")}
          label="Insights"
          icon={<Insights />}
        />
        <BottomNavigationAction label="User" icon={<UserButton />} />
      </BottomNavigation>
    </Paper>
  );
};
