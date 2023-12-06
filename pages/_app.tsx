import '@/styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (<>
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
    <Component {...pageProps} />
  </>)
}
