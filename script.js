"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form"),
  containerWorkouts = document.querySelector(".workouts"),
  inputType = document.querySelector(".form__input_type"),
  inputDistance = document.querySelector(".form__input_distance"),
  inputDuration = document.querySelector(".form__input_duration"),
  inputCadence = document.querySelector(".form__input_cadence"),
  inputElevation = document.querySelector(".form__input_elevation"),
  popupQuestion = document.querySelector(".popup-question"),
  chooseWalking = document.querySelector(".choose-transport__walk"),
  chooseCycling = document.querySelector(".choose-transport__bycicle"),
  sidebar = document.querySelector(".sidebar");

let root = document.documentElement;
let transportType = "";

// POPUP QUESTION

chooseWalking.addEventListener("click", () => {
  transportType = "walking";
  sidebar.firstElementChild.setAttribute("src", "logo.png");
  popupQuestion.style.display = "none";
  root.style.setProperty("--color-brand", "#00c46954");
  form.classList.remove("hidden");
  inputDistance.focus();
});

chooseCycling.addEventListener("click", () => {
  transportType = "cycling";
  sidebar.firstElementChild.setAttribute("src", "bycicle-logo.png");
  popupQuestion.style.display = "none";
  root.style.setProperty("--color-brand", "#ffb54577");
  form.classList.remove("hidden");
  inputDistance.focus();
});

// MAP

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { longitude, latitude } = position.coords;

    let coords = [latitude, longitude];
    const map = L.map("map").setView(coords, 13);

    L.marker(coords).addTo(map).bindPopup("You are here!").openPopup();
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  },
  () => {
    alert("Could not get your position!");
  }
);

form.addEventListener("submit", () => {
  L.marker(coords).addTo(map).bindPopup("You are here!").openPopup();

  map.on("click", (mapEvent) => {
    coords = [mapEvent.latlng.lat, mapEvent.latlng.lng];
    L.marker(coords)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          className: "running-popup",
        })
      )
      .setPopupContent("Hurry!")
      .openPopup();
  });
});
