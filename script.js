const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


//NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};


function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
   loader.classList.add('hidden');
}


// Create DOM
function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    console.log('Current Array', page, currentArray);
    currentArray.forEach((result) => {
        // Create Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Create Image Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Create Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'Nasa Picture of the Day';
        // lazy loading functionality
        image.loading = 'lazy';
        image.classList.add('card-image-top');
        // Create Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Create Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Create Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to Favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove from Favourites';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }
        // Create Image Explanation
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Create Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Create Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Create Copyright Info
        const copyright = document.createElement('span');
        if (result.copyright) {
            copyright.textContent = ` ${result.copyright}`;
        } else {
            copyright.textContent = '';
        }
        // Append together in correct order
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

// Populate DOM with NASA images
function updateDOM(page) {
    // Get Faves from local storage
    if (localStorage.getItem('nasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}


// Get 10 images from NASA API
async function getNasaPicture() {
    // Show Loader
    loader.classList.remove('hidden');

    try {
        const response = await fetch(apiURL);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        // Catch Error Here
    }
}

// Add NASA photo result to favourites
function saveFavourite(itemUrl) {
    // Loop through results array to select selected favourite data & check if already in favourites
    resultsArray.forEach((item) => {
       if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
           favourites[itemUrl] = item;
           //  Show Save Confirmation for 2 Seconds
           saveConfirmed.hidden = false;
           setTimeout(() => {
              saveConfirmed.hidden = true;
           }, 2000);
           // Set favourites in local storage
           localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
       }
    });
}

// Remove Item from favourites
function removeFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        // Set favourites in local storage
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

// On Load
getNasaPicture();












// Set footer date dynamically
const year = new Date().getFullYear();
switch (new Date().getMonth()) {
    case 0:
        month = "Jan";
        break;
    case 1:
        month = "Feb";
        break;
    case 2:
        month = "Mar";
        break;
    case 3:
        month = "Apr";
        break;
    case 4:
        month = "May";
        break;
    case 5:
        month = "Jun";
        break;
    case 6:
        month = "Jul";
        break;
    case 7:
        month = "Aug";
        break;
    case 8:
        month = "Sept";
        break;
    case 9:
        month = "Oct";
        break;
    case 10:
        month = "Nov";
        break;
    case 11:
        month = "Dec";
        break;
    default:
        month = "Invalid Date";
}
// footerDate.textContent = `${month}, ${year}`;