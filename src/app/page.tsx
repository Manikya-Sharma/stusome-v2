import Decoration from "@/components/miscelleneous/Decoration";

export default function Home() {
  return (
    <main className="relative min-h-screen w-[100vw] overflow-x-hidden pr-5">
      <Decoration />
      <div className="pl-3">
        <div>
          {/* Hero */}
          <h1 className="mb-3 pt-7 text-6xl font-semibold tracking-tighter sm:text-center">
            Social Media{" "}
            <span className="block text-blue-600 sm:inline">made better</span>
          </h1>
          <p className="max-w-xs pl-1 text-muted-foreground sm:mx-auto sm:max-w-prose sm:pl-0 sm:text-center">
            A social media, made by the students, made for the students
          </p>
        </div>

        {/* Vision */}
        <div className="mt-24">
          <h2 className="text-5xl">Our Vision</h2>
          <p className="mt-3 pl-1 text-lg font-light text-black/80">
            Stusome is an effort to{" "}
            <span className="text-blue-600">reduce the negative impacts</span>{" "}
            of social media while retaining its original character. We want the
            future generation to create a{" "}
            <span className="text-blue-600">supportive online community</span>{" "}
            while avoiding distractions offered by the existing social media
            platforms.
          </p>
        </div>
      </div>
      {/* Features */}
      <div>
        <div className="mt-20 bg-blue-950 px-6 py-12 text-white/90 opacity-40">
          <h2 className="text-5xl">Features</h2>
        </div>
        <div>
          <ul className="text-black/75">
            <li className="my-5">
              <h3 className="mb-2 mt-3 pl-3 text-4xl tracking-wide">Posts</h3>
              <p className="ml-3 max-w-prose leading-relaxed">
                Got some knowledge to share? Feel free to post on our app! You
                can write in simple markdown, out app will automatically extract
                headings and topics from it.
                <br />
                Support has been provided for syntax-highlighted code-blocks,
                mathematic equations powered by latex and feature to insert
                tables and images.
                <br />
                Focus on the content, we will take care of the looks.
              </p>
            </li>
            <li className="my-5">
              <h3 className="mb-2 mt-3 pl-3 text-4xl tracking-wide">Doubts</h3>
              <p className="ml-3 max-w-prose leading-relaxed">
                Confused? No more! With our doubts feature, you can freely post
                any question. We make sure that your doubt comes at the top of
                other&apos;s feed.
                <br />
                Even if you post a duplicate doubt, you will be provided a
                redirection link. So don&apos;t hesitate!
              </p>
            </li>
            <li className="my-5">
              <h3 className="mb-2 mt-3 pl-3 text-4xl tracking-wide">Chats</h3>
              <p className="ml-3 max-w-prose leading-relaxed">
                Feeling shy in posting in public? You need not worry, as we
                provide state-of-the-art real-time chat experience for free! To
                avoid spamming, you can chat with either an author or with a
                person whose email you know.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative h-56 bg-gradient-to-b from-white to-blue-500">
        <p className="absolute inset-x-0 bottom-10 text-center text-white/90">
          2023, All rights reserved
        </p>
      </div>
    </main>
  );
}
