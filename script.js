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

  // createSlots(selected);
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
  let loadDiv = document.createElement("div");
  loadDiv.classList.add("loadDiv");

  slotNum.append(selectName, loadDiv);
};

// & CREATE DIVS
const divCreator = (e) => {
  let div = document.createElement(e.element);
  div.classList.add(e.name);
  return div;
};

// && Pokemon Selected from dropdown
const monSelect = async (e, id) => {
  // grab data
  let currentSlot = id,
    currentGame = document.getElementById("game").value,
    loadDiv = currentSlot.querySelector(".loadDiv"),
    selectPokemon = currentSlot.querySelector(".selectPokemon");

  // ? reset all elements
  const elementReset = [
    "inputsDiv",
    "spriteDiv",
    "typeAndShiny",
    // "selectAbilityDiv",
  ];
  if (currentSlot.children.length > 2) {
    elementReset.forEach((e) => {
      currentSlot.querySelector(`.${e}`).remove();
    });
  }

  // ? create divs for mon customization, depending on whether game has abilities
  for (let i = 0; i < monInputDivs.length; i++) {
    if (!noAbilities.includes(currentGame)) {
      currentSlot.append(divCreator(monInputDivs[i]));
    } else {
      if (monInputDivs[i].name !== "selectAbilityDiv") {
        currentSlot.append(divCreator(monInputDivs[i]));
      }
    }
  }
  inputsDiv = currentSlot.querySelector(".inputsDiv");
  spriteDiv = currentSlot.querySelector(".spriteDiv");
  typeAndShiny = currentSlot.querySelector(".typeAndShiny");
  typeDiv = currentSlot.querySelector(".typeDiv");
  selectMovesDiv = currentSlot.querySelector(".selectMovesDiv");
  // append child divs
  inputsDiv.appendChild(selectMovesDiv);
  typeAndShiny.appendChild(typeDiv);
  currentSlot.appendChild(loadDiv);

  // ? load up pokemon data
  let loadMon;
  if (e.value !== "chooseMon") {
    loadMon = await getPokemonData(e.value);
  }

  let sprites = [
    {
      default: loadMon.sprites.front_default,
      shiny: loadMon.sprites.front_shiny,
    },
  ];

  // create DIV for shiny switch
  let shinySwitch = document.createElement("div");
  shinySwitch.setAttribute("class", "shinySwitch");
  shinySwitch.appendChild(createSVG("shiny"));

  shinySwitch.setAttribute(
    "onclick",
    `shinySwitchFunc(this, ${JSON.stringify(sprites)}, ${currentSlot.id})`
  );

  // ? set up loading
  let pokeballLoad = document.createElement("img");
  pokeballLoad.classList.add("pokeballLoad");
  pokeballLoad.src = "./IMGs/pokeballIcon.png";
  loadDiv.appendChild(pokeballLoad);
  loadDiv.style.height = "auto";
  currentSlot.classList.remove("pokemonDataDisplayGrid");
  // display none
  selectPokemon.classList.add("displayNone");
  typeDiv.classList.add("displayNone");

  // create scoped variables for moves, mon data
  let moveArr = [];
  let arr = [sprites, loadMon.types, loadMon.abilities, loadMon.moves];

  // ! set timeout to allow for load
  setTimeout(() => {
    // ? end load
    loadDiv.textContent = "";
    currentSlot.classList.add("pokemonDataDisplayGrid");
    selectPokemon.classList.remove("displayNone");
    typeDiv.classList.remove("displayNone");

    // ~ if game has abilities, setup input
    if (!noAbilities.includes(currentGame)) {
      let selectAbilityDiv = currentSlot.querySelector(".selectAbilityDiv");
      selectAbilityDiv.innerHTML = "";
      let selectAbility = document.createElement("select");
      selectAbility.classList.add("selectAbility");
      selectAbility.setAttribute(
        "oninput",
        `selectAbility(this, ${JSON.stringify(currentSlot.id)})`
      );
      let option = document.createElement("option");
      option.value = "selectAbility";
      option.textContent = "Select Ability";

      //append
      selectAbility.appendChild(option);
      // ? create divs for mon customization
      for (let i = 0; i < abilityInputDivs.length; i++) {
        selectAbilityDiv.append(divCreator(abilityInputDivs[i]));
      }

      currentSlot
        .querySelector(".selectAbilitiesWrap")
        .appendChild(selectAbility);

      inputsDiv.append(selectAbilityDiv);
      // setup grid
      inputsDiv.classList.add("inputsDivAbilities");
    }

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
          typeDiv.append(span);
          typeDiv.appendChild(shinySwitch);
        }
        // ? select the abilities of the selected Pokemon
        if (
          d[key].ability !== undefined &&
          !noAbilities.includes(currentGame)
        ) {
          let option = document.createElement("option");
          option.value = d[key].ability.name;
          option.textContent = d[key].ability.name;
          currentSlot.querySelector(".selectAbility").appendChild(option);
        }
        // ? select the moves of the selected Pokemon
        if (d[key].move !== undefined) {
          moveArr.push(d[key].move.name);
        }
      }
    });

    createMovesDropdown(moveArr, selectMovesDiv);
    createSlots(currentGame);
  }, 2000);
};

