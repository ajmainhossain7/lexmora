import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="flex flex-col items-center gap-6 max-w-xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Welcome to <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Lexmora</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          A Premium Life Lessons & Wisdom Sharing Platform. Project initialized successfully!
        </p>
        <div className="flex gap-4">
          <Button color="primary" variant="shadow" size="lg">
            Explore Wisdom
          </Button>
          <Button color="secondary" variant="flat" size="lg">
            Learn More
          </Button>

        </div>
      </main>
    </div>
  );
}
