"use client";

import { createComment } from "@/app/tweet/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { useCallback } from "react";
import { useFormState } from "react-dom";
import Button from "./button";
import Input from "./input";

export interface CommentProps {
  user: {
    id: number;
    username: string;
    email: string | null;
  };
  tweet: {
    userId: number;
    id: number;
  };
  id: number;
  created_at: Date;
  updated_at: Date;
  payload: string;
}

export default function Comment({
  id,
  userId,
  comments,
}: {
  id: number;
  userId: number;
  comments: CommentProps[];
}) {
  const createCommentWithId = useCallback(
    (prevState: any, formData: FormData) =>
      createComment(id, prevState, formData),
    [id]
  );
  const [state, dispatch] = useFormState(createCommentWithId, null);
  return (
    <div className="h-content bg-neutral-100 rounded-2xl my-3 py-8 p-5">
      <h2 className="h2 mb-3 pb-3 border-b-2 border-neutral-500">{`comment (${comments.length})`}</h2>
      <form action={dispatch} className="flex justify-between">
        <Input name="comment_content" />
        <Button text="Add Comment" />
      </form>
      {comments.map((comment) => (
        <div key={comment.id} className="mt-5">
          <div className="flex items-center">
            <span className="font-semibold mr-3">{comment.user.username}</span>
            <span className="text-xs">
              {formatToTimeAgo(comment.created_at.toString())}
            </span>
          </div>
          <p>{comment.payload}</p>
        </div>
      ))}
    </div>
  );
}
