import dynamic from "next/dynamic"

import useNetwork from "hooks/useNetwork"

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "types"

const Map = dynamic(() => import('components/base/LeafletOfflineMaps'), {
    ssr: false,
    loading: () => null,
})

export default function LocationPage () {
    const { online } = useNetwork()

    return (
        <Map
            mapCenter={DEFAULT_MAP_CENTER}
            mapZoom={DEFAULT_MAP_ZOOM}
            isOffline={! online}
        />
    )
}
