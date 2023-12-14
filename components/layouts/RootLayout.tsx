import { PropsWithChildren, memo,useEffect } from "react"
import axios from "axios"
import { Inter } from "next/font/google"

import useNetwork from "hooks/useNetwork"

const inter = Inter({ subsets: ['latin'] })

const RootLayout = memo(({ children }: PropsWithChildren)=>{
    const { online } = useNetwork()

    const initAxios = ()=>{
        axios.defaults.baseURL = 'https://pokeapi.co/api/v2/'
    }

    useEffect(() => {
        initAxios()
    }, [])

    return (
        <main className={`flex min-h-screen flex-col justify-normal py-8 px-8 lg:py-6 lg:px-12 ${inter.className}`}>
            <div className='text-center text-orange-500 font-semibold'>
                {! online && <p>You are offline!</p>}
            </div>
            {children}
        </main>
    )
})

RootLayout.displayName = 'RootLayout'

export default RootLayout
