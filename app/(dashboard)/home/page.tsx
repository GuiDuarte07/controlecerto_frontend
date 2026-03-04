"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Landmark,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { accountService } from "@/features/accounts/services/accounts.service";
import { transactionService } from "@/features/transactions/services/transactions.service";
import { investmentService } from "@/features/investments/services/investments.service";
import { formatCurrency, formatMonthYear, getMonthRange } from "@/lib/utils/format";
import { TransactionTypeEnum, transactionTypeLabels } from "@/types/enums";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { QuickTransactionDialog } from "@/features/transactions/components/quick-transaction-dialog";

export default function HomePage() {
  const { user } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<TransactionTypeEnum>(
    TransactionTypeEnum.EXPENSE
  );

  const currentMonth = getMonthRange();

  const { data: balance, isLoading: loadingBalance } = useQuery({
    queryKey: ["balance-statement"],
    queryFn: () => accountService.getBalanceStatement(),
  });

  const { data: accountBalance, isLoading: loadingAccountBalance } = useQuery({
    queryKey: ["account-balance"],
    queryFn: () => accountService.getAccountBalance(),
  });

  const { data: transactionList, isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions-home", currentMonth],
    queryFn: () =>
      transactionService.getTransactions({
        startDate: currentMonth.startDate,
        endDate: currentMonth.endDate,
        seeInvoices: true,
      }),
  });

  const { data: investments, isLoading: loadingInvestments } = useQuery({
    queryKey: ["investments-home"],
    queryFn: () => investmentService.getInvestments(),
  });

  const totalInvestments =
    investments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
  const recentTransactions = transactionList?.transactions?.slice(0, 5) || [];

  function openDialog(type: TransactionTypeEnum) {
    setDialogType(type);
    setDialogOpen(true);
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {greeting()}, {user?.name?.split(" ")[0] || "Usuário"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Aqui está o resumo do mês de{" "}
          <span className="font-medium capitalize">
            {formatMonthYear(new Date())}
          </span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => openDialog(TransactionTypeEnum.INCOME)}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Receita
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => openDialog(TransactionTypeEnum.EXPENSE)}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Despesa
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openDialog(TransactionTypeEnum.CREDITEXPENSE)}
          className="gap-1.5"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Cartão
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => openDialog(TransactionTypeEnum.TRANSFERENCE)}
          className="gap-1.5"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Transferência
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/accounts">
          <Card className="transition-colors hover:border-primary/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingAccountBalance ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(accountBalance || 0)}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-[hsl(var(--income))]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas
            </CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-income" />
          </CardHeader>
          <CardContent>
            {loadingBalance ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-income">
                {formatCurrency(balance?.incomes || 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--expense))]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-expense" />
          </CardHeader>
          <CardContent>
            {loadingBalance ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-expense">
                {formatCurrency(balance?.expenses || 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Link href="/investments">
          <Card className="transition-colors hover:border-primary/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investimentos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-investment" />
            </CardHeader>
            <CardContent>
              {loadingInvestments ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold text-investment">
                  {formatCurrency(totalInvestments)}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Invoices + Recent Transactions Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Invoice Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Faturas do Mês</CardTitle>
            <Link href="/credit-cards">
              <Button variant="ghost" size="sm">
                Ver cartões
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingBalance ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-invoice/10">
                      <CreditCard className="h-5 w-5 text-invoice" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total em Faturas</p>
                      <p className="text-xs text-muted-foreground">
                        {formatMonthYear(new Date())}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-invoice">
                    {formatCurrency(balance?.invoices || 0)}
                  </p>
                </div>
                {transactionList?.invoices &&
                  transactionList.invoices.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {transactionList.invoices.map((inv) => (
                        <Link
                          key={inv.id}
                          href={`/invoices/${inv.id}`}
                          className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {inv.creditCard.description}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {inv.isPaid ? "Paga" : "Pendente"}
                            </span>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatCurrency(inv.totalAmount)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Últimos Lançamentos
            </CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingTransactions ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum lançamento este mês
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
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
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {t.description || transactionTypeLabels[t.type]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t.account.bank}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        t.type === TransactionTypeEnum.INCOME
                          ? "text-income"
                          : "text-expense"
                      }`}
                    >
                      {t.type === TransactionTypeEnum.INCOME ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <QuickTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType={dialogType}
      />
    </div>
  );
}
