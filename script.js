// --- 1. GET REFERENCES TO HTML ELEMENTS ---
const cardA = document.getElementById('card-a');
const imgA = document.getElementById('img-a');
const nameA = document.getElementById('name-a');

const cardB = document.getElementById('card-b');
const imgB = document.getElementById('img-b');
const nameB = document.getElementById('name-b');

const selectionContainer = document.getElementById('selection-container');
const winnerContainer = document.getElementById('winner-container');

// --- 2. DEFINE GLOBAL VARIABLES ---
let remainingContenders = []; // Renamed for clarity
let dataA, dataB; // Will hold the object data for the restaurant in each card

// --- 3. CORE LOGIC FUNCTIONS ---

/**
 * MODIFIED: This function now updates a single card (the loser) with a new challenger.
 * @param {'A' | 'B'} winningCardId - The ID of the card that just won ('A' or 'B').
 */
function selectNext(winningCardId) {
    // Check if there are any challengers left.
    if (remainingContenders.length === 0) {
        // If not, the winner is the one currently in the winning card.
        const finalWinner = (winningCardId === 'A') ? dataA : dataB;
        displayWinner(finalWinner);
        return;
    }

    // Get the next challenger from the front of the array.
    const nextChallenger = remainingContenders.shift();

    // Update the losing card with the new challenger's data.
    if (winningCardId === 'A') {
        // Card A won, so Card B gets the new challenger.
        dataB = nextChallenger;
        imgB.src = dataB.image;
        imgB.alt = `A photo of ${dataB.name}`;
        nameB.textContent = dataB.name;
    } else {
        // Card B won, so Card A gets the new challenger.
        dataA = nextChallenger;
        imgA.src = dataA.image;
        imgA.alt = `A photo of ${dataA.name}`;
        nameA.textContent = dataA.name;
    }
}

function displayWinner(winner) {
    // Hide the selection cards
    selectionContainer.classList.add('hidden');

    // Update the winner card with the final restaurant's details
    document.getElementById('winner-img').src = winner.image;
    document.getElementById('winner-name').textContent = winner.name;

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
        
        // Shuffle the restaurants array for a different order each time
        restaurants.sort(() => Math.random() - 0.5);

        // Check if we have at least two restaurants to start
        if (restaurants.length < 2) {
             selectionContainer.innerHTML = `<h2>Not enough restaurants to start a showdown!</h2>`;
             return;
        }

        // MODIFIED: Set up the initial matchup
        dataA = restaurants.shift(); // Pull the first contender
        dataB = restaurants.shift(); // Pull the second contender
        
        // The rest of the restaurants are the challengers
        remainingContenders = [...restaurants];

        // Update Card A with the initial data
        imgA.src = dataA.image;
        imgA.alt = `A photo of ${dataA.name}`;
        nameA.textContent = dataA.name;

        // Update Card B with the initial data
        imgB.src = dataB.image;
        imgB.alt = `A photo of ${dataB.name}`;
        nameB.textContent = dataB.name;

    } catch (error) {
        console.error("Could not load restaurant data:", error);
        // Display an error message to the user on the page
        selectionContainer.innerHTML = `<h2>Sorry, could not load the restaurants. Please check the console for errors.</h2>`;
    }
}

// --- 5. ADD EVENT LISTENERS ---
// MODIFIED: The event listeners now call the new function, passing which card won.
cardA.addEventListener('click', () => {
    selectNext('A'); // Card A is the winner
});

cardB.addEventListener('click', () => {
    selectNext('B'); // Card B is the winner
});

// --- 6. KICK OFF THE PROCESS ---
// Call the async function to begin the entire process
startShowdown();