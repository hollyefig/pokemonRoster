let inputsOpen = false;
const addBtn = document.querySelector(".addNewButtonWrapper"),
  colors = {
    green: "rgb(71, 140, 71)",
    darkGreen: "rgb(28, 93, 55)",
  };

const noAbilities = ["red", "blue", "yellow", "gold", "silver", "crystal"],
  fadeInOut = gsap.timeline({ defaults: { ease: "power2.out" } }),
  addMonsDivs = document.querySelector(".addMonsDivs");

let gameOption = document.getElementById("game");
let currentGameSelect;
let movepool = [];

// & ADD NEW ROSTER
const addNew = () => {
  let allInputs = new Array(...document.querySelectorAll(".selection"));
  allInputs.forEach((e, index) => {
    allInputs[index] = e.value !== "" && gameOption.value !== "choose";
  });

  if (!inputsOpen) {
    inputsOpen = true;
    fadeInOut
      .to(".inputDataWrapper, .fadeBg", { display: "flex" })
      .to(".inputDataWrapper, .fadeBg", { opacity: 1, delay: 0 }, "<.1");
  } else {
    if (allInputs.includes(false)) {
      let chkInputs = new Array(...document.querySelectorAll(".selection"));

      chkInputs.forEach((e) => {
        if (e.value === "" || e.value === "choose") {
          e.classList.add("required");
        }
      });
    } else {
      gsap
        .timeline({ defaults: { delay: 1 } })
        .add(() => closeAdd())
        .add(() => {
          allInputs = new Array(...document.querySelectorAll(".selection"));
          allInputs.forEach((e) => {
            e.value = "";
          });
        }, ">1");

      const rosterColor = document.getElementById("rosterColor").value;
      addBtn.classList.remove("btnBlink");
      confirmData(rosterColor, dataArray.length - 1);
    }
  }
};

// & NAME INPUT CHANGE, removing the 'required' class
const inputShift = (e) => {
  if (e.value !== "" || e.id !== "choose") {
    e.classList.remove("required");
  }
};

// && GAME DROPDOWN
document.getElementById("game").addEventListener("click", (e) => {
  currentGameSelect = e.target.value;
});
const gameDropdown = (e) => {
  inputShift(e);
  addMonsDivs.innerHTML = "";
  partyLimit = 1;
  createSlots(e.value);

  // make add mon button appear
  if (e.value === "choose") {
    gsap
      .timeline()
      .to(".addMonsDivs", {
        opacity: 0,
        duration: 0.2,
      })
      .to(".addMonsDivs", { height: 0 });
  } else {
    gsap
      .timeline()
      .to(".addMonsDivs", {
        height: "auto",
        duration: 0.1,
      })
      .to(".addMonsDivs, .addMonsDivs > div", {
        opacity: 1,
        duration: 0.2,
      });
  }
};

// close the add slide
const closeAdd = () => {
  fadeInOut
    .to(".inputDataWrapper, .fadeBg", { opacity: 0, delay: 0 })
    .to(".inputDataWrapper, .fadeBg", { display: "none" }, "<");
  inputsOpen = false;
  addBtn.classList.remove("btnBlink");
};
window.addEventListener("keydown", (e) => {
  e.key === "Escape" && inputsOpen && closeAdd();
  e.key === "Enter" && inputsOpen && addNew();
});
document.querySelector(".fadeBg").addEventListener("click", (e) => {
  inputsOpen && closeAdd();
});

// & CONFIRM ENTERED DATA
// * CONFIRM ENTERED DATA
const rosterWrapper = document.querySelector(".rosterWrapper");
let dataArray = [];

// Initialize the counter from localStorage or set it to 1 if not present
let counter = parseInt(localStorage.getItem("counter")) || 1;

const confirmData = (color, num) => {
  let inputs = {
    name: document.getElementById("name").value,
    game: document.getElementById("game").value,
    key: `key${counter}`,
    color: color,
    textColor: null,
    gameData: `https://pokeapi.co/api/v2/version/${
      document.getElementById("game").value
    }`,
    party: [],
  };

  inputs.textColor = setTextColor(inputs.color);

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

// & store data to array
const storeToArray = () => {
  dataArray = [];
  Object.entries(localStorage).forEach(([key, value]) => {
    let toObj = JSON.parse(value);
    typeof toObj !== "number" && dataArray.push(toObj);
  });

  // Sort the array
  dataArray.sort(sortByKeyNumber);
  populateDivs();
};

// ARRAY SORT
const sortByKeyNumber = (a, b) => {
  const keyA = parseInt(a.key.slice(3));
  const keyB = parseInt(b.key.slice(3));

  // Compare based on the numeric part
  return keyA - keyB;
};

// & Pokemon Select button
const addMonsWrapper = document.querySelector(".addMonsWrapper");

partyLimit = 1;

const createSlots = (game) => {
  if (partyLimit <= 6) {
    const div = document.createElement("div");
    div.setAttribute("id", `slot${partyLimit}`);
    div.classList.add(game);
    div.setAttribute("onclick", "loadPokedex(this)");
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("addPokemonTextArea");
    const plusIcon = document.createElement("div");
    plusIcon.setAttribute("class", "material-symbols-outlined plusSlot");
    plusIcon.textContent = "add";
    const msg = document.createElement("div");
    msg.textContent = "Add Pokemon";

    innerDiv.append(plusIcon, msg);
    div.appendChild(innerDiv);
    addMonsDivs.appendChild(div);
    gsap.to(div, { opacity: 1 });
  }
  partyLimit++;
};

// & GRAB POKEDEX DATA
const loadPokedex = async (e) => {
  e.style.cursor = "default";
  const selected = document.getElementById("game").value;
  const loadPokedex = await getSelectedGameURL(selected);

  pokedexDropdown(loadPokedex, e);

  createSlots(selected);
};

// * Create inputs for Pokemon Creation
const pokedexDropdown = (e, slotNum) => {
  if (slotNum.children.length > 0) {
    slotNum.children[0].remove();
    slotNum.removeAttribute("onclick");
  }

  const selectName = document.createElement("select");

  e.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.pokemon_species.name;
    option.textContent = p.pokemon_species.name;
    selectName.appendChild(option);
    selectName.setAttribute("oninput", `monSelect(this, ${slotNum.id})`);
  });

  // create DIV to house selected Pokemon type(s)
  let typeDiv = document.createElement("div");
  typeDiv.classList.add("typeDiv");

  // create select to house abilities dropdown
  let selectAbilityDiv = document.createElement("div");
  selectAbilityDiv.classList.add("selectAbilityDiv");
  let selectAbility = document.createElement("select");
  selectAbility.classList.add("selectAbility");
  selectAbilityDiv.appendChild(selectAbility);

  // create select to house move pool dropdown
  let selectMovesDiv = document.createElement("div");
  selectMovesDiv.classList.add("selectMovesDiv");

  // append divs based on whether game includes abilities or not
  if (!noAbilities.includes(slotNum.getAttribute("class"))) {
    selectAbilityDiv.appendChild(selectAbility);
    slotNum.append(selectName, typeDiv, selectAbilityDiv, selectMovesDiv);
  } else {
    slotNum.append(selectName, typeDiv, selectMovesDiv);
  }
};

