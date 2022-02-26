const updateTradesDelay = 10

const tradesResultLimit = 10

const notificationSound = new Audio(chrome.runtime.getURL('/assets/audio/witam.mp3'))

export {
    updateTradesDelay,
    tradesResultLimit,
    notificationSound
}