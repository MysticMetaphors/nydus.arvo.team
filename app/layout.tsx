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
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="h-full flex flex-col bg-background text-foreground antialiased dark overflow-hidden">
        {!session ? (
          <div className="h-full overflow-auto">
            {children}
          </div>
        ) : (
          <>
            <div className="flex-none">
              <TopBar />
            </div>
            <div className="flex flex-1 min-h-0 bg-background">
              <aside className="w-64 border-r border-border bg-card flex-none overflow-y-auto">
                <DashboardSidebar />
              </aside>
              <main className="flex-1 overflow-y-auto bg-background p-8">
                {children}
              </main>
            </div>
          </>
        )}
      </body>
    </html>
  );
}