export const buildFileSelector = (
    callback: any,
    isMultiple = true,
    acceptType = 'image/*'
) => {
    const fileSelector = document.createElement('input')
    fileSelector.setAttribute('type', 'file')

    if (isMultiple) {
        fileSelector.setAttribute('multiple', 'multiple')
    }

    fileSelector.setAttribute('accept', acceptType)

    fileSelector.addEventListener('change', async (e: any) => {
        if (fileSelector.files.length > 0) {
            const fileList = []
            // eslint-disable-next-line prefer-destructuring, no-restricted-syntax
            for (const dataFile of fileSelector.files as any) {
                fileList.push(dataFile)
            }
            await callback([...fileList])
        }
    })

    return fileSelector
}
