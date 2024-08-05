import { redirect } from "next/navigation";

// This component redirects the user to the dashboard page immediately.
export default async function Home() {
  // Redirect to the dashboard page.
  redirect("/dashboard");

  // This function returns null to prevent any additional rendering.
  return null;
}
