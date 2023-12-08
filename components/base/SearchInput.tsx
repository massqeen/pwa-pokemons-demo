import { ChangeEvent, useState } from "react"
import { useDebouncedCallback } from 'use-debounce'

interface IProps {
    debounceTimeout: number;
    onSearch: (value: string) => void
}

const SearchInput = ({ debounceTimeout,onSearch }:IProps) => {

    const [value, setValue] = useState<string>('')

    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        debouncedOnSearch(e.target.value)
    }

    const debouncedOnSearch = useDebouncedCallback(
        (value: string) => {
            onSearch(value)
        },
        debounceTimeout, { leading: true }
    )

    return (
        <div
            className="max-w-xs my-4">
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    value={value}
                    type="text"
                    placeholder="Search"
                    className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default SearchInput
