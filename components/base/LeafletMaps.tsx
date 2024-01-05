import { MapContainer, TileLayer } from 'react-leaflet'
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer'

import { ICoords } from "types"

interface IMapProps {
    mapCenter: ICoords
    mapZoom: number
    isOffline?: boolean
    onZoomChange?: (zoom: number) => void
    onMapCenterChange?: (coords: ICoords) => void
}

function LeafletMaps({
    mapCenter,
    mapZoom,
}: IMapProps) {

    return (
        <div style={{ display: "flex" }}>
            <MapContainer
                style={{
                    height: "90vh",
                    width: "100%",
                }}
                center={mapCenter}
                zoom={mapZoom}
            >
                <TileLayer
                    attribution="Google Maps"
                    url='http://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
                    maxZoom={20}
                    subdomains={['mt0','mt1','mt2','mt3']}
                />
                <ReactLeafletGoogleLayer
                    useGoogMapsLoader={false}
                    type='roadmap'
                    maxZoom={20}
                    styles={[
                        {
                            featureType: "poi",
                            stylers: [{ visibility: "off" }],
                        },
                    ]}
                    attribution="Google Maps"
                />
            </MapContainer>
        </div>
    )
}

export default LeafletMaps
