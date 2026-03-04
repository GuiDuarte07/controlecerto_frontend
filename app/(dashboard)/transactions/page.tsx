"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Trash2,
  Search,
  X,
  CreditCard,
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { transactionService } from "@/features/transactions/services/transactions.service";
import { accountService } from "@/features/accounts/services/accounts.service";
import { categoryService } from "@/features/categories/services/categories.service";
import { QuickTransactionDialog } from "@/features/transactions/components/quick-transaction-dialog";
import {
  TransactionTypeEnum,
  transactionTypeLabels,
} from "@/types/enums";
import type { InfoTransactionResponse, TransactionFilters } from "@/types";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/utils/format";

type FilterMode = "month" | "year" | "custom";

export default function TransactionsPage() {
  const queryClient = useQueryClient();

  // Filter state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterMode, setFilterMode] = useState<FilterMode>("month");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showInvoices, setShowInvoices] = useState(true);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Calculate date range
  const dateRange = useMemo(() => {
    if (filterMode === "month") {
      return {
        startDate: startOfMonth(currentDate).toISOString(),
        endDate: endOfMonth(currentDate).toISOString(),
      };
    }
    if (filterMode === "year") {
      return {
        startDate: new Date(currentDate.getFullYear(), 0, 1).toISOString(),
        endDate: new Date(currentDate.getFullYear(), 11, 31).toISOString(),
      };
    }
    return {
      startDate: startOfMonth(currentDate).toISOString(),
      endDate: endOfMonth(currentDate).toISOString(),
    };
  }, [currentDate, filterMode]);

  const filters: TransactionFilters = {
    ...dateRange,
    accountId: selectedAccountId !== "all" ? parseInt(selectedAccountId) : undefined,
    categoryId: selectedCategoryId !== "all" ? parseInt(selectedCategoryId) : undefined,
    search: searchText || undefined,
    sortBy: sortBy as TransactionFilters["sortBy"],
    sortOrder: sortOrder as TransactionFilters["sortOrder"],
    seeInvoices: showInvoices && filterMode === "month",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getTransactions(filters),
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountService.getAccounts(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => categoryService.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => transactionService.deleteTransaction(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balance-statement"] });
      queryClient.invalidateQueries({ queryKey: ["account-balance"] });
      setSelectedIds(new Set());
      toast.success("Transações excluídas com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir transações"),
  });

  const transactions = data?.transactions || [];
  const invoices = data?.invoices || [];

  // Balance from selected
  const balanceSummary = useMemo(() => {
    const items = selectedIds.size > 0
      ? transactions.filter((t) => selectedIds.has(t.id))
      : transactions;

    return items.reduce(
      (acc, t) => {
        if (t.type === TransactionTypeEnum.INCOME) acc.incomes += t.amount;
        else if (t.type === TransactionTypeEnum.EXPENSE) acc.expenses += t.amount;
        else if (t.type === TransactionTypeEnum.CREDITEXPENSE) acc.invoices += t.amount;
        return acc;
      },
      { incomes: 0, expenses: 0, invoices: 0 }
    );
  }, [transactions, selectedIds]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    }
  }

  function navigateDate(direction: "prev" | "next") {
    setCurrentDate((d) =>
      filterMode === "month"
        ? direction === "prev" ? subMonths(d, 1) : addMonths(d, 1)
        : filterMode === "year"
          ? new Date(d.getFullYear() + (direction === "prev" ? -1 : 1), d.getMonth(), 1)
          : d
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Lançamentos</h1>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Novo Lançamento
        </Button>
      </div>

      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Month/Year Navigator */}
        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateDate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-28 text-center text-sm font-medium capitalize">
            {filterMode === "month"
              ? formatMonthYear(currentDate)
              : currentDate.getFullYear().toString()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateDate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Mode */}
        <Select
          value={filterMode}
          onValueChange={(v) => {
            setFilterMode(v as FilterMode);
            setShowInvoices(v === "month");
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mensal</SelectItem>
            <SelectItem value="year">Anual</SelectItem>
          </SelectContent>
        </Select>

        {/* Quick Account Filter */}
        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Todas contas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas contas</SelectItem>
            {accounts?.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                  {a.bank}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros Avançados</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="amount">Valor</SelectItem>
                    <SelectItem value="description">Descrição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Ordem</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Mais recente</SelectItem>
                    <SelectItem value="asc">Mais antigo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Bulk Delete */}
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Balance Statement */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[hsl(var(--income))]">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">
              {selectedIds.size > 0 ? `Receitas (${selectedIds.size} selecionadas)` : "Receitas"}
            </span>
            <span className="text-lg font-bold text-income">
              {formatCurrency(balanceSummary.incomes)}
            </span>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[hsl(var(--expense))]">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">
              {selectedIds.size > 0 ? `Despesas (${selectedIds.size} selecionadas)` : "Despesas"}
            </span>
            <span className="text-lg font-bold text-expense">
              {formatCurrency(balanceSummary.expenses)}
            </span>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[hsl(var(--invoice))]">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">Cartão</span>
            <span className="text-lg font-bold text-invoice">
              {formatCurrency(balanceSummary.invoices)}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Section */}
      {filterMode === "month" && invoices.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Faturas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {invoices.map((inv) => (
              <Link key={inv.id} href={`/invoices/${inv.id}`}>
                <Card className="transition-colors hover:border-primary/50 cursor-pointer">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-invoice/10">
                      <CreditCard className="h-5 w-5 text-invoice" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {inv.creditCard.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {inv.isPaid ? "Paga" : "Pendente"}
                      </p>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrency(inv.totalAmount)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filterMode !== "month" && (
        <p className="text-xs text-muted-foreground">
          Faturas são exibidas apenas no filtro mensal.
        </p>
      )}

      {/* Transaction List */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <Checkbox
            checked={
              transactions.length > 0 &&
              selectedIds.size === transactions.length
            }
            onCheckedChange={toggleSelectAll}
          />
          <CardTitle className="text-sm">
            {transactions.length} lançamento
            {transactions.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col gap-1 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum lançamento encontrado
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                Criar lançamento
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {transactions.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  selected={selectedIds.has(t.id)}
                  onToggle={() => toggleSelect(t.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <QuickTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir {selectedIds.size} transação(ões). Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(Array.from(selectedIds))}
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

// ---- Transaction Row ----
function TransactionRow({
  transaction: t,
  selected,
  onToggle,
}: {
  transaction: InfoTransactionResponse;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col transition-colors ${
        selected ? "bg-primary/5" : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Checkbox checked={selected} onCheckedChange={onToggle} />
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: t.category?.color
                ? `${t.category.color}20`
                : "hsl(var(--muted))",
            }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: t.category?.color || "inherit" }}
            >
              {t.category?.name?.[0]?.toUpperCase() || "$"}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium truncate">
              {t.description || transactionTypeLabels[t.type]}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t.account.bank}</span>
              <span>{"·"}</span>
              <span>{formatDate(t.purchaseDate)}</span>
              {t.category && (
                <>
                  <span>{"·"}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {t.category.name}
                  </Badge>
                </>
              )}
            </div>
          </div>
          <span
            className={`text-sm font-semibold whitespace-nowrap ${
              t.type === TransactionTypeEnum.INCOME
                ? "text-income"
                : "text-expense"
            }`}
          >
            {t.type === TransactionTypeEnum.INCOME ? "+" : "-"}
            {formatCurrency(t.amount)}
          </span>
        </button>
      </div>

      {expanded && (
        <div className="border-t bg-muted/30 px-4 py-3 pl-16">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {t.destination && (
              <div>
                <span className="text-muted-foreground">Destino/Origem: </span>
                <span className="font-medium">{t.destination}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Tipo: </span>
              <span className="font-medium">{transactionTypeLabels[t.type]}</span>
            </div>
            {t.observations && (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Observações: </span>
                <span>{t.observations}</span>
              </div>
            )}
            {t.creditPurchase && (
              <div>
                <span className="text-muted-foreground">Parcela: </span>
                <span className="font-medium">
                  {t.installmentNumber}/{t.creditPurchase.totalInstallment}
                </span>
              </div>
            )}
            {t.justForRecord && (
              <Badge variant="outline" className="w-fit text-xs">
                Apenas registro
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
