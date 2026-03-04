"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { profileService } from "@/features/profile/services/profile.service";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/confirm-email"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, logout, setLoading, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    if (!token) {
      setLoading(false);
      if (!isPublicPath) {
        router.replace("/login");
      }
      return;
    }

    profileService
      .getUser()
      .then((user) => {
        setUser(user);
        setLoading(false);
        if (isPublicPath) {
          router.replace("/home");
        }
      })
      .catch(() => {
        logout();
        if (!isPublicPath) {
          router.replace("/login");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show nothing while loading on protected routes
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isLoading && !isPublicPath) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicPath && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
