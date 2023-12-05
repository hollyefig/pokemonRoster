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
      reset();
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

// ? close the add slide
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

// ? clear all inputs of pokemon
const reset = () => {
  document.querySelector(".addMonsDivs").innerHTML = "";
  document.getElementById("game").value = "choose";
  partyLimit = 1;
};

// & Pokemon Select button
const addMonsWrapper = document.querySelector(".addMonsWrapper");

let partyLimit = 1;

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

  e.classList.add("addFlex");

  createSlots(selected);
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
    selectName.setAttribute("oninput", `monSelect(this)`);
    selectName.classList.add("selectPokemon");
  });

  slotNum.append(selectName);
};

// & CREATE DIVS
const divCreator = (e) => {
  let div = document.createElement(e.element);
  div.classList.add(e.name);

  return div;
};

// && Pokemon Selected from dropdown
const monSelect = async (e) => {
  if (e.value !== "chooseMon") {
    e.value === "chooseMon" && (e.disabled = true);
    // grab data
    let currentSlot = e.parentNode,
      currentGame = document.getElementById("game").value;

    !currentSlot.classList.contains("addFlex") &&
      currentSlot.classList.add("addFlex");

    // ? reset all elements
    const elementReset = ["inputsDiv", "spriteDiv", "typeAndShiny"];
    if (currentSlot.children.length > 2) {
      elementReset.forEach((e) => {
        currentSlot.querySelector(`.${e}`).remove();
      });
    }

    // ? Create divs for all other input slots : START
    for (let i = 0; i < monInputDivs.length; i++) {
      currentSlot.append(divCreator(monInputDivs[i]));
    }

    // ? add display none
    for (let i = 0; i < currentSlot.children.length; i++) {
      if (!currentSlot.children[i].classList.contains("displayNone")) {
        currentSlot.children[i].classList.add("displayNone");
      }
    }

    let inputsDiv = currentSlot.querySelector(".inputsDiv");
    let spriteDiv = currentSlot.querySelector(".spriteDiv");
    let typeAndShiny = currentSlot.querySelector(".typeAndShiny");
    let typeDiv = currentSlot.querySelector(".typeDiv");
    let selectMovesDiv = currentSlot.querySelector(".selectMovesDiv");
    let removeMon = currentSlot.querySelector(".removeMon");
    // append child divs
    inputsDiv.appendChild(selectMovesDiv);
    typeAndShiny.appendChild(typeDiv);

    // ? Create divs for all other input slots : END

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
    let arr = [sprites, loadMon.types, loadMon.abilities, loadMon.moves];

    // create DIV for shiny switch
    let shinySwitch = document.createElement("div");
    shinySwitch.setAttribute("class", "shinySwitch");
    shinySwitch.appendChild(createSVG("shiny"));

    shinySwitch.setAttribute(
      "onclick",
      `shinySwitchFunc(this, ${JSON.stringify(sprites)})`
    );

    // ** set up loading, animation
    let loadDiv = document.createElement("div");
    loadDiv.classList.add("loadDiv");
    currentSlot.appendChild(loadDiv);
    let pokeballLoad = document.createElement("img");
    pokeballLoad.classList.add("pokeballLoad");
    pokeballLoad.src = "./IMGs/pokeballIcon.png";
    loadDiv.appendChild(pokeballLoad);
    loadDiv.style.height = "auto";
    currentSlot.classList.remove("pokemonDataDisplayGrid");

    // create scoped variables for moves, mon data
    let moveArr = [];

    // ! set timeout to allow for load : START
    setTimeout(() => {
      // ? end load
      loadDiv.remove();
      currentSlot.classList.remove("addFlex");
      currentSlot.classList.add("pokemonDataDisplayGrid");

      // ? remove display none
      for (let i = 0; i < currentSlot.children.length; i++) {
        if (currentSlot.children[i].classList.contains("displayNone")) {
          currentSlot.children[i].classList.remove("displayNone");
        }
        for (let n = 0; n < currentSlot.children[i].children.length; n++) {
          if (
            currentSlot.children[i].children[n].classList.contains(
              "displayNone"
            )
          ) {
            currentSlot.children[i].children[n].classList.remove("displayNone");
          }
        }
      }

      removeMon.setAttribute(
        "onclick",
        `removeMon(this, ${JSON.stringify(currentSlot.id)})`
      );
      removeMon.textContent = "Remove";

      // ~ if abilities are included : START
      let selectAbilityDiv = currentSlot.querySelector(".selectAbilityDiv");
      selectAbilityDiv.innerHTML = "";

      for (let i = 0; i < abilityInputDivs.length; i++) {
        selectAbilityDiv.append(divCreator(abilityInputDivs[i]));
      }
      for (let i = 0; i < abilityInputDivs.length; i++) {
        if (abilityInputDivs[i].parent !== undefined) {
          selectAbilityDiv
            .querySelector(`.${abilityInputDivs[i].parent}`)
            .append(
              selectAbilityDiv.querySelector(`.${abilityInputDivs[i].name}`)
            );
        }
      }
      let selectAbility = currentSlot.querySelector(".selectAbility");
      selectAbility.setAttribute("oninput", `selectAbility(this)`);
      let option = document.createElement("option");
      option.value = "selectAbility";
      option.textContent = "Select Ability";
      selectAbility.appendChild(option);

      inputsDiv.append(selectAbilityDiv);

      if (!noAbilities.includes(currentGame)) {
        inputsDiv.classList.add("inputsDivAbilities");
        selectAbilityDiv.style.height = "auto";
      } else {
        inputsDiv.classList.remove("inputsDivAbilities");
        selectAbilityDiv.style.height = "0px";
      }
      // ~ if abilities are included : END

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
    }, 2000);
    // ! set timeout to allow for load : END
  }
};
// ? When an ability is selected
const selectAbility = async (e) => {
  if (e.value !== "selectAbility") {
    let loadAbility = await getAbility(e.value);
    let parent = e.closest(".inputsDiv").parentNode;
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
      `moveSelect(this, ${JSON.stringify(arr)})`
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
const moveSelect = (move, moveArr) => {
  // get exact div to replace title with move
  let parent = move.closest(".inputsDiv").parentNode;
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

      const SVG = createSVG(loadMove[key].name);
      SVG.setAttribute("id", loadMove[key].name);
      div.appendChild(SVG);

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

  if (n === "physical" || n === "special" || n === "status") {
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

      path.setAttribute("stroke", "#a39f9f");
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
      circ1.setAttribute("stroke", "#a39f9f");
      circ1.setAttribute("stroke-width", "2");

      circ2.setAttribute("cx", "12.5");
      circ2.setAttribute("cy", "12.5");
      circ2.setAttribute("r", "8");
      circ2.setAttribute("stroke", "#a39f9f");
      circ2.setAttribute("stroke-width", "2");

      svg.append(circ1, circ2);

      return svg;
    }
    // if special
    else if (n === "status") {
      svg.setAttribute("viewBox", "0 0 30 30");
      let path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path1.setAttribute("stroke", "#a39f9f");
      path1.setAttribute("stroke-width", "1.5");
      path1.setAttribute("stroke-linecap", "round");
      path1.setAttribute(
        "d",
        "M4 5.84L7.24903 8.1793C7.59804 8.43058 8.06863 8.43058 8.41764 8.1793L11.0824 6.2607C11.4314 6.00941 11.902 6.00941 12.251 6.2607L14.9157 8.1793C15.2647 8.43058 15.7353 8.43058 16.0843 8.1793L18.749 6.2607C19.098 6.00941 19.5686 6.00941 19.9176 6.2607L22.5824 8.1793C22.9314 8.43058 23.402 8.43058 23.751 8.1793L27 5.84"
      );

      let path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path2.setAttribute("stroke", "#a39f9f");
      path2.setAttribute("stroke-width", "1.5");
      path2.setAttribute("stroke-linecap", "round");
      path2.setAttribute(
        "d",
        "M4 16.88L7.24903 19.2193C7.59804 19.4706 8.06863 19.4706 8.41764 19.2193L11.0824 17.3007C11.4314 17.0494 11.902 17.0494 12.251 17.3007L14.9157 19.2193C15.2647 19.4706 15.7353 19.4706 16.0843 19.2193L18.749 17.3007C19.098 17.0494 19.5686 17.0494 19.9176 17.3007L22.5824 19.2193C22.9314 19.4706 23.402 19.4706 23.751 19.2193L27 16.88"
      );

      let path3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path3.setAttribute("stroke", "#a39f9f");
      path3.setAttribute("stroke-width", "1.5");
      path3.setAttribute("stroke-linecap", "round");
      path3.setAttribute(
        "d",
        "M4 11.36L7.24903 13.6993C7.59804 13.9506 8.06863 13.9506 8.41764 13.6993L11.0824 11.7807C11.4314 11.5294 11.902 11.5294 12.251 11.7807L14.9157 13.6993C15.2647 13.9506 15.7353 13.9506 16.0843 13.6993L18.749 11.7807C19.098 11.5294 19.5686 11.5294 19.9176 11.7807L22.5824 13.6993C22.9314 13.9506 23.402 13.9506 23.751 13.6993L27 11.36"
      );
      let path4 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path4.setAttribute("stroke", "#a39f9f");
      path4.setAttribute("stroke-width", "1.5");
      path4.setAttribute("stroke-linecap", "round");
      path4.setAttribute(
        "d",
        "M4 22.4L7.24903 24.7393C7.59804 24.9906 8.06863 24.9906 8.41764 24.7393L11.0824 22.8207C11.4314 22.5694 11.902 22.5694 12.251 22.8207L14.9157 24.7393C15.2647 24.9906 15.7353 24.9906 16.0843 24.7393L18.749 22.8207C19.098 22.5694 19.5686 22.5694 19.9176 22.8207L22.5824 24.7393C22.9314 24.9906 23.402 24.9906 23.751 24.7393L27 22.4"
      );

      svg.append(path1, path2, path3, path4);

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
const shinySwitchFunc = (e, sprites) => {
  let par = e.closest(".typeAndShiny").parentNode;
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

// ! remove pokemon from slot
const removeMon = (e, slotNum) => {
  const parent = document.getElementById(slotNum);
  const result = window.confirm(
    "Are you sure you want to remove this Pokemon?"
  );

  if (result) {
    // User clicked "OK" (Yes)
    parent.remove();
    for (let i = 0; i < addMonsDivs.children.length; i++) {
      addMonsDivs.children[i].setAttribute("id", `slot${i + 1}`);
    }
    partyLimit = addMonsDivs.children.length + 1;
  } else {
    // User clicked "Cancel" (No)
    null;
  }
};

// * Get party data upon confirmation
const getPartyData = () => {
  let partyArr = [];
  for (const slots of addMonsDivs.children) {
    let obj = {
      name: null,
      sprite: null,
      type: [],
      shiny: null,
      ability: null,
      abilityDesc: null,
      moves: [],
    };
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
        // ? get sprite
        if (value.classList.contains("spriteDiv")) {
          obj.sprite = value.children[0].src;
          obj.shiny = value.children[0].src.includes("shiny");
        }
        // ? get inputs
        if (value.classList.contains("inputsDiv")) {
          // ? get moves
          let selectMovesDiv = value.querySelector(".selectMovesDiv");
          // iterate through all 4 moves
          for (let i = 0; i < selectMovesDiv.children.length; i++) {
            let parent = selectMovesDiv.children[i];

            if (parent.querySelector(".selectMoves").value !== "selectMove") {
              let moveObj = {
                name: parent.querySelector(".selectMoves").value,
                type: parent.querySelector(".moveType").textContent,
                effect: parent
                  .querySelector(".moveDamageClass")
                  .children[0].getAttribute("id"),
                power: parent.querySelector(".movePower").textContent,
                accuracy: parent.querySelector(".moveAccuracy").textContent,
                pp: parent.querySelector(".movePp").textContent,
                desc: parent.querySelector(".moveEffect").textContent,
              };
              obj.moves.push(moveObj);
            } else {
              obj.moves.push("--");
            }
          }
          // ? get ability
          obj.ability = value.querySelector(".selectAbility").value;
          obj.abilityDesc =
            value.querySelector(".abilitiesDescDiv").textContent;
        }
        // ? get type
        if (value.classList.contains("typeAndShiny")) {
          let typeDiv = value.querySelector(".typeDiv");
          for (let i = 0; i < typeDiv.children.length; i++) {
            !typeDiv.children[i].classList.contains("shinySwitch") &&
              obj.type.push(typeDiv.children[i].textContent);
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
let counter = parseInt(localStorage.getItem("counter")) || 0;

const confirmData = (color, num) => {
  let inputs = {
    name: document.getElementById("name").value,
    game: `${document.getElementById("game").value} Version`,
    // key: `key${counter}`,
    key: null,
    color: color,
    textColor: null,
    party: getPartyData(),
  };

  inputs.textColor = setTextColor(inputs.color);

  // to string
  const JSONstring = JSON.stringify(inputs);

  const key = `key${counter}`;

  //set key
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

  console.log(localStorage);

  Object.entries(localStorage).forEach(([key, value], index) => {
    // update key in storage
    let v = JSON.parse(localStorage.getItem(`key${index}`));
    if (v !== null) {
      v.key = `key${index}`;
      localStorage.setItem(`key${index}`, JSON.stringify(v));

      // push to array
      dataArray.push(v);
    }
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
  console.log("Data array", dataArray);
  const rosterWrapper = document.querySelector(".rosterWrapper");
  rosterWrapper.innerHTML = "";

  dataArray.forEach((obj) => {
    // ? create divs
    const postedRoster = document.createElement("div");
    postedRoster.classList.add("postedRoster");
    rosterWrapper.appendChild(postedRoster);
    for (let i = 0; i < postedDivs.length; i++) {
      postedRoster.append(divCreator(postedDivs[i]));
    }
    // ? append children
    for (let i = 0; i < postedDivs.length; i++) {
      if (postedDivs[i].parent !== undefined) {
        postedRoster
          .querySelector(`.${postedDivs[i].parent}`)
          .append(postedRoster.querySelector(`.${postedDivs[i].name}`));
      }
    }
    let name = postedRoster.querySelector(".postedName"),
      game = postedRoster.querySelector(".postedGame"),
      // settings = postedRoster.querySelector(".postedSettings"),
      edit = postedRoster.querySelector(".postedEdit"),
      remove = postedRoster.querySelector(".postedDelete"),
      partyList = postedRoster.querySelector(".postedPartyList");

    edit.classList.add("material-symbols-outlined");
    edit.textContent = "edit_square";
    remove.classList.add("material-symbols-outlined");
    remove.setAttribute("onclick", "removePost(this)");
    remove.textContent = "delete";

    for (const k in obj) {
      if (k !== "") {
        if (k === "key") {
          postedRoster.setAttribute("id", obj[k]);
        } else if (k === "name") {
          name.classList.add(obj[k].replace(/ /g, "-"));
          name.classList.add("spanName");
          name.textContent = obj[k];
        } else if (k === "game") {
          game.textContent = obj[k];
        } else if (k === "color") {
          name.style.backgroundColor = obj[k];
          postedRoster.style.borderTop = `18px solid ${obj[k]}`;
        } else if (k === "textColor") {
          name.style.color = obj[k];
        }
        // !! put together party  : START
        else if (k == "party") {
          let party = obj[k];
          // ~ iterate through each selected pokemon
          for (let n = 0; n < party.length; n++) {
            if (party[n].name !== null) {
              let postedMonWrapper = document.createElement("div");
              postedMonWrapper.classList.add("postedMonWrapper");
              postedMonWrapper.setAttribute("id", `posted${n}`);
              // * create divs
              for (let i = 0; i < postedMon.length; i++) {
                postedMonWrapper.append(divCreator(postedMon[i]));
              }
              // * append divs
              for (let d = 0; d < postedMon.length; d++) {
                if (postedMon[d].parent !== undefined) {
                  postedMonWrapper
                    .querySelector(`.${postedMon[d].parent}`)
                    .append(
                      postedMonWrapper.querySelector(`.${postedMon[d].name}`)
                    );
                }
              }
              // * grab divs
              let postedSpriteImg =
                postedMonWrapper.querySelector(".postedSpriteImg");
              let postedMonName =
                postedMonWrapper.querySelector(".postedMonName");
              let postedType = postedMonWrapper.querySelector(".postedType");
              let postedShiny = postedMonWrapper.querySelector(".postedShiny");
              let postedAbilityName =
                postedMonWrapper.querySelector(".postedAbilityName");
              let postedAbilityDesc =
                postedMonWrapper.querySelector(".postedAbilityDesc");
              let postedMovesWrap =
                postedMonWrapper.querySelector(".postedMovesWrap");
              let expand = postedMonWrapper.querySelector(".expand");

              // image
              postedSpriteImg.src = party[n].sprite;
              // name
              postedMonName.textContent = party[n].name;
              // shiny
              postedShiny.append(createSVG("shiny"));
              party[n].ability !== "selectAbility" &&
                (postedAbilityName.textContent = party[n].ability);
              postedAbilityDesc.textContent = party[n].abilityDesc;
              // type
              party[n].type.forEach((e) => {
                let span = document.createElement("span");
                span.textContent = e;
                for (const k in typeColors) {
                  if (k === e) {
                    span.style.backgroundColor = typeColors[k];
                  }
                }
                postedType.appendChild(span);
              });
              // svg
              let svg = postedShiny.children[0];
              postedSpriteImg.src.includes("shiny") &&
                svg.setAttribute("fill", "#DFAB0A");

              //expand button
              expand.classList.add("material-symbols-outlined");
              expand.textContent = "keyboard_double_arrow_down";
              expand.setAttribute("onclick", "showHideMoves(this)");

              // ! Iterate through each move
              for (let i = 0; i < party[n].moves.length; i++) {
                let move = party[n].moves[i];
                let wrap = document.createElement("div");
                wrap.setAttribute("id", `move${i}`);

                if (move !== "--") {
                  for (let d = 0; d < moveDetails.length; d++) {
                    wrap.append(divCreator(moveDetails[d]));
                  }
                  for (let d = 0; d < moveDetails.length; d++) {
                    if (moveDetails[d].parent !== undefined) {
                      wrap
                        .querySelector(`.${moveDetails[d].parent}`)
                        .append(wrap.querySelector(`.${moveDetails[d].name}`));
                    }
                  }
                  let pMoveName = wrap.querySelector(".pMoveName");
                  let pMovePower = wrap.querySelector(".pMovePower");
                  let pMoveAccuracy = wrap.querySelector(".pMoveAccuracy");
                  let pMovePp = wrap.querySelector(".pMovePp");
                  let pMoveDesc = wrap.querySelector(".pMoveDesc");
                  let pMoveEffect = wrap.querySelector(".pMoveEffect");
                  let pMoveTypeSpan = wrap.querySelector(".pMoveTypeSpan");

                  // input entries
                  //name
                  pMoveName.textContent = move.name;
                  //type
                  pMoveTypeSpan.textContent = move.type;
                  for (let k in typeColors) {
                    k === move.type &&
                      (pMoveTypeSpan.style.backgroundColor = typeColors[k]);
                  }
                  pMovePower.textContent = move.power;

                  pMoveAccuracy.textContent = move.accuracy;

                  pMovePp.textContent = move.pp;

                  pMoveDesc.textContent = move.desc;
                  // effect is SVG unless 'status'

                  pMoveEffect.append(createSVG(move.effect));
                } else {
                  wrap.textContent = move;
                }
                postedMovesWrap.append(wrap);
              }

              partyList.append(postedMonWrapper);
            }
          }
        }
        // !! put together party  : END
      }
    }
  });
};

//  ~ loop through children to create divs
const loopFunc = (c, n) => {
  let divs = [];
  for (let i = 0; i < n; i++) {
    divs.push(divCreator(c[i]));
  }

  return divs;
};

// ! clear
const clearStorage = () => {
  localStorage.clear();
  document.getElementById("rosterWrapper").innerHTML = "";
  dataArray = [];
};

// ! REMOVE A POST
const removePost = (e) => {
  let id = e.closest(".postedSettings").parentNode.id;
  let currentNum = parseInt(localStorage.getItem("counter"));
  let numRemoved = parseInt(id[id.length - 1]);

  let result = window.confirm("Delete this roster?");
  // if deleted
  if (result) {
    // loop to reassign key order
    for (let k = 0; k < currentNum; k++) {
      if (k > numRemoved) {
        let val = localStorage.getItem(`key${k}`);

        localStorage.removeItem(`key${k}`);
        localStorage.setItem(`key${k - 1}`, val);
      } else if (k === numRemoved) {
        localStorage.removeItem(`key${numRemoved}`);
      }
    }
    // update counter
    localStorage.setItem("counter", currentNum - 1);
    // run storage update
    storeToArray();
  } else {
    console.log("you clicked no");
  }
};

// && SHOW OR HIDE POSTED MOVESET
const showHideMoves = (e) => {
  let parent = e.parentNode;
  let bottom = parent.querySelector(".postedBottom");

  if (getComputedStyle(bottom).height === "0px") {
    gsap.to(bottom, { height: "auto", ease: "power2.out", duration: 0.5 });
    e.textContent = "keyboard_double_arrow_up";
  } else {
    gsap.to(bottom, { height: "0px", ease: "power2.out", duration: 0.5 });
    e.textContent = "keyboard_double_arrow_down";
  }
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
