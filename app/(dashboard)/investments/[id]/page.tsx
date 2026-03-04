"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  TrendingUp,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { investmentService } from "@/features/investments/services/investments.service";
import { accountService } from "@/features/accounts/services/accounts.service";
import type {
  DepositInvestmentRequest,
  AdjustInvestmentRequest,
  InvestmentHistoryResponse,
} from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";

type ActionType = "deposit" | "withdraw" | "adjust";

export default function InvestmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const investmentId = parseInt(id);

  const [actionType, setActionType] = useState<ActionType | null>(null);

  const { data: investment, isLoading } = useQuery({
    queryKey: ["investment", investmentId],
    queryFn: () => investmentService.getInvestmentById(investmentId),
    enabled: !!investmentId,
  });

  const { data: history } = useQuery({
    queryKey: ["investment-history", investmentId],
    queryFn: () => investmentService.getInvestmentHistory(investmentId),
    enabled: !!investmentId,
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountService.getAccounts(),
  });

  const depositMutation = useMutation({
    mutationFn: (data: DepositInvestmentRequest) =>
      investmentService.deposit(data),
    onSuccess: () => {
      invalidate();
      toast.success("Deposito realizado!");
      setActionType(null);
    },
    onError: () => toast.error("Erro ao depositar"),
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: DepositInvestmentRequest) =>
      investmentService.withdraw(data),
    onSuccess: () => {
      invalidate();
      toast.success("Resgate realizado!");
      setActionType(null);
    },
    onError: () => toast.error("Erro ao resgatar"),
  });

  const adjustMutation = useMutation({
    mutationFn: (data: AdjustInvestmentRequest) =>
      investmentService.adjustValue(data),
    onSuccess: () => {
      invalidate();
      toast.success("Valor ajustado!");
      setActionType(null);
    },
    onError: () => toast.error("Erro ao ajustar valor"),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["investment", investmentId] });
    queryClient.invalidateQueries({
      queryKey: ["investment-history", investmentId],
    });
    queryClient.invalidateQueries({ queryKey: ["investments"] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted-foreground">Investimento nao encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/investments")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {investment.name}
          </h1>
          {investment.description && (
            <p className="text-sm text-muted-foreground">
              {investment.description}
            </p>
          )}
        </div>
      </div>

      {/* Value Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm opacity-90">Valor Atual</p>
            <p className="text-3xl font-bold">
              {formatCurrency(investment.currentValue)}
            </p>
            {investment.startDate && (
              <p className="text-xs opacity-70 mt-1">
                Inicio: {formatDate(investment.startDate)}
              </p>
            )}
          </div>
          <TrendingUp className="h-10 w-10 opacity-50" />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setActionType("deposit")}
          className="gap-1.5"
          variant="outline"
        >
          <ArrowDownLeft className="h-4 w-4 text-income" />
          Depositar
        </Button>
        <Button
          onClick={() => setActionType("withdraw")}
          className="gap-1.5"
          variant="outline"
        >
          <ArrowUpRight className="h-4 w-4 text-expense" />
          Resgatar
        </Button>
        <Button
          onClick={() => setActionType("adjust")}
          className="gap-1.5"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Ajustar Valor
        </Button>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Historico ({history?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!history || history.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                Nenhuma movimentacao registrada
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {history.map((h) => (
                <HistoryRow key={h.id} entry={h} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      {actionType === "deposit" && (
        <DepositWithdrawDialog
          open
          onOpenChange={(o) => !o && setActionType(null)}
          type="deposit"
          investmentId={investmentId}
          accounts={accounts || []}
          onSubmit={(data) => depositMutation.mutate(data)}
          isLoading={depositMutation.isPending}
        />
      )}
      {actionType === "withdraw" && (
        <DepositWithdrawDialog
          open
          onOpenChange={(o) => !o && setActionType(null)}
          type="withdraw"
          investmentId={investmentId}
          accounts={accounts || []}
          onSubmit={(data) => withdrawMutation.mutate(data)}
          isLoading={withdrawMutation.isPending}
        />
      )}
      {actionType === "adjust" && (
        <AdjustDialog
          open
          onOpenChange={(o) => !o && setActionType(null)}
          investmentId={investmentId}
          currentValue={investment.currentValue}
          onSubmit={(data) => adjustMutation.mutate(data)}
          isLoading={adjustMutation.isPending}
        />
      )}
    </div>
  );
}

function HistoryRow({ entry }: { entry: InvestmentHistoryResponse }) {
  const isPositive = entry.changeAmount >= 0;
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isPositive ? "bg-income/10" : "bg-expense/10"
          }`}
        >
          {isPositive ? (
            <ArrowDownLeft className="h-4 w-4 text-income" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-expense" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium capitalize">{entry.type}</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(entry.occurredAt)}
            {entry.note && ` - ${entry.note}`}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span
          className={`text-sm font-bold ${
            isPositive ? "text-income" : "text-expense"
          }`}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(entry.changeAmount)}
        </span>
        <span className="text-xs text-muted-foreground">
          Total: {formatCurrency(entry.totalValue)}
        </span>
      </div>
    </div>
  );
}

function DepositWithdrawDialog({
  open,
  onOpenChange,
  type,
  investmentId,
  accounts,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "deposit" | "withdraw";
  investmentId: number;
  accounts: { id: number; bank: string }[];
  onSubmit: (data: DepositInvestmentRequest) => void;
  isLoading: boolean;
}) {
  const form = useForm<Omit<DepositInvestmentRequest, "investmentId">>({
    defaultValues: {
      amount: 0,
      accountId: accounts[0]?.id ?? null,
      occurredAt: new Date().toISOString().split("T")[0],
      note: null,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "deposit" ? "Depositar" : "Resgatar"}
          </DialogTitle>
          <DialogDescription>
            {type === "deposit"
              ? "Adicione valor ao investimento"
              : "Resgate valor do investimento"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit({ ...data, investmentId })
          )}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Valor</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("amount", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Conta (opcional)</Label>
            <Controller
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(v) =>
                    field.onChange(v === "none" ? null : parseInt(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Data</Label>
            <Input type="date" {...form.register("occurredAt")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Observacao (opcional)</Label>
            <Textarea rows={2} {...form.register("note")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processando..."
                : type === "deposit"
                  ? "Depositar"
                  : "Resgatar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdjustDialog({
  open,
  onOpenChange,
  investmentId,
  currentValue,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investmentId: number;
  currentValue: number;
  onSubmit: (data: AdjustInvestmentRequest) => void;
  isLoading: boolean;
}) {
  const form = useForm<Omit<AdjustInvestmentRequest, "investmentId">>({
    defaultValues: {
      newTotalValue: currentValue,
      occurredAt: new Date().toISOString().split("T")[0],
      note: null,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Valor</DialogTitle>
          <DialogDescription>
            Valor atual: {formatCurrency(currentValue)}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit({ ...data, investmentId })
          )}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Novo Valor Total</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("newTotalValue", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Data</Label>
            <Input type="date" {...form.register("occurredAt")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Observacao (opcional)</Label>
            <Textarea rows={2} {...form.register("note")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajustando..." : "Ajustar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
