const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');

let searchQuery = '';
const APP_ID = '5eb18cfb';

const APP_key = 'cb07f1e7dcd8a8e1bd01f2af8faee16c';



searchForm.addEventListener('submit',(e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;
    console.log(searchQuery)
    fetchAPI();
});
async function fetchAPI(){
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&to=93`;
    const response = await fetch(baseURL);
    const data = await response.json();
    generateHTML(data.hits);
    console.log(data);
}
function generateHTML(results){

    let generatedHTML = '';
    results.map(result => {
        generatedHTML +=
        `
        <div class="item">
            <img src="${result.recipe.image}" alt="" />
            <div class="flex-container">
              <div class="title">${result.recipe.label}</div>
              <a class="view-button" href="${result.recipe.url}" target="_blank">View Recipe</a>
            </div>
            <p class="item-data">Calories:${result.recipe.calories.toFixed(2)}</p>
            <p class="item-data">Diet Label:${result.recipe.dietLabels.length > 0 ? result.recipe.dietLabels:'No data Found'}</p>
            <p class="item-data">Health Label:${result.recipe.healthLabels}</p>
          </div>
        `
    })
    searchResultDiv.innerHTML = generatedHTML;
}