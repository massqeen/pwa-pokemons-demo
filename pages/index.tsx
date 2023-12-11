import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import dynamic from 'next/dynamic'
import { Online } from "react-detect-offline"

import { fetchPokemonDetails } from "pages/details/pokemon/[pid]"

import { RootState } from "redux/store"
import { IPokemonDetails } from "types"

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
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

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

    const fetchAllPokemonDetails = async()=>{
        const allDetails:IPokemonDetails[] = []
        if(! pokemons || pokemons.length === 0) return allDetails
        for (let i = 0; i < pokemons.length ; i ++) {
            const index = pokemons[i].url.indexOf('pokemon')
            if(index !== - 1) {
                let id = pokemons[i].url.substring(index + 8)
                id = id.slice(0, - 1)
                const details:IPokemonDetails | undefined = await fetchPokemonDetails(id)
                if(details) {
                    allDetails.push(details)
                }
            }
        }

        return allDetails
    }

    const onDownloadAllDetails = async()=> {
        setIsDownloading(true)
        await fetchAllPokemonDetails().then(()=>{
            setIsDownloading(false)})
    }

    return (
        <>
            <h1>Pokemons</h1>

            <Online>
                <button
                    className="flex justify-center content-center max-w-xs mt-2 p-2 dark:text-black border border-yellow-500 bg-yellow-200 rounded-lg duration-150 shadow-md
                        hover:bg-yellow-100 disabled:cursor-not-allowed"
                    disabled={isDownloading}
                    onClick={onDownloadAllDetails}
                >
                    {isDownloading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                        <path className="opacity-75" fill="#7c2d12"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
                            5.824 3 7.938l3-2.647z"
                        >
                        </path>
                    </svg>}
                    Download offline content
                </button>
            </Online>

            <SearchInput debounceTimeout={500} onSearch={onSearchPokemonByName}/>

            <Pagination records={foundPokemons ?? []} perPage={paginationPerPage} onChangePage={onChangePage}>
                <BasicPokemonsList pokemons={paginatedPokemons}/>
            </Pagination>
        </>
    )
}
