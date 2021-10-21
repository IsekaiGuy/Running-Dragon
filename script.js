"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form"),
  containerWorkouts = document.querySelector(".workouts"),
  inputType = document.querySelector(".form__input_type"),
  inputDistance = document.querySelector(".form__input_distance"),
  inputDuration = document.querySelector(".form__input_duration"),
  inputCadence = document.querySelector(".form__input_cadence"),
  inputElevation = document.querySelector(".form__input_elevation");

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { longitude, latitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
  },
  () => {
    alert("Could not get your position!");
  }
);
