console.log("===>>> javascript is running");

const foodItemArea = document.getElementById("foodItemArea");
const recipeInput = document.getElementById("searchInput");
const recipeDetails = document.getElementById("recipeDetails");
let recipeInputValue;

function getRecipeResults() {
  // fetching the api from a free backend
  const recipeBackendApi = fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes?search=${recipeInputValue}`,
  );

  //   showing a loader until the recipes load
  foodItemArea.innerHTML =
    '<div class="loader_div"><span class="loader"></span><h3>Loading</h3></div>';

  // now giving proper promise handling to the api fetch
  recipeBackendApi
    .then((result) => {
      // returning in json() is necessary because the result we hope doesn't come in the format that we need
      return result.json();
    })
    .then((result) => {
      const { data } = result;
      const { recipes } = data;

      // the map() method should always be in a variable as it returns a new array by modifying.
      const searchedRecipes = recipes.map((recipe) => {
        return `<div id=${recipe.id} class="foodItem" onClick="singleRecipeApi(this)">
                <img src=${recipe.image_url}>
                <span>
                    <h3>${recipe.title}</h3>
                    <p>${recipe.publisher}</p>
                </span>
            </div>`;
      });
      // the join() function will remove the unnecessary comas between the array modified by .map() method
      foodItemArea.innerHTML = searchedRecipes.join("");
    })
    .catch((error) => {
      console.log(error);
    });
}

// getting the value of of the input value by clicking on the search button
const searchBtn = document.getElementById("searchBtn");
const getInputValue = searchBtn.addEventListener("click", () => {
  recipeInputValue = recipeInput.value;

  //   calling the function here so that on each click the api calls work
  getRecipeResults();
});

recipeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    recipeInputValue = recipeInput.value;

    //   calling the function here so that on each click the api calls work
    getRecipeResults();
  } else {
    return;
  }
});

function singleRecipeApi(elem) {
  const singleApi = fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes/${elem.id}`,
  );
  singleApi
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      const { data } = result;
      const { recipe } = data;
      const { ingredients } = recipe;

      // the map() method should always be in a variable as it returns a new array by modifying.
      const ingredientsList = ingredients.map((elem) => {
        return `<li>${elem.quantity} ${elem.unit} ${elem.description}</li>`;
      });

      const singleRecipe = `<div class="recipeBanner" style="background: url(${recipe.image_url});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;">
                    <div class="recipeInfo">
                        <div class="label">
                            <h1>${recipe.title}</h1>
                        </div>
                        <span>
                            <p><i class="fa-regular fa-clock"></i>${recipe.cooking_time} Minutes</p>
                            <p><i class="fa-solid fa-semibold fa-users"></i>${recipe.servings} Servings</p>
                        </span>
                    </div>
                </div>

                <div class="recipeIngredients">
                    <h1>Recipe Ingredients</h1>
                    <ol>
                        ${ingredientsList.join("")}
                    </ol>
                </div>

                <div class="recipeLink">
                    <h1>HOW TO COOK IT</h1>
                    <p>This recipe was carefully designed and tested by <strong>${recipe.publisher}</strong>. Please check out
                        directions at their <a href=${recipe.source_url} target="_blank">website</a></p>
                </div>`;

      recipeDetails.innerHTML = singleRecipe;
    })
    .catch((error) => {
      console.log(error);
    });
}
