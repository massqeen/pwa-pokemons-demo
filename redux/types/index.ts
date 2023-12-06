import { IPokemon, IPokemonsMeta } from "types"

export interface IAppState {
    pokemonsMeta: IPokemonsMeta | null
    pokemons: IPokemon[] | null
}
