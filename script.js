let inputsOpen = false;
const addBtn = document.querySelector(".addNewButtonWrapper"),
  colors = {
    green: "rgb(71, 140, 71)",
    darkGreen: "rgb(28, 93, 55)",
  };

const noAbilities = ["red", "blue", "yellow", "gold", "silver", "crystal"],
  fadeInOut = gsap.timeline({ defaults: { ease: "power2.out" } }),
  addMonsDivs = document.querySelector(".addMonsDivs");

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  fighting: "#C03028",
  water: "#6890F0",
  flying: "#A890F0",
  grass: "#78C850",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  psychic: "#F85888",
  rock: "#B8A038",
  ice: "#98D8D8",
  bug: "#A8B820",
  dragon: "#7038F8",
  ghost: "#705898",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

let gameOption = document.getElementById("game");
let currentGameSelect;

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
    gsap.timeline().from(div, { y: 10 }).to(div, { opacity: 1, delay: 0 }, "<");
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

  // hide other divs except name dropdown
  for (let i = 0; i < e.children.length; i++) {
    if (!e.children[i].classList.contains("nameAndType")) {
      e.children[i].classList.add("displayNone");
      gsap.to(e.children[i], { opacity: 0 });
    } else if (e.children[i].classList.contains("shinySwitch")) {
      e.children[i].classList.remove("displayNone");
    }
  }
};

// * Create inputs for Pokemon Creation
const pokedexDropdown = async (e, slotNum) => {
  if (slotNum.children.length > 0) {
    slotNum.children[0].remove();
    slotNum.removeAttribute("onclick");
  }

  const selectName = document.createElement("select");
  const option = document.createElement("option");
  option.value = "chooseMon";
  option.textContent = "Select Pokemon";
  selectName.appendChild(option);

  e.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.pokemon_species.name;
    option.textContent = p.pokemon_species.name;
    selectName.appendChild(option);
    selectName.setAttribute("oninput", `monSelect(this, ${slotNum.id})`);
    selectName.classList.add("selectPokemon");
  });

  // inputs and load divs
  let inputsDiv = document.createElement("div");
  inputsDiv.classList.add("inputsDiv");
  let loadDiv = document.createElement("div");
  loadDiv.classList.add("loadDiv");

  // create DIV to hold sprite
  let spriteDiv = document.createElement("div");
  spriteDiv.classList.add("spriteDiv");

  // create DIV for shiny switch
  let shinySwitch = document.createElement("div");
  shinySwitch.setAttribute("class", "shinySwitch displayNone");

  // create DIV to house selected Pokemon type(s)
  let typeDiv = document.createElement("div");
  typeDiv.classList.add("typeDiv");

  // create select to house abilities dropdown
  let selectAbilityDiv = document.createElement("div");
  selectAbilityDiv.classList.add("selectAbilityDiv");

  // create select to house move pool dropdown
  let selectMovesDiv = document.createElement("div");
  selectMovesDiv.classList.add("selectMovesDiv");

  // create DIV to house name dropdown and type
  let nameAndType = document.createElement("div");
  nameAndType.classList.add("nameAndType");

  // ? append divs based on whether game includes abilities or not
  if (!noAbilities.includes(slotNum.getAttribute("class"))) {
    inputsDiv.append(typeDiv, selectAbilityDiv, selectMovesDiv);
    nameAndType.append(selectName, typeDiv);
    slotNum.append(spriteDiv, nameAndType, shinySwitch, inputsDiv, loadDiv);
  } else {
    inputsDiv.append(typeDiv, selectMovesDiv);
    nameAndType.append(selectName, typeDiv);
    slotNum.append(spriteDiv, nameAndType, shinySwitch, inputsDiv, loadDiv);
  }
};

