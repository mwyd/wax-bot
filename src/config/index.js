const version = '1.0.3'

const updateTradesDelay = 10

const tradesResultLimit = 10

const ordersResultLimit = 50

const marketResultLimit = 50

const steamBuffDiscountOffset = 30

const notificationSound = new Audio(chrome.runtime.getURL('/assets/audio/witam.mp3'))

export {
    version,
    updateTradesDelay,
    tradesResultLimit,
    ordersResultLimit,
    marketResultLimit,
    steamBuffDiscountOffset,
    notificationSound
}