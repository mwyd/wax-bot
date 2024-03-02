import externalServiceEnum from "@/enums/externalServiceEnum";
import useSteamMarket from "./useSteamMarket";
import useUser from "./useUser";
import useCsItem from "./useCsItem";
import useBuffMarket from "./useBuffMarket";

const defaults = {
  baseUrl: "https://conduit.ddns.net/api/v1",
  service: externalServiceEnum.CONDUIT,
};

export const buffMarket = useBuffMarket(defaults);

export const steamMarket = useSteamMarket(defaults);

export const user = useUser(defaults);

export const csItem = useCsItem(defaults);