// && Pokemon Selected from dropdown
const monSelect = async (e, id) => {
  // grab data
  let currentSlot = id,
    currentGame = document.getElementById("game").value,
    loadDiv = currentSlot.querySelector(".loadDiv"),
    inputsDiv = currentSlot.querySelector(".inputsDiv");

  // show/hide during load
  for (let i = 0; i < currentSlot.children.length; i++) {
    if (!currentSlot.children[i].classList.contains("loadDiv")) {
      currentSlot.children[i].classList.add("displayNone");
      gsap.to(currentSlot.children[i], { opacity: 0 });
    } else {
      currentSlot.children[i].classList.remove("displayNone");
      currentSlot.children[i].style.opacity = 1;
    }
  }

  let mon = "";
  let loadMon = "";
  if (e.value !== "chooseMon") {
    mon = e.value;
    loadMon = await getPokemonData(mon);
  }

  let sprites = [
    {
      default: loadMon.sprites.front_default,
      shiny: loadMon.sprites.front_shiny,
    },
  ];

  // ? set up loading
  let pokeballLoad = document.createElement("img");
  pokeballLoad.classList.add("pokeballLoad");
  pokeballLoad.src = "./IMGs/pokeballIcon.png";
  loadDiv.appendChild(pokeballLoad);
  loadDiv.style.height = "100%";
  currentSlot.classList.remove("pokemonDataDisplayGrid");

  // set up input slots for selected pokemon
  let spriteDiv = currentSlot.querySelector(".spriteDiv");
  spriteDiv.innerHTML = "";

  let shinySwitch = currentSlot.querySelector(".shinySwitch");
  shinySwitch.setAttribute(
    "onclick",
    `shinySwitchFunc(this, ${JSON.stringify(sprites)}, ${currentSlot.id})`
  );
  shinySwitch.textContent = "";

  let typeDiv = currentSlot.querySelector(".typeDiv");
  typeDiv.innerHTML = "";

  let selectAbilityDiv = currentSlot.querySelector(".selectAbilityDiv");

  let selectMovesDiv = currentSlot.querySelector(".selectMovesDiv");
  let moveArr = [];
  selectMovesDiv.innerHTML = "";

  let arr = [sprites, loadMon.types, loadMon.abilities, loadMon.moves];

  // ! set timeout to allow for load
  setTimeout(() => {
    // ? end load
    loadDiv.textContent = "";
    currentSlot.classList.add("pokemonDataDisplayGrid");

    // if game has abilities, setup input
    if (!noAbilities.includes(currentGame)) {
      selectAbilityDiv.innerHTML = "";
      let selectAbility = document.createElement("select");
      selectAbility.classList.add("selectAbility");
      selectAbilityDiv.appendChild(selectAbility);
      // setup grid
      inputsDiv.classList.add("inputsDivAbilities");
    }

    // bring back divs after load
    for (let i = 0; i < currentSlot.children.length; i++) {
      if (currentSlot.children[i].classList.contains("loadDiv")) {
        currentSlot.children[i].classList.add("displayNone");
      } else {
        currentSlot.children[i].classList.remove("displayNone");
        gsap.to(currentSlot.children[i], { opacity: 1, delay: 0.5 });
      }
    }

    shinySwitch.textContent = "Shiny Off";

    arr.forEach((d) => {
      for (const key in d) {
        // console.log(d[key]);
        // ? apply sprite image
        if (d[key].default !== undefined) {
          let img = document.createElement("img");
          img.setAttribute("src", d[key].default);
          spriteDiv.appendChild(img);
        }
        // ? define the type(s) of the selected Pokemon
        if (d[key].type !== undefined) {
          let color = d[key].type.name;
          let colorKey = Object.keys(typeColors);
          let span = document.createElement("span");
          span.classList.add(d[key].type.name);
          span.textContent = d[key].type.name;
          for (const c in colorKey) {
            if (colorKey[c] === color) {
              span.style.backgroundColor = typeColors[colorKey[c]];
            }
          }
          typeDiv.appendChild(span);
        }
        // ? select the abilities of the selected Pokemon
        if (
          d[key].ability !== undefined &&
          !noAbilities.includes(currentGame)
        ) {
          let option = document.createElement("option");
          option.value = d[key].ability.name;
          option.textContent = d[key].ability.name;
          selectAbilityDiv.querySelector(".selectAbility").appendChild(option);
        }
        // ? select the moves of the selected Pokemon
        if (d[key].move !== undefined) {
          moveArr.push(d[key].move.name);
        }
      }
    });
    createMovesDropdown(moveArr, selectMovesDiv);
  }, 2000);
};

