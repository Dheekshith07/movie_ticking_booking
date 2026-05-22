import { useEffect, useState } from "react";
import "./Home.css";

function Home({ user, setUser }) {
  const [movies, setMovies] = useState([]);
  const [branches, setBranches] = useState([]);

  const [step, setStep] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {

  fetch("http://localhost:5000/movies")
    .then((res) => res.json())
    .then((data) => {
      setMovies(data);
    })
    .catch((err) => {
      console.log(err);
    });

  fetch("http://localhost:5000/branches")
    .then((res) => res.json())
    .then((data) => {
      setBranches(data);
    })
    .catch((err) => {
      console.log(err);
    });

}, []);
  function logout() {
    setUser(null);
  }

  function selectSeat(seat) {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  }

  function confirmBooking() {
    fetch("http://localhost:5000/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        seat: selectedSeats.join(","),
        row: "A",
        tickets: selectedSeats.length,
        screen: 1,
        custId: user.id,
        date: selectedDate,
        time: selectedTime,
        branchId: selectedBranch
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setStep(1);
      });
  }

  // STEP 1: MOVIES
  if (step === 1) {
    return (
      <div className="container-dark">
        <div className="navbar">
          <h2>🎬 Movie Ticket</h2>
          <div>
            {user.email}
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <h2>Now Showing</h2>

        <div className="grid">
          {movies.map(m => (
            <div className="card" key={m.Movie_ID}>
              <h3>{m.Description}</h3>
              <p>⭐ {m.Rating || 8.5}</p>
              <p>Screen: {m.Screen_Number}</p>
              <button onClick={() => {
                setSelectedMovie(m);
                setStep(2);
              }}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP 2: BRANCH + DATE + TIME
  if (step === 2) {
    return (
      <div className="container-dark">
        <button onClick={() => setStep(1)}>← Back</button>

        <h2>{selectedMovie.Description}</h2>

        <h3>Select Location</h3>
        <div className="row">
          {branches.map(b => (
            <button
              className={selectedBranch === b.Branch_ID ? "active" : ""}
              onClick={() => setSelectedBranch(b.Branch_ID)}
            >
              {b.Branch_Location}
            </button>
          ))}
        </div>

        <h3>Select Date</h3>
        <div className="row">
          {["may 1","may 2","may 3","may 4"].map(d => (
            <button
              className={selectedDate === d ? "active" : ""}
              onClick={() => setSelectedDate(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <h3>Select Time</h3>
        <div className="row">
          {["10:30 AM","1:15 PM","4:00 PM"].map(t => (
            <button
              className={selectedTime === t ? "active" : ""}
              onClick={() => setSelectedTime(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <button onClick={() => setStep(3)}>Continue</button>
      </div>
    );
  }

  // STEP 3: SEATS
  if (step === 3) {
    return (
      <div className="container-dark">
        <button onClick={() => setStep(2)}>← Back</button>

        <h3>Select Seats</h3>

        <div className="seats">
          {[...Array(20)].map((_, i) => {
            const seat = "A" + (i + 1);
            return (
              <div
                className={
                  selectedSeats.includes(seat)
                    ? "seat selected"
                    : "seat"
                }
                onClick={() => selectSeat(seat)}
              >
                {seat}
              </div>
            );
          })}
        </div>

        <button onClick={() => setStep(4)}>Continue</button>
      </div>
    );
  }

  // STEP 4: SUMMARY
  if (step === 4) {
    return (
      <div className="container-dark center-box">
        <button onClick={() => setStep(3)}>← Back</button>

        <div className="summary-card">
          <h2 className="center-text">Booking Summary</h2>

          <div className="summary-row">
            <span>Movie</span>
            <span>{selectedMovie.Description}</span>
          </div>

          <div className="summary-row">
            <span>Location</span>
            <span>
              {branches.find(b => b.Branch_ID === selectedBranch)?.Branch_Location}
            </span>
          </div>

          <div className="summary-row">
            <span>Date</span>
            <span>{selectedDate}</span>
          </div>

          <div className="summary-row">
            <span>Time</span>
            <span>{selectedTime}</span>
          </div>

          <div className="summary-row">
            <span>Seats</span>
            <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="summary-row">
            <span>screen</span>
            <span>{selectedMovie.Screen_Numbe}</span>
          </div>

          <button className="confirm-btn" onClick={confirmBooking}>
            Confirm & Pay
          </button>
        </div>
      </div>
    );
  }
}

export default Home;