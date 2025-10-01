"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => axios.post("/api/auth/logout"),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("Erro ao fazer logout:", error);
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Bem-vindo! Você está autenticado. Esta página é protegida pelo
          middleware.
        </p>

        <div className="mt-8">
          <Button
            onClick={handleLogout}
            variant="destructive"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Saindo..." : "Sair (Logout)"}
          </Button>
        </div>
      </div>
    </div>
  );
}
