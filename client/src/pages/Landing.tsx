import logo from "@/assets/RR_curve.png";

export const Landing = () => {
  // const text = "We were frustrated with the normal reminders app we all have on our phones. They are limited in their usefulness and are not very motivating. With goals being a big part of our lives, we wanted an app that could be so much more alongside our friends. We designed Reminder's Remorse to give people motivation to become consistent goal setters and create positive habits for themselves. There are four useful components that make Reminder's Remorse better: habit builder, reminder penalties, charity search, and friend exploration."
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "-425px",
      }}
    >
      <div style={{ margin: 'auto', textAlign: 'center', marginTop: '1500px' }}>
        <img src={logo} alt="Reminders Remorse Logo"
          style={{ width: "40%" }}
        />
      </div>

      <div>
        <p style={{ textAlign: 'center', fontSize: '200%' }}>
          Keep yourself accountable. <br />
          <b>Otherwise, you’ll be remorseful when it hits your bank account.</b>

        </p>
        <p>
          Reminder apps are <i>bland</i> and don't keep you on track. ReminderRemosrse want to change that. Hold yourself and your friends accountable.<br />
          <br />
          Reminder's Remorse charges you when you miss a reminder and sends the money to a charity or a friend. Reminder's Remorse not only keeps track of your reminders, it shows your consistent habits, your all time total tasks, and penalizes you financially. This app is designed to help you stay on top of your tasks and help others in the process.
        </p>
        <br />
        <h2>Inspiration</h2>
        <p>
          We were frustrated with the normal reminders app we all have on our phones. They are limited in their usefulness and are not very motivating. With goals a big part of our lives, the reminders app could be so much more.
          <br />There are four useful components that make Reminder's Remorse better: habit builder, reminder penalties, charity search, and friend exploration.
        </p>
        <br />

        <h2>Tech Stack</h2>
        <p>
          Frontend: React, Typescript<br />
          Backend: Flask, Redis, Python<br />
          Server: GoDaddy, Cloudflare Pages
        </p>
        <br />

        <h2>Features</h2>
        <h3>Reminder Penality</h3>
        <p>
          Users are charged a random amount of money when they miss a reminder. The money is sent to a charity or a friend.
        </p>
        <h3>Peer Pressure</h3>
        <p>
          Users can add friends to their account. Friends can see other friends' public reminders and can send them bumps to remind them of their reminders.
        </p>

        <h3>Habit Builder</h3>
        <p>
          Users can set up recurring reminders to build habits.
        </p>

        <h3>Charity Search</h3>
        <p>
          Users can search for charities to send their money to.
        </p>

        <h3>Personal Tracker</h3>
        <p>Users can see reminders, habits, penalties, and charity donations in a dashboard.</p>
      </div>
      <div><br /><br /><br /><br /><br /><br />&nbsp;</div>
    </div>
  );
};
