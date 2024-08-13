import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface TweetListProps {
  created_at: Date;
  tweet: string;
  user: { username: string };
  id: number;
}

export default function TweetList({
  id,
  tweet,
  user,
  created_at,
}: TweetListProps) {
  return (
    <Link className="flex gap-5 items-center" href={`/tweet/${id}`}>
      <div className="flex flex-col gap-1 *:text-black">
        <span className="text-lg">{tweet}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </Link>
  );
}
