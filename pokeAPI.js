// Function to fetch data from PokeAPI using async/await

// & GRAB VERSIONS
const getVersions = async (n) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/version/`);
    // console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// & LOAD VERSIONS
const loadVersions = async () => {
  let verArr = [];
  const ver = await getVersions();
  verArr = [...ver.results];

  const gameDropdown = document.getElementById("game");
  verArr.forEach((e, index) => {
    if (e.name !== "colosseum" && e.name !== "xd") {
      const opt = document.createElement("option");
      opt.value = e.name;
      opt.id = `ver${index + 1}`;
      opt.textContent = e.name;
      gameDropdown.appendChild(opt);
    }
  });
};

// & GRAB SELECTED GAME
const getSelectedGameURL = async (game) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/version/${game}`
    );

    const url = response.data.version_group.url;

    return getPokedex(url);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// * GRAB POKEDEX URL
const getPokedex = async (url) => {
  try {
    const response = await axios.get(url);

    let spread = [...response.data.pokedexes];

    dexUrl = spread[0].url;

    return openPokedex(dexUrl);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// & LOAD POKEDEX
const openPokedex = async (url) => {
  try {
    const response = await axios.get(url);

    return response.data.pokemon_entries;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// * GRAB SELECTED POKEMON
const getPokemonData = async (mon) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${mon}/`
    );
    // console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// * GRAB SELECTED MOVE
const getMoveData = async (move) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/move/${move}/`);
    // console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// * GRAB SELECTED ABILITY
const getAbility = async (a) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/ability/${a}/`);
    // console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

loadVersions();
