// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalCloseBtn = document.querySelector(".close");
const form = document.querySelector("form");
const formData = document.querySelectorAll(".formData");
const burgerMenu = document.querySelector("#burger_menu");
const twoMinCharsFields = document.querySelectorAll(".two-min-chars");
const emailField = document.querySelector(".email");
const dobField = document.querySelector("#birthdate");
const numberInput = document.querySelector("#quantity");
const radios = document.querySelectorAll('input[name="location"]');
const termsCheckbox = document.querySelector('input[name="terms"]');

// burger menu responsive
burgerMenu.addEventListener("click", editNav);
function editNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// launch modal
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
function launchModal() {
  modalbg.style.display = "block";
}

// close modal
modalCloseBtn.addEventListener("click", closeModal);
function closeModal() {
  modalbg.style.display = "none";
}

//
// Function for show/hide an error
//
function setError(element, message) {
  const parent = element.parentElement;

  if (message) {
    parent.setAttribute("data-error-visible", "true");
    parent.setAttribute("data-error", message);
  } else {
    parent.setAttribute("data-error-visible", "false");
    parent.removeAttribute("data-error");
  }
}

//
// Verifications in real time
//
twoMinCharsFields.forEach((input) =>
  input.addEventListener("input", isFirstAndLastNameValid)
);
emailField.addEventListener("input", isEmailValid);
dobField.addEventListener("input", isDateOfBirthValid);
numberInput.addEventListener("input", isQuantityValid);
radios.forEach((radio) => radio.addEventListener("change", isLocationValid));
termsCheckbox.addEventListener("change", isTermsChecked);

//
// Validate first name & last name lengths
// This function takes a name as a parameter and validates that it is in the correct format. Here: at least two characters.
//

function isStringLongEnough(str, minLength = 2) {
  return str.length >= minLength;
}

function isFirstAndLastNameValid(e) {
  const input = e.target;
  const isValid = isStringLongEnough(input.value.trim());

  if (!isValid === true) {
    setError(input, "Veuillez saisir 2 caractères minimum");
  } else {
    setError(input, "");
  }
}

//
// Validate email validity
// This function uses usual regex for check the correct format of the email.
//

function isEmailValid(e) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const input = e.target;
  const email = input.value;
  if (!regex.test(email)) {
    setError(input, "Veuillez entrer un email valide");
    return false;
  } else {
    setError(input, "");
    return true;
  }
}

//
// Validate birthday date
// This function checks if the date of birth is correctly entered.
//

function isDateOfBirthValid(e) {
  const input = e.target;

  if (!input.value) {
    setError(input, "Veuillez entrer votre date de naissance");
    return false;
  } else {
    setError(input, "");
    return true;
  }
}

//
// Validate a numeric value
// This function checks if the entered value is indeed a numeric value.
//

function isQuantityValid(e) {
  const input = e.target;
  if (input.value.trim() === "" || isNaN(input.value)) {
    setError(input, "Veuillez entrer un nombre valide");
    return false;
  } else {
    setError(input, "");
    return true;
  }
}

//
// Validate radios
// Creates an array from radio buttons & check if there is one checked.
//

function isLocationValid() {
  const selectedLocation = Array.from(radios).some((radio) => radio.checked);
  if (!selectedLocation) {
    radios.forEach((radio) =>
      setError(radio, "Veuillez sélectionner une ville")
    );
    return false;
  } else {
    radios.forEach((radio) => setError(radio, ""));
    return true;
  }
}

//
// Validate checkbox
// This function checks if the terms checkbox is checked (the other one is possibly checked but not required to validate form submit)
//

function isTermsChecked() {
  if (!termsCheckbox.checked) {
    setError(termsCheckbox, "Vous devez accepter les conditions d'utilisation");
    return false;
  } else {
    setError(termsCheckbox, "");
    return true;
  }
}

//
// Form submit
// This function allows to keep the entered values in the form if it doesn't pass the check validity.
//

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true; // global valid marker

  // First & last name check
  twoMinCharsFields.forEach((input) => {
    isFirstAndLastNameValid({ target: input });
  });

  // Email check
  if (!isEmailValid({ target: emailField })) isValid = false;

  // Date of Birth check
  if (!isDateOfBirthValid({ target: dobField })) isValid = false;

  // Quantity check
  if (!isQuantityValid({ target: numberInput })) isValid = false;

  // Location selected check
  if (!isLocationValid()) isValid = false;

  // Terms conditions check
  if (!isTermsChecked()) isValid = false;

  if (isValid) {
    alert("Formulaire soumis avec succès !");
    form.reset();
  }
});
