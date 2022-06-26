
let tag = document.createElement("script");
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;
function onYouTubeIframeAPIReady() {
  let storageID = localStorage.getItem("id");
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    videoId: "M7lc1UVf-VE",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}
let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

let apiKey = "&apiKey=03c52fdc9d7a467aa7f8489135117004";
let recipesObject = [];
let randomRecipe = [];

let youtubeApiKey = "&key=AIzaSyDVHPPmkd5kTFUc8CdK12tko9A_DQzQfVM";
let youtubeQueryURL =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=";
let searchValue;

function youtubeSearch(searchValue) {
  searchValue = randomRecipe[0]["title"];
  let arraySearchVal = [...searchValue];
  let spaceIndeces = [];
  let firstChar = [0];

  for (i = 0; i < searchValue.length; i++) {
    if (arraySearchVal[i] === " ") {
      spaceIndeces.push(i);
    }
  }

  for (i = 0; i < spaceIndeces.length; i++) {
    let firstCharIndex = spaceIndeces[i] + 1;
    firstChar.push(firstCharIndex);
  }

  let wordArray = [searchValue.substring(0, spaceIndeces[0])];

  if (spaceIndeces.length >= 1) {
    for (i = 1; i < spaceIndeces.length; i++) {
      let newWordVal = searchValue.substring(firstChar[i], spaceIndeces[i]);
      wordArray.push(newWordVal);
    }
    let lastValFirstChar = spaceIndeces[spaceIndeces.length - 1] + 1;
    wordArray.push(searchValue.substring(lastValFirstChar, searchValue.length));
  }

  let firstValue = wordArray[0];
  let newWordArray = [];
  for (i = 1; i < wordArray.length; i++) {
    let stringWordArray = "%20" + wordArray[i];
    newWordArray.push(stringWordArray);
  }
  let finalRecipeString = firstValue.concat(newWordArray.join(""));
  let newQueryURL =
    youtubeQueryURL + finalRecipeString + "%20recipe" + youtubeApiKey;

  $.ajax({
    url: newQueryURL,
    method: "GET",
  }).then(function (response) {
    let id = response.items[0]["id"]["videoId"];
    player.cueVideoById({ videoId: id });
  });
}

