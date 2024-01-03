import { memo, useEffect, PropsWithChildren } from 'react'
import { useDispatch } from 'react-redux'
import process from "process"
import { Libraries, useLoadScript } from '@react-google-maps/api'
import { AnyAction, Dispatch } from 'redux'

import { setGoogleMapsAPI } from 'redux/slicers/appSlice'

export type GoogleMapsLibraryTypes = (
    | 'core'
    | 'maps'
    | 'drawing'
    | 'geometry'
    | 'places'
    | 'visualization'
)[]

export const googleMapsLibraries: Libraries = ['places']

export const onGoogleMapsAPILoaded = (dispatch: Dispatch<AnyAction>) => {
    dispatch(setGoogleMapsAPI({ isLoaded: true, loadError: null }))
}

export const onGoogleMapsAPIError = (
    error: Error,
    dispatch: Dispatch<AnyAction>
) => {
    dispatch(setGoogleMapsAPI({ isLoaded: false, loadError: error }))
}

const GoogleMapsLayout = memo(({ children }: PropsWithChildren) => {
    const dispatch = useDispatch()
    const {
        isLoaded: isGoogleMapsAPILoaded,
        loadError: googleMapsAPILoadError,
    } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY ?? '',
        language: 'en',
        region: 'ae',
        libraries: googleMapsLibraries,
    })

    useEffect(() => {
        if (isGoogleMapsAPILoaded || !! googleMapsAPILoadError) {
            dispatch(
                setGoogleMapsAPI({
                    isLoaded: isGoogleMapsAPILoaded,
                    loadError: googleMapsAPILoadError ?? null,
                })
            )
        }
    }, [isGoogleMapsAPILoaded, googleMapsAPILoadError])

    return <>{children}</>
})

GoogleMapsLayout.displayName = 'GoogleMapsLayout'

export default GoogleMapsLayout
