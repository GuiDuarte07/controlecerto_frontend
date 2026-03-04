"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Landmark, Wallet, PiggyBank, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { accountService } from "@/features/accounts/services/accounts.service";
import type { AccountInfo, CreateAccountRequest, UpdateAccountRequest } from "@/types";
import { AccountTypeEnum, accountTypeLabels } from "@/types/enums";
import { formatCurrency } from "@/lib/utils/format";
import { colorOptions } from "@/lib/constants";

function getAccountIcon(type: AccountTypeEnum) {
  switch (type) {
    case AccountTypeEnum.CHECKING:
    case AccountTypeEnum.CREDIT:
      return Landmark;
    case AccountTypeEnum.SAVINGS:
      return PiggyBank;
    default:
      return Wallet;
  }
}

export default function AccountsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AccountInfo | null>(null);
  const [editing, setEditing] = useState<AccountInfo | null>(null);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountService.getAccounts(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAccountRequest) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Conta criada com sucesso!");
      setDialogOpen(false);
    },
    onError: () => toast.error("Erro ao criar conta"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAccountRequest) => accountService.updateAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Conta atualizada com sucesso!");
      setDialogOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Erro ao atualizar conta"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Conta excluída com sucesso!");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao excluir conta"),
  });

  const totalBalance = accounts?.reduce((acc, a) => acc + a.balance, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas contas bancarias e carteiras
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Balance Summary */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm opacity-90">Saldo Total</p>
            <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
          </div>
          <Wallet className="h-10 w-10 opacity-50" />
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : accounts && accounts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.accountType);
            return (
              <Card key={account.id} className="group relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ backgroundColor: account.color }}
                />
                <CardContent className="flex flex-col gap-3 p-5 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${account.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: account.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{account.bank}</h3>
                        <p className="text-xs text-muted-foreground">
                          {account.description}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(account);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(account)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Saldo</p>
                      <p
                        className={`text-lg font-bold ${
                          account.balance >= 0 ? "text-income" : "text-expense"
                        }`}
                      >
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {accountTypeLabels[account.accountType]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <Wallet className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhuma conta cadastrada</p>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              Criar primeira conta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <AccountFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
        onSubmit={(data) => {
          if (editing) {
            updateMutation.mutate({ id: editing.id, ...data });
          } else {
            createMutation.mutate(data as CreateAccountRequest);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta?</AlertDialogTitle>
            <AlertDialogDescription>
              A conta &quot;{deleteTarget?.bank}&quot; sera excluida permanentemente. Todas
              as transacoes associadas tambem serao removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---- Account Form Dialog ----
function AccountFormDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: AccountInfo | null;
  onSubmit: (data: Partial<CreateAccountRequest>) => void;
  isLoading: boolean;
}) {
  const form = useForm<CreateAccountRequest>({
    defaultValues: {
      bank: "",
      description: "",
      balance: 0,
      color: colorOptions[0],
    },
  });

  // Reset form when dialog opens or editing changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset(
        editing
          ? {
              bank: editing.bank,
              description: editing.description,
              balance: editing.balance,
              color: editing.color,
            }
          : {
              bank: "",
              description: "",
              balance: 0,
              color: colorOptions[0],
            }
      );
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar Conta" : "Nova Conta"}</DialogTitle>
          <DialogDescription>
            {editing ? "Altere as informacoes da conta" : "Crie uma nova conta para gerenciar suas financas"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="bank">Banco / Instituicao</Label>
            <Input
              id="bank"
              placeholder="Ex: Nubank, Inter, Caixa..."
              {...form.register("bank", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descricao</Label>
            <Input
              id="description"
              placeholder="Ex: Conta principal"
              {...form.register("description")}
            />
          </div>
          {!editing && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="balance">Saldo Inicial</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                {...form.register("balance", { valueAsNumber: true })}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => form.setValue("color", c)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    form.watch("color") === c
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
