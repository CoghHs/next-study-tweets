"use client";

import { addTweet } from "@/app/(nav)/(home)/actions";
import { useFormState } from "react-dom";
import Button from "./button";

export default function AddTweet() {
  const [state, action] = useFormState(addTweet, null);
  const errors = state?.fieldErrors.tweet;
  return (
    <div className="py-5 ">
      <form action={action} className="gap-5 flex flex-col">
        <input
          name="tweet"
          className="h-32"
          type="text"
          required
          placeholder="What is happening?"
        />
        {errors?.map((error, index) => (
          <span key={index} className="text-red-600">
            {error}
          </span>
        ))}
        <Button text="Add Tweet" />
      </form>
    </div>
  );
}
