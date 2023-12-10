import SessionRedirect from "@/components/auth/SessionRedirect";
import Tile from "@/components/auth/Tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const Page = () => {
  return (
    <SessionRedirect when="authenticated" to="/explore">
      <div className="flex h-[80vh] items-center justify-center overflow-hidden">
        <main>
          <div className="mx-auto mb-3 h-fit w-fit rounded-lg px-2 py-1 dark:bg-[rgba(225,225,225,0.5)]">
            <div className="relative mx-auto h-16 w-60">
              <Image src="/logo-full.svg" alt="logo" fill priority={true} />
            </div>
          </div>

          <p className="mb-10 text-center text-sm text-muted-foreground">
            Sign-in to your account
          </p>

          <form className="border-px md:w-xl mx-auto mb-4 min-w-fit max-w-md rounded border border-black/10 bg-white px-10 pb-8 pt-6 dark:border-white/10 dark:bg-black md:px-12 md:py-8">
            <div className="mb-4">
              <Label
                className="mb-2 block text-sm font-semibold text-gray-500"
                htmlFor="username"
              >
                Username
              </Label>
              <Input className="w-full" id="username" type="email" />
            </div>
            <div className="mb-6">
              <Label
                className="mb-2 block text-sm font-semibold text-gray-500"
                htmlFor="password"
              >
                Password
              </Label>
              <Input className="mb-3 w-full" id="password" type="password" />
            </div>
            <div className="flex items-center justify-between">
              <Button size={"lg"} type="button">
                Sign In
              </Button>
              <Button
                variant={"link"}
                className="align-baseline text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                Forgot Password?
              </Button>
            </div>
          </form>
          <div className="mx-auto flex w-[80%] max-w-sm items-center gap-5">
            <div className="h-px flex-1 bg-black/20"></div>
            <p>or</p>
            <div className="h-px flex-1 bg-black/20"></div>
          </div>

          <div className="mx-auto mt-3 flex w-fit gap-1">
            <Tile provider="google" />
            <Tile provider="github" />
            <Tile provider="discord" />
          </div>
        </main>
      </div>
    </SessionRedirect>
  );
};

export default Page;
