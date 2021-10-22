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

  constructor() {
    this._getPosition();

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
    if (type === "walking" || type === "bycicle-logo.png") {
      logoBlock.lastElementChild.setAttribute("src", "logo.png");
      logoBlock.lastElementChild.setAttribute("alt", "walking");
      root.style.setProperty("--color-brand", "#00c46954");
      inputElevation.parentElement.classList.add("form__row_hidden");
      inputCadence.parentElement.classList.remove("form__row_hidden");
    } else {
      logoBlock.lastElementChild.setAttribute("src", "bycicle-logo.png");
      logoBlock.lastElementChild.setAttribute("alt", "cycling");
      root.style.setProperty("--color-brand", "#ffb54577");
      inputCadence.parentElement.classList.add("form__row_hidden");
      inputElevation.parentElement.classList.remove("form__row_hidden");
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

  _newWorkout(e) {
    e.preventDefault();

    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        "";

    L.marker(this.#coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          className: "running-popup",
        })
      )
      .setPopupContent("Hurry!")
      .openPopup();
  }
}

const app = new App();
