import { AdminPanel } from "@/components/admin/AdminPanel";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  // Simple client-side routing
  const path = window.location.pathname;
  const isAdmin = path === "/admin" || path.startsWith("/admin/");

  return (
    <>
      {isAdmin ? <AdminPanel /> : <PortfolioPage />}
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}

export default App;
