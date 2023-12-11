import Image from 'next/image'
import { IPokemonDetails } from "types"
import { capitalizeFirstLetter } from "../../services/utils"

interface IProps {
    details: IPokemonDetails
}

const PokemonDetailsCard = ({ details }:IProps) => {
    const { name, sprites, base_experience, height, weight,abilities } = details

    return (
        <div className="flex flex-col border border-slate-900 dark:border-amber-50 rounded-lg max-w-xl p-4">
            <h4 className="font-semibold self-center">{capitalizeFirstLetter(name)}</h4>
            <div className="">
                <div className="space-y-2">
                    {sprites.front_default &&
                        <Image
                            src={sprites.front_default}
                            alt='Icon'
                            width={64}
                            height={64}
                            priority
                            className='rounded-full border-solid border border-slate-900 dark:border-amber-50'
                        />
                    }
                    <p className="font-mono italic text-sm">
                        Base experience: <span className='font-normal not-italic'>{base_experience}</span>
                    </p>
                    <p className="font-mono italic text-sm">
                        Height: <span className='font-normal not-italic'>{height}</span>
                    </p>
                    <p className="font-mono italic text-sm">
                        Weight: <span className='font-normal not-italic'>{weight}</span>
                    </p>
                    <div className="flex font-mono italic text-sm">
                        Abilities:
                        <ul className='ms-2'>
                            {abilities.map(({ is_hidden,ability }, index)=>
                                (
                                    <li key={index}>
                                        <span className='font-normal not-italic'>{ability.name} </span>
                                        <span className='font-normal not-italic'>{is_hidden ? '(hidden)' : '(not hidden)'}</span>
                                    </li>
                                )
                            )
                            }
                        </ul>
                    </div>
                    {sprites?.other["official-artwork"]?.front_default &&
                            <img
                                src={sprites?.other["official-artwork"]?.front_default}
                                alt='Official artwork'
                                width={300}
                                height={300}
                            />
                    }
                </div>
            </div>
        </div>
    )

}

export default PokemonDetailsCard
