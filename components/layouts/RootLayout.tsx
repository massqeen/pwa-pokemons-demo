import { PropsWithChildren, memo,useEffect } from "react"
import { useDispatch } from "react-redux"
import axios, { AxiosResponse } from "axios"
import { Inter } from "next/font/google"

import { setPokemons, setPokemonsMeta } from "redux/slicers/appSlice"

import { IPokemonsData } from "types"
const inter = Inter({ subsets: ['latin'] })

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

    return (
        <main className={`flex min-h-screen flex-col justify-normal py-4 px-8 lg:py-6 lg:px-12 ${inter.className}`}>
            {children}
        </main>
    )
})

RootLayout.displayName = 'RootLayout'

export default RootLayout
