import { UserIcon } from "@heroicons/react/24/solid";
import { KeyIcon } from "@heroicons/react/24/solid";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  const hasError = errors.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {name === "email" && (
            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
          )}
          {name === "username" && (
            <UserIcon className="h-5 w-5 text-gray-500" />
          )}
          {name === "password" && <KeyIcon className="h-5 w-5 text-gray-500" />}
          {name === "confirm_password" && (
            <KeyIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <input
          name={name}
          className={`p-3 pl-10 w-full rounded-3xl border transition focus:ring-2 focus:ring-neutral-300 focus:ring-offset-4 placeholder:text-neutral-400 ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-neutral-300 focus:border-neutral-300"
          }`}
          {...rest}
        />
      </div>
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 text-sm font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
