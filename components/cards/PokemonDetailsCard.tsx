import Image from 'next/image'
import { IPokemonDetails } from "types"
import { capitalizeFirstLetter } from "../../services/utils"

interface IProps {
    details: IPokemonDetails
}

const PokemonDetailsCard = ({ details }:IProps) => {
    const { name, sprites } = details

    return (
        <div className="border border-black dark:border-amber-50 rounded-lg max-w-xl">
            <div className="flex items-start justify-between p-4">
                <div className="space-y-2">
                    {sprites.front_default &&
                        <Image
                            src={sprites.front_default}
                            alt={`${name} icon`}
                            width={64}
                            height={64}
                        />
                    }
                    <h4 className="font-semibold">{capitalizeFirstLetter(name)}</h4>
                    <p className="font-semibold text-sm">DESCRIPTION</p>
                </div>
            </div>
        </div>
    )

}

export default PokemonDetailsCard
