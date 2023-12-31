/* eslint-disable  @typescript-eslint/no-explicit-any */
import { geoJSON } from 'leaflet'
import { getStorageInfo, getStoredTilesAsJson } from 'leaflet.offline'

import { OPENSTREETMAP_URL_TEMPLATE } from 'types'

export default function storageLayer(baseLayer:any, layerSwitcher:any) {
    let layer:any
    console.log('storageLayer init, baseLayer, layerSwitcher:', baseLayer,layerSwitcher)
    const getGeoJsonData = () =>
        getStorageInfo(OPENSTREETMAP_URL_TEMPLATE).then((tiles) =>
            getStoredTilesAsJson(baseLayer.getTileSize(), tiles),
        )

    const addStorageLayer = () => {
        getGeoJsonData().then((geoJson) => {
            layer = geoJSON(geoJson).bindPopup(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
                (clickedLayer) => clickedLayer.feature.properties.key,
            )
            console.log('adding offline tiles overlay' )
            layerSwitcher.addOverlay(layer, 'offline tiles')
        })
    }

    addStorageLayer()

    baseLayer.on('storagesize', (e: any) => {
        const storageElement = document.getElementById('storage')
        if(! storageElement) return
        storageElement.innerHTML = e.storagesize
        if (layer) {
            layer.clearLayers()
            getGeoJsonData().then((data) => {
                layer.addData(data)
            })
        }
    })
}
