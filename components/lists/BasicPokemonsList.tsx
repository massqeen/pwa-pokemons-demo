import Link from 'next/link'

import { capitalizeFirstLetter } from "services/utils"

import { IPokemon } from "types"

interface IProps {
    pokemons: IPokemon[] | null
}

const BasicPokemonsList = ({ pokemons }:IProps) =>{
    const getQueryPID = (url:string)=>{
        const index = url.indexOf('pokemon')
        if(index === - 1) return ''

        return url.substring(index)
    }

    if(! pokemons || pokemons.length === 0) {
        return (<p>No data</p>)
    }

    return (
        <ul className="list-disc space-y-2">
            {pokemons.map(({ name, url }, index)=>{
                const query = getQueryPID(url)

                return (
                    <li key={`${name}${index}`}>
                        {query ?
                            <Link
                                href={`/details/${getQueryPID(url)}`}
                            >
                                {capitalizeFirstLetter(name)}
                            </Link>
                            : <span>{name}</span>
                        }
                    </li>
                )
            })}
        </ul>
    )
}

export default BasicPokemonsList
