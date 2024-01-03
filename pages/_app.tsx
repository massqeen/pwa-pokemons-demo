import 'styles/globals.css'
import Head from 'next/head'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

import ReduxProvider from 'redux/provider'

import RootLayout from 'components/layouts/RootLayout'

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    return (
        <ReduxProvider>
            <Head>
                <title>Pokemon</title>
                <meta name="description" content="Pokemon demo app" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    href="/assets/icons/icon-48x48.png"
                    type="image/png"
                />
            </Head>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </ReduxProvider>
    )
}
