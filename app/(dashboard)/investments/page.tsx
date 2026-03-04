"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Plus,
  TrendingUp,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { investmentService } from "@/features/investments/services/investments.service";
import type {
  InfoInvestmentResponse,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
} from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default function InvestmentsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InfoInvestmentResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InfoInvestmentResponse | null>(null);

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: () => investmentService.getInvestments(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInvestmentRequest) =>
      investmentService.createInvestment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast.success("Investimento criado!");
      setDialogOpen(false);
    },
    onError: () => toast.error("Erro ao criar investimento"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateInvestmentRequest) =>
      investmentService.updateInvestment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast.success("Investimento atualizado!");
      setDialogOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Erro ao atualizar investimento"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => investmentService.deleteInvestment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast.success("Investimento excluido!");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao excluir investimento"),
  });

  const totalValue =
    investments?.reduce((acc, inv) => acc + inv.currentValue, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investimentos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe e gerencie seus investimentos
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
          Novo Investimento
        </Button>
      </div>

      {/* Total */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm opacity-90">Patrimonio Investido</p>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <TrendingUp className="h-10 w-10 opacity-50" />
        </CardContent>
      </Card>

      {/* Investments Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : investments && investments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {investments.map((inv) => (
            <Card key={inv.id} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardContent className="relative flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{inv.name}</h3>
                      {inv.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {inv.description}
                        </p>
                      )}
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
                      <DropdownMenuItem asChild>
                        <Link href={`/investments/${inv.id}`}>
                          <Eye className="mr-2 h-3.5 w-3.5" />
                          Detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditing(inv);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(inv)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Atual</p>
                    <p className="text-lg font-bold text-income">
                      {formatCurrency(inv.currentValue)}
                    </p>
                  </div>
                  {inv.startDate && (
                    <p className="text-xs text-muted-foreground">
                      Inicio: {formatDate(inv.startDate)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <Wallet className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum investimento cadastrado
            </p>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              Criar primeiro investimento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <InvestmentFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
        onSubmit={(data) => {
          if (editing) {
            updateMutation.mutate({ id: editing.id, ...data } as UpdateInvestmentRequest);
          } else {
            createMutation.mutate(data as CreateInvestmentRequest);
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
            <AlertDialogTitle>Excluir investimento?</AlertDialogTitle>
            <AlertDialogDescription>
              O investimento &quot;{deleteTarget?.name}&quot; sera excluido permanentemente.
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

function InvestmentFormDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: InfoInvestmentResponse | null;
  onSubmit: (data: Partial<CreateInvestmentRequest>) => void;
  isLoading: boolean;
}) {
  const form = useForm<CreateInvestmentRequest>({
    defaultValues: {
      name: "",
      initialAmount: 0,
      startDate: null,
      description: null,
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset(
        editing
          ? {
              name: editing.name,
              description: editing.description,
              startDate: editing.startDate
                ? editing.startDate.split("T")[0]
                : null,
            }
          : {
              name: "",
              initialAmount: 0,
              startDate: null,
              description: null,
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
            {editing ? "Editar Investimento" : "Novo Investimento"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Altere as informacoes do investimento"
              : "Cadastre um novo investimento"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="inv-name">Nome</Label>
            <Input
              id="inv-name"
              placeholder="Ex: Tesouro Selic, CDB..."
              {...form.register("name", { required: true })}
            />
          </div>
          {!editing && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="initialAmount">Valor Inicial</Label>
              <Input
                id="initialAmount"
                type="number"
                step="0.01"
                {...form.register("initialAmount", { valueAsNumber: true })}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="startDate">Data de Inicio (opcional)</Label>
            <Input
              id="startDate"
              type="date"
              {...form.register("startDate")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="inv-description">Descricao (opcional)</Label>
            <Textarea
              id="inv-description"
              placeholder="Detalhes sobre o investimento..."
              rows={3}
              {...form.register("description")}
            />
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
