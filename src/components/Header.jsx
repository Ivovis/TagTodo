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
          <div className="flex justify-between gap-2">
            <Link href="/" className="h-10  ttbutton">
              Tasks
            </Link>
            <Link href="/tags" className="h-10 ttbutton">
              Tags
            </Link>
            <Link href="/new" className="h-10 ttbutton">
              New
            </Link>
            <Link href="/about" className="h-10 text-center ttbutton">
              About
            </Link>
            <div className="ml-5 mt-2">
              <UserButton />
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex justify-between gap-3">
            <SignInButton mode="modal" className="ttbutton" />
            <SignUpButton mode="modal" className="ttbutton" />
            <Link href="/about" className="ttbutton">
              About
            </Link>
          </div>
        </SignedOut>
      </div>
    </>
  );
}
