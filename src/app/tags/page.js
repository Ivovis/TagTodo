import Link from "next/link";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import TagList from "@/components/TagList";

import { auth } from "@clerk/nextjs/server";

export default function TagListPage() {
  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <SignedIn>
        <Link href="/newtag" className="ttbutton">
          Add New
        </Link>
        <TagList />
      </SignedIn>
    </div>
  );
}
