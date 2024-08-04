import { Suspense } from "react";
import Navigation from "@/components/dashboard/Navigation";
import UserListServer from "@/components/dashboard/UserListServer";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <UserListServer />
        </Suspense>
      </div>
      <div className="w-full md:w-64 p-4 border-l">
        <Navigation />
      </div>
    </div>
  );
}
