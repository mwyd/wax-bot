import moment from 'moment'
import { pushAlert } from '@/stores/alertsStore'
import alertTypeEnum from '@/enums/alertTypeEnum'

export const syncStorage = {
  set: (data) => chrome.storage.sync.set(data),
  get: (key) => new Promise(resolve => chrome.storage.sync.get([key], data => resolve(data[key])))
}

export const WXB_LOG = (message, data) => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [WAX-BOT] ${message}`, data)
}

export const fetchBackground = (message) => {
  return new Promise(resolve => chrome.runtime.sendMessage(message, resolve))
}

export const calculateDiscount = (a, b, round = true) => {
  const discount = (1 - (a / b)) * 100

  return round ? Math.round(discount) : discount
}

export const waxpeerDate = () => {
  return moment().subtract(2, 'hours')
}

export const round = (number, decimals = 3) => {
  let places = Math.pow(10, decimals)

  return Math.round(number * places) / places
}

export const copyToClipboard = async (data) => {
  let alert = {
    type: alertTypeEnum.SUCCESS,
    title: 'Copy success'
  }

  try {
    await navigator.clipboard.writeText(data)
  } catch (err) {
    alert = {
      type: alertTypeEnum.ERROR,
      title: 'Copy error',
      body: err?.message
    }
  }

  pushAlert(alert)
}