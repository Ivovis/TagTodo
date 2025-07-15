import Link from "next/link";

export default async function Header() {
  return (
    <>
      <div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
    </>
  );
}
