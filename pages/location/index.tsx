import dynamic from "next/dynamic"
import { ReactElement } from "react"

import GoogleMapsLayout from 'components/layouts/GoogleMapsLayout'

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "types"
import { NextPageWithLayout } from "pages/_app"

const Map = dynamic(() => import('components/base/Map'), {
    ssr: false,
    loading: () => (
        <p>Loading...</p>
    ),
})

const LocationPage: NextPageWithLayout = function () {

    return (
        <Map
            mapCenter={DEFAULT_MAP_CENTER}
            mapZoom={DEFAULT_MAP_ZOOM}
        />
    )
}

LocationPage.getLayout = function getLayout(page: ReactElement) {
    return <GoogleMapsLayout>{page}</GoogleMapsLayout>
}

export default LocationPage
