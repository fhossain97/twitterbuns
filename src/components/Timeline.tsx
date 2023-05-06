import { CreateTweetForm } from "./CreateTweetForm";
import { RouterInputs, RouterOutputs, api as trpc } from "../utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useState, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import Link from "next/link";
import {
  InfiniteData,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

const styles = {
  fistDiv: `mb-4 border-b-2 border-gray-200`,
  secondDiv: `flex p-2`,
  image: `rounded-full`,
  tweets: `border-l-2 border-r-2 border-t-2 border-2 border-gray-200`,
  detailsContainer: `ml-2`,
  details: `flex align-middle`,
  name: `font-bold`,
  date: `text-m text-gray-500`,
  heart: `flex mt-4 p-2 items-center `,
  heartNum: `text-sm text-gray-500`,
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const windowScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (windowScroll / height) * 100;

    setScrollPosition(scrolled);
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
};
const LIMIT = 10;

function updateCache({
  client,
  variables,
  data,
  action,
  input,
}: {
  client: QueryClient;
  input: RouterInputs["tweet"]["timeline"];
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
}) {
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;
      const value = action === "like" ? 1 : -1;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: tweet._count.likes + value,
                },
              };
            }
            return tweet;
          }),
        };
      });

      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

function Tweet({
  tweet,
  client,
  input,
}: {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
  input: RouterInputs["tweet"]["timeline"];
  client: QueryClient;
}) {
  const likeMutation = trpc.tweet.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({
        client,
        data,
        variables,
        action: "like",
        input,
      });
    },
  }).mutateAsync;
  const unlikeMutation = trpc.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({
        client,
        data,
        variables,
        action: "unlike",
        input,
      });
    },
  }).mutateAsync;

  const hasLikes = tweet.likes.length > 0;

  return (
    <div className={styles.fistDiv}>
      <div className={styles.secondDiv}>
        {tweet.author.image && (
          <Image
            src={tweet.author.image}
            alt=""
            width={48}
            height={48}
            className={styles.image}
          />
        )}
        <div className={styles.detailsContainer}>
          <div className={styles.details}>
            <p className={styles.name}>
              <Link href={`/${tweet.author.name}`}>{tweet.author.name}</Link>
            </p>
            <p className={styles.date}> - {dayjs(tweet.createdAt).fromNow()}</p>
          </div>
        </div>
        <div>{tweet.text}</div>
      </div>
      <div className={styles.heart}>
        <AiFillHeart
          size="1.5rem"
          color={hasLikes ? "red" : "gray"}
          onClick={() => {
            if (hasLikes) {
              unlikeMutation({ tweetId: tweet.id });
              return;
            }
            likeMutation({ tweetId: tweet.id });
          }}
        />
        <span className={styles.heartNum}>{tweet._count.likes}</span>
      </div>
    </div>
  );
}

export const Timeline = ({
  where = {},
}: {
  where: RouterInputs["tweet"]["timeline"]["where"];
}) => {
  const scrollPosition = useScrollPosition();

  const { data, hasNextPage, fetchNextPage, isFetching } =
    trpc.tweet.timeline.useInfiniteQuery(
      { limit: LIMIT, where },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const client = useQueryClient();

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div>
      {/* nextCursor: {data?.nextCursor} */}
      <CreateTweetForm />
      <div className={styles.tweets}>
        {tweets.map((tweet) => {
          return (
            <Tweet
              key={tweet.id}
              client={client}
              input={{
                where,
                limit: LIMIT,
              }}
              tweet={tweet}
            />
          );
        })}
        {!hasNextPage ? (
          <div>That is all folks!</div>
        ) : (
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetching}
          >
            Load Next
          </button>
        )}
      </div>
    </div>
  );
};
