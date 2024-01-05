import { tileLayerOffline, savetiles } from 'leaflet.offline'
import { Control, Map } from 'leaflet'
import { useDebouncedCallback } from "use-debounce"

import storageLayer from 'services/mapStorageLayer'

import { OPENSTREETMAP_URL_TEMPLATE } from 'types'
import { useEffect } from "react"

function LeafletOfflineMaps() {
    const leafletMap = new Map('map')

    // offline baselayer, will use offline source if available
    const baseLayer = tileLayerOffline(OPENSTREETMAP_URL_TEMPLATE, {
        attribution: 'Map data {attribution.OpenStreetMap}',
        subdomains: 'abc',
        minZoom: 13,
    }).addTo(leafletMap)

    // add buttons to save tiles in area viewed
    const saveControl = savetiles(baseLayer, {
        zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
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
        saveText: '<i class="fa fa-download" title="Save tiles"></i>',
        rmText: '<i class="fa fa-trash" title="Remove tiles"></i>',
    })
    saveControl.addTo(leafletMap)

    leafletMap.setView(
        {
            lat: 52.09,
            lng: 5.118,
        },
        16
    )
    // layer switcher control
    const layerSwitcher = new Control.Layers(
        { 'osm (offline)': baseLayer, },
        undefined,
        { collapsed: false }
    ).addTo(leafletMap)
    // add storage overlay
    storageLayer(baseLayer, layerSwitcher)

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
        baseLayer.on('savestart', onSaveStart)
        baseLayer.on('loadtileend',onEndLoadTile )

        return ()=>{
            baseLayer.off('savestart',onSaveStart)
            baseLayer.off('loadtileend',onEndLoadTile)
        }
    }, [baseLayer])

    return <div id='map'></div>
}

export default LeafletOfflineMaps
