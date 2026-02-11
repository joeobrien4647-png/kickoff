import { getSession } from "@/lib/auth";
import { TopNavbar } from "@/components/layout/top-navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PollingProvider } from "@/components/polling-provider";

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const session = await getSession();

  // No session = login page. Render children without app chrome.
  if (!session) {
    return <>{children}</>;
  }

  const travelerName = session.travelerName;

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar travelerName={travelerName} />
      <PollingProvider>
        <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 pb-16 md:pb-0">
          {children}
        </main>
      </PollingProvider>
      <BottomNav />
    </div>
  );
}
