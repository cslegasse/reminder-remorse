import logo from "../../public/screenshots/Reminders_Remorse_logo.png"


export const Landing = () => {
  const text = "Reminder apps are bland and don't keep you on track or help you build consistent habits. Hold yourself and your friends accountable. You’ll be remorseful when it hits your bank account otherwise.";

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", textAlign: "center", marginTop: "-135px" }}>
      <img src={logo} alt="Reminders Remorse Logo" style={{ width: "50%" }} />
      {text.split('.').map((sentence, index) => (
        <p key={index} style={{ textAlign: "center", marginBottom: "10px" }}>{sentence.trim()}</p>
      ))}
    </div>
  );
};
