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
  logoBlock = document.querySelector(".logo-block"),
  sidebar = document.querySelector(".sidebar"),
  logo = document.querySelector(".logo"),
  buttons = document.querySelectorAll(".form__btn"),
  closingIcon = document.querySelector(".logo-block__icon"),
  root = document.documentElement;

class Workout {
  date = new Date();
  id = parseInt((Date.now() * Math.random()) / 500);

  constructor(coords, distance, duration) {
    this.coords = coords; //[lat, lng]
    this.distance = distance; //km
    this.duration = duration; //mins
    this._setDescription();
  }

  _setDescription() {
    this.description = `${logo.getAttribute("alt")[0].toUpperCase()}${logo
      .getAttribute("alt")
      .slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDay()}`;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #allCoords = [];
  #coords;
  #map;
  #tstype;
  #polyline;
  #workouts = [];
  #markers = [];
  #calcDistance = [];

  constructor() {
    this._getPosition();

    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));

    document.getElementById("map").addEventListener("click", () => {
      if (!inputDistance.value) {
        inputDistance.focus();
      } else if (!inputDuration.value) {
        inputDuration.focus();
      } else {
        inputDistance.focus();
      }
    });

    images.forEach((image) => {
      image.addEventListener("click", (e) => {
        let transportType = e.target.getAttribute("alt");
        this._setStyle(transportType);
      });
    });

    closingIcon.addEventListener("click", () => {
      this._toggleSidebar();
    });

    // SWITCH STYLE
    logo.addEventListener("click", (e) => {
      this._toggleSidebar();
      this._setStyle(e.target.getAttribute("src"));
    });