function getRecipeByIngredients(ing1, ing2, ing3, ing4, ing5) {
  let arrayVal = [ing1, ing2, ing3, ing4, ing5];
  let newArray = [];
  for (i = 0; i < arrayVal.length; i++) {
    if (arrayVal[i] != null) {
      newArray.push(arrayVal[i]);
    }
  }

  let newIngArray = [newArray[0]];
  for (i = 1; i < newArray.length; i++) {
    let stringIngArray = ",+" + newArray[i];
    newIngArray.push(stringIngArray);
  }

  let finalIngString = newIngArray.join("");

  let spoonQueryURL =
    "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" +
    finalIngString +
    "&number=100" +
    apiKey;

  $.ajax({
    url: spoonQueryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    for (i = 0; i < response.length; i++) {
      let newRecipeObject = {
        id: response[i]["id"],
        title: response[i]["title"],
      };
      recipesObject.push(newRecipeObject);
    }
    randomRecipe.push(recipesObject[Math.floor(Math.random() * 100)]);
    let newid = randomRecipe[0]["id"];
    console.log(newid);
    let ingredientsURL =
      "https://api.spoonacular.com/recipes/" +
      newid +
      "/information?includeNutrition=false" +
      apiKey;
    $.ajax({
      url: ingredientsURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      let recipeDiv = $("#recipeParent2");
      let centerDiv = $("#recipeParent");

      let title = $("<h5>").text(response.title);
      let totalMinutes = $("<p>").text(
        "Total Minutes: " + response.readyInMinutes + " minutes"
      );
      let imageEl = $("<img>").attr("src", response.image);
      let servings = $("<p>").text("Servings: " + response.servings);
      let ingredients = $("<div>");

      let ingredientsList = $("<ul>");
      for (i = 0; i < response.extendedIngredients.length; i++) {
        let insListEl = $("<li>").text(
          response.extendedIngredients[i]["name"] +
            "," +
            " " +
            response.extendedIngredients[i]["amount"] +
            " " +
            response.extendedIngredients[i]["unit"]
        );
        ingredientsList.append(insListEl);
      }
      ingredients.append(ingredientsList);
      let pairedWine = response.winePairing.pairedWines;
      if (pairedWine == null || pairedWine.length === 0) {
        let newPairedWine = "Cabernet Sauvignon, Riesling";
        let winePairingEl = $("<p>").text("Wine Suggestions: " + newPairedWine);
        recipeDiv.append(totalMinutes, servings, ingredients, winePairingEl);
      } else {
        let pairing = $("<p>").text(
          "Wine Suggestions: " + response.winePairing.pairedWines
        );
        let text = $("<p>").text(response.winePairing.pairingText);
        let suggestedWineDiv = $("<div>");
        let suggestedWineTitle = $("<p>");
        let suggestedWineURL = response.winePairing.productMatches[0]["link"];
        let suggestedWineLink = $("<a>").attr("href", suggestedWineURL);
        suggestedWineLink.text(response.winePairing.productMatches[0]["title"]);
        suggestedWineTitle.append(suggestedWineLink);
        let suggestedWineImg = $("<img>").attr(
          "src",
          response.winePairing.productMatches[0]["imageUrl"]
        );
        let suggestedWinePrice = $("<p>").text(
          response.winePairing.productMatches[0]["price"]
        );
        let suggestedWineText = $("<p>").text(
          response.winePairing.productMatches[0]["description"]
        );
        suggestedWineDiv.append(
          suggestedWineTitle,
          suggestedWineImg,
          suggestedWinePrice,
          suggestedWineText
        );
        recipeDiv.append(
          totalMinutes,
          servings,
          ingredients,
          pairing,
          text,
          suggestedWineDiv
        );
      }
      let recSummary = $("<p>").html(response.summary);
      console.log(response);

      if (
        response.analyzedInstructions !== null &&
        response.analyzedInstructions.length > 0
      ) {
        console.log("that");
        let instructions = $("<div>");
        let instructionsHeader = $("<h6>").text("Instructions");
        let instructionsList = $("<ol>");
        instructions.append(instructionsHeader, instructionsList);
        for (i = 0; i < response.analyzedInstructions[0]["steps"].length; i++) {
          let steps = $("<li>").text(
            response.analyzedInstructions[0]["steps"][i]["step"]
          );
          instructionsList.append(steps);
        }
      } else {
        console.log("this");
      }

      centerDiv.append(title, recSummary, imageEl);
      recipeDiv.append(instructions);
    });
    youtubeSearch(searchValue);
    recipesObject = [];
    randomRecipe = [];
    $("#ings").val(" ");
  });
}
//  Serach by Cuisine Functionality
function getRecipeByCuisine(cuisine) {
  let cuisineQueryURL = "https://api.spoonacular.com/recipes/search?cuisine=";
  let newCuisineURL = cuisineQueryURL + cuisine + "&number=100" + apiKey;

  $.ajax({
    url: newCuisineURL,
    method: "GET",
  }).then(function (response) {
    // Storing each result's id and title as an object in the recipes array

    for (i = 0; i < response.results.length; i++) {
      let newRecipeObject = {
        id: response.results[i]["id"],
        title: response.results[i]["title"],
      };
      recipesObject.push(newRecipeObject);
    }

    randomRecipe.push(recipesObject[Math.floor(Math.random() * 100)]);
    let newid = randomRecipe[0]["id"];
    let ingredientsURL =
      "https://api.spoonacular.com/recipes/" +
      newid +
      "/information?includeNutrition=false" +
      apiKey;
    $.ajax({
      url: ingredientsURL,
      method: "GET",
    }).then(function (response) {
      let recipeDiv = $("#recipeParent2");
      let centerDiv = $("#recipeParent");

      let title = $("<h5>").text(response.title);
      let totalMinutes = $("<p>").text(
        "Total Minutes: " + response.readyInMinutes + " minutes"
      );
      let imageEl = $("<img>").attr("src", response.image);
      let servings = $("<p>").text("Servings: " + response.servings);
      let ingredients = $("<div>");

      let ingredientsList = $("<ul>");
      for (i = 0; i < response.extendedIngredients.length; i++) {
        let insListEl = $("<li>").text(
          response.extendedIngredients[i]["name"] +
            "," +
            " " +
            response.extendedIngredients[i]["amount"] +
            " " +
            response.extendedIngredients[i]["unit"]
        );
        ingredientsList.append(insListEl);
      }
      ingredients.append(ingredientsList);
      let pairedWine = response.winePairing.pairedWines;
      if (pairedWine == null || pairedWine.length === 0) {
        switch (cuisine) {
          case (cuisine = "Italian"):
            newPairedWine = "Pinot Grigio, Chianti";
            break;

          case (cuisine = "American"):
            newPairedWine = "Chardonnay, Pinot Noir";
            break;

          case (cuisine = "French"):
            newPairedWine = "Bordeaux Blend, Champagne";
            break;

          case (cuisine = "Mexican"):
            newPairedWine = "Rioja, Chardonnay";
            break;
          case (cuisine = "Mediterranean"):
            newPairedWine = "Pinot Grigio, Cabernet";
            break;
          case (cuisine = "European"):
            newPairedWine = "Chardonnay, Nebiolo";
            break;
          case (cuisine = "Vegan"):
            newPairedWine = "Pinot Noir, Chardonnay";
            break;
          case (cuisine = "Vegetarian"):
            newPairedWine = "Cabernet Sauvignon, Sauvignon Blanc";
            break;
        }
        let winePairingEl = $("<p>").text("Wine Suggestions: " + newPairedWine);
        recipeDiv.append(totalMinutes, servings, ingredients, winePairingEl);
      } else {
        let pairing = $("<p>").text(
          "Wine Suggestions: " + response.winePairing.pairedWines
        );
        let text = $("<p>").text(response.winePairing.pairingText);
        let suggestedWineDiv = $("<div>");
        let suggestedWineTitle = $("<p>");
        let suggestedWineURL = response.winePairing.productMatches[0]["link"];
        let suggestedWineLink = $("<a>").attr("href", suggestedWineURL);
        suggestedWineLink.text(response.winePairing.productMatches[0]["title"]);
        suggestedWineTitle.append(suggestedWineLink);
        let suggestedWineImg = $("<img>").attr(
          "src",
          response.winePairing.productMatches[0]["imageUrl"]
        );
        let suggestedWinePrice = $("<p>").text(
          response.winePairing.productMatches[0]["price"]
        );
        let suggestedWineText = $("<p>").text(
          response.winePairing.productMatches[0]["description"]
        );
        suggestedWineDiv.append(
          suggestedWineTitle,
          suggestedWineImg,
          suggestedWinePrice,
          suggestedWineText
        );
        recipeDiv.append(
          totalMinutes,
          servings,
          ingredients,
          pairing,
          text,
          suggestedWineDiv
        );
      }
      let recSummary = $("<p>").html(response.summary);
      console.log(response);

      if (
        response.analyzedInstructions !== null &&
        response.analyzedInstructions.length > 0
      ) {
        console.log("that");
        let instructions = $("<div>");
        let instructionsHeader = $("<h6>").text("Instructions");
        let instructionsList = $("<ol>");
        instructions.append(instructionsHeader, instructionsList);
        for (i = 0; i < response.analyzedInstructions[0]["steps"].length; i++) {
          let steps = $("<li>").text(
            response.analyzedInstructions[0]["steps"][i]["step"]
          );
          instructionsList.append(steps);
        }
      } else {
        console.log("this");
      }

      centerDiv.append(title, recSummary, imageEl);
      recipeDiv.append(instructions);
    });

    youtubeSearch(searchValue);
    recipesObject = [];
    randomRecipe = [];
    $("#ings").val(" ");
  });
}
$("#meals").on("change", function () {
  $("#recipeParent").empty();
  $("#recipeParent2").empty();
  let cuisine = $("#meals").val();
  getRecipeByCuisine(cuisine);
});

$("#recipeSearch").on("click", function () {
  event.preventDefault();
  $("#recipeParent").empty();
  $("#recipeParent2").empty();
  let ing1 = $("#ing1").val();
  let ing2 = $("#ing2").val();
  let ing3 = $("#ing3").val();
  let ing4 = $("#ing4").val();
  let ing5 = $("#ing5").val();
  getRecipeByIngredients(ing1, ing2, ing3, ing4, ing5);
});

$("#randomEatButton").on("click", function () {
  $("#recipeParent").empty();
  $("#recipeParent2").empty();
  let cuisineArray = [
    "Italian",
    "American",
    "French",
    "Mexican",
    "Mediterranean",
    "European",
    "Vegan",
    "Vegetarian",
  ];
  let cuisine;
  for (i = 0; i < cuisineArray.length; i++) {
    cuisine = cuisineArray[Math.floor(Math.random() * cuisineArray.length)];
  }
  getRecipeByCuisine(cuisine);
});
