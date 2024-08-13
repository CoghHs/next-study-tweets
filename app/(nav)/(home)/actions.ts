"use server";

import db from "@/lib/db";

export async function getMoreTweets(page: number) {
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
    skip: page * 1,
    take: 1,
    orderBy: {
      created_at: "asc",
    },
  });
  return tweets;
}
