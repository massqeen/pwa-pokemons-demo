import { useState, useEffect } from "react"

interface INetworkConnectionInfo {
    online :boolean
    since? :string | undefined
}

function useNetwork() {

    const [state, setState] = useState<INetworkConnectionInfo>({ online: true })

    useEffect(() => {
        setState({
            since: undefined,
            online: navigator.onLine,
        })
        const handleOnline = () => {
            setState((prevState) => ({
                ...prevState,
                online: true,
                since: new Date().toString(),
            }))
        }
        const handleOffline = () => {
            setState((prevState) => ({
                ...prevState,
                online: false,
                since: new Date().toString(),
            }))
        }

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    return state
}
export default useNetwork
