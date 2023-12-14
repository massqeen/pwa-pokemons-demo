import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from "next/navigation"
import axios, { AxiosResponse } from "axios"
import { NextPage } from "next"

import useNetwork from "hooks/useNetwork"
import { sleep } from "services/utils"

import { setPokemons, setPokemonsMeta } from "redux/slicers/appSlice"

import { fetchPokemonDetails } from "pages/details/pokemon/[pid]"

import { RootState } from "redux/store"
import { DEFAULT_POKEMONS_PER_REQUEST, IPokemonDetails, IPokemonsData } from "types"

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

const paginationPerPage = 10

const fetchPokemonsList = async(
    limit = DEFAULT_POKEMONS_PER_REQUEST,
    nextUrl?: string,
    onSuccess?:(data: IPokemonsData)=>void)=> {
    if (process.env.NODE_ENV === 'development') {
        await sleep()
    }

    const requestUrl = nextUrl ? nextUrl : `/pokemon/?limit=${limit}`
    const result:AxiosResponse<IPokemonsData> = await axios.get(requestUrl)

    if(result?.data && onSuccess) {
        onSuccess(result.data)
    } else if(result?.data) {
        return result.data
    }
}

const HomePage: NextPage = () => {
    const dispatch = useDispatch()

    const { pokemons,nextPokemonsUrl } = useSelector(
        ({ app }: RootState) => (
            {
                pokemons: app.pokemons,
                nextPokemonsUrl: app.pokemonsMeta?.next ?? null
            }
        )
    )

    const [query, setQuery] = useState<string>('')
    const [paginationOffset, setPaginationOffset] = useState<number>(0)
    const [isDownloadingContent, setIsDownloadingContent] = useState<boolean>(false)
    const [arePokemonsLoading, setArePokemonsLoading] = useState<boolean>(false)

    const { online } = useNetwork()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const queryFromSearchParam = searchParams.get('query')
    const pageFromSearchParam = Number(searchParams.get('page')) || 1

    const findPokemonsByQuery = (query:string)=>{
        if(! query || ! pokemons ) return pokemons

        return pokemons.filter(({ name })=>name.includes(query))
    }

    const foundPokemons = useMemo(() => {
        if(! query || ! pokemons ) return pokemons

        return findPokemonsByQuery(query)
    }, [query, pokemons])

    const paginatedPokemons = useMemo(() => {
        if(! foundPokemons ) return null

        return foundPokemons.filter((pokemon, index) =>
            index >= paginationOffset && index < paginationOffset + paginationPerPage)

    }, [foundPokemons, paginationOffset])

    const onSearchPokemonByName = (value: string)=>{
        const params = new URLSearchParams(searchParams)
        setQuery(value.toLowerCase())

        if (value) {
            params.set('query', value)
        } else {
            params.delete('query')
        }

        const foundPokemons = findPokemonsByQuery(value)
        if(foundPokemons && foundPokemons?.length > (pageFromSearchParam - 1) * paginationPerPage) {
            setPaginationOffset((pageFromSearchParam - 1) * paginationPerPage)
            params.set('page', pageFromSearchParam.toString())
        } else {
            setPaginationOffset(0)
            params.set('page', '1')
        }

        replace(`${pathname}?${params.toString()}`)
    }

    const onChangePage = (offset: number, page: number) =>{
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        if(queryFromSearchParam) {
            params.set('query',queryFromSearchParam)
        }
        setPaginationOffset(offset)
        replace(`${pathname}?${params.toString()}`)
    }

    const fetchAllPokemonDetails = async()=>{
        const allDetails:IPokemonDetails[] = []
        if(! pokemons || pokemons.length === 0) return allDetails

        for (const { url } of pokemons) {
            const index = url.indexOf('pokemon')

            if(index !== - 1) {
                let id = url.substring(index + 8)
                id = id.slice(0, - 1)
                const details:IPokemonDetails | undefined = await fetchPokemonDetails(id)

                if(details) {
                    const urls:string[] = []

                    if(details.sprites?.front_default) {
                        urls.push(details.sprites.front_default)
                    }
                    if(details.sprites?.other["official-artwork"]?.front_default) {
                        urls.push(details.sprites.other["official-artwork"].front_default)
                    }

                    const imageRequests = urls.map((url) => axios.get(url))
                    await axios.all(imageRequests)
                    allDetails.push(details)
                }
            }
        }

        return allDetails
    }

    const onDownloadAllDetails = async()=> {
        setIsDownloadingContent(true)
        await fetchAllPokemonDetails().finally(()=>{
            setIsDownloadingContent(false)}
        )
    }

    const onGetPokemonsList = (data:IPokemonsData)=>{
        const { results,count,next,previous } = data
        dispatch(setPokemons(results))
        dispatch(setPokemonsMeta({ count,next,previous }))
    }

    const onFetchPokemons = async ()=>{
        const requestFn = ! pokemons || pokemons.length === 0 ?
            async ()=> await fetchPokemonsList(
                DEFAULT_POKEMONS_PER_REQUEST,'', onGetPokemonsList
            )
            : async()=> await fetchPokemonsList(
                DEFAULT_POKEMONS_PER_REQUEST, nextPokemonsUrl as string
            )
        setArePokemonsLoading(true)
        const data = await requestFn()
            .finally(()=>{setArePokemonsLoading(false)})
        if(! data) {
            return
        }
        onGetPokemonsList(data)
    }

    useEffect(() => {
        const totalPages = ! pokemons || pokemons.length === 0
            ? 1
            : Math.ceil(pokemons.length / paginationPerPage)

        if(pageFromSearchParam === 1 || pageFromSearchParam > totalPages) return

        setPaginationOffset((pageFromSearchParam - 1) * paginationPerPage)
    }, [pageFromSearchParam])

    useEffect(() => {
        if(pokemons && pokemons.length > 0) return
        // to fix race condition with axios initialization in RootLayout
        setTimeout(() =>{ onFetchPokemons()},0)
    }, [pokemons])

    return (
        <>
            <h1>Pokemons</h1>

            {online && <button
                className="flex justify-center content-center max-w-xs mt-2 p-2 dark:text-black border
                        border-yellow-500 bg-yellow-200 rounded-lg duration-150 shadow-md
                        hover:bg-yellow-100 disabled:cursor-not-allowed"
                disabled={isDownloadingContent}
                onClick={onDownloadAllDetails}
            >
                {isDownloadingContent &&
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
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
            </button>}

            <SearchInput
                debounceTimeout={500}
                defaultValue={queryFromSearchParam ?? ''}
                onSearch={onSearchPokemonByName}
            />

            <Pagination
                records={foundPokemons ?? []}
                defaultPage={pageFromSearchParam}
                perPage={paginationPerPage}
                onChangePage={onChangePage}
            >
                {arePokemonsLoading && (! pokemons || pokemons.length === 0) ?
                    <p>Loading...</p> :
                    pokemons ?
                        <BasicPokemonsList
                            pokemons={paginatedPokemons}
                            doDisableLinks={isDownloadingContent}
                        />
                        : <p>No data</p>
                }

            </Pagination>

            {online && nextPokemonsUrl &&
                    <button
                        disabled={arePokemonsLoading}
                        className="flex justify-center content-center mt-6 px-4 py-2 max-w-xs border border-gray-800 dark:border-white rounded-lg duration-150
                            shadow-md hover:bg-gray-300 hover:dark:bg-neutral-700 disabled:cursor-not-allowed
                            disabled:hover:bg-transparent"
                        onClick={onFetchPokemons}
                    >
                        {arePokemonsLoading &&
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path className="opacity-75" fill="rgb(245 158 11)"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
                            5.824 3 7.938l3-2.647z"
                                >
                                </path>
                            </svg>}
                        Load more
                    </button>
            }
        </>
    )
}

export default HomePage
