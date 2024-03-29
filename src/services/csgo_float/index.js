import useInspectTool from "./useInspectTool";
import externalServiceEnum from "@/enums/externalServiceEnum";

const defaults = {
  baseUrl: "https://api.csgofloat.com",
  service: externalServiceEnum.CSGO_FLOAT,
};

export const inspectTool = useInspectTool(defaults);
