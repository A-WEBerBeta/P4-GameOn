// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalCloseBtn = document.querySelectorAll(".close");
const form = document.querySelector("form");
const formData = document.querySelectorAll(".formData");
const burgerMenu = document.querySelector("#burger_menu");
const twoMinCharsFields = document.querySelectorAll(".two-min-chars");
const emailField = document.querySelector(".email");
const dobField = document.querySelector("#birthdate");
const numberInput = document.querySelector("#quantity");
const radios = document.querySelectorAll('input[name="location"]');
const termsCheckbox = document.querySelector('input[name="terms"]');

const formErrors = {
  isFirstNameValid: false,
  isLastNameValid: false,
  isEmailValid: false,
  isDateOfBirthValid: false,
  isQuantityValid: false,
  isLocationValid: false,
  isTermsChecked: false,
};

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
modalCloseBtn.forEach((btn) => btn.addEventListener("click", closeModal));
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

  if (!isValid) {
    formErrors[e.target.name] = false;
    setError(input, "Veuillez saisir 2 caractères minimum");
  } else {
    formErrors[e.target.name] = true;
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
    formErrors.isEmailValid = false;
    setError(input, "Veuillez entrer un email valide");
  } else {
    formErrors.isEmailValid = true;
    setError(input, "");
  }
}

//
// Validate birthday date
// This function checks if the date of birth is correctly entered.
//

function isDateOfBirthValid(e) {
  const input = e.target;
  const dateOfBirth = new Date(input.value);

  if (!input.value) {
    formErrors.isDateOfBirthValid = false; // check if the input is empty
    setError(input, "Veuillez entrer votre date de naissance");
  } else {
    // we check if the date of birth is valid
    if (isNaN(dateOfBirth.getTime())) {
      formErrors.isDateOfBirthValid = false;
      setError(input, "La date de naissance est invalide");
    } else {
      // we calculate the age of the person
      const today = new Date();
      let age = today.getFullYear() - dateOfBirth.getFullYear();
      const month = today.getMonth() - dateOfBirth.getMonth();

      // Adjust age if birthday hasn't passed yet this year
      if (
        month < 0 ||
        (month === 0 && today.getDate() < dateOfBirth.getDate())
      ) {
        age--;
      }

      // Check is the age is between 16 & 99 yo
      if (age >= 16 && age <= 99) {
        formErrors.isDateOfBirthValid = true;
        setError(input, "");
      } else {
        formErrors.isDateOfBirthValid = false;
        setError(
          input,
          "Vous devez avoir entre 16 et 99 ans pour vous inscrire"
        );
      }
    }
  }
}

//
// Validate a numeric value
// This function checks if the entered value is indeed a numeric value.
//

function isQuantityValid(e) {
  const input = e.target;
  const quantity = parseInt(input.value.trim(), 10); // convert value in integer

  if (
    input.value.trim() === "" ||
    isNaN(quantity) ||
    quantity < 0 ||
    quantity > 99
  ) {
    formErrors.isQuantityValid = false;
    setError(input, "Veuillez entrer un nombre valide entre 0 et 99");
  } else {
    formErrors.isQuantityValid = true;
    setError(input, "");
  }
}

//
// Validate radios
// Creates an array from radio buttons & check if there is one checked.
//

function isLocationValid() {
  const selectedLocation = Array.from(radios).some((radio) => radio.checked);
  if (!selectedLocation) {
    formErrors.isLocationValid = false;
    radios.forEach((radio) =>
      setError(radio, "Veuillez sélectionner une ville")
    );
  } else {
    formErrors.isLocationValid = true;
    radios.forEach((radio) => setError(radio, ""));
  }
}

//
// Validate checkbox
// This function checks if the terms checkbox is checked (the other one is possibly checked but not required to validate form submit)
//

function isTermsChecked() {
  if (!termsCheckbox.checked) {
    formErrors.isTermsChecked = false;
    setError(termsCheckbox, "Vous devez accepter les conditions d'utilisation");
  } else {
    formErrors.isTermsChecked = true;
    setError(termsCheckbox, "");
  }
}

//
// Form submit
// This function allows to keep the entered values in the form if it doesn't pass the check validity.
// If all the entries are correct, display the confirm overlay with a confirm message & reset form.
//

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isInvalid = Object.values(formErrors).some((field) => field === false);

  isFirstAndLastNameValid({ target: twoMinCharsFields[0] }); // check first name
  isFirstAndLastNameValid({ target: twoMinCharsFields[1] }); // check last name
  isEmailValid({ target: emailField }); // check email
  isDateOfBirthValid({ target: dobField }); // check date of birth
  isQuantityValid({ target: numberInput }); // check a numeric number
  isLocationValid(); // check if a location is checked
  isTermsChecked(); // check if the terms are checked

  if (!isInvalid) {
    const confirmOverlay = document.querySelector(".confirmOverlay");
    confirmOverlay.style.visibility = "visible";
    confirmOverlay.style.opacity = "1";

    form.reset();
  }
});
