import Link from "next/link";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";

export default function Home() {
  return (
    <>
      <SignedOut>
        <h1>Please sign in to continue</h1>
      </SignedOut>
      <SignedIn>{/* show the list of tasks here */}</SignedIn>
    </>
  );
}
