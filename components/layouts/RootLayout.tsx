import { PropsWithChildren, memo,useEffect } from "react"
import { useDispatch } from "react-redux"
import axios, { AxiosResponse } from "axios"
import { Inter } from "next/font/google"
import { Offline } from "react-detect-offline"

import { setPokemons, setPokemonsMeta } from "redux/slicers/appSlice"

import { DEFAULT_POKEMONS_PER_REQUEST, IPokemonsData } from "types"

const inter = Inter({ subsets: ['latin'] })

export const fetchPokemonsList = async(
    limit = DEFAULT_POKEMONS_PER_REQUEST,
    nextUrl?: string,
    onSuccess?:(data: IPokemonsData)=>void)=> {
    const requestUrl = nextUrl ? nextUrl : `/pokemon/?limit=${limit}`
    const result:AxiosResponse<IPokemonsData> = await axios.get(requestUrl)

    if(result?.data && onSuccess) {
        onSuccess(result.data)
    } else if(result?.data) {
        return result.data
    }
}

const RootLayout = memo(({ children }: PropsWithChildren)=>{
    const dispatch = useDispatch()

    const onGetPokemonsList = (data:IPokemonsData)=>{
        const { results,count,next,previous } = data
        dispatch(setPokemons(results))
        dispatch(setPokemonsMeta({ count,next,previous }))
    }

    const initAxios = ()=>{
        axios.defaults.baseURL = 'https://pokeapi.co/api/v2/'
    }

    useEffect(() => {
        initAxios()
        fetchPokemonsList(DEFAULT_POKEMONS_PER_REQUEST,'', onGetPokemonsList)
    }, [])

    return (
        <main className={`flex min-h-screen flex-col justify-normal py-4 px-8 lg:py-6 lg:px-12 ${inter.className}`}>
            <div className='text-center text-orange-500 font-semibold'>
                <Offline >You are offline!</Offline>
            </div>
            {children}
        </main>
    )
})

RootLayout.displayName = 'RootLayout'

export default RootLayout
