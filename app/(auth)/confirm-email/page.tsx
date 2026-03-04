"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userAuthService } from "@/features/auth/services/auth.service";
import { Suspense } from "react";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    userAuthService
      .confirmEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Confirmando seu e-mail...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            Erro na confirmação
          </h1>
          <p className="text-sm text-muted-foreground">
            Não foi possível confirmar seu e-mail. O link pode ter expirado.
          </p>
        </div>
        <Link href="/login">
          <Button>Ir para o login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-10 w-10 text-primary" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          E-mail confirmado!
        </h1>
        <p className="text-sm text-muted-foreground">
          Seu e-mail foi confirmado com sucesso. Agora você pode acessar todas
          as funcionalidades do sistema.
        </p>
      </div>
      <Link href="/login">
        <Button>Fazer login</Button>
      </Link>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
