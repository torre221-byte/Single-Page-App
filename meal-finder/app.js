const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const results = document.querySelector("#results");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchMeals(input.value.trim());
});

async function searchMeals(query) {
  results.textContent = "Loading...";

  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    renderMeals(data.meals);
  } catch (error) {
    results.textContent = "Something went wrong. Please try again.";
    console.error(error);
  }
}

function renderMeals(meals) {
  results.textContent = "";
  details.textContent = "";

  if (!meals) {
    results.textContent = "No meals found. Try another search.";
    return;
  }

  for (const meal of meals) {
    const article = document.createElement("article");

    const title = document.createElement("h2");
    title.textContent = meal.strMeal;

    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    const info = document.createElement("p");
    info.textContent = `${meal.strArea} | ${meal.strCategory}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "View recipe";
    button.addEventListener("click", () => showDetails(meal));

    article.append(title, img, info, button);
    results.append(article);
  }
}
const randomButton = document.querySelector("#random-btn");
randomButton.addEventListener("click", getRandomMeal);

async function getRandomMeal() {
  results.textContent = "Loading...";

  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    renderMeals(data.meals);
  } catch (error) {
    results.textContent = "Something went wrong. Please try again.";
    console.error(error);
  }
}

results.textContent = "Search for a meal or click Surprise me to get started.";

const details = document.querySelector("#details");

function showDetails(meal) {
  details.textContent = "";

  const panel = document.createElement("div");
  panel.className = "details-card";

  const title = document.createElement("h2");
  title.textContent = meal.strMeal;

  const img = document.createElement("img");
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;

  const countryBox = document.createElement("div");
  countryBox.className = "country-box";
  addCountryInfo(meal.strArea, countryBox);
  const ingredientsHeading = document.createElement("h3");
  ingredientsHeading.textContent = "Ingredients";

  const list = document.createElement("ul");
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      const item = document.createElement("li");
      item.textContent = `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim();
      list.append(item);
    }
  }

  const instructionsHeading = document.createElement("h3");
  instructionsHeading.textContent = "Instructions";

  const instructions = document.createElement("p");
  instructions.className = "instructions";
  instructions.textContent = meal.strInstructions;

const videoParagraph = document.createElement("p");
  if (meal.strYoutube) {
    const videoLink = document.createElement("a");
    videoLink.href = meal.strYoutube;
    videoLink.textContent = "Watch video tutorial";
    videoLink.target = "_blank";
    videoLink.rel = "noopener noreferrer";
    videoParagraph.append(videoLink);
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Close recipe";
  closeButton.addEventListener("click", () => {
    details.textContent = "";
  });

  panel.append(title, img, ingredientsHeading, list, instructionsHeading, instructions, videoParagraph, closeButton);  details.append(panel);
  panel.scrollIntoView({ behavior: "smooth" });
}

const areaToCode = {
  American: "US", British: "GB", Canadian: "CA", Chinese: "CN",
  Croatian: "HR", Dutch: "NL", Egyptian: "EG", Filipino: "PH",
  French: "FR", Greek: "GR", Indian: "IN", Irish: "IE",
  Italian: "IT", Jamaican: "JM", Japanese: "JP", Kenyan: "KE",
  Malaysian: "MY", Mexican: "MX", Moroccan: "MA", Polish: "PL",
  Portuguese: "PT", Russian: "RU", Spanish: "ES", Thai: "TH",
  Tunisian: "TN", Turkish: "TR", Ukrainian: "UA", Uruguayan: "UY",
  Vietnamese: "VN", Algerian: "DZ", Argentinian: "AR", Norwegian: "NO",
  "Saudi Arabian": "SA", Slovakian: "SK", Syrian: "SY", Venezulan: "VE"
};

async function addCountryInfo(area, container) {
  const code = areaToCode[area];

  if (!code) {
    return; // No match (for example "Unknown"), so skip quietly
  }

  container.textContent = "Loading country info...";

  try {
    const url = `https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,capital,population,region,languages,currencies`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    const country = Array.isArray(data) ? data[0] : data;

    const heading = document.createElement("h3");
    heading.textContent = `About ${country.name.common}`;

    const flag = document.createElement("img");
    flag.src = country.flags.png;
    flag.alt = country.flags.alt || `Flag of ${country.name.common}`;
    flag.className = "flag";

    const facts = document.createElement("ul");
    const factList = [
      `Capital: ${country.capital ? country.capital.join(", ") : "N/A"}`,
      `Region: ${country.region}`,
      `Population: ${country.population.toLocaleString()}`,
      `Languages: ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}`,
      `Currency: ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A"}`
    ];

    for (const fact of factList) {
      const item = document.createElement("li");
      item.textContent = fact;
      facts.append(item);
    }

    container.textContent = "";
    container.append(heading, flag, facts);
  } catch (error) {
    container.textContent = "Country info could not be loaded.";
    console.error(error);
  }
}