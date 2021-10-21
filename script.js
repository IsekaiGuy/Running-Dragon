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
  transport = document.querySelectorAll(".choose-transport");

let transportType = "";

// POPUP QUESTION
transport.forEach((transportType) => {
  transportType.addEventListener("click", (e) => {
    if (e.target.parentNode.className === "choose-transport__walk") {
      transportType = "walk";
    } else {
      transportType = "bycicle";
    }
    popupQuestion.style.display = "none";
    console.log(transportType);
  });
});

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { longitude, latitude } = position.coords;

    let coords = [latitude, longitude];
    const map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(coords).addTo(map).bindPopup("You are here!").openPopup();

    map.on("click", (mapEvent) => {
      coords = [mapEvent.latlng.lat, mapEvent.latlng.lng];
      map.setView(coords, 13);
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
  },
  () => {
    alert("Could not get your position!");
  }
);
