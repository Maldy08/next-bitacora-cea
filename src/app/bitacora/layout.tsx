import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Footer, Header, Sidebar } from "../components";

export default async function BitacoraLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = session.user;

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <div className="flex-1 flex pt-16 lg:pt-0 lg:mt-16 pb-0 md:pb-16">
          <main className="flex-grow overflow-auto">
            <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-4 pb-6 md:pb-4">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
