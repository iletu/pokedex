

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
    let pokemon = await response.json();

    console.log(pokemon.id);
    console.log(pokemon.name);
    console.log(pokemon.types);
    console.log(pokemon.sprites.other['official-artwork'].front_default);

    renderPokemonCard(pokemon);
}


function renderPokemonCard(pokemon) {

    document.getElementById('pokemon-card').innerHTML += `
        <div class="pokemon-content">
            <div>
                 <img src="${pokemon.sprites.other['official-artwork'].front_default}">
            </div>

            <div class="pokemon-data">
                <p>Nr. ${pokemon.id.toString().padStart(4, '0')}</p>
               <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            </div>

            <div>
                <p>${pokemon.abilities} </p>
            </div> 
        </div> 
    `;
}

fetchPokemonData();
