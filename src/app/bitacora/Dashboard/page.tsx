import { auth } from "@/auth";
import { DashboardHome } from "./components/DashboardHome";

export default async function DashboardPage() {
  const session = await auth();
  return <DashboardHome session={session} />;
}
