export const encodeFilenameFromLink = (link) => {
    if (!link) {
        return null
    }

    const fileName = encodeURIComponent(`${link}`.split('/').pop())
    const path = link.substring(0, link.lastIndexOf('/') + 1)
    return path + fileName
}
