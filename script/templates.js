function renderPokemonTypes(pokemon) {
    let types = pokemonType(pokemon);
    let typesHtml = '';

    for (let i = 0; i < types.length; i++) {
        typesHtml += `<p class="${types[i]}">${types[i]}</p>`;
    }

    return typesHtml;
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