// ? When an ability is selected
const selectAbility = async (e, slotNum) => {
  if (e.value !== "selectAbility") {
    let loadAbility = await getAbility(e.value);
    let parent = document.getElementById(slotNum);
    let desc = parent.querySelector(".abilitiesDescDiv");

    for (const ent in loadAbility.effect_entries) {
      if (loadAbility.effect_entries[ent].language.name === "en") {
        desc.textContent = loadAbility.effect_entries[ent].effect;
      }
    }
  }
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

  let effectChance = loadMove.effect_chance;

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
      div.textContent = loadMove[key][0].effect.replace(
        /\$effect_chance/g,
        effectChance
      );

      moveDivDesc.append(div);
    }
  }
  moveDivDesc.appendChild(typeAndDamageClass);
};

// * create SVG
const createSVG = (n) => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("fill", "none");

  if (n === "physical" || n === "special") {
    svg.classList.add("effectSvg");
    svg.setAttribute("width", "25");
    svg.setAttribute("height", "25");

    // if physical
    if (n === "physical") {
      svg.setAttribute("viewBox", "0 0 30 30");
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
      svg.setAttribute("viewBox", "0 0 25 25");
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
      circ1.setAttribute("r", "3");
      circ1.setAttribute("stroke", "black");
      circ1.setAttribute("stroke-width", "2");

      circ2.setAttribute("cx", "12.5");
      circ2.setAttribute("cy", "12.5");
      circ2.setAttribute("r", "8");
      circ2.setAttribute("stroke", "black");
      circ2.setAttribute("stroke-width", "2");

      svg.append(circ1, circ2);

      return svg;
    }
  } else if (n === "shiny") {
    svg.classList.add("shinySvg");
    svg.setAttribute("width", "35");
    svg.setAttribute("height", "35");
    svg.setAttribute("viewBox", "0 0 30 30");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M15.5 7.56644L17.8011 11.7857L17.9715 12.0983L18.3214 12.1638L23.0453 13.0484L19.7436 16.5406L19.499 16.7994L19.5448 17.1524L20.1632 21.9184L15.8216 19.8575L15.5 19.7048L15.1784 19.8575L10.8368 21.9184L11.4552 17.1524L11.501 16.7994L11.2564 16.5406L7.95473 13.0484L12.6786 12.1638L13.0285 12.0983L13.1989 11.7857L15.5 7.56644Z"
    );
    path.setAttribute("stroke", "#DFAB0A");
    path.setAttribute("stroke-width", "1.5");

    svg.append(path);

    return svg;
  }
};

// ? shiny switching
const shinySwitchFunc = (e, sprites, par) => {
  let svg = e.children[0];
  let spriteImg = par.querySelector(".spriteDiv > img");

  if (!svg.classList.contains("shinyOn")) {
    spriteImg.setAttribute("src", sprites[0].shiny);
    svg.classList.add("shinyOn");
  } else {
    spriteImg.setAttribute("src", sprites[0].default);
    svg.classList.remove("shinyOn");
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
