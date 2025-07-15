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
      <div>
        <Link href="/">Home</Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="flex justify-between gap-3">
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </div>
        </SignedOut>
        <Link href="/about">About</Link>
      </div>
    </>
  );
}
