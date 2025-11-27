// ⭐ src/pages/MapPage.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";

import "./Map.css";
import customMarker from "../assets/chibi-hero.png"; // ⭐ your family marker

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

  /* LOAD SAVED MEMORIES */
  useEffect(() => {
    const savedPins = localStorage.getItem("wanderly_memories");
    if (savedPins) setMemoryPins(JSON.parse(savedPins));
  }, []);

  /* AUTO SAVE MEMORIES */
  useEffect(() => {
    localStorage.setItem("wanderly_memories", JSON.stringify(memoryPins));
  }, [memoryPins]);

  /* MAP LOAD */
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

  /* SEARCH HANDLER */
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
    service.nearbySearch(
      {
        location: newCenter,
        radius: 5000,
        type: [searchType],
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
        } else {
          setPlaces([]);
        }
      }
    );
  };

  /* CLICK TO ADD MEMORY */
  const handleMapClick = (e) => {
    setNewMemory({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      text: "",
    });
    setShowMemoryModal(true);
  };

  const saveMemory = () => {
    if (newMemory.text.trim() !== "") {
      setMemoryPins([...memoryPins, newMemory]);
      setShowMemoryModal(false);
    }
  };

  const deleteMemory = (index) => {
    setMemoryPins(memoryPins.filter((_, i) => i !== index));
    setSelectedPlace(null);
  };

  if (!isLoaded) return <div className="text-light">🌀 Loading Wanderly Map...</div>;

  return (
    <section className="map-section">
      <h1 className="map-title">🌍 Explore with Wanderly</h1>
      <p className="map-subtitle">Drop pins to bookmark your beautiful memories 💫</p>

      {/* SEARCH BOX */}
      <div className="map-search-box glassy">
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)}>
          <input type="text" placeholder="Search a city or location..." className="map-input" />
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

      {/* MAP */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {/* 🔶 SEARCH RESULT MARKERS with custom glowing image */}
          {places.map((place, index) => (
            <Marker
              key={index}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              icon={{
                url: customMarker,
                scaledSize: new window.google.maps.Size(65, 65),
                anchor: new window.google.maps.Point(32, 65),
              }}
              animation={window.google.maps.Animation.DROP}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {/* 🔶 MEMORY PINS with same custom marker */}
          {memoryPins.map((mem, i) => (
            <Marker
              key={i}
              position={{ lat: mem.lat, lng: mem.lng }}
              icon={{
                url: customMarker,
                scaledSize: new window.google.maps.Size(70, 70),
                anchor: new window.google.maps.Point(35, 70),
              }}
              animation={window.google.maps.Animation.BOUNCE}
              onClick={() => setSelectedPlace({ ...mem, index: i })}
            />
          ))}

          {/* 🔶 INFO WINDOW */}
          {selectedPlace && (
            <InfoWindow
              position={{
                lat:
                  selectedPlace.lat ??
                  selectedPlace.geometry?.location?.lat(),
                lng:
                  selectedPlace.lng ??
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

      {/* MEMORY MODAL */}
      {showMemoryModal && (
        <div className="memory-modal-overlay">
          <div className="memory-modal">
            <h3>✨ Save this memory?</h3>
            <textarea
              placeholder="Describe your moment..."
              onChange={(e) => setNewMemory({ ...newMemory, text: e.target.value })}
              className="form-control mt-2"
            ></textarea>
            <button className="map-btn mt-3" onClick={saveMemory}>
              Save Memory
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
