export interface IPokemonsMeta {
    count: number
    next: string | null
    previous: string | null 
}

export interface IPokemon {
    name: string
    url: string
}

export interface IPokemonsData extends IPokemonsMeta {
    results: IPokemon[]
}
