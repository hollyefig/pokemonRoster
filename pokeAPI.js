// Function to fetch data from PokeAPI using async/await

// & Grab the games
async function fetchGame() {
  try {
    let dataArr = [];

    for (let i = 1; i <= 9; i++) {
      const pokeGameURL = `https://pokeapi.co/api/v2/generation/${i}`;

      // Make a request to the PokeAPI using async/await
      const response = await fetch(pokeGameURL);
      const data = await response.json();

      dataArr.push(data);

      // Handle the data and update the DOM
    }
    displayData(dataArr);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to display data on the webpage
const displayData = (data) => {
  let fetchVersions = [],
    versions = [];
  data.forEach((e) => {
    fetchVersions.push(e.version_groups);
  });

  for (let i = 0; i < fetchVersions.length; i++) {
    for (const keys in fetchVersions[i]) {
      versions.push(fetchVersions[i][keys].name);
    }
  }

  const filteredArray = versions.filter(
    (item) =>
      item !== "colosseum" &&
      item !== "the-isle-of-armor" &&
      item !== "the-crown-tundra" &&
      item !== "the-teal-mask" &&
      item !== "xd" &&
      item !== "the-indigo-disk"
  );

  const gameDropdown = document.getElementById("game");

  filteredArray.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e;

    opt.textContent = adjustText(e);

    gameDropdown.appendChild(opt);
  });
};

// FIX TEXT
const adjustText = (e) => {
  return e
    .replace(/-/g, " / ")
    .replace("black / 2 / white / 2", "black 2 / white 2")
    .replace("omega / ruby / alpha / sapphire", "omega ruby / alpha sapphire")
    .replace("ultra / sun / ultra / moon", "ultra sun / ultra moon")
    .replace("legends / arceus", "legends arceus")
    .replace(
      "brilliant / diamond / and / shining / pearl",
      "brilliant diamond / shining pearl"
    )
    .replace(
      "lets / go / pikachu / lets / go / eevee",
      "lets go pikachu / lets go eevee"
    );
};
