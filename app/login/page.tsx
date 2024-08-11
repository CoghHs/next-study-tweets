"use client";

import FormButton from "@/components/button";
import FormInput from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { FireIcon } from "@heroicons/react/24/solid";

export default function LogIn() {
  const [state, dispatch] = useFormState(login, null);
  return (
    <div className="flex justify-center  h-full flex-col min-h-screen gap-16  max-w-screen-sm m-auto">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h2 className="text-xl">
          <FireIcon className="size-20 text-red-400" />
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <FormButton text="Log in" />
      </form>
    </div>
  );
}
