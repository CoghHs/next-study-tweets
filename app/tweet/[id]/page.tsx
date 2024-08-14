import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getTweet(id: number) {
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
