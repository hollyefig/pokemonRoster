let inputsOpen = false;
const addBtn = document.querySelector(".addNewButtonWrapper"),
  colors = {
    green: "rgb(71, 140, 71)",
    darkGreen: "rgb(28, 93, 55)",
  };
const tlDrop = gsap.timeline({
  defaults: { ease: "power2.inOut", duration: 0.7 },
});

// ADD NEW ROSTER
const addNew = () => {
  let allInputs = new Array(...document.querySelectorAll(".inputData > input"));
  allInputs.forEach((e, index) => {
    allInputs[index] = e.value !== "";
  });

  if (!inputsOpen) {
    tlDrop
      .to(".top", { height: "55dvh" })
      .to(".inputDataWrapper", { height: "100%" }, "<");

    inputsOpen = true;
    addBtn.classList.add("btnBlink");
  } else {
    if (allInputs.includes(false)) {
      alert("enter in all data");
    } else {
      gsap
        .timeline({ defaults: { delay: 1 } })
        .add(() => closeAdd())
        .add(() => {
          allInputs = new Array(
            ...document.querySelectorAll(".inputData > input")
          );
          allInputs.forEach((e) => {
            e.value = "";
          });
        }, ">1");

      addBtn.classList.remove("btnBlink");
      confirmData();
    }
  }
};

// close the add slide
const closeAdd = () => {
  tlDrop
    .to(".top", { height: 70.5 })
    .to(".inputDataWrapper", { height: 0 }, "<");
  inputsOpen = false;
  addBtn.classList.remove("btnBlink");
};
window.addEventListener("keydown", (e) => {
  e.key === "Escape" && inputsOpen && closeAdd;
  e.key === "Enter" && inputsOpen && addNew();
});
document.querySelector(".bottom").addEventListener("click", (e) => {
  inputsOpen && closeAdd();
});

// CONFIRM ENTERED DATA
const rosterWrapper = document.querySelector(".rosterWrapper");
let dataArray = [];

// Initialize the counter from localStorage or set it to 1 if not present
let counter = parseInt(localStorage.getItem("counter")) || 1;

const confirmData = () => {
  const inputs = {
    name: document.getElementById("name").value,
    game: document.getElementById("game").value,
    key: `key${counter}`,
  };

  // to string
  const JSONstring = JSON.stringify(inputs);

  // Create  key
  const key = `key${counter}`;
  localStorage.setItem(key, JSONstring);

  // Increment the counter for the next unique key
  counter++;

  // Save the updated counter to localStorage
  localStorage.setItem("counter", counter.toString());

  // Display the stored value
  storeToArray();
};

// store data to array
const storeToArray = () => {
  dataArray = [];
  Object.entries(localStorage).forEach(([key, value]) => {
    let toObj = JSON.parse(value);
    typeof toObj !== "number" && dataArray.push(toObj);
  });
  populateDivs();
};

// CREATE DIV OF INFO
const populateDivs = () => {
  const rosterWrapper = document.querySelector(".rosterWrapper");
  rosterWrapper.innerHTML = "";

  dataArray.forEach((obj) => {
    const div = document.createElement("div"),
      name = document.createElement("span"),
      game = document.createElement("span");
    for (const k in obj) {
      if (k === "key") {
        div.classList.add(obj[k]);
      } else if (k === "name") {
        name.classList.add(obj[k]);
        name.textContent = obj[k];
      } else if (k === "game") {
        game.classList.add(obj[k]);
        game.textContent = obj[k];
      }
    }

    div.append(name, game);
    rosterWrapper.appendChild(div);
  });
};

const clearStorage = () => {
  localStorage.clear();
  document.getElementById("rosterWrapper").innerHTML = "";
  dataArray = [];
};

// Call the storeToArray function when the page loads
window.onload = storeToArray;
