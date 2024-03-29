import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";

export const alerts = reactive(new Map());

export const pushAlert = (alert, lifetime = 2 * 1000) => {
  const uuid = uuidv4();

  alerts.set(uuid, alert);

  if (lifetime != null) {
    setTimeout(() => destroyAlert(uuid), lifetime);
  }

  return uuid;
};

export const destroyAlert = (id) => {
  alerts.delete(id);
};
