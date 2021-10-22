"use strict";

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
  root = document.documentElement;

class Workout {
  date = new Date();
  id = parseInt((Date.now() * Math.random()) / 500);

  constructor(coords, distance, duration) {
    (this.coords = coords), //[lat, lng]
      (this.distance = distance), //km
      (this.duration = duration); //mins
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
  #coords;
  #map;
  #tstype;
  #workouts = [];

  constructor() {
    this._getPosition();

    // document.getElementsById("map").addEventListener("click", () => {
    //   inputDistance.focus();
    // });

    images.forEach((image) => {
      image.addEventListener("click", (e) => {
        let transportType = e.target.getAttribute("alt");
        this._setStyle(transportType);
      });
    });

    document
      .querySelector(".logo-block__icon")
      .addEventListener("click", () => {
        this._toggleSidebar();
      });

    // SWITCH STYLE
    document.querySelector(".logo").addEventListener("click", (e) => {
      this._toggleSidebar();
      this._setStyle(e.target.getAttribute("src"));
    });

    form.addEventListener("submit", this._newWorkout.bind(this));
  }

  _toggleSidebar() {
    sidebar.classList.toggle("sidebar_hidden");
    logoBlock.lastElementChild.classList.toggle("form__row_hidden");
    logoBlock.querySelector("h2").classList.toggle("form__row_hidden");
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

    // L.marker(this.#coords)
    //   .addTo(this.#map)
    //   .bindPopup("You are here!")
    //   .openPopup();
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", (mapEvent) => {
      this.#coords = [mapEvent.latlng.lat, mapEvent.latlng.lng];
    });
  }

  _showForm() {}

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

    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        "";
  }

  _renderWorkoutMarker(workout) {
    L.marker(this.#coords)
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
      .setPopupContent("Hurry!")
      .openPopup();
  }

  _renderWorkout(workout) {}
}

const app = new App();