// ? create moves dropdown
const createMovesDropdown = (arr, selectDiv) => {
  let slotNum = selectDiv.parentNode.parentNode.id;
  for (let i = 0; i < 4; i++) {
    // create divs for moves accordian
    let moveDiv = document.createElement("div");
    moveDiv.classList.add(`moveDiv${i + 1}`);

    let moveDivTop = document.createElement("div");
    moveDivTop.classList.add("moveDivTop");

    let moveDivStats = document.createElement("div");
    moveDivStats.classList.add("moveDivStats");

    let moveDivDesc = document.createElement("div");
    moveDivDesc.classList.add("moveDivDesc");

    // create select and options
    let selectMoves = document.createElement("select");
    selectMoves.classList.add("selectMoves");
    selectMoves.setAttribute(
      "oninput",
      `moveSelect(this, ${JSON.stringify(arr)}, ${JSON.stringify(slotNum)})`
    );
    const moveOption = document.createElement("option");
    moveOption.value = "selectMove";
    moveOption.textContent = "Select Move";

    //append
    selectMoves.appendChild(moveOption);
    moveDivTop.append(selectMoves, moveDivStats);
    moveDiv.append(moveDivTop, moveDivDesc);

    arr.forEach((e) => {
      let option = document.createElement("option");
      option.value = e.replace("-", " ");
      option.textContent = e.replace("-", " ");

      selectMoves.appendChild(option);
    });
    selectDiv.appendChild(moveDiv);
  }
};

// ? when a move is selected
const moveSelect = (move, moveArr, slotNum) => {
  // get exact div to replace title with move
  let parent = document.getElementById(slotNum);
  let moveSlot = parent.querySelector(
    `.${move.parentNode.parentNode.getAttribute("class")}`
  );

  let desc = moveSlot.querySelector(".moveDivDesc");
  desc.setAttribute("style", "height: auto; padding: 0 0 10px 10px");
  // gsap.to(desc, {
  //   height: "auto",
  //   duration: 0.5,
  //   onComplete: () => {
  //     gsap.set(desc, { height: "auto" });
  //   },
  // });

  loadMoveData(move.value.replace(" ", "-"), moveSlot);

  // remove selected move from movepool
  moveArr = moveArr.filter((e) => e !== move.value);
};

// ? Load move data
const loadMoveData = async (move, moveSlot) => {
  let loadMove = await getMoveData(move);
  let moveDivTop = moveSlot.querySelector(".moveDivTop");
  let moveDivStats = moveDivTop.querySelector(".moveDivStats");
  let moveDivDesc = moveSlot.querySelector(".moveDivDesc");
  let typeAndDamageClass = document.createElement("div");
  typeAndDamageClass.classList.add("typeAndDamageClass");

  moveDivStats.innerHTML = "";
  moveDivDesc.innerHTML = "";

  // organize move details into divs
  for (const key in loadMove) {
    // ? move power
    if (key === "power") {
      let div = document.createElement("div");
      div.classList.add("movePower");
      loadMove[key] !== null
        ? (div.textContent = loadMove[key])
        : (div.textContent = "-");
      moveDivStats.append(div);
    }
    // ? move accuracy
    else if (key === "accuracy") {
      let div = document.createElement("div");
      div.classList.add("moveAccuracy");
      loadMove[key] !== null
        ? (div.textContent = loadMove[key])
        : (div.textContent = "-");
      moveDivStats.append(div);
    }
    // ? move PP
    else if (key === "pp") {
      let div = document.createElement("div");
      div.classList.add("movePp");
      div.textContent = loadMove[key];
      moveDivStats.append(div);
    }
    // ? move type
    else if (key === "type") {
      let div = document.createElement("div");
      let color = loadMove[key].name;
      let colorKey = Object.keys(typeColors);

      div.classList.add("moveType");
      div.textContent = loadMove[key].name;
      for (const c in colorKey) {
        if (colorKey[c] === color) {
          div.style.backgroundColor = typeColors[colorKey[c]];
        }
      }
      typeAndDamageClass.append(div);
    }
    // ? move dmg class (physical, special or status)
    else if (key === "damage_class") {
      let div = document.createElement("div");
      div.classList.add("moveDamageClass");
      // if SVG applies
      if (loadMove[key].name !== "status") {
        const SVG = createSVG(loadMove[key].name);
        div.appendChild(SVG);
      } else {
        div.textContent = loadMove[key].name;
      }

      typeAndDamageClass.append(div);
    }
    // ? move info
    else if (key === "effect_entries") {
      let div = document.createElement("div");
      div.classList.add("moveEffect");
      div.textContent = loadMove[key][0].effect;
      moveDivDesc.append(div);
    }
  }
  moveDivDesc.appendChild(typeAndDamageClass);
};

