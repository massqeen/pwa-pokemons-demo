import { useEffect, useMemo, useRef } from 'react'
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
import { useDispatch, useSelector } from 'react-redux'
import process from "process"

import { useDebouncedCallback } from 'use-debounce'

import {
    googleMapsLibraries,
    onGoogleMapsAPIError,
    onGoogleMapsAPILoaded,
} from 'components/layouts/GoogleMapsLayout'

import { ICoords, IMap } from 'types'
import { RootState } from 'redux/store'

const defaultMapParams: IMap = {
    // Dubai
    center: {
        lat: 24.987404,
        lng: 55.02177,
    },
    zoom: 18,
}

interface IMapProps {
    mapCenter: ICoords
    mapZoom: number
    onZoomChange?: (zoom: number) => void
    onMapCenterChange?: (coords: ICoords) => void
}

const Map = ({
    mapCenter,
    mapZoom,
    onZoomChange,
    onMapCenterChange,
}: IMapProps) => {
    const dispatch = useDispatch()

    const { isLoaded, loadError } = useSelector(
        ({ app }: RootState) => ({
            isLoaded: app.googleMapsAPI.isLoaded,
            loadError: app.googleMapsAPI.loadError,
        })
    )

    const mapRef = useRef<google.maps.Map | null>(null)
    const mapCenterCoordsRef = useRef<ICoords>(defaultMapParams.center)

    const mapOptions = useMemo(() => {
        const options: google.maps.MapOptions = {
            center: mapCenter,
            zoom: mapZoom,
            styles: [],
        }

        return options
    }, [mapCenter, mapZoom])

    const mapCenterChangeThrottleCB = useDebouncedCallback(function fn() {
        const { lat: propLat, lng: propLng } = mapCenterCoordsRef.current
        const coords = {
            lat: mapRef.current?.getCenter()?.lat() || propLat,
            lng: mapRef.current?.getCenter()?.lng() || propLng,
        }
        if (onMapCenterChange) {
            if (
                mapRef.current?.getCenter()?.lat() === propLat &&
                mapRef.current?.getCenter()?.lng() === propLng
            ) {
                return
            }
            onMapCenterChange(coords)
        }
    }, 100)

    const onApiLoaded = function (map: google.maps.Map) {
        mapRef.current = map

        map.addListener('zoom_changed', function fn() {
            if (onZoomChange) {
                onZoomChange(map.getZoom() || mapZoom)
            }
        })

        map.addListener('center_changed', mapCenterChangeThrottleCB)
    }

    const renderMap = () => {
        return (
            <GoogleMap
                options={mapOptions}
                mapContainerStyle={{ width: '100%', minHeight: '94vh' }}
                mapContainerClassName="map-container"
                onLoad={onApiLoaded}
            />
        )
    }

    const renderMapWithScriptLoader = () => {
        return (
            <LoadScriptNext
                googleMapsApiKey={process.env.NEXT_PUBLIC_MAP_API_KEY ?? ''}
                language={'en'}
                region="ae"
                libraries={googleMapsLibraries}
                loadingElement={
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                        <path className="opacity-75" fill="#7c2d12"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
                            5.824 3 7.938l3-2.647z"
                        >
                        </path>
                    </svg>
                }
                onLoad={() => onGoogleMapsAPILoaded(dispatch)}
                onError={(error) => onGoogleMapsAPIError(error, dispatch)}
            >
                {renderMap()}
            </LoadScriptNext>
        )
    }

    useEffect(() => {
        mapCenterCoordsRef.current = { ...mapCenter }
    }, [mapCenter])

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }

    return isLoaded ? renderMap() : renderMapWithScriptLoader()
}

export default Map
