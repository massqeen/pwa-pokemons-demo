import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import axios, { AxiosResponse } from "axios"

import { IPokemonDetails } from "types"

const PokemonDetailsCard = dynamic(
    () => import('components/cards/PokemonDetailsCard'),
    {
        ssr: true,
        loading: () => (
            <p>Loading...</p>
        ),
    }
)

export const fetchPokemonDetails = async(id:string, onSuccess?:(data:IPokemonDetails)=>void)=> {
    const result:AxiosResponse<IPokemonDetails> = await axios.get(`/pokemon/${id}`)
    if(result?.data && onSuccess) {
        onSuccess(result.data)
    } else if(result?.data) {
        return result.data
    }
}

export default function PokemonDetailsPage() {
    const router = useRouter()

    const [details, setDetails] = useState<IPokemonDetails | null>(null)

    const pokemonId = useMemo(
        () =>
            Array.isArray(router.query.pid)
                ? router.query.pid[0]
                : router.query.pid,
        [router.query.pid]
    )

    useEffect(() => {
        if(! pokemonId) return
        fetchPokemonDetails(pokemonId, setDetails)
    }, [pokemonId])

    return (
        <>
            <h1>Pokemon details</h1>
            {details ? <PokemonDetailsCard details={details}/> : <p>No data</p>}
        </>
    )
}
