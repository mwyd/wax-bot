import { fetchBackground } from "@/utils";

export default function ({ baseUrl, service }) {
  const authenticate = (token) =>
    fetchBackground({
      service,
      data: {
        path: baseUrl + "/user",
        config: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    });

  return {
    authenticate,
  };
}
