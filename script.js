let allPokemon = [];        // Liste aller Pokémon aus der API
let loadedPokemon = [];     // Pokémon aus Load more
let pokemonCache = [];      // Cache aller heruntergeladenen Pokémon

let currentPokemonId = 1;

let currentIndex = 0;       // bis wohin wurde geladen?
let pokemonPerLoad = 20;    // immer 20 Pokemon laden




// Kleine Pokemonkarte

async function fetchPokemonData() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
    let pokemonData = await response.json();

    allPokemon = pokemonData.results;

    console.log(allPokemon);

    loadMorePokemon();
}

async function loadMorePokemon() {
    let end = currentIndex + pokemonPerLoad;

    for (let i = currentIndex; i < end && i < allPokemon.length; i++) {
        let pokemonUrl = allPokemon[i].url;

        await loadPokemonDetails(pokemonUrl);
    }

    currentIndex = end;
}

async function loadPokemonDetails(pokemonUrl) {
    let response = await fetch(pokemonUrl);
    let pokemon = await response.json();

    loadedPokemon.push(pokemon);
    pokemonCache.push(pokemon);

    console.log(loadedPokemon);
    console.log(pokemon.id);
    console.log(pokemon.name);
    console.log(pokemon.types);
    console.log(pokemonAbilities(pokemon));
    console.log(pokemon.sprites.other['official-artwork'].front_default);

    renderPokemonBackground(pokemon);
    renderPokemonCard(pokemon);
}


function pokemonType(pokemon) {
    let types = [];

    for (let i = 0; i < pokemon.types.length; i++) {
        let type = pokemon.types[i].type.name;
        types.push(type);
    }
    return types;
}


function renderPokemonTypes(pokemon) {
    let types = pokemonType(pokemon);
    let typesHtml = ""

    for (let i = 0; i < types.length; i++) {
        console.log(types[i]);
        typesHtml += `<p class="${types[i]}">${types[i]}</p>`;
    }
    return typesHtml
}


function renderPokemonCard(pokemon) {

    document.getElementById('pokemon-card').innerHTML += `
            <div class="pokemon-content" onclick="openDialog(${pokemon.id})">
                <div class="pokemon-image">
                    <div class="pokemon-background ${pokemonBackground(pokemon)}">
                        <img src="${pokemon.sprites.other['official-artwork'].front_default}">
                    </div>
                </div>

                <div class="pokemon-data">
                    <p>Nr. ${pokemon.id.toString().padStart(4, '0')}</p>
                    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                </div>

                <div class="types">
                    ${renderPokemonTypes(pokemon)}
                </div> 
            </div>
    `;
}


function pokemonBackground(pokemon) {
    return pokemon.types[0].type.name
}


function renderPokemonBackground(pokemon) {
    let background = pokemonBackground(pokemon);

    console.log(background);
}


fetchPokemonData();







// Große Ansicht (Overlay)

function pokemonAbilities(pokemon) {
    let abilities = [];

    for (let i = 0; i < pokemon.abilities.length; i++) {
        let ability = pokemon.abilities[i].ability.name;
        abilities.push(ability);
    }

    return abilities;
}


// Dialog

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


function renderPokemonDialog(pokemon) {
    document.getElementById('pokemon-dialog').innerHTML = `
        <div class="pokemon-dialog-content">

            <div class="pokemon-dialog-header">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <p>Nr. ${pokemon.id.toString().padStart(4, '0')}</p>
            </div>

            <div class="types">
                ${renderPokemonTypes(pokemon)}
            </div>

            <div class="pokemon-dialog-image ${pokemonBackground(pokemon)}">

                <button class="pokemon-arrow" onclick="previousPokemon()">
                    &lt;
                </button>

                <img src="${pokemon.sprites.other['official-artwork'].front_default}">

                <button class="pokemon-arrow" onclick="nextPokemon()">
                    &gt;
                </button>

            </div>

            <div class="pokemon-stats">
                <h3>Base Stats</h3>
                ${renderPokemonStats(pokemon)}
            </div>

        </div>
    `;
}



function renderPokemonStats(pokemon) {
    let statsHtml = '';

    for (let i = 0; i < pokemon.stats.length; i++) {
        let statName = pokemon.stats[i].stat.name;
        let statValue = pokemon.stats[i].base_stat;

        statName = statName.charAt(0).toUpperCase() + statName.slice(1);

        statsHtml += `
            <div class="stat">
                <p>${statName}</p>
                <p>${statValue}</p>

                <div class="stat-bar">
                    <div class="stat-bar-value" style="width: ${statValue}%"></div>
                </div>
            </div>
        `;
    }

    return statsHtml;
}
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

// search pokemon
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