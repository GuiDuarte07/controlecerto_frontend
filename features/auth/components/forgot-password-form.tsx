"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userAuthService } from "@/features/auth/services/auth.service";

interface EmailFormData {
  email: string;
}

interface ResetFormData {
  password: string;
  confirmPassword: string;
}

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [step, setStep] = useState<"email" | "reset" | "sent">(
    token ? "reset" : "email"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const emailForm = useForm<EmailFormData>();
  const resetForm = useForm<ResetFormData>();
  const password = resetForm.watch("password");

  useEffect(() => {
    if (token) {
      userAuthService
        .verifyForgotPasswordToken(token)
        .then(() => setTokenValid(true))
        .catch(() => {
          setTokenValid(false);
          toast.error("Token expirado ou inválido.");
        });
    }
  }, [token]);

  async function onEmailSubmit(data: EmailFormData) {
    setIsLoading(true);
    try {
      await userAuthService.sendForgotPasswordEmail(data.email);
      setStep("sent");
      toast.success("E-mail enviado com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar e-mail."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetSubmit(data: ResetFormData) {
    if (!token) return;
    setIsLoading(true);
    try {
      await userAuthService.forgotPassword(
        token,
        data.password,
        data.confirmPassword
      );
      toast.success("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao redefinir senha."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "sent") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            Verifique seu e-mail
          </h1>
          <p className="text-sm text-muted-foreground">
            Enviamos um link para redefinir sua senha. Verifique sua caixa de
            entrada.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </Link>
      </div>
    );
  }

  if (step === "reset" && token) {
    if (tokenValid === null) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (tokenValid === false) {
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <KeyRound className="h-8 w-8 text-destructive" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Token expirado
            </h1>
            <p className="text-sm text-muted-foreground">
              O link de redefinição expirou. Solicite um novo.
            </p>
          </div>
          <Link href="/forgot-password">
            <Button>Solicitar novo link</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Nova senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite sua nova senha abaixo
          </p>
        </div>

        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nova senha"
              {...resetForm.register("password", {
                required: "Senha é obrigatória",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {resetForm.formState.errors.password && (
              <p className="text-xs text-destructive">
                {resetForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme a nova senha"
              {...resetForm.register("confirmPassword", {
                required: "Confirmação é obrigatória",
                validate: (v) => v === password || "As senhas não coincidem",
              })}
            />
            {resetForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              "Redefinir Senha"
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Default: email step
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Esqueceu sua senha?
        </h1>
        <p className="text-sm text-muted-foreground">
          Digite seu e-mail e enviaremos um link para redefinir sua senha
        </p>
      </div>

      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...emailForm.register("email", {
              required: "E-mail é obrigatório",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "E-mail inválido",
              },
            })}
          />
          {emailForm.formState.errors.email && (
            <p className="text-xs text-destructive">
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            "Enviar link"
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao login
      </Link>
    </div>
  );
}
