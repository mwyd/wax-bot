const updateTradesDelay = 10

const tradesResultLimit = 10

const ordersResultLimit = 50

const marketResultLimit = 50

const notificationSound = new Audio(chrome.runtime.getURL('/assets/audio/witam.mp3'))

export {
    updateTradesDelay,
    tradesResultLimit,
    ordersResultLimit,
    marketResultLimit,
    notificationSound
}