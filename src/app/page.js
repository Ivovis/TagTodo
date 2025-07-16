import { SignedIn, SignedOut } from "@clerk/nextjs";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <SignedOut>
        <h1 className="flex justify-around text-3xl mt-7">
          Please sign in to continue
        </h1>
      </SignedOut>
      <SignedIn>
        <TaskList />
      </SignedIn>
    </div>
  );
}