// * create SVG
const createSVG = (n) => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("effectSvg");
  svg.setAttribute("width", "25");
  svg.setAttribute("height", "25");
  svg.setAttribute("viewBox", "0 0 30 30");
  svg.setAttribute("fill", "none");

  // if physical
  if (n === "physical") {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M15.5 7.63759L17.0146 10.5774L17.3053 11.1416L17.9099 10.9482L21.0596 9.94044L20.0518 13.0901L19.8584 13.6947L20.4226 13.9854L23.3624 15.5L20.4226 17.0146L19.8584 17.3053L20.0518 17.9099L21.0596 21.0596L17.9099 20.0518L17.3053 19.8584L17.0146 20.4226L15.5 23.3624L13.9854 20.4226L13.6947 19.8584L13.0901 20.0518L9.94044 21.0596L10.9482 17.9099L11.1416 17.3053L10.5774 17.0146L7.63759 15.5L10.5774 13.9854L11.1416 13.6947L10.9482 13.0901L9.94044 9.94044L13.0901 10.9482L13.6947 11.1416L13.9854 10.5774L15.5 7.63759Z"
    );

    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
    return svg;
  }
  // if special
  else if (n === "special") {
    let circ1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    let circ2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circ1.setAttribute("cx", "12.5");
    circ1.setAttribute("cy", "12.5");
    circ1.setAttribute("r", "4");
    circ1.setAttribute("stroke", "black");
    circ1.setAttribute("stroke-width", "2");

    circ2.setAttribute("cx", "12.5");
    circ2.setAttribute("cy", "12.5");
    circ2.setAttribute("r", "9");
    circ2.setAttribute("stroke", "black");
    circ2.setAttribute("stroke-width", "2");

    svg.append(circ1, circ2);

    return svg;
  }
};

// ? shiny switching
const shinySwitchFunc = (e, sprites, par) => {
  let spriteImg = par.querySelector(".spriteDiv > img");

  if (e.textContent === "Shiny Off") {
    e.textContent = "Shiny On";
    e.classList.add("shinyOn");
    spriteImg.setAttribute("src", sprites[0].shiny);
  } else {
    e.textContent = "Shiny Off";
    spriteImg.setAttribute("src", sprites[0].default);
    e.classList.remove("shinyOn");
  }
};

// * Get party data upon confirmation
const getPartyData = () => {
  let partyArr = [];
  for (const slots of addMonsDivs.children) {
    let obj = { name: null, type: null, ability: null, moves: [] };
    for (let i = 0; i < slots.children.length; i++) {
      let value = slots.children[i];
      if (
        !value.classList.contains("addPokemonTextArea") &&
        !value.classList.contains("loadDiv")
      ) {
        // ? get pokemon name
        if (value.classList.contains("selectPokemon")) {
          obj.name = value.value;
        }
        // ? get inputs
        if (value.classList.contains("inputsDiv")) {
          for (let i = 0; i < value.children.length; i++) {
            const inputs = value.children[i];
            // ? get type
            if (inputs.classList.contains("typeDiv")) {
              obj.type = value.value;
            }
            // ? get moveset
            else if (inputs.classList.contains("selectMovesDiv")) {
              let moveArr = new Array(...inputs.children);
              moveArr.forEach((e) => {
                obj.moves.push(e.value);
              });
            }
          }
        }
      }
    }
    partyArr.push(obj);
  }
  return partyArr;
};

// & CONFIRM ENTERED DATA
// ^ CONFIRM ENTERED DATA
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
    party: getPartyData(),
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

// & CREATE FINAL DIV OF INFO ENTERED
const populateDivs = () => {
  // console.log(dataArray);
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
  let finalColor = brightness > 128 ? "#353535" : "#ffffff";
  return finalColor;
};

// ^ Call the fetchData function when the page loads
window.onload = () => {
  storeToArray();
};
