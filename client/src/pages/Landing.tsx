import logo from "../../src/assets/RR_curve.png"


export const Landing = () => {
  //const text = "We were frustrated with the normal reminders app we all have on our phones. They are limited in their usefulness and are not very motivating. With goals being a big part of our lives, we wanted an app that could be so much more alongside our friends. We designed Reminder's Remorse to give people motivation to become consistent goal setters and create positive habits for themselves. There are four useful components that make Reminder's Remorse better: habit builder, reminder penalties, charity search, and friend exploration."
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: "-425px" }}>
      <div style={{ float: "left", marginRight: "-500px" }}>
        <img src={logo} alt="Reminders Remorse Logo" style={{ width: "40%" }} />
      </div>

    </div>
  );
};
