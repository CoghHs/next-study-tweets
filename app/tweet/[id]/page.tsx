import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getComments, getIsOwner, getTweet, getUser } from "./actions";
import LikeButton from "@/components/like-button";
import { unstable_cache as nextCache } from "next/cache";
import Comment from "@/components/comment";

async function getTweets(id: number) {
  try {
    const tweets = await db.tweet.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            comment: true,
          },
        },
      },
    });
    return tweets;
  } catch (e) {
    return null;
  }
}

const getCachedTweets = nextCache(getTweets, ["tweets-detail"], {
  tags: ["tweets-detail"],
  revalidate: 60,
});

async function getLikeStatus(tweetId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        tweetId,
        userId: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}

async function getCachedLikeStatus(tweetId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["tweets-like-status"], {
    tags: [`like-status-${tweetId}`],
  });
  return cachedOperation(tweetId, userId!);
}

export default async function TweetDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const tweet = await getTweet(id);
  if (!tweet) {
    return notFound();
  }
  const isOwner = await getIsOwner(tweet.userId);
  const user = await getUser();
  if (!user) {
    return notFound();
  }

  const comments = await getComments(id);
  if (!comments) {
    return notFound();
  }
  const onDelete = async () => {
    "use server";
    if (!isOwner) return;
    await db.tweet.delete({
      where: {
        id,
      },
      select: null,
    });
    redirect("/");
  };
  const tweets = await getCachedTweets(id);
  if (!tweets) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  return (
    <div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full ">
          <UserIcon />
        </div>
        <div>
          <h3>{tweet.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{tweet.tweet}</h1>
      </div>
      <LikeButton isLiked={isLiked} tweetId={tweet.id} likeCount={likeCount} />
      <Comment id={id} comments={comments} userId={user.id} />
      <div className="fixed w-full max-w-screen-sm bottom-0 p-5 pb-10 bg-neutral-800 flex justify-center gap-10 items-center">
        {isOwner ? (
          <form action={onDelete}>
            <button className="bg-red-500 rounded-md text-white font-semibold px-5 py-2.5">
              Delete tweet
            </button>
          </form>
        ) : null}
        <Link
          className="px-5 py-2.5 bg-neutral-200 rounded-md font-semibold"
          href="/"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
