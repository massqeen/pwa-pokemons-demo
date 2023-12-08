import { PropsWithChildren, useEffect, useMemo, useState } from "react"

interface IProps {
    records: unknown[]
    perPage?: number
    doHideIfOnePage?: boolean
    onChangePage: (offset: number, perPage: number) => void
}

const Pagination = ({ children, records, perPage = 10, doHideIfOnePage = true, onChangePage }: PropsWithChildren<IProps>) => {
    const [currentPage, setCurrentPage] = useState<number>(1)

    const pageQuantity = useMemo(() => {
        if(perPage === 0 || records.length === 0) return 1

        return Math.ceil(records.length / perPage)
    }, [records, perPage])

    const onPrevious = ()=>{
        if(currentPage === 1) return
        setCurrentPage((prev)=> {
            onChangePage((prev - 2) * perPage, perPage)

            return prev -= 1
        })

    }

    const onNext = ()=>{
        if(currentPage === pageQuantity) return
        setCurrentPage((prev)=> {
            onChangePage((prev) * perPage, perPage)

            return prev += 1
        })
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [pageQuantity])

    return (
        <>
            {children}
            {(pageQuantity !== 1 || ! doHideIfOnePage) &&
                <div className="mt-6 px-2 text-gray-600 dark:text-white lg:px-8 lg:mt-12">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <button
                            className="px-4 py-2 border border-gray-800 dark:border-white rounded-lg duration-150
                        hover:bg-gray-300 hover:dark:bg-neutral-700 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            disabled={currentPage === 1}
                            onClick={onPrevious}
                        >
                        Previous
                        </button>
                        <div>
                        Page {currentPage} of {pageQuantity}
                        </div>
                        <button
                            className="px-4 py-2 border border-gray-800 dark:border-white rounded-lg duration-150
                        hover:bg-gray-300 hover:dark:bg-neutral-700 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            disabled={currentPage === pageQuantity}
                            onClick={onNext}
                        >
                        Next
                        </button>
                    </div>
                </div>}
        </>
    )
}

export default Pagination
