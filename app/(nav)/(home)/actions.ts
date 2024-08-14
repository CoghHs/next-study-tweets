"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

import { z } from "zod";

const formSchema = z.object({
  tweet: z
    .string()
    .min(5, "Please write within 5 characters.")
    .max(100, "Please write within 100 characters."),
});

export async function addTweet(prevState: any, formData: FormData) {
  const data = {
    tweet: formData.get("tweet"),
  };
  const result = await formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const tweet = await db.tweet.create({
        data: {
          tweet: result.data.tweet,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });
      redirect(`tweet/${tweet.id}`);
    }
  }
}

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
