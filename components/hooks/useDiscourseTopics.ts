import { useQuery } from "react-query";
import axios from "axios";

export const useDiscourseTopics = (url: string) => {
  const { data = [], ...opts } = useQuery<Topic[]>(
    `discourse-topics-${url}`,
    async () => {
      try {
        const baseUrl = new URL(url);

        /**
         * To advance the implementation before the Eco Forum is created,
         * we're using an already existing forum from another organization meantime.
         * As we don't have admin access to those forums, we have a CORS restriction,
         * to solve this issue momentarily we're using a CORS proxy that will have to be
         * removed once on production.
         * TODO: Remove CORS PROXY
         */
        const { data } = await axios.get<TopicListResponse>(
          "https://cors-proxy-t.herokuapp.com/" + url
        );
        return data.topic_list.topics
          .map((topic) => {
            return {
              url: `${baseUrl.origin}/t/${topic.slug}/${topic.id}`,
              ...topic,
            };
          })
          .filter((topic) => topic.bumped)
          .sort((a, b) => {
            return (
              new Date(b.bumped_at).getTime() - new Date(a.bumped_at).getTime()
            );
          });
      } catch (e) {
        return [];
      }
    }
  );

  return { data, ...opts };
};

interface TopicListResponse {
  topic_list: {
    topics: Omit<Topic, "url">[];
  };
}

interface Topic {
  id: number;
  category_id: number;
  slug: string;
  title: string;
  url: string;
  excerpt?: string;
  image_url: string | null;
  created_at: string;
  bumped: boolean;
  bumped_at: string;
  unseen: boolean;
  pinned: boolean;
  visible: boolean;
  closed: boolean;
  archived: boolean;
}
