import { Suspense } from "react";
import Navigation from "@/components/dashboard/Navigation";
import UserList from "@/components/dashboard/UserList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64 p-4 border-r">
        <Navigation />
      </div>
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <UserList />
        </Suspense>
      </div>
    </div>
  );
}