// * Pokemon Selected from dropdown
const monSelect = async (e, id) => {
  movepool = [];
  // grab data
  let currentSlot = id;
  let currentGame = document.getElementById("game").value;
  let mon = e.value;

  const loadMon = await getPokemonData(mon);

  let typeDiv = currentSlot.querySelector(".typeDiv");
  typeDiv.innerHTML = "";

  let selectAbility = currentSlot.querySelector(".selectAbility");
  typeDiv.innerHTML = "";

  let selectMovesDiv = currentSlot.querySelector(".selectMovesDiv");
  let moveArr = [];

  let arr = [loadMon.types, loadMon.abilities, loadMon.moves];
  arr.forEach((d) => {
    // console.log("keys", d);
    for (const key in d) {
      // ? define the type(s) of the selected Pokemon
      if (d[key].type !== undefined) {
        let span = document.createElement("span");
        span.classList.add(d[key].type.name);
        span.textContent = d[key].type.name;
        typeDiv.appendChild(span);
      }
      // ? select the abilities of the selected Pokemon
      if (d[key].ability !== undefined && !noAbilities.includes(currentGame)) {
        let option = document.createElement("option");
        option.value = d[key].ability.name;
        option.textContent = d[key].ability.name;
        selectAbility.appendChild(option);
      }
      // ? select the moves of the selected Pokemon
      if (d[key].move !== undefined) {
        moveArr.push(d[key].move.name);
      }
    }
  });
  createMovesDropdown(moveArr, selectMovesDiv);
};

// ? create moves dropdown
const createMovesDropdown = (arr, selectDiv) => {
  let selectMoves = document.createElement("select");
  selectMoves.classList.add("selectMoves");
  arr.forEach((e) => {
    let option = document.createElement("option");
    option.value = e.replace("-", " ");
    option.textContent = e.replace("-", " ");
    selectMoves.setAttribute("oninput", `moveSelect(this)`);
    selectMoves.appendChild(option);
  });
  selectDiv.appendChild(selectMoves);
};
// ? when a move is selected
const moveSelect = (move) => {
  movepool.push(move.value);
};

// & CREATE FINAL DIV OF INFO ENTERED
const populateDivs = () => {
  const rosterWrapper = document.querySelector(".rosterWrapper");
  rosterWrapper.innerHTML = "";

  dataArray.forEach((obj) => {
    const div = document.createElement("div"),
      settings = document.createElement("div"),
      close = document.createElement("div"),
      name = document.createElement("span"),
      game = document.createElement("span");
    for (const k in obj) {
      if (k !== "") {
        if (k === "key") {
          div.classList.add(obj[k]);
        } else if (k === "name") {
          name.classList.add(obj[k].replace(/ /g, "-"));
          name.classList.add("spanName");
          name.textContent = obj[k];
        } else if (k === "game") {
          game.classList.add(obj[k].replace(/ /g, "-"));
          game.classList.add("gameName");
          game.textContent = obj[k];
        } else if (k === "color") {
          name.style.backgroundColor = obj[k];
          div.style.borderTop = `18px solid ${obj[k]}`;
        } else if (k === "textColor") {
          name.style.color = obj[k];
        }
      }
    }
    settings.classList.add("settings");
    close.classList.add("close");
    settings.appendChild(close);

    div.append(name, settings, game);
    rosterWrapper.appendChild(div);
  });
};

const clearStorage = () => {
  localStorage.clear();
  document.getElementById("rosterWrapper").innerHTML = "";
  dataArray = [];
};

// & ADJUST TEXT COLOR BASED ON BG
const getBrightness = (color) => {
  // Convert the color to RGB components
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  // Calculate perceived brightness
  return (r * 299 + g * 587 + b * 114) / 1000;
};
const setTextColor = (color) => {
  // Calculate brightness
  const brightness = getBrightness(color);

  // Set text color based on brightness
  let finalColor = brightness > 128 ? "#353535" : "#F0F5EF";
  return finalColor;
};

// ^ Call the fetchData function when the page loads
window.onload = () => {
  storeToArray();
};
