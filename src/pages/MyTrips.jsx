import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MyTrips.css"; // 👈 custom CSS for toast theme

export default function MyTrips() {
  const [trips, setTrips] = useState([
    {
      id: 1,
      destination: "Paris, France",
      date: "2025-11-12",
      notes: "Romantic getaway to Eiffel Tower 🗼",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    },
    {
      id: 2,
      destination: "Tokyo, Japan",
      date: "2026-01-05",
      notes: "New Year in Shibuya ✨",
      image:
        "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800&q=80",
    },
  ]);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    destination: "",
    date: "",
    notes: "",
    image: "",
  });

  const handleClose = () => setSelectedTrip(null);
  const handleShow = (trip) => setSelectedTrip(trip);

  // ✅ Add new trip
  const handleAddTrip = () => {
    if (!newTrip.destination || !newTrip.date) {
      toast.error("⚠️ Destination and Date are required!");
      return;
    }
    setTrips([...trips, { id: Date.now(), ...newTrip }]);
    setNewTrip({ destination: "", date: "", notes: "", image: "" });
    setShowAddModal(false);

    toast.success("🎉 Trip added successfully!");
  };

  // ✅ Remove trip
  const handleRemoveTrip = (tripId) => {
    setTrips(trips.filter((t) => t.id !== tripId));
    setSelectedTrip(null);
    toast.info("🗑️ Trip removed!");
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        className="text-center text-light py-5"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "80px", // ✅ pushes below navbar
        }}
      >
        <h1 className="fw-bold text-warning display-4">📌 My Trips</h1>
        <p className="lead">
          Here’s a list of your saved and upcoming adventures!
        </p>
        <Button
          variant="warning"
          className="fw-bold mt-3"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add Trip
        </Button>
      </div>

      {/* Trips Container */}
      <div className="container py-5">
        {trips.length === 0 ? (
          <div className="text-center text-light">
            <h3>No trips saved yet 😢</h3>
            <p>Start exploring and add your dream trips here!</p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="col-md-5 col-lg-4 d-flex justify-content-center"
              >
                <div
                  className="card shadow-lg border-0 h-100"
                  style={{
                    backgroundColor: "#111",
                    color: "yellow",
                    width: "100%",
                    maxWidth: "350px",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={trip.image}
                    className="card-img-top"
                    alt={trip.destination}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  />
                  <div className="card-body text-center">
                    <h4 className="fw-bold">{trip.destination}</h4>
                    <p className="text-muted">{trip.date}</p>
                    <p>{trip.notes}</p>
                  </div>
                  <div className="card-footer bg-transparent border-0 text-center">
                    <button
                      className="btn btn-warning fw-bold px-4"
                      onClick={() => handleShow(trip)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Trip Details */}
      {selectedTrip && (
        <Modal show={true} onHide={handleClose} centered>
          <Modal.Header closeButton className="bg-dark text-warning">
            <Modal.Title>{selectedTrip.destination}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <img
              src={selectedTrip.image}
              alt={selectedTrip.destination}
              className="img-fluid rounded mb-3"
            />
            <p>
              <strong>Date:</strong> {selectedTrip.date}
            </p>
            <p>
              <strong>Notes:</strong> {selectedTrip.notes}
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => handleRemoveTrip(selectedTrip.id)}>
              Remove Trip
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for Adding New Trip */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-warning">
          <Modal.Title>Add a New Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <input
            type="text"
            placeholder="Destination"
            className="form-control mb-3"
            value={newTrip.destination}
            onChange={(e) =>
              setNewTrip({ ...newTrip, destination: e.target.value })
            }
          />
          <input
            type="date"
            className="form-control mb-3"
            value={newTrip.date}
            onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Notes"
            className="form-control mb-3"
            value={newTrip.notes}
            onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="form-control mb-3"
            value={newTrip.image}
            onChange={(e) => setNewTrip({ ...newTrip, image: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddTrip}>
            Save Trip
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
        transition={Slide}
        toastClassName="golden-toast"
      />
    </div>
  );
}
