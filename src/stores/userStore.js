import { reactive, watch } from "vue";
import { user as conduitUser } from "@/services/conduit";
import { user as waxpeerUser } from "@/services/waxpeer";
import { syncStorage } from "@/utils";
import { pushAlert } from "./alertsStore";
import { defaultNotificationVolume, notificationSound } from "@/config";
import alertTypeEnum from "@/enums/alertTypeEnum";
import targetMarketEnum from "@/enums/targetMarketEnum";

export const session = reactive({
  conduitName: null,
  token: null,
  waxpeerId: null,
});

export const userPreferences = reactive({
  targetMarket: targetMarketEnum.STEAM,
  notificationVolume: defaultNotificationVolume,
});

export const loadToken = async () => {
  session.token = await syncStorage.get("token");
};

watch(
  () => session.token,
  () => {
    syncStorage.set({ token: session.token });
  },
);

export const loadUserPreferences = async () => {
  const preferences = await syncStorage.get("preferences");

  if (preferences instanceof Object) {
    Object.assign(userPreferences, preferences);
  }
};

watch(userPreferences, () => {
  syncStorage.set({ preferences: userPreferences });
});

watch(
  () => userPreferences.notificationVolume,
  (value) => {
    notificationSound.volume = value / 100;
  },
);

export const authenticateConduit = async () => {
  const { success, data } = await conduitUser.authenticate(session.token);

  const alert = {
    type: alertTypeEnum.SUCCESS,
    title: "Conduit",
    body: "Authenticated",
  };

  if (success) {
    session.conduitName = data.name;
  } else {
    session.conduitName = null;

    alert.type = alertTypeEnum.ERROR;
    alert.body = "Unauthenticated";
  }

  pushAlert(alert);
};

export const authenticateWaxpeer = async () => {
  const { success, user } = await waxpeerUser.authenticate();

  const alert = {
    type: alertTypeEnum.SUCCESS,
    title: "Waxpeer",
    body: "Authenticated",
  };

  if (success) {
    session.waxpeerId = user.id;
  } else {
    alert.type = alertTypeEnum.ERROR;
    alert.body = "Unauthenticated";
  }

  pushAlert(alert);
};
