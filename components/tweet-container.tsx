"use client";

import { useEffect, useRef, useState } from "react";
import { InitialTweets } from "@/app/(nav)/(home)/page";
import { getMoreTweets } from "@/app/(nav)/(home)/actions";
import Link from "next/link";

interface TweetListProps {
  initialTweets: InitialTweets;
}

export default function TweetContainer({ initialTweets }: TweetListProps) {
  const [tweets, setTweets] = useState(initialTweets);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);

  const prevClick = async () => {
    setIsLoading(true);
    if (page !== 0) {
      const getTweets = await getMoreTweets(page - 1);
      setTweets((prev) => [...prev, ...getTweets]);
      setPage((prev) => prev - 1);
    }
    setIsLoading(false);
  };

  const nextClick = async () => {
    setIsLoading(true);
    const getTweets = await getMoreTweets(page + 1);
    if (getTweets.length !== 0) {
      setTweets((prev) => [...prev, ...getTweets]);
      setPage((prev) => prev + 1);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-5 flex flex-col">
      <div className="flex justify-between items-center">
        <button onClick={prevClick} disabled={page === 0}>
          {isLoading ? "<" : "<"}
        </button>

        {tweets.length > 0 ? (
          <Link href={`/tweet/${tweets[page].id}`}>{tweets[page].tweet}</Link>
        ) : (
          <span>No tweets available</span>
        )}

        <button onClick={nextClick} disabled={isLoading}>
          {isLoading ? ">" : ">"}
        </button>
      </div>
    </div>
  );
}
