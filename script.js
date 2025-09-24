// --- 1. GET REFERENCES TO HTML ELEMENTS ---
const cardA = document.getElementById('card-a');
const imgA = document.getElementById('img-a');
const nameA = document.getElementById('name-a');
const descA = document.getElementById('desc-a');

const cardB = document.getElementById('card-b');
const imgB = document.getElementById('img-b');
const nameB = document.getElementById('name-b');
const descB = document.getElementById('desc-b');

const selectionContainer = document.getElementById('selection-container');
const winnerContainer = document.getElementById('winner-container');

// --- 2. DEFINE GLOBAL VARIABLES ---
let contenders = [];
let currentA, currentB;

// --- 3. CORE LOGIC FUNCTIONS ---
function setupNextRound() {
    // If there's only one contender left, they are the winner!
    if (contenders.length < 2) {
        // Make sure there is a winner to display before calling
        if (contenders.length > 0) {
            displayWinner(contenders[0]);
        }
        return;
    }

    // Pull the next two restaurants from the front of the array
    currentA = contenders.shift();
    currentB = contenders.shift();

    // Update Card A with the new data
    imgA.src = currentA.image;
    imgA.alt = `A photo of ${currentA.name}`;
    nameA.textContent = currentA.name;
    descA.textContent = currentA.description;

    // Update Card B with the new data
    imgB.src = currentB.image;
    imgB.alt = `A photo of ${currentB.name}`;
    nameB.textContent = currentB.name;
    descB.textContent = currentB.description;
}

function select(winner) {
    // Add the winning restaurant back to the end of the array to compete again
    contenders.push(winner);
    // Set up the next pair for the user to choose from
    setupNextRound();
}

function displayWinner(winner) {
    // Hide the selection cards
    selectionContainer.classList.add('hidden');

    // Update the winner card with the final restaurant's details
    document.getElementById('winner-img').src = winner.image;
    document.getElementById('winner-name').textContent = winner.name;
    document.getElementById('winner-desc').textContent = winner.description;

    // Show the winner container
    winnerContainer.classList.remove('hidden');
}

// --- 4. ASYNCHRONOUS START FUNCTION ---
// This function fetches the data and then starts the showdown
async function startShowdown() {
    try {
        // Fetch the JSON file
        const response = await fetch('./restaurants.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON data into a JavaScript array
        const restaurants = await response.json();
        
        // Populate our contenders list with the loaded data
        contenders = [...restaurants];

        // Shuffle the contenders array for a different order each time (optional but fun!)
        contenders.sort(() => Math.random() - 0.5);

        // Start the first round
        setupNextRound();

    } catch (error) {
        console.error("Could not load restaurant data:", error);
        // Display an error message to the user on the page
        selectionContainer.innerHTML = `<h2>Sorry, could not load the restaurants. Please check the console for errors.</h2>`;
    }
}

// --- 5. ADD EVENT LISTENERS ---
cardA.addEventListener('click', () => {
    select(currentA);
});

cardB.addEventListener('click', () => {
    select(currentB);
});

// --- 6. KICK OFF THE PROCESS ---
// Call the async function to begin the entire process
startShowdown();