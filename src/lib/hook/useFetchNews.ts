import { getNews } from "@/requests/news";
import { useUserStore } from "@/store/UserStore";
import { useEffect, useState } from "react";

/**
 *
 * @param filter strapi filter
 * @see: https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication#filtering
 * @returns news with 3 type: news/hiring/event
 */
export const useFetchNews = (filter?: string) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await getNews(filter);
      setNews(response.data);
    };
    fetchNews();
  }, []);

  return news;
};
