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

const gameColors = {
  red: "#F95B5B",
  blue: "#5B75F9",
  yellow: "#F9D75B",
  gold: "#DEAD6A",
  silver: "#CFDDDE",
  crystal: "#98E3DC",
  ruby: "#BA3126",
  sapphire: "#2679BA",
  emerald: "#26BA5E",
  fireRed: "#D30202",
  leafGreen: "#61D302",
  diamond: "#CBE3E1",
  pearl: "#E3CBD4",
  platinum: "#868C91",
  heartGold: "#B67128",
  soulSilver: "#A4B0B2",
  black: "#2F2F2F",
  white: "#D8D8D8",
};

const monInputDivs = [
  {
    name: "inputsDiv",
    element: "div",
  },
  {
    name: "spriteDiv",
    element: "div",
  },
  {
    name: "typeAndShiny",
    element: "div",
  },
  {
    name: "typeDiv",
    element: "div",
    parent: "typeAndShiny",
  },
  {
    name: "selectAbilityDiv",
    element: "div",
  },
  {
    name: "selectMovesDiv",
    element: "div",
    parent: "inputsDiv",
  },
  {
    name: "removeMon",
    element: "div",
  },
];

const abilityInputDivs = [
  {
    name: "selectAbility",
    element: "select",
    parent: "selectAbilitiesWrap",
  },
  {
    name: "selectAbilitiesWrap",
    element: "div",
  },
  {
    name: "abilitiesDescDiv",
    element: "div",
  },
];

// && FOR BOTTOM POSTED CONTENT
// && FOR BOTTOM POSTED CONTENT
const postedDivs = [
  {
    name: "postedSettings",
    element: "div",
  },
  {
    name: "postedEdit",
    element: "div",
    parent: "editAndDelete",
  },
  {
    name: "postedDelete",
    element: "div",
    parent: "editAndDelete",
  },
  {
    name: "postedName",
    element: "span",
  },
  {
    name: "postedGame",
    element: "span",
    parent: "postedSettings",
  },
  {
    name: "postedPartyList",
    element: "div",
  },
  {
    name: "editAndDelete",
    element: "div",
    parent: "postedSettings",
  },
];
// *
const postedMon = [
  {
    name: "postedTop",
    element: "div",
  },
  {
    name: "postedSprite",
    element: "div",
    parent: "postedTop",
  },
  {
    name: "postedSpriteImg",
    element: "img",
    parent: "postedSprite",
  },
  {
    name: "postedTopLeft",
    element: "div",
    parent: "postedTop",
  },
  {
    name: "postedNameAndShiny",
    element: "div",
    parent: "postedTopLeft",
  },
  {
    name: "bulbaDiv",
    element: "div",
    parent: "postedTopLeft",
  },
  {
    name: "bulbaLink",
    element: "a",
    parent: "bulbaDiv",
  },
  {
    name: "bulbaIcon",
    element: "span",
    parent: "bulbaDiv",
  },
  {
    name: "postedMonName",
    element: "span",
    parent: "postedNameAndShiny",
  },
  {
    name: "postedShiny",
    element: "div",
    parent: "postedNameAndShiny",
  },
  {
    name: "postedType",
    element: "div",
    parent: "postedTopLeft",
  },
  {
    name: "postedBottom",
    element: "div",
  },
  {
    name: "postedBottomInner",
    element: "div",
    parent: "postedBottom",
  },
  {
    name: "postedAbility",
    element: "div",
    parent: "postedBottomInner",
  },
  {
    name: "postedAbilityName",
    element: "span",
    parent: "postedAbility",
  },
  {
    name: "postedAbilityDesc",
    element: "div",
    parent: "postedAbility",
  },
  {
    name: "postedMovesWrap",
    element: "div",
    parent: "postedBottomInner",
  },
  {
    name: "expand",
    element: "div",
  },
];
//*
const moveDetails = [
  {
    name: "pMoveName",
    element: "span",
  },
  {
    name: "pMoveStatsWrap",
    element: "div",
  },
  {
    name: "pMovePower",
    element: "div",
    parent: "pMoveStatsWrap",
  },
  {
    name: "pMoveAccuracy",
    element: "div",
    parent: "pMoveStatsWrap",
  },
  {
    name: "pMovePp",
    element: "div",
    parent: "pMoveStatsWrap",
  },
  {
    name: "pMoveType",
    element: "div",
  },
  {
    name: "pMoveTypeSpan",
    element: "span",
    parent: "pMoveType",
  },
  {
    name: "pMoveEffect",
    element: "div",
    parent: "pMoveType",
  },
  {
    name: "pMoveDesc",
    element: "div",
  },
];
