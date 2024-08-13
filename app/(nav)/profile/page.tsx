import db from "@/lib/db";
import getSession from "@/lib/session";
import { FireIcon } from "@heroicons/react/24/solid";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <div className="flex justify-center  h-full flex-col min-h-screen gap-16  max-w-screen-sm m-auto">
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h2 className="text-xl">
              <FireIcon className="size-20 text-red-400" />
            </h2>
          </div>
          <h1>
            Welcome ! <span className="font-semibold">{user?.username}</span>
          </h1>
          <form action={logOut}>
            <button className=" px-5 py-3 bg-neutral-400 rounded-3xl text-white">
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
