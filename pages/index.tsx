import { useSelector } from "react-redux"
import dynamic from 'next/dynamic'

import { RootState } from "redux/store"
import { useMemo, useState } from "react"

const SearchInput = dynamic(
    () => import('components/base/SearchInput'),
    {
        ssr: true,
        loading: () => null,
    }
)
const Pagination = dynamic(
    () => import('components/base/Pagination'),
    {
        ssr: true,
        loading: () => null,
    }
)
const BasicPokemonsList = dynamic(
    () => import('components/lists/BasicPokemonsList'),
    {
        ssr: true,
        loading: () => (
            <p>Loading...</p>
        ),
    }
)

const paginationPerPage = 15

export default function Home() {
    const { pokemons } = useSelector(
        ({ app }: RootState) => ({ pokemons:app.pokemons })
    )

    const [query, setQuery] = useState<string>('')
    const [paginationOffset, setPaginationOffset] = useState<number>(0)

    const foundPokemons = useMemo(() => {
        if(! query || ! pokemons ) return pokemons

        return pokemons.filter(({ name })=>name.includes(query))
    }, [query, pokemons])

    const paginatedPokemons = useMemo(() => {
        if(! foundPokemons ) return null

        return foundPokemons.filter((pokemon, index) =>
            index >= paginationOffset && index < paginationOffset + paginationPerPage)

    }, [foundPokemons, paginationOffset])

    const onSearchPokemonByName = (value: string)=>{
        setQuery(value)
        setPaginationOffset(0)
    }

    const onChangePage = (offset: number) =>{
        setPaginationOffset(offset)
    }

    return (
        <>
            <h1>Pokemons</h1>
            <SearchInput debounceTimeout={500} onSearch={onSearchPokemonByName}/>
            <Pagination records={foundPokemons ?? []} perPage={paginationPerPage} onChangePage={onChangePage}>
                <BasicPokemonsList pokemons={paginatedPokemons}/>
            </Pagination>
        </>
    )
}
