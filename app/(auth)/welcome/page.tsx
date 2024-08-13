import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2">
        <span className="text-9xl">📚</span>
        <h1 className="text-4xl font-light ">NOMAD CHALLENGES</h1>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link
          href="/create-account"
          className="primary-btn text-lg py-2.5 hover:underline"
        >
          Create Account
        </Link>
        <div className="flex gap-2">
          <Link href="/login" className=" text-lg hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
