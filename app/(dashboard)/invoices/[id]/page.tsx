"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { creditCardService } from "@/features/credit-cards/services/credit-cards.service";
import { accountService } from "@/features/accounts/services/accounts.service";
import type { CreateInvoicePaymentRequest, InfoCreditExpense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const invoiceId = parseInt(id);

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<number | null>(null);

  const { data: invoicePage, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => creditCardService.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });

  const { data: expenses } = useQuery({
    queryKey: ["invoice-expenses", invoiceId],
    queryFn: () => creditCardService.getCreditExpensesFromInvoice(invoiceId),
    enabled: !!invoiceId,
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountService.getAccounts(),
  });

  const payMutation = useMutation({
    mutationFn: (data: CreateInvoicePaymentRequest) =>
      creditCardService.payInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Pagamento registrado!");
      setPayDialogOpen(false);
    },
    onError: () => toast.error("Erro ao registrar pagamento"),
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (pmtId: number) => creditCardService.deleteInvoicePayment(pmtId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      toast.success("Pagamento excluido!");
      setDeletePaymentId(null);
    },
    onError: () => toast.error("Erro ao excluir pagamento"),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!invoicePage) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted-foreground">Fatura nao encontrada</p>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  const { invoice, nextInvoiceId, prevInvoiceId } = invoicePage;
  const remaining = invoice.totalAmount - invoice.totalPaid;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/credit-cards")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Fatura - {invoice.creditCard.description}
          </h1>
          <p className="text-sm text-muted-foreground">
            Vencimento: {formatDate(invoice.dueDate)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={!prevInvoiceId}
            onClick={() => prevInvoiceId && router.push(`/invoices/${prevInvoiceId}`)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!nextInvoiceId}
            onClick={() => nextInvoiceId && router.push(`/invoices/${nextInvoiceId}`)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-invoice">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">Total da Fatura</span>
            <span className="text-xl font-bold">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-income">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">Total Pago</span>
            <span className="text-xl font-bold text-income">
              {formatCurrency(invoice.totalPaid)}
            </span>
          </CardContent>
        </Card>
        <Card className={`border-l-4 ${remaining > 0 ? "border-l-expense" : "border-l-income"}`}>
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">Restante</span>
            <span
              className={`text-xl font-bold ${
                remaining > 0 ? "text-expense" : "text-income"
              }`}
            >
              {formatCurrency(remaining)}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        {invoice.isPaid ? (
          <Badge className="bg-income/10 text-income gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Paga
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Pendente
          </Badge>
        )}
        {!invoice.isPaid && remaining > 0 && (
          <Button size="sm" onClick={() => setPayDialogOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Pagar Fatura
          </Button>
        )}
      </div>

      {/* Payments */}
      {invoice.invoicePayments && invoice.invoicePayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pagamentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              {invoice.invoicePayments.map((pmt) => (
                <div
                  key={pmt.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{pmt.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(pmt.paymentDate)} - {pmt.account.bank}
                      {pmt.justForRecord && " (Apenas registro)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-income">
                      {formatCurrency(pmt.amountPaid)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeletePaymentId(pmt.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Compras ({expenses?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!expenses || expenses.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                Nenhuma compra nesta fatura
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {expenses.map((exp) => (
                <ExpenseRow key={exp.id} expense={exp} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pay Invoice Dialog */}
      <PayInvoiceDialog
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
        invoiceId={invoiceId}
        remaining={remaining}
        accounts={accounts || []}
        onSubmit={(data) => payMutation.mutate(data)}
        isLoading={payMutation.isPending}
      />

      {/* Delete Payment Dialog */}
      <AlertDialog
        open={deletePaymentId !== null}
        onOpenChange={(open) => !open && setDeletePaymentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pagamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Este pagamento sera removido e o valor voltara para o saldo restante da fatura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletePaymentId && deletePaymentMutation.mutate(deletePaymentId)
              }
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

function ExpenseRow({ expense }: { expense: InfoCreditExpense }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-invoice/10">
          <CreditCard className="h-4 w-4 text-invoice" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            {expense.destination || expense.description}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(expense.purchaseDate)}
            {expense.installmentNumber > 0 &&
              ` - Parcela ${expense.installmentNumber}`}
          </span>
        </div>
      </div>
      <span className="text-sm font-bold">
        {formatCurrency(expense.amount)}
      </span>
    </div>
  );
}

// ---- Pay Invoice Dialog ----
function PayInvoiceDialog({
  open,
  onOpenChange,
  invoiceId,
  remaining,
  accounts,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number;
  remaining: number;
  accounts: { id: number; bank: string; description: string }[];
  onSubmit: (data: CreateInvoicePaymentRequest) => void;
  isLoading: boolean;
}) {
  const form = useForm<Omit<CreateInvoicePaymentRequest, "invoiceId">>({
    defaultValues: {
      amountPaid: remaining,
      description: "Pagamento de fatura",
      paymentDate: new Date().toISOString().split("T")[0],
      accountId: accounts[0]?.id ?? 0,
      justForRecord: false,
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset({
        amountPaid: remaining,
        description: "Pagamento de fatura",
        paymentDate: new Date().toISOString().split("T")[0],
        accountId: accounts[0]?.id ?? 0,
        justForRecord: false,
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagar Fatura</DialogTitle>
          <DialogDescription>
            Valor restante: {formatCurrency(remaining)}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit({ ...data, invoiceId })
          )}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Valor do Pagamento</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("amountPaid", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Descricao</Label>
            <Input {...form.register("description")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Data do Pagamento</Label>
            <Input type="date" {...form.register("paymentDate")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Conta</Label>
            <Controller
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
          <div className="flex items-center gap-3">
            <Controller
              control={form.control}
              name="justForRecord"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Apenas para registro (nao desconta do saldo)</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Pagando..." : "Pagar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
