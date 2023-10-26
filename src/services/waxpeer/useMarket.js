import { marketResultLimit } from "@/config";
import { WXB_LOG } from "@/utils";

export default function useMarket({ baseUrl, credentials, headers }) {
  const getItems = async (query) => {
    const params = new URLSearchParams(query);

    const response = await fetch(
      `${baseUrl}/data/index/?${params.toString()}`,
      { credentials, headers },
    );

    return response.json();
  };

  const getItemsByPages = async (query, pages) => {
    let marketItems = [];

    try {
      for (let i = 0; i < pages; i++) {
        const { success, items } = await getItems({
          skip: i * marketResultLimit,
          ...query,
        });

        if (success) {
          marketItems = [...marketItems, ...items];
        }

        if (!success || items.length < marketResultLimit) {
          break;
        }
      }
    } catch (err) {
      WXB_LOG("Cannot load market items page", err);
    }

    return marketItems;
  };

  const buyItem = async (body) => {
    const response = await fetch(`${baseUrl}/buy-steam`, {
      method: "POST",
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return response.json();
  };

  return {
    getItems,
    getItemsByPages,
    buyItem,
  };
}
