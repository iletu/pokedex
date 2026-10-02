let loadedPokemon = [];


// Kleine Pokemonkarte

async function fetchPokemonData() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let pokemonData = await response.json();
    console.log(pokemonData);

    loadPokemonUrls(pokemonData);
}


async function loadPokemonUrls(pokemonData) {
    for (let i = 0; i < 20; i++) {

        let pokemonUrl = pokemonData.results[i].url;
        await loadPokemonDetails(pokemonUrl);
    }
}


async function loadPokemonDetails(pokemonUrl) {
    let response = await fetch(pokemonUrl);
    let pokemon = await response.json();    //  // komplettes Pokémon-Objekt z.B. Bulbasaur-Objekt

    loadedPokemon.push(pokemon);   // speichert das komplette Pokémon-Objekt im Array / Cache


    console.log(loadedPokemon);
    console.log(pokemon.id);        // nur die ID des Pokémons
    console.log(pokemon.name);
    console.log(pokemon.types);
    console.log(pokemonAbilities(pokemon));
    console.log(pokemon.sprites.other['official-artwork'].front_default);

    renderPokemonBackground(pokemon)
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
    // console.log(abilities);
    return abilities;
}

// Dialog

const dialogRef = document.getElementById('myDialog');

function openDialog(pokemonId) {
    let pokemon = getPokemonById(pokemonId);

    console.log(pokemon.stats);

    console.log(pokemon.stats[0].stat.name);
    console.log(pokemon.stats[0].base_stat);

    renderPokemonDialog(pokemon);



    dialogRef.showModal();
    dialogRef.classList.add('opened');
}


function closeDialog() {
    dialogRef.close();
    dialogRef.classList.remove('opened');
}

function getPokemonById(pokemonId) {
    for (let i = 0; i < loadedPokemon.length; i++) {
        if (loadedPokemon[i].id === pokemonId) {
            return loadedPokemon[i]
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
                <img src="${pokemon.sprites.other['official-artwork'].front_default}">
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

        statsHtml += `
            <div class="stat">
                <p>${statName}</p>
                <p>${statValue}</p>
            </div>
        `;
    }

    return statsHtml;
}