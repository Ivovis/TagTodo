import Link from "next/link";

import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default async function Header() {
  return (
    <>
      <div className="flex custom-panel justify-around text-white p-2 m-2 rounded-md box-border custom-shadow">
        <SignedIn>
          <div className="flex justify-between gap-8">
            <Link href="/">Tasks</Link>
            <Link href="/tags">Tags</Link>
            <Link href="/new">New Task</Link>
            <Link href="/about">About</Link>
            <UserButton />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex justify-between gap-3">
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
            <Link href="/about">About</Link>
          </div>
        </SignedOut>
      </div>
    </>
  );
}
