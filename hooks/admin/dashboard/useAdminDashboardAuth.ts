import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAdminDashboardAuth() {
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      router.replace("/admin/login");
    }
    setIsLoading(false);
  }, [router]);

  const handleAuthError = (error: any) => {
    if (error?.message?.includes("401")) {
      toast.error("Sessione scaduta. Effettua nuovamente il login.");
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setIsAuthenticated(false);
    router.replace("/admin/login");
  };

  const loginSuccess = (newToken: string) => {
    localStorage.setItem("admin_token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    router.push("/admin/dashboard");
  };

  return {
    token,
    isAuthenticated,
    isLoading,
    handleAuthError,
    logout,
    loginSuccess,
  };
}