    form.addEventListener("submit", this._newWorkout.bind(this));
  }

  _toggleSidebar() {
    sidebar.classList.toggle("sidebar_hidden");
    logoBlock.lastElementChild.classList.toggle("form__row_hidden");
    logoBlock.querySelector("h2").classList.toggle("form__row_hidden");
    buttons.forEach((el) => el.classList.toggle("form__row_hidden"));
    if (sidebar.classList.contains("sidebar_hidden")) {
      closingIcon.setAttribute("src", "arrows-svgrepo.svg");
    } else {
      closingIcon.setAttribute("src", "compress-alt-solid.svg");
    }
  }

  _setStyle(type) {
    if (type === "running" || type === "bycicle-logo.png") {
      logoBlock.lastElementChild.setAttribute("src", "logo.png");
      logoBlock.lastElementChild.setAttribute("alt", "running");
      root.style.setProperty("--color-brand", "#00c46954");
      inputElevation.parentElement.classList.add("form__row_hidden");
      inputCadence.parentElement.classList.remove("form__row_hidden");
      this.#tstype = "running";
    } else {
      logoBlock.lastElementChild.setAttribute("src", "bycicle-logo.png");
      logoBlock.lastElementChild.setAttribute("alt", "cycling");
      root.style.setProperty("--color-brand", "#ffb54577");
      inputCadence.parentElement.classList.add("form__row_hidden");
      inputElevation.parentElement.classList.remove("form__row_hidden");
      this.#tstype = "cycling";
    }
    popupQuestion.style.display = "none";
    form.classList.remove("hidden");
    inputDistance.focus();
    this._toggleSidebar();
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

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", (mapEvent) => {
      this.#coords = [mapEvent.latlng.lat, mapEvent.latlng.lng];
      this.#allCoords.push(this.#coords);
    });
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((input) => Number.isFinite(input));
    const allPositive = (...inputs) => inputs.every((input) => input > 0);

    e.preventDefault();

    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let workout;

    if (this.#tstype === "running") {
      const cadence = +inputCadence.value;

      if (
        !validInputs(duration, distance, cadence) ||
        !allPositive(duration, distance, cadence)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Running(this.#coords, distance, duration, cadence);
    }

    if (this.#tstype === "cycling") {
      const elevation = +inputElevation.value;

      if (
        !validInputs(duration, distance, elevation) ||
        !allPositive(duration, distance)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Cycling(this.#coords, distance, duration, elevation);
    }

    this.#workouts.push(workout);
    console.log(workout);

    this._renderWorkoutMarker(workout);

    this._renderWorkout(workout);

    // REMOVING FROM LIST AND MAP
    document.querySelector(".workout__xmark").addEventListener("click", (e) => {
      this.#markers.forEach((marker) => {
        if (marker.id == e.target.parentElement.dataset.id) {
          this.#map.removeLayer(marker);
          this.#markers = this.#markers.filter((el) => el.id !== marker.id);
        }
      });
      e.target.parentElement.remove();
    });
    //////////////////////////////////////////////

    // CLEAR MAP LISTENER
    document
      .querySelector(".form__btn_clear-map")
      .addEventListener("click", this._clearMap.bind(this));
    //////////////////////////////////////////////

    // CLEAR LIST LISTENER
    document
      .querySelector(".form__btn_clear-list")
      .addEventListener("click", () => {
        document.querySelectorAll(".workout").forEach((el) => el.remove());
      });

    ////////////////////////////////////////////////

    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        "";
  }

  _renderWorkoutMarker(workout) {
    let marker = L.marker(this.#coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent(
        `${this.#tstype === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();

    // DRAWING RED LINE BETWEEN POINTS
    if (this.#allCoords.length >= 2) {
      this.#polyline = L.polyline(this.#allCoords, { color: "red" }).addTo(
        this.#map
      );
      this.#map.fitBounds(this.#polyline.getBounds());

      // CALCULATING DISTANCE
      let dist = this._getDistance(
        this.#coords,
        this.#allCoords[this.#allCoords.length - 2]
      );

      this.#calcDistance.push(dist);
      let sum = Math.floor(
        this.#calcDistance.reduce((sum, current) => sum + current / 1000)
      );
      console.log(sum);
    }
    ////////////////////////////////////

    marker.id = workout.id;
    this.#markers.push(marker);
  }

  _renderWorkout(workout) {
    const html = `
    <li class="workout" data-id="${workout.id}">
    <img class="workout__xmark" src="xmark.svg" alt="xmark">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          this.#tstype === "running" ? "🏃‍♂️" : "🚴‍♀️"
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${
          this.#tstype === "running"
            ? workout.pace.toFixed(1)
            : workout.speed.toFixed(1)
        }</span>
        <span class="workout__unit">${
          this.#tstype === "running" ? "min/km" : "km/h"
        }</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">${
          this.#tstype === "running" ? "🦶🏼" : "⛰"
        }</span>
        <span class="workout__value">${
          this.#tstype === "running" ? workout.cadence : workout.elevation
        }</span>
        <span class="workout__unit">${
          this.#tstype === "running" ? "spm" : "m"
        }</span>
      </div>
    </li>
    `;

    form.insertAdjacentHTML("afterend", html);
  }

  ////////MOVING TO POPUP ONCLICK IN THE LIST
  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      (work) => work.id == workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    console.log(document.getElementById("distance"));
  }

  //////////////////////////////////////////////

  // CLEAR MAP FUNCTION
  _clearMap() {
    this.#markers.forEach((marker) => this.#map.removeLayer(marker));
    this.#markers = [];

    this.#map.removeLayer(this.#polyline);
    this.#polyline.remove(this.#map);
    this.#allCoords = [];
  }

  ///////////////////////////////////////////////

  // CALCULATE DISTANCE
  _toRadian(degree) {
    return (degree * Math.PI) / 180;
  }

  _getDistance(origin, destination) {
    // return distance in meters
    var lon1 = this._toRadian(origin[1]),
      lat1 = this._toRadian(origin[0]),
      lon2 = this._toRadian(destination[1]),
      lat2 = this._toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }
}

const app = new App();
