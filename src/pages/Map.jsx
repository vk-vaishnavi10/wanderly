import React, { useState, useCallback, useRef } from "react";
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
  const autocompleteRef = useRef(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    mapInstance.setOptions({
      disableDefaultUI: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#e5e3df" }] },
        { featureType: "water", stylers: [{ color: "#a6c8ff" }] },
        { featureType: "road", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.highway", stylers: [{ color: "#ffd700" }] },
      ],
    });
  }, []);

  const handleSearch = () => {
    if (!map || !autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry) {
      alert("Please select a valid location from the suggestions!");
      return;
    }

    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    map.panTo(newCenter);
    setCenter(newCenter);

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: newCenter,
      radius: 7000, // meters
      type: [searchType],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      } else {
        setPlaces([]);
      }
    });
  };

  if (!isLoaded) return <div className="text-light">🌀 Loading Wanderly Map...</div>;

  return (
    <section className="map-section">
      <h1 className="map-title">🌍 Explore with Wanderly</h1>
      <p className="map-subtitle">
        Find the best restaurants, hotels, and attractions nearby.
      </p>

      {/* 🔍 Search Bar */}
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

      {/* 🗺️ Map */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
        >
          {places.map((place, index) => (
            <Marker
              key={index}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={{
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng(),
              }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="info-window">
                <h4>{selectedPlace.name}</h4>
                <p>{selectedPlace.vicinity}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      <footer className="map-footer">
        <p>
          ✨ Discover more, travel smarter —{" "}
          <span className="wanderly-link">Wanderly leads your way!</span>
        </p>
      </footer>
    </section>
  );
}
