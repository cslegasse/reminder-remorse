import logo from "@/assets/banner.png";
import { Stack, Typography } from "@mui/material";

export const Landing = () => {
  return (
    <Stack
      sx={{
        textAlign: "center",
      }}
    >
      <div>
        <img src={logo} alt="Reminders Remorse Logo" style={{ width: "40%" }} />
      </div>

      <div>
        <Typography variant="h4">
          Keep yourself accountable. <br />
          <b>Otherwise, you’ll be remorseful when it hits your bank account.</b>
        </Typography>
        <p>
          <Typography variant="h6">
            Reminder apps are <i>bland</i> and don't keep you on track. Reminder Remorse want to
            change that.
          </Typography>
          <br />
          <Typography variant="body1">Hold yourself and your friends accountable.</Typography>
        </p>
      </div>
      <br />
      <br />
      <Typography variant="h3">Join Reminder Remorse today and start building habits!</Typography>
    </Stack>
  );
};
