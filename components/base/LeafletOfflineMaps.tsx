import { useEffect, useState } from "react"
import { tileLayerOffline, savetiles, TileLayerOffline } from 'leaflet.offline'
import { Control, Map } from 'leaflet'

import { useDebouncedCallback } from "use-debounce"

import storageLayer from 'services/mapStorageLayer'

import { OPENSTREETMAP_URL_TEMPLATE } from 'types'
import { IMapProps } from "components/base/LeafletGoogleMaps"

function LeafletOfflineMaps({
    mapCenter,
    mapZoom,
}: IMapProps) {
    const [map, setMap] = useState<Map | null>(null)
    const [mapBaseLayer, setMapBaseLayer] = useState<TileLayerOffline | null>(null)
    const [layerSwitcher, setLayerSwitcher] = useState<Control.Layers | null>(null)
    const initMap = () =>{
        const leafletMap = new Map('map')
        setMap(leafletMap)
        leafletMap.setView(
            mapCenter,
            mapZoom
        )

        return map
    }

    const initBaseLayer = ()=>{
        // offline baselayer, will use offline source if available
        console.log('initBaseLayer, map:', map)
        if(! map || mapBaseLayer) return
        const baseLayer = tileLayerOffline(OPENSTREETMAP_URL_TEMPLATE, {
            attribution: 'Map data {attribution.OpenStreetMap}',
            subdomains: 'abc',
            minZoom: 13,
        }).addTo(map)
        setMapBaseLayer(baseLayer)
    }

    const initSaveControls = ()=>{
        if(! map || ! mapBaseLayer) return
        // add buttons to save tiles in area viewed
        const saveControl = savetiles(mapBaseLayer, {
            zoomlevels: [13, 17], // optional zoomlevels to save, default current zoomlevel
            alwaysDownload: false,
            confirm(layer:unknown, successCallback: ()=>void) {
                // eslint-disable-next-line
                // @ts-ignore
                if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
                    successCallback()
                }
            },
            confirmRemoval(layer:unknown, successCallback: ()=>void) {
                // eslint-disable-next-line no-alert
                if (window.confirm('Remove all the tiles?')) {
                    successCallback()
                }
            },
            saveText: 'save',
            rmText: 'del',
        })
        saveControl.addTo(map)
    }

    const addLayerSwitcher = ()=>{
        if(! map || ! mapBaseLayer || layerSwitcher) return
        console.log('initing layerSwitcher')
        // layer switcher control
        const localLayerSwitcher = new Control.Layers(
            { 'osm (offline)': mapBaseLayer, },
            undefined,
            { collapsed: false }
        ).addTo(map)
        setLayerSwitcher(localLayerSwitcher)
    }

    const addStorageOverlay = ()=>{
        if(! layerSwitcher || ! mapBaseLayer) return
        console.log('setting storage layer')
        // add storage overlay
        storageLayer(mapBaseLayer, layerSwitcher)
    }

    // events while saving a tile layer
    let progress = 0
    let total = 0
    const showProgress = useDebouncedCallback(() => {
        const progressBar = document.getElementById('progressbar')
        if(! progressBar) return
        progressBar.style.width = `${
            (progress / total) * 100
        }%`
        progressBar.innerHTML = progress.toString()
        if (progress === total) {
            setTimeout(
                () =>
                    document.getElementById('progress-wrapper')?.classList.remove('show'),
                1000
            )
        }
    }, 10)

    useEffect(() => {
        if(map) return
        initMap()
    }, [])

    useEffect(() => {
        initBaseLayer()
    }, [map])

    useEffect(() => {
        initSaveControls()
        addLayerSwitcher()
    }, [map, mapBaseLayer])

    useEffect(() => {
        addStorageOverlay()
    }, [layerSwitcher, mapBaseLayer])

    useEffect(() => {
        if(! mapBaseLayer) return
        const onSaveStart = (e: unknown) => {
            const progressBar = document.getElementById('progressbar')
            if(! progressBar) return
            progress = 0
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            total = e._tilesforSave.length
            document?.getElementById('progress-wrapper')?.classList.add('show')
            progressBar.style.width = '0%'
        }
        const onEndLoadTile = () => {
            progress += 1
            showProgress()
        }
        mapBaseLayer.on('savestart', onSaveStart)
        mapBaseLayer.on('loadtileend',onEndLoadTile )

        return ()=>{
            mapBaseLayer.off('savestart',onSaveStart)
            mapBaseLayer.off('loadtileend',onEndLoadTile)
        }
    }, [mapBaseLayer])

    return (
        <>
            <p>
                Total in database:
                <a href="list.html"><span id="storage"></span> files</a>
            </p>

            <div id="progress-wrapper" className="collapse  pb-2">
                <div className="d-flex">
                    <div className="">Download Progress</div>
                    <div className="flex-grow-1 ml-2 my-1">
                        <div id="progress" className="progress">
                            <div
                                id="progressbar"
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style={{ width: "0%" }}
                                aria-valuenow={0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="map"
                style={{
                    height: "90vh",
                    width: "100%",
                }}
            />
        </>
    )
}

export default LeafletOfflineMaps
