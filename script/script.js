let allPokemon = [];        // Liste aller Pokémon aus der API
let loadedPokemon = [];     // Pokémon aus Load more
let pokemonCache = [];      // Cache aller heruntergeladenen Pokémon

let currentPokemonId = 1;
let currentIndex = 0;       // Bis wohin wurde geladen?
let pokemonPerLoad = 20;    // Immer 20 Pokémon laden


// --------------------------------------------------
// Pokémon laden
// --------------------------------------------------

async function fetchPokemonData() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
    let pokemonData = await response.json();

    allPokemon = pokemonData.results;

    loadMorePokemon();
}


async function loadMorePokemon() {
    showLoadingScreen();

    let end = currentIndex + pokemonPerLoad;

    for (let i = currentIndex; i < end && i < allPokemon.length; i++) {
        let pokemonUrl = allPokemon[i].url;

        await loadPokemonDetails(pokemonUrl);
    }

    currentIndex = end;

    hideLoadingScreen();
}


async function loadPokemonDetails(pokemonUrl) {
    let response = await fetch(pokemonUrl);
    let pokemon = await response.json();

    loadedPokemon.push(pokemon);
    pokemonCache.push(pokemon);

    renderPokemonCard(pokemon);
}


// --------------------------------------------------
// Loading Screen
// --------------------------------------------------

function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
}


function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}


// --------------------------------------------------
// Pokémon Hilfsfunktionen
// --------------------------------------------------

function pokemonType(pokemon) {
    let types = [];

    for (let i = 0; i < pokemon.types.length; i++) {
        let type = pokemon.types[i].type.name;
        types.push(type);
    }

    return types;
}


function pokemonBackground(pokemon) {
    return pokemon.types[0].type.name;
}


// --------------------------------------------------
// Dialog
// --------------------------------------------------

const dialogRef = document.getElementById('myDialog');


dialogRef.addEventListener('click', function (event) {
    if (event.target === dialogRef) {
        closeDialog();
    }
});


function openDialog(pokemonId) {
    currentPokemonId = pokemonId;

    let pokemon = getPokemonById(pokemonId);

    renderPokemonDialog(pokemon);

    dialogRef.showModal();
    dialogRef.classList.add('opened');

    document.body.style.overflow = 'hidden';
}


function closeDialog() {
    dialogRef.close();
    dialogRef.classList.remove('opened');

    document.body.style.overflow = '';
}


function getPokemonById(pokemonId) {
    for (let i = 0; i < pokemonCache.length; i++) {
        if (pokemonCache[i].id === pokemonId) {
            return pokemonCache[i];
        }
    }
}


// --------------------------------------------------
// Vorheriges / nächstes Pokémon
// --------------------------------------------------

async function previousPokemon() {
    if (currentPokemonId > 1) {
        let previousId = currentPokemonId - 1;
        let pokemon = getPokemonById(previousId);

        if (!pokemon) {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${previousId}`);
            pokemon = await response.json();

            pokemonCache.push(pokemon);
        }

        currentPokemonId = previousId;

        renderPokemonDialog(pokemon);
    }
}


async function nextPokemon() {
    let nextId = currentPokemonId + 1;
    let pokemon = getPokemonById(nextId);

    if (!pokemon) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
        pokemon = await response.json();

        pokemonCache.push(pokemon);
    }

    currentPokemonId = nextId;

    renderPokemonDialog(pokemon);
}


// --------------------------------------------------
// Pokémon suchen
// --------------------------------------------------

async function searchPokemon() {
    let searchInput = document.getElementById('search-input').value.toLowerCase();

    if (searchInput.length < 3) {
        document.getElementById('pokemon-card').innerHTML = '';

        for (let i = 0; i < loadedPokemon.length; i++) {
            renderPokemonCard(loadedPokemon[i]);
        }

        return;
    }

    let filteredPokemon = allPokemon.filter(
        (pokemon) => pokemon.name.includes(searchInput)
    );

    if (filteredPokemon.length === 0) {
        document.getElementById('pokemon-card').innerHTML =
            '<p>No Pokémon found</p>';

        return;
    }

    document.getElementById('pokemon-card').innerHTML = '';

    for (let i = 0; i < filteredPokemon.length; i++) {
        let pokemon = getPokemonByName(filteredPokemon[i].name);

        if (!pokemon) {
            let response = await fetch(filteredPokemon[i].url);
            pokemon = await response.json();

            pokemonCache.push(pokemon);
        }

        renderPokemonCard(pokemon);
    }
}


function getPokemonByName(pokemonName) {
    for (let i = 0; i < pokemonCache.length; i++) {
        if (pokemonCache[i].name === pokemonName) {
            return pokemonCache[i];
        }
    }
}


// --------------------------------------------------
// Start
// --------------------------------------------------

fetchPokemonData();