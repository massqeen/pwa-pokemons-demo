import { IPokemon, IPokemonsMeta } from "types"

export interface IGoogleMapsAPI {
    isLoaded: boolean
    loadError: Error | null
}

export interface IAppState {
    pokemonsMeta: IPokemonsMeta | null
    pokemons: IPokemon[] | null
    googleMapsAPI: IGoogleMapsAPI
}
