import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/TopBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Nydus | Arvo",
  description: "Arvo's Deployment Manager",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-sky-900">
        {!session ? (
           children
        ) : (
          <>
            <TopBar />
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] bg-white">
              <aside className="w-[20%] h-full overflow-y-auto border-r border-sky-200">
                <DashboardSidebar />
              </aside>
              <main className="w-[80%] h-full overflow-y-auto bg-slate-50 p-10">
                  {children}
              </main>
            </div>
          </>
        )}
      </body>
    </html>
  );
}