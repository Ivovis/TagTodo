import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";

export default function TaskList() {
  // check logged in
  // go get tasks for this user
  return (
    <div>
      <SignedIn>
        {/* show the list of tasks here */}
        <h2 className="text-xl font-semibold mb-4">Task list</h2>
        {/* // --- temp --- */}
        {Array.from({ length: 50 }).map((_, i) => (
          <p key={i} className="mb-2">
            Task number {i + 1}
          </p>
        ))}
        {/* // --- temp --- */}
      </SignedIn>
    </div>
  );
}
