import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useApi } from "../hooks/useApi";
import DashboardNav from "../components/DashboardNav";
import "./ImpactMap.css";

const KENYA_CENTER = [-0.0236, 37.9062];
const KENYA_BOUNDS = [
  [-4.8, 33.7],
  [5.2, 42.1],
];
const API_BASE = (import.meta.env.VITE_API_URL || "https://cdms-91w6.onrender.com").replace(/\/$/, "");

function MapLocationPicker({ position, onPick }) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });

  return position ? (
    <CircleMarker
      center={position}
      radius={9}
      pathOptions={{ color: "#e53935", fillColor: "#e53935", fillOpacity: 0.8 }}
    />
  ) : null;
}

function MapViewController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 10));
  }, [map, position]);

  return null;
}

function mediaUrl(fileUrl) {
  return fileUrl?.startsWith("/api/files/") ? `${API_BASE}${fileUrl}` : fileUrl;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "Date unavailable";
}

export default function ImpactMap() {
  const api = useApi();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [position, setPosition] = useState(null);
  const [form, setForm] = useState({
    name: "",
    county: "",
    constituency: "",
    ward: "",
    description: "",
  });
  const [photos, setPhotos] = useState([]);
  const [report, setReport] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.get("/api/events");
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError("Unable to load events");
    } finally {
      setLoadingEvents(false);
    }
  }, [api]);

  useEffect(() => {
    fetchEvents();
    const refresh = window.setInterval(fetchEvents, 30000);
    return () => window.clearInterval(refresh);
  }, [fetchEvents]);

  const updateForm = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const selectPhotos = (event) => {
    const selected = Array.from(event.target.files || []).slice(0, 3);
    setPhotos(selected);
    event.target.value = "";
  };

  const detectLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Your browser does not support automatic location detection.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPosition([coords.latitude, coords.longitude]),
      () => setError("Location could not be detected. Search or click the map to choose it manually."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const searchLocation = async (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: `${search.trim()}, Kenya`,
        format: "jsonv2",
        limit: "1",
        countrycodes: "ke",
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      if (!response.ok) throw new Error("Search failed");
      const results = await response.json();
      if (!results.length) {
        setError("Location not found. Try a county, constituency, ward or nearby landmark.");
        return;
      }
      setPosition([Number(results[0].lat), Number(results[0].lon)]);
    } catch {
      setError("Location search failed. You can click directly on the map instead.");
    } finally {
      setSearching(false);
    }
  };

  const saveEvent = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!position) {
      setError("Choose the event location using GPS, search, or by clicking the map.");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("latitude", position[0]);
      data.append("longitude", position[1]);
      photos.forEach((photo) => data.append("photos", photo));
      if (report) data.append("report", report);

      await api.post("/api/events", data, true);
      setForm({ name: "", county: "", constituency: "", ward: "", description: "" });
      setPhotos([]);
      setReport(null);
      setPosition(null);
      setSuccess("Event saved and added to the map.");
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setError("Event could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const markers = useMemo(
    () =>
      events.filter(
        (event) =>
          Number.isFinite(Number(event.latitude)) &&
          Number.isFinite(Number(event.longitude))
      ),
    [events]
  );

  return (
    <>
      <DashboardNav />
      <div className="impact-map-page">
        <section className="event-panel">
          <h2>Events map</h2>
          <p>Record organization events and their locations across Kenya.</p>

          <form className="event-form" onSubmit={saveEvent}>
            <label>
              Event name
              <input value={form.name} onChange={updateForm("name")} required placeholder="Name of the event" />
            </label>
            <label>
              County
              <input value={form.county} onChange={updateForm("county")} required placeholder="e.g. Nairobi" />
            </label>
            <label>
              Constituency
              <input value={form.constituency} onChange={updateForm("constituency")} required />
            </label>
            <label>
              Ward
              <input value={form.ward} onChange={updateForm("ward")} required />
            </label>
            <label>
              Description
              <textarea value={form.description} onChange={updateForm("description")} placeholder="Describe the event" />
            </label>

            <label>
              Find location manually
              <div className="location-search">
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a place in Kenya" />
                <button type="button" onClick={searchLocation} disabled={searching}>
                  {searching ? "Searching…" : "Search"}
                </button>
              </div>
            </label>
            <button className="location-button" type="button" onClick={detectLocation}>
              Use my current location
            </button>
            <div className="coordinates">
              {position
                ? `Selected: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
                : "Or click anywhere on the map to tag the event location"}
            </div>

            <label>
              Event photos <small>Optional, up to 3 photos</small>
              <input type="file" accept="image/*" multiple onChange={selectPhotos} disabled={saving} />
            </label>
            {photos.length > 0 && <small>{photos.length} photo{photos.length === 1 ? "" : "s"} selected</small>}

            <label>
              Event report <small>Optional PDF or document</small>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={(event) => setReport(event.target.files?.[0] || null)}
                disabled={saving}
              />
            </label>

            {error && <p className="event-error">{error}</p>}
            {success && <p className="event-success">{success}</p>}
            <button type="submit" disabled={saving}>
              {saving && <span className="btn-spinner" />}
              {saving ? "Saving event…" : "Save event"}
            </button>
          </form>
        </section>

        <section className="map-panel">
          <h2>Kenya event locations</h2>
          <p>{loadingEvents ? "Loading events…" : `${markers.length} event${markers.length === 1 ? "" : "s"} on the map`} · Click the map to select a location</p>
          <MapContainer
            className="map-container"
            center={KENYA_CENTER}
            zoom={6}
            minZoom={5}
            maxBounds={KENYA_BOUNDS}
            maxBoundsViscosity={0.8}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapLocationPicker position={position} onPick={setPosition} />
            <MapViewController position={position} />
            {markers.map((event) => (
              <CircleMarker
                key={event._id}
                center={[event.latitude, event.longitude]}
                radius={8}
                pathOptions={{ color: "#1672b8", fillColor: "#47a7ff", fillOpacity: 0.85 }}
              >
                <Popup>
                  <div className="event-popup">
                    <h3>{event.name}</h3>
                    <p><strong>{event.county}</strong> · {event.constituency} · {event.ward}</p>
                    <p>{formatDate(event.createdAt)}</p>
                    {event.description && <p className="popup-description">{event.description}</p>}
                    <div className="event-media">
                      {event.photos?.map((photo) => (
                        <span key={photo.fileUrl}>
                          <a href={mediaUrl(photo.fileUrl)} target="_blank" rel="noreferrer">
                            <img className="event-photo" src={mediaUrl(photo.fileUrl)} alt={photo.filename} />
                          </a>
                          <br />
                          <a href={`${mediaUrl(photo.fileUrl)}?download=1`} download={photo.filename}>Download</a>
                        </span>
                      ))}
                      {event.report && (
                        <a href={`${mediaUrl(event.report.fileUrl)}?download=1`} download={event.report.filename}>
                          Download report
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </section>
      </div>
    </>
  );
}