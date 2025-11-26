// src/pages/MapPage.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import "./Map.css";

const containerStyle = {
  width: "90%",
  height: "85vh",
  borderRadius: "20px",
  margin: "2rem auto",
};

const defaultCenter = { lat: 22.9734, lng: 78.6569 };

export default function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchType, setSearchType] = useState("hotel");
  const [places, setPlaces] = useState([]);
  const [memoryPins, setMemoryPins] = useState([]);
  const [newMemory, setNewMemory] = useState({ lat: null, lng: null, text: "" });
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const autocompleteRef = useRef(null);

  // Load saved pins
  useEffect(() => {
    const savedPins = localStorage.getItem("wanderly_memories");
    if (savedPins) setMemoryPins(JSON.parse(savedPins));
  }, []);

  // Save automatically
  useEffect(() => {
    localStorage.setItem("wanderly_memories", JSON.stringify(memoryPins));
  }, [memoryPins]);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    mapInstance.setOptions({
      disableDefaultUI: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#efe7dc" }] },
        { featureType: "water", stylers: [{ color: "#d1bfa2" }] },
        { featureType: "road", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.highway", stylers: [{ color: "#d4a657" }] },
      ],
    });
  }, []);

  const handleSearch = () => {
    if (!map || !autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry) {
      alert("Please select a valid location!");
      return;
    }

    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    map.panTo(newCenter);
    setCenter(newCenter);

    const service = new window.google.maps.places.PlacesService(map);
    const request = { location: newCenter, radius: 5000, type: [searchType] };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      } else {
        setPlaces([]);
      }
    });
  };

  // Add memory pin
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setNewMemory({ lat, lng, text: "" });
    setShowMemoryModal(true);
  };

  const saveMemory = () => {
    if (newMemory.text.trim() !== "") {
      setMemoryPins([...memoryPins, newMemory]);
      setShowMemoryModal(false);
    }
  };

  // Delete pin
  const deleteMemory = (index) => {
    const updated = memoryPins.filter((_, i) => i !== index);
    setMemoryPins(updated);
    setSelectedPlace(null);
  };

  if (!isLoaded)
    return <div className="text-light">🌀 Loading Wanderly Map...</div>;

  return (
    <section className="map-section">
      <h1 className="map-title">🌍 Explore with Wanderly</h1>
      <p className="map-subtitle">
        Drop golden pins to mark memories that stay with you forever 💫
      </p>

      {/* Search Box */}
      <div className="map-search-box glassy">
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)}>
          <input
            type="text"
            placeholder="Search a city or location..."
            className="map-input"
          />
        </Autocomplete>

        <select
          className="map-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="restaurant">🍽️ Restaurants</option>
          <option value="hotel">🏨 Hotels</option>
          <option value="park">🌳 Parks</option>
          <option value="museum">🏛️ Museums</option>
          <option value="cafe">☕ Cafes</option>
        </select>

        <button className="map-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Map */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {/* Search Results */}
          {places.map((place, index) => (
            <Marker
              key={index}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              icon={{
                url: "/src/assets/pins/chibi-hero.png",
                scaledSize: new window.google.maps.Size(46, 46),
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {/* Memory Pins */}
          {memoryPins.map((mem, i) => (
            <Marker
              key={i}
              position={{ lat: mem.lat, lng: mem.lng }}
              icon={{
                url: "/src/assets/pins/panda_pin.png",
                scaledSize: new window.google.maps.Size(52, 52),
              }}
              onClick={() => setSelectedPlace({ ...mem, index: i })}
            />
          ))}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={{
                lat:
                  selectedPlace.lat ||
                  selectedPlace.geometry?.location?.lat(),
                lng:
                  selectedPlace.lng ||
                  selectedPlace.geometry?.location?.lng(),
              }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="info-window">
                {selectedPlace.text ? (
                  <>
                    <h4>📍 Your Memory</h4>
                    <p>{selectedPlace.text}</p>
                    <button
                      className="delete-btn"
                      onClick={() => deleteMemory(selectedPlace.index)}
                    >
                      ❌ Delete
                    </button>
                  </>
                ) : (
                  <>
                    <h4>{selectedPlace.name}</h4>
                    <p>{selectedPlace.vicinity}</p>
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Memory Modal */}
      {showMemoryModal && (
        <div className="memory-modal-overlay">
          <div className="memory-modal">
            <h3>Add Memory 📍</h3>
            <textarea
              placeholder="Write something unforgettable..."
              value={newMemory.text}
              onChange={(e) =>
                setNewMemory({ ...newMemory, text: e.target.value })
              }
            />
            <div className="memory-buttons">
              <button onClick={saveMemory} className="btn-save">
                Save
              </button>
              <button
                onClick={() => setShowMemoryModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="map-footer">
        <p>
          ✨ Your memories sparkle across the world —{" "}
          <span className="wanderly-link">with Wanderly 💛</span>
        </p>
      </footer>
    </section>
  );
}
