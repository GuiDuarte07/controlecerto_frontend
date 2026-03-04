"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  Plus,
  Pencil,
  CreditCard,
  MoreVertical,
  Eye,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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

import { creditCardService } from "@/features/credit-cards/services/credit-cards.service";
import { accountService } from "@/features/accounts/services/accounts.service";
import type { CreditCardInfo, CreateCreditCardRequest, AccountInfo } from "@/types";
import { formatCurrency } from "@/lib/utils/format";

export default function CreditCardsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CreditCardInfo | null>(null);

  const { data: creditCards, isLoading } = useQuery({
    queryKey: ["credit-cards"],
    queryFn: () => creditCardService.getCreditCards(),
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts-no-cc"],
    queryFn: () => accountService.getAccountsWithoutCreditCard(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCreditCardRequest) =>
      creditCardService.createCreditCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
      toast.success("Cartao criado com sucesso!");
      setDialogOpen(false);
    },
    onError: () => toast.error("Erro ao criar cartao"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number } & Partial<CreateCreditCardRequest>) =>
      creditCardService.updateCreditCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
      toast.success("Cartao atualizado!");
      setDialogOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Erro ao atualizar cartao"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cartoes de Credito</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus cartoes e acompanhe os limites
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
          Novo Cartao
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : creditCards && creditCards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creditCards.map((cc) => (
            <CreditCardItem
              key={cc.id}
              card={cc}
              onEdit={() => {
                setEditing(cc);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <CreditCard className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum cartao de credito cadastrado
            </p>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              Criar primeiro cartao
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <CreditCardFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
        accounts={accounts || []}
        onSubmit={(data) => {
          if (editing) {
            updateMutation.mutate({ id: editing.id, ...data });
          } else {
            createMutation.mutate(data as CreateCreditCardRequest);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

// ---- Credit Card Item ----
function CreditCardItem({
  card,
  onEdit,
}: {
  card: CreditCardInfo;
  onEdit: () => void;
}) {
  const usedPercent =
    card.totalLimit > 0 ? (card.usedLimit / card.totalLimit) * 100 : 0;
  const availableLimit = card.totalLimit - card.usedLimit;

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardContent className="relative flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{card.description}</h3>
              <p className="text-xs text-muted-foreground">
                {card.account.bank}
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
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/invoices?cardId=${card.id}`}>
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Ver Faturas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Limit Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Usado: {formatCurrency(card.usedLimit)}</span>
            <span>Limite: {formatCurrency(card.totalLimit)}</span>
          </div>
          <Progress
            value={usedPercent}
            className="h-2"
          />
          <p className="text-sm font-medium">
            Disponivel:{" "}
            <span className={availableLimit >= 0 ? "text-income" : "text-expense"}>
              {formatCurrency(availableLimit)}
            </span>
          </p>
        </div>

        {/* Due/Close Days */}
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Vencimento: dia {card.dueDay}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Fechamento: dia {card.closeDay}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Credit Card Form Dialog ----
function CreditCardFormDialog({
  open,
  onOpenChange,
  editing,
  accounts,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: CreditCardInfo | null;
  accounts: AccountInfo[];
  onSubmit: (data: Partial<CreateCreditCardRequest>) => void;
  isLoading: boolean;
}) {
  const form = useForm<CreateCreditCardRequest>({
    defaultValues: {
      totalLimit: 0,
      usedLimit: 0,
      description: "",
      dueDay: 10,
      closeDay: 3,
      accountId: 0,
      skipWeekend: false,
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset(
        editing
          ? {
              totalLimit: editing.totalLimit,
              usedLimit: editing.usedLimit,
              description: editing.description,
              dueDay: editing.dueDay,
              closeDay: editing.closeDay,
              accountId: editing.account.id,
              skipWeekend: false,
            }
          : {
              totalLimit: 0,
              usedLimit: 0,
              description: "",
              dueDay: 10,
              closeDay: 3,
              accountId: accounts[0]?.id ?? 0,
              skipWeekend: false,
            }
      );
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar Cartao" : "Novo Cartao de Credito"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Altere as informacoes do cartao"
              : "Cadastre um novo cartao de credito"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="cc-description">Nome do Cartao</Label>
            <Input
              id="cc-description"
              placeholder="Ex: Nubank, Inter..."
              {...form.register("description", { required: true })}
            />
          </div>

          {!editing && (
            <div className="flex flex-col gap-2">
              <Label>Conta Vinculada</Label>
              <Controller
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.bank} - {a.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="totalLimit">Limite Total</Label>
              <Input
                id="totalLimit"
                type="number"
                step="0.01"
                {...form.register("totalLimit", { valueAsNumber: true })}
              />
            </div>
            {!editing && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="usedLimit">Limite Usado</Label>
                <Input
                  id="usedLimit"
                  type="number"
                  step="0.01"
                  {...form.register("usedLimit", { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="dueDay">Dia de Vencimento</Label>
              <Input
                id="dueDay"
                type="number"
                min={1}
                max={31}
                {...form.register("dueDay", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="closeDay">Dia de Fechamento</Label>
              <Input
                id="closeDay"
                type="number"
                min={1}
                max={31}
                {...form.register("closeDay", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Controller
              control={form.control}
              name="skipWeekend"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Pular fim de semana</Label>
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
