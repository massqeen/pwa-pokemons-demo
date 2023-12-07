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

export interface IBasicSprite {
    front_default: string | null
}

export interface ISprite extends IBasicSprite {
    back_default: string | null
    back_female: string | null
    back_shiny: string | null
    back_shiny_female: string | null
    front_female: string | null
    front_shiny: string | null
    front_shiny_female: string | null
    other: {
        dream_world: IBasicSprite
        home: IBasicSprite
        'official-artwork': IBasicSprite
    }
}

export interface IPokemonDetails {
    id:number
    name:string
    base_experience: number
    height: number
    weight: number
    sprites: ISprite
}
