import externalServiceEnum from "./enums/externalServiceEnum";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.origin !== "https://waxpeer.com") {
    return false;
  }

  const { service, data } = request;

  switch (service) {
    case externalServiceEnum.CONDUIT:
      fetch(data.path, data.config)
        .then((res) => res.json())
        .then(sendResponse)
        .catch((err) => sendResponse({ success: false, error_message: err }));
      break;

    case externalServiceEnum.CSGO_FLOAT:
      fetch(data.path)
        .then((res) => res.json())
        .then((data) => sendResponse({ success: true, data: data }))
        .catch((err) => sendResponse({ success: false, error_message: err }));
      break;
  }

  return true;
});
