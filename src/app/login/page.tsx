import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  return (
    <div className="flex h-[80vh] items-center justify-center overflow-hidden">
      <main>
        <div className="mb-3 text-3xl sm:text-5xl">
          <h1 className="text-center">Login to stusome</h1>
        </div>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          Don&apos;t have an account? sign up!
        </p>

        <form className="border-px md:w-xl mx-auto mb-4 min-w-fit max-w-md rounded border border-black/10 bg-white px-10 pb-8 pt-6 md:px-12 md:py-8">
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
              className="align-baseline text-blue-500 hover:text-blue-800"
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

        <div>{/* Login with Github etc. */}</div>
      </main>
    </div>
  );
};

export default Page;
