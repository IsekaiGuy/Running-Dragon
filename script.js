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
  images = popupQuestion.querySelectorAll("img"),
  sidebar = document.querySelector(".sidebar"),
  root = document.documentElement;

class App {
  #coords;
  #map;

  constructor() {
    this._getPosition();
  }

  _setStyle(type) {
    if (type === "walking") {
      sidebar.firstElementChild.setAttribute("src", "logo.png");
      popupQuestion.style.display = "none";
      root.style.setProperty("--color-brand", "#00c46954");
      form.classList.remove("hidden");
      inputDistance.focus();
      inputElevation.parentElement.classList.add("form__row_hidden");
      inputCadence.parentElement.classList.remove("form__row_hidden");
    } else {
      sidebar.firstElementChild.setAttribute("src", "bycicle-logo.png");
      popupQuestion.style.display = "none";
      root.style.setProperty("--color-brand", "#ffb54577");
      form.classList.remove("hidden");
      inputDistance.focus();
      inputCadence.parentElement.classList.add("form__row_hidden");
      inputElevation.parentElement.classList.remove("form__row_hidden");
    }
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
      alert("Could not get your position!");
    });
  }

  _loadMap(position) {
    const { longitude, latitude } = position.coords;

    this.#coords = [latitude, longitude];
    this.#map = L.map("map").setView(this.#coords, 13);

    L.marker(this.#coords)
      .addTo(this.#map)
      .bindPopup("You are here!")
      .openPopup();
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", (mapEvent) => {
      this.#coords = [mapEvent.latlng.lat, mapEvent.latlng.lng];
    });
  }

  _showForm() {}

  _newWorkout() {}
}

const app = new App();

// POPUP QUESTION
images.forEach((image) => {
  image.addEventListener("click", (e) => {
    let transportType = e.target.getAttribute("alt");
    app._setStyle(transportType);
  });
});

// MAP

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   inputDistance.value =
//     inputDuration.value =
//     inputElevation.value =
//     inputCadence.value =
//       "";

//   L.marker(coords)
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         className: "running-popup",
//       })
//     )
//     .setPopupContent("Hurry!")
//     .openPopup();
// });
