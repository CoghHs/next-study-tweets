"use client";

import { useEffect, useRef, useState } from "react";
import { InitialTweets } from "@/app/(nav)/(home)/page";
import { getMoreTweets } from "@/app/(nav)/(home)/actions";
import TweetList from "./tweet-list";
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
    } else {
      null;
    }
    setIsLoading(false);
  };
  const nextClick = async () => {
    setIsLoading(true);
    const getTweets = await getMoreTweets(page + 1);
    if (getTweets.length !== 0) {
      setTweets((prev) => [...prev, ...getTweets]);
      setPage((prev) => prev + 1);
    } else {
      null;
    }
    setIsLoading(false);
  };
  //   const [tweet] = useState(initialTweets); // 모든 트윗을 한번에 보여주기
  //   const trigger = useRef<HTMLSpanElement>(null);
  //   useEffect(() => {
  //     const observer = new IntersectionObserver(
  //       async (
  //         entries: IntersectionObserverEntry[],
  //         observer: IntersectionObserver
  //       ) => {
  //         const element = entries[0];
  //         if (element.isIntersecting && trigger.current) {
  //           observer.unobserve(trigger.current);
  //           setIsLoading(true);
  //           const newProducts = await getMoreTweets(page + 1);
  //           if (newProducts.length !== 0) {
  //             setPage((prev) => prev + 1);
  //             setTweets((prev) => [...prev, ...newProducts]);
  //           } else {
  //             setIsLastPage(true);
  //           }

  //           setIsLoading(false);
  //         }
  //       },
  //       {
  //         threshold: 1.0,
  //         rootMargin: "0px 0px -100px 0px",
  //       }
  //     );
  //     if (trigger.current) {
  //       observer.observe(trigger.current);
  //     }
  //     return () => {
  //       observer.disconnect();
  //     };
  //   }, [page]);
  return (
    <div className="p-5 flex flex-col ">
      <div className="flex justify-between items-center">
        <button onClick={prevClick}>{isLoading ? "<" : "<"}</button>
        <Link href={`/tweet/${tweets[page].id}`}>{tweets[page].tweet}</Link>
        <button onClick={nextClick}>{isLoading ? ">" : ">"}</button>
      </div>
      {/* {tweets.map((tweet) => (
        <TweetList key={tweet.id} {...tweet} />
      ))} */}
      {/* {!isLastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 900}vh`,
          }}
          className="mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "Load more"}
        </span>
      ) : null} */}
    </div>
  );
}
