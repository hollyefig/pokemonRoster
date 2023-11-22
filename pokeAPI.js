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

loadVersions();
