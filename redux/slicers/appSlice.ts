import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IAppState, IGoogleMapsAPI } from 'redux/types'
import { IPokemon, IPokemonsMeta } from "types"

const initialState: IAppState = {
    pokemonsMeta:null,
    pokemons:null,
    googleMapsAPI: {
        isLoaded: false,
        loadError: null,
    },
}

export const appSlice = createSlice({
    name: 'app',
    initialState, 
    reducers: {
        setPokemons: (state, { payload }: PayloadAction<IPokemon[] | null>) => {
            if(! payload || ! state.pokemons) {
                state.pokemons = payload
            } else {
                state.pokemons = [...state.pokemons, ...payload]
            }
        },
        setPokemonsMeta: (state, { payload }: PayloadAction<IPokemonsMeta | null>) => {
            state.pokemonsMeta = payload
        },
        setGoogleMapsAPI: (
            state,
            { payload }: PayloadAction<IGoogleMapsAPI>
        ) => {
            state.googleMapsAPI = payload
        },
    },
})

export const {
    setPokemonsMeta,
    setPokemons,
    setGoogleMapsAPI,
} = appSlice.actions

export default appSlice.reducer
