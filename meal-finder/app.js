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

    article.append(title, img, info);
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