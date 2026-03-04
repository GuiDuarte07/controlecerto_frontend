"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { User, Lock, AlertTriangle, Trash2, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { profileService } from "@/features/profile/services/profile.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ResetUserDataRequest, UpdateUserRequest } from "@/types";
import { formatDate } from "@/lib/utils/format";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [resetDataOpen, setResetDataOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-details"],
    queryFn: () => profileService.getUser(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => profileService.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details"] });
      toast.success("Perfil atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar perfil"),
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      profileService.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setChangePasswordOpen(false);
    },
    onError: () => toast.error("Erro ao alterar senha"),
  });

  const resetDataMutation = useMutation({
    mutationFn: (data: ResetUserDataRequest) => profileService.resetUserData(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries();
      toast.success(
        `Dados resetados! ${result.transactionsDeleted} transacoes, ${result.accountsDeleted} contas removidas.`
      );
      setResetDataOpen(false);
    },
    onError: () => toast.error("Erro ao resetar dados"),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => profileService.deleteUser(),
    onSuccess: () => {
      logout();
      router.push("/login");
    },
    onError: () => toast.error("Erro ao excluir conta"),
  });

  const nameForm = useForm<UpdateUserRequest>({
    defaultValues: { name: user?.name ?? "" },
  });

  // Sync form when user loads
  if (user && !nameForm.formState.isDirty) {
    nameForm.reset({ name: user.name });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informacoes pessoais e configuracoes
        </p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={nameForm.handleSubmit((data) => updateMutation.mutate(data))}
            className="flex items-end gap-3"
          >
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...nameForm.register("name", { required: true })}
              />
            </div>
            <Button
              type="submit"
              disabled={updateMutation.isPending || !nameForm.formState.isDirty}
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </form>
          {user?.createdAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              Conta criada em {formatDate(user.createdAt)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Seguranca
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="gap-1.5 justify-start"
            onClick={() => setChangePasswordOpen(true)}
          >
            <Lock className="h-4 w-4" />
            Alterar Senha
          </Button>
          <Button
            variant="outline"
            className="gap-1.5 justify-start text-foreground"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="gap-1.5 justify-start border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => setResetDataOpen(true)}
          >
            <AlertTriangle className="h-4 w-4" />
            Resetar Dados
          </Button>
          <Button
            variant="outline"
            className="gap-1.5 justify-start border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteAccountOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Excluir Conta
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        onSubmit={(old, newP) =>
          changePasswordMutation.mutate({
            oldPassword: old,
            newPassword: newP,
          })
        }
        isLoading={changePasswordMutation.isPending}
      />

      {/* Reset Data Dialog */}
      <ResetDataDialog
        open={resetDataOpen}
        onOpenChange={setResetDataOpen}
        onSubmit={(data) => resetDataMutation.mutate(data)}
        isLoading={resetDataMutation.isPending}
      />

      {/* Delete Account Dialog */}
      <AlertDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao e irreversivel. Todos os seus dados serao removidos
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccountMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ChangePasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (oldPassword: string, newPassword: string) => void;
  isLoading: boolean;
}) {
  const form = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alterar Senha</AlertDialogTitle>
          <AlertDialogDescription>
            Digite sua senha atual e a nova senha
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (data.newPassword !== data.confirmPassword) {
              toast.error("As senhas nao conferem");
              return;
            }
            onSubmit(data.oldPassword, data.newPassword);
          })}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Senha Atual</Label>
            <Input
              type="password"
              {...form.register("oldPassword", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Nova Senha</Label>
            <Input
              type="password"
              {...form.register("newPassword", { required: true, minLength: 6 })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Confirmar Nova Senha</Label>
            <Input
              type="password"
              {...form.register("confirmPassword", { required: true })}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Alterando..." : "Alterar"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ResetDataDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ResetUserDataRequest) => void;
  isLoading: boolean;
}) {
  const form = useForm<ResetUserDataRequest>({
    defaultValues: {
      password: "",
      deleteTransactions: true,
      deleteAccounts: false,
      deleteCategories: false,
      deleteCreditCards: false,
      deleteInvestments: false,
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resetar Dados</AlertDialogTitle>
          <AlertDialogDescription>
            Selecione quais dados deseja excluir. Esta acao e irreversivel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Senha (confirmacao)</Label>
            <Input
              type="password"
              {...form.register("password", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-3">
            {(
              [
                { key: "deleteTransactions" as const, label: "Transacoes" },
                { key: "deleteAccounts" as const, label: "Contas" },
                { key: "deleteCategories" as const, label: "Categorias" },
                { key: "deleteCreditCards" as const, label: "Cartoes de Credito" },
                { key: "deleteInvestments" as const, label: "Investimentos" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <Controller
                  control={form.control}
                  name={item.key}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label>{item.label}</Label>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? "Resetando..." : "Resetar"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
