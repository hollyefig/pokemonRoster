let inputsOpen = false;
const addBtn = document.querySelector(".addNewButtonWrapper");

// ADD NEW ROSTER
const addNew = () => {
  const tlDrop = gsap.timeline({
    defaults: { ease: "power2.inOut", duration: 0.7 },
  });

  if (!inputsOpen) {
    tlDrop
      .to(".top", { height: "55dvh" })
      .to(".inputDataWrapper", { height: "100%" }, "<");
    inputsOpen = true;
  } else {
    tlDrop
      .to(".top", { height: 70.5 })
      .to(".inputDataWrapper", { height: 0 }, "<");
    inputsOpen = false;
    confirmData();
  }
};
window.addEventListener("keydown", (e) => {
  e.key === "Escape" && inputsOpen && addNew();
});
document.querySelector(".bottom").addEventListener("click", (e) => {
  inputsOpen && addNew();
});

// CONFIRM ENETERED DATA
const rosterWrapper = document.querySelector(".rosterWrapper");

const confirmData = () => {
  const inputName = document.getElementById("Name").value;

  // Store the value in localStorage with the key 'exampleKey'
  localStorage.setItem("exampleKey", inputName);

  // Display the stored value
  displayStoredValue();
};

const displayStoredValue = () => {
  // Get the stored value using the key 'exampleKey'
  const storedValue = localStorage.getItem("exampleKey");
  // Display the stored value on the webpage
  document.getElementById("rosterWrapper").textContent = storedValue;
};

const clearStorage = () => {
  localStorage.clear();
  document.getElementById("rosterWrapper").textContent = "";
};

// Call the displayStoredValue function when the page loads
window.onload = displayStoredValue;
