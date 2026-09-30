

async function fetchPokemonData() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
    let pokemonData = await response.json();
    console.log(pokemonData);

    loadPokemonUrls(pokemonData);
}


function loadPokemonUrls(pokemonData) {
    for (let i = 0; i < 20; i++) {

        let pokemonUrl = pokemonData.results[i].url;
        loadPokemonDetails(pokemonUrl);
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


}


fetchPokemonData();