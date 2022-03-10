import moment from 'moment'
import { pushAlert } from '@/stores/alertsStore'
import alertTypeEnum from '@/enums/alertTypeEnum'

const syncStorage = {
    set: (data) => chrome.storage.sync.set(data),
    get: (key) => new Promise(resolve => chrome.storage.sync.get([key], data => resolve(data[key])))
}

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

const roundNumber = (number, decimals = 2) => {
    let places = Math.pow(10, decimals)

    return Math.round(number * places) / places
}

const copyToClipboard = async (data) => {
    let alert = {
        type: alertTypeEnum.SUCCESS,
        title: 'Copy success'
    }

    try {
        await navigator.clipboard.writeText(data)
    }
    catch(err) {
        alert = {
            type: alertTypeEnum.ERROR,
            title: 'Copy error',
            body: err?.message
        }
    }

    pushAlert(alert)
}

export {
    syncStorage,
    WXB_LOG,
    fetchBackground,
    calculateDiscount,
    waxpeerDate,
    roundNumber,
    copyToClipboard
}