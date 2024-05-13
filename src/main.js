import * as L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { parseCoordValue, toggleClipboardIcon } from "./util";

const coordsForm = document.querySelector("#coords-form");
const latElement = coordsForm.querySelector("#lat");
const lngElement = coordsForm.querySelector("#lng");
const submitBtn = document.querySelector("#submit-btn");

/**
 * Leaflet map
 */
let marker = null;

const map = L.map("map").setView([57.710083, 11.9727685], 11);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const search = new GeoSearchControl({
  notFoundMessage: "Kan inte hitta den addressen.",
  provider: new OpenStreetMapProvider(),
  style: "bar",
});

map.addControl(search);

const setLatLng = (lat, lng) => {
  latElement.value = lat;
  lngElement.value = lng;
};

const addMarker = (lat, lng) => {
  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);
};

const handleMapClick = ({ latlng }) => {
  const { lat, lng } = latlng;
  setLatLng(lat, lng);
  addMarker(lat, lng);
};

const handleResult = ({ location, marker: geoMarker }) => {
  map.removeLayer(geoMarker);

  setLatLng(location.y, location.x);
  addMarker(location.y, location.x);
};

map.on("click", handleMapClick);
map.on("geosearch/showlocation", handleResult);

/**
 * Coordinates form
 */
const handleCoordsSubmit = (ev) => {
  ev.preventDefault();

  // Elements
  const lat = parseCoordValue(latElement);
  const lng = parseCoordValue(lngElement);

  console.log([lat, lng]);

  navigator.clipboard.writeText(`${lat}, ${lng}`);

  toggleClipboardIcon(submitBtn);
};

const validateCoords = () => {
  const lat = parseCoordValue(latElement);
  const lng = parseCoordValue(lngElement);

  const isValid = lat && lng;

  submitBtn.disabled = !isValid;

  return isValid;
};

const copySingleCoord = (ev) => {
  const { value } = ev.target;

  if (!validateCoords()) return;

  navigator.clipboard.writeText(value);

  toggleClipboardIcon(submitBtn);
};

coordsForm.addEventListener("submit", handleCoordsSubmit);
coordsForm.addEventListener("input", validateCoords);
latElement.addEventListener("click", (ev) => copySingleCoord(ev));
lngElement.addEventListener("click", (ev) => copySingleCoord(ev));
