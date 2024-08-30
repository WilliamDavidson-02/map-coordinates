import * as L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import { parseCoordValue, toggleClipboardIcon } from "./util";

const coordsForm = document.querySelector("#coords-form");
const latElement = coordsForm.querySelector("#lat");
const lngElement = coordsForm.querySelector("#lng");
const latBtn = document.querySelector("#lat-btn");
const lngBtn = document.querySelector("#lng-btn");

const validateCoords = () => {
  let lat = parseCoordValue(latElement);
  let lng = parseCoordValue(lngElement);

  if (lat < -90 || lat > 90) lat = null;
  if (lng < -180 || lng > 180) lng = null;

  latBtn.disabled = !lat;
  lngBtn.disabled = !lng;

  return lat && lng;
};

/**
 * Leaflet map
 */
let marker = null;
const markerIcon = L.divIcon({
  className: "bg-transparent text-red-700",
  html: '<i class="fa-solid fa-location-dot text-3xl"></i>',
  iconSize: [22, 32],
});

const map = L.map("map").setView([57.710083, 11.9727685], 11);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const search = new GeoSearchControl({
  notFoundMessage: "Unable to find this address",
  provider: new OpenStreetMapProvider(),
  style: "bar",
});

map.addControl(search);

const setLatLng = (lat, lng) => {
  latElement.value = lat;
  lngElement.value = lng;

  validateCoords();
};

const addMarker = (lat, lng) => {
  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
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

  navigator.clipboard.writeText(`${lat}, ${lng}`);

  toggleClipboardIcon(latBtn);
  toggleClipboardIcon(lngBtn);
};

const copySingleCoord = (value, button) => {
  navigator.clipboard.writeText(value);

  toggleClipboardIcon(button);
};

const handleInputChange = () => {
  if (validateCoords()) {
    const lat = parseCoordValue(latElement);
    const lng = parseCoordValue(lngElement);

    addMarker(lat, lng);
    map.flyTo([lat, lng], 11);
  }
};

coordsForm.addEventListener("submit", handleCoordsSubmit);
coordsForm.addEventListener("input", handleInputChange);
latBtn.addEventListener("click", () =>
  copySingleCoord(latElement.value, latBtn)
);
lngBtn.addEventListener("click", () =>
  copySingleCoord(lngElement.value, lngBtn)
);

/**
 * Dark mode
 */
function darkMode(button){

  const classes = [
    ".textHolder",
    ".leaflet-control-zoom-in",
    ".leaflet-control-zoom-out",
    ".glass",
    ".reset",
    ".leaflet-control-zoom-in",
    ".leaflet-control-zoom-out",
    ".text-xl",
    ".moon",
    ".reset",
    ".glass",
    ".results",
  ]

  //If it is already black then return to light mode
  if(button.style.color == "white"){
    //Elements to white
    document.body.style.backgroundColor = "white";
    document.querySelectorAll(classes).forEach(element => {
      element.style.backgroundColor = "white";
      element.style.color = "black";
    });
    document.getElementsByTagName("form")[1].style.backgroundColor = "white";

  }else{
    //Elements to black
    document.body.style.backgroundColor = "hsla(0, 0%, 5%, 1)";
    document.querySelectorAll(classes).forEach(element => {
      element.style.backgroundColor = "hsla(0, 0%, 5%, 1)";
      element.style.color = "white";
    });
    document.getElementsByTagName("form")[1].style.backgroundColor = "hsla(0, 0%, 5%, 1)";
  }
}
window.darkMode = darkMode;
