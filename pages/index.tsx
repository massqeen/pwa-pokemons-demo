import { useSelector } from "react-redux"
import dynamic from 'next/dynamic'

import { RootState } from "redux/store"

const BasicPokemonsList = dynamic(
    () => import('components/lists/BasicPokemonsList'),
    {
        ssr: false,
        loading: () => (
            <p>Loading...</p>
        ),
    }
)

export default function Home() {
    const { pokemons } = useSelector(
        ({ app }: RootState) => ({ pokemons:app.pokemons })
    )

    return (
        <BasicPokemonsList pokemons={pokemons}/>
    )
}
