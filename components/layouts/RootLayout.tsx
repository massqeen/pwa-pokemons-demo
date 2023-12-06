import { PropsWithChildren, memo,useEffect } from "react"
import { useDispatch } from "react-redux"
import axios, { AxiosResponse } from "axios"

import { setPokemons, setPokemonsMeta } from "redux/slicers/appSlice"

import { IPokemonsData } from "types"

const RootLayout = memo(({ children }: PropsWithChildren)=>{
    const dispatch = useDispatch()

    const fetchAllPokemons = async(limit = 100)=> {
        const result:AxiosResponse<IPokemonsData> = await axios.get(`/pokemon/?limit=${limit}`)
        if(result?.data) {
            const { results,count,next,previous } = result.data
            dispatch(setPokemons(results))
            dispatch(setPokemonsMeta({ count,next,previous }))
        }
    }

    const initAxios = ()=>{
        axios.defaults.baseURL = 'https://pokeapi.co/api/v2/'
    }

    useEffect(() => {
        initAxios()
        fetchAllPokemons()
    }, [])

    return children
})

RootLayout.displayName = 'RootLayout'

export default RootLayout
