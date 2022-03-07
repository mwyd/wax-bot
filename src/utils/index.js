import moment from 'moment'

const WXB_LOG = (message, data) => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [WAX-BOT] ${message}`, data)
}

const fetchBackground = (message) => {
    return new Promise(resolve => chrome.runtime.sendMessage(message, resolve))
}

const calculateDiscount = (a, b, round = true) => {
    const discount =  (1 - (a / b)) * 100

    return round ? Math.round(discount) : discount
}

const waxpeerDate = () => {
    return moment().subtract(2, 'hours')
}

const syncStorage = {
    set: (data) => chrome.storage.sync.set(data),
    get: (key) => new Promise(resolve => chrome.storage.sync.get([key], data => resolve(data[key])))
}

export {
    WXB_LOG,
    fetchBackground,
    calculateDiscount,
    waxpeerDate,
    syncStorage
}