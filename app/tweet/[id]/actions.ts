"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  comment_content: z.string().max(100, "please 100 -"),
});

export async function getComments(tweetId: number) {
  const comments = await db.comment.findMany({
    where: {
      tweetId: tweetId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      tweet: {
        select: {
          userId: true,
          id: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return comments;
}

export async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
}

export async function createComment(
  id: number,
  prevState: any,
  formData: FormData
) {
  try {
    const user = await getUser();
    const tweet = await getTweet(id);
    const comment_content = formData.get("comment_content");

    if (typeof comment_content !== "string") {
      return { error: "Invalid comment content" };
    }

    const result = formSchema.safeParse({ comment_content });

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    if (!user) {
      return { error: "User not found" };
    }

    if (!tweet) {
      return { error: "Tweet not found" };
    }

    await db.comment.create({
      data: {
        payload: result.data.comment_content,
        userId: user.id,
        tweetId: tweet.id,
      },
    });
    revalidatePath(`/post/${id}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "retry" };
  }
}

export async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export async function getTweet(id: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return tweet;
}

export async function likeTweet(tweetId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}

export async function dislikeTweet(tweetId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}
