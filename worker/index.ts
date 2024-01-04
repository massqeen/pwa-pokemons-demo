import { util } from './util'

declare let self: ServiceWorkerGlobalScope

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

util()

// listen to message event from window
self.addEventListener('message', event => {
    // HOW TO TEST THIS?
    // Run this in your browser console:
    //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
    // OR use next-pwa injected workbox object
    //     window.workbox.messageSW({command: 'log', message: 'hello world'})
    console.log(event?.data)
})

self.addEventListener('push', (event) => {
    const data = JSON.parse(event?.data.text() || '{}')
    event?.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.message,
            icon: '/icons/android-chrome-192x192.png'
        })
    )
})

self.addEventListener('notificationclick', (event) => {
    event?.notification.close()
    event?.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            if (clientList.length > 0) {
                let client = clientList[0]
                for (let i = 0; i < clientList.length; i ++) {
                    if (clientList[i].focused) {
                        client = clientList[i]
                    }
                }
                return client.focus()
            }
            return self.clients.openWindow('/')
        })
    )
})

self.addEventListener('fetch', async (event) => {
    if(! event) return
    if (event.request.method === 'POST') {
        console.log('post fetch event', event)
        const reqUrl = event.request.url
        const authHeader = event.request.headers.get('Authorization') ?? ''

        return Promise.resolve(event.request.text()).then(async (payload) => {

            // if application is online, send request over network
            if (navigator.onLine) {
                const response = await fetch(reqUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authHeader
                    },
                    body: payload
                })
                console.log('POST response:',response)

                return response
            } else {
                // if offline, save request details to IndexedDB to be sent later
                // saveIntoIndexedDB(reqUrl, authHeader, payload)
                console.log('saving request details:',reqUrl, authHeader, payload)

                // return dummy response so application can continue execution
                const myOptions = { status: 200, statusText: 'Fabulous', ok: true }
                return new Response(payload, myOptions)
            }
        })
    }
})
