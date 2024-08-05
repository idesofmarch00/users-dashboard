import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="space-y-2">
      <Button
        asChild
        className="w-full justify-start bg-gray-100"
        variant="ghost"
      >
        <Link href="/dashboard">Users</Link>
      </Button>
    </nav>
  );
}
