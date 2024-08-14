import AddTweet from "@/components/add-tweet";
import TweetContainer from "@/components/tweet-container";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
    select: {
      tweet: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "asc",
    },
  });
  return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export default async function Home() {
  const initialTweets = await getInitialTweets();
  return (
    <div>
      <AddTweet />
      <TweetContainer initialTweets={initialTweets} />
    </div>
  );
}
