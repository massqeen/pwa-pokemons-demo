function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function sleep(ms = 2000): Promise<void> {
    console.log('Kindly remember to remove `sleep`')
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export { capitalizeFirstLetter, sleep }
