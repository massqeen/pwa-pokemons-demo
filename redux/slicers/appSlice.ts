import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IAppState } from 'redux/types'
import { IPokemon, IPokemonsMeta } from "types"

const initialState: IAppState = {
    pokemonsMeta:null,
    pokemons:null
}

export const appSlice = createSlice({
    name: 'app',
    initialState, 
    reducers: {
        setPokemons: (state, { payload }: PayloadAction<IPokemon[] | null>) => {
            state.pokemons = payload
        },
        setPokemonsMeta: (state, { payload }: PayloadAction<IPokemonsMeta | null>) => {
            state.pokemonsMeta = payload
        },
    },
})

export const {
    setPokemonsMeta,
    setPokemons
} = appSlice.actions

export default appSlice.reducer
