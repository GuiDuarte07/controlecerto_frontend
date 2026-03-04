"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { accountService } from "@/features/accounts/services/accounts.service";
import { categoryService } from "@/features/categories/services/categories.service";
import { transactionService } from "@/features/transactions/services/transactions.service";
import { creditCardService } from "@/features/credit-cards/services/credit-cards.service";
import {
  TransactionTypeEnum,
  BillTypeEnum,
  transactionTypeLabels,
} from "@/types/enums";
import type {
  CreateTransactionRequest,
  CreateCreditPurchaseRequest,
  CreateTransferenceRequest,
} from "@/types";
import { cn } from "@/lib/utils";

interface QuickTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: TransactionTypeEnum;
}

export function QuickTransactionDialog({
  open,
  onOpenChange,
  defaultType = TransactionTypeEnum.EXPENSE,
}: QuickTransactionDialogProps) {
  const queryClient = useQueryClient();

  const activeTab =
    defaultType === TransactionTypeEnum.CREDITEXPENSE
      ? "credit"
      : defaultType === TransactionTypeEnum.TRANSFERENCE
        ? "transfer"
        : "regular";

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountService.getAccounts(),
    enabled: open,
  });

  const { data: expenseCategories } = useQuery({
    queryKey: ["categories", BillTypeEnum.EXPENSE],
    queryFn: () => categoryService.getCategories(BillTypeEnum.EXPENSE),
    enabled: open,
  });

  const { data: incomeCategories } = useQuery({
    queryKey: ["categories", BillTypeEnum.INCOME],
    queryFn: () => categoryService.getCategories(BillTypeEnum.INCOME),
    enabled: open,
  });

  const { data: creditCards } = useQuery({
    queryKey: ["credit-cards"],
    queryFn: () => creditCardService.getCreditCards(),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-home"] });
      queryClient.invalidateQueries({ queryKey: ["balance-statement"] });
      queryClient.invalidateQueries({ queryKey: ["account-balance"] });
      toast.success("Transação criada com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao criar transação");
    },
  });

  const createCreditMutation = useMutation({
    mutationFn: (data: CreateCreditPurchaseRequest) =>
      creditCardService.createCreditPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-home"] });
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
      toast.success("Despesa de cartão criada com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao criar despesa de cartão");
    },
  });

  const createTransferMutation = useMutation({
    mutationFn: (data: CreateTransferenceRequest) =>
      transactionService.createTransference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-home"] });
      queryClient.invalidateQueries({ queryKey: ["account-balance"] });
      toast.success("Transferência realizada com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao realizar transferência");
    },
  });

  const allCategories = [
    ...(expenseCategories || []),
    ...(incomeCategories || []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="regular" className="flex-1">
                Receita / Despesa
              </TabsTrigger>
              <TabsTrigger value="credit" className="flex-1">
                Cartão
              </TabsTrigger>
              <TabsTrigger value="transfer" className="flex-1">
                Transferência
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="max-h-[60vh]">
            <div className="p-6 pt-4">
              <TabsContent value="regular" className="mt-0">
                <RegularTransactionForm
                  accounts={accounts || []}
                  categories={allCategories}
                  defaultType={
                    defaultType === TransactionTypeEnum.INCOME
                      ? TransactionTypeEnum.INCOME
                      : TransactionTypeEnum.EXPENSE
                  }
                  onSubmit={(data) => createMutation.mutate(data)}
                  isLoading={createMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="credit" className="mt-0">
                <CreditTransactionForm
                  creditCards={creditCards || []}
                  categories={expenseCategories || []}
                  onSubmit={(data) => createCreditMutation.mutate(data)}
                  isLoading={createCreditMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="transfer" className="mt-0">
                <TransferForm
                  accounts={accounts || []}
                  onSubmit={(data) => createTransferMutation.mutate(data)}
                  isLoading={createTransferMutation.isPending}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ---- Regular Transaction Form ----
function RegularTransactionForm({
  accounts,
  categories,
  defaultType,
  onSubmit,
  isLoading,
}: {
  accounts: { id: number; bank: string; color: string }[];
  categories: { id?: number; name: string; icon: string; color: string; billType: number; subCategories?: { id?: number; name: string; color: string }[] }[];
  defaultType: TransactionTypeEnum;
  onSubmit: (data: CreateTransactionRequest) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<{
      amount: string;
      type: string;
      purchaseDate: Date;
      description: string;
      destination: string;
      observations: string;
      accountId: string;
      categoryId: string;
      justForRecord: boolean;
    }>({
      defaultValues: {
        type: String(defaultType),
        purchaseDate: new Date(),
        justForRecord: false,
        description: "",
        destination: "",
        observations: "",
      },
    });

  const purchaseDate = watch("purchaseDate");
  const selectedType = watch("type");

  const filteredCategories = categories.filter(
    (c) =>
      c.billType ===
      (selectedType === String(TransactionTypeEnum.INCOME)
        ? BillTypeEnum.INCOME
        : BillTypeEnum.EXPENSE)
  );

  function handleFormSubmit(data: Record<string, unknown>) {
    const d = data as {
      amount: string;
      type: string;
      purchaseDate: Date;
      description: string;
      destination: string;
      observations: string;
      accountId: string;
      categoryId: string;
      justForRecord: boolean;
    };
    onSubmit({
      amount: parseFloat(d.amount),
      type: parseInt(d.type),
      purchaseDate: d.purchaseDate.toISOString(),
      description: d.description || "",
      destination: d.destination || "",
      observations: d.observations || undefined,
      accountId: parseInt(d.accountId),
      categoryId: parseInt(d.categoryId),
      justForRecord: d.justForRecord,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <Select
          value={selectedType}
          onValueChange={(v) => setValue("type", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={String(TransactionTypeEnum.INCOME)}>
              Receita
            </SelectItem>
            <SelectItem value={String(TransactionTypeEnum.EXPENSE)}>
              Despesa
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Valor (R$)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          {...register("amount", { required: "Valor é obrigatório" })}
        />
        {errors.amount && (
          <p className="text-xs text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !purchaseDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {purchaseDate
                ? format(purchaseDate, "dd/MM/yyyy", { locale: ptBR })
                : "Selecione a data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={purchaseDate}
              onSelect={(d) => d && setValue("purchaseDate", d)}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Conta</Label>
          <Select onValueChange={(v) => setValue("accountId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    {a.bank}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Categoria</Label>
          <Select onValueChange={(v) => setValue("categoryId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Descrição</Label>
        <Input placeholder="Ex: Supermercado" {...register("description")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Destino / Origem</Label>
        <Input placeholder="Ex: Loja X" {...register("destination")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Observações</Label>
        <Textarea
          placeholder="Notas adicionais..."
          rows={2}
          {...register("observations")}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="justForRecord"
          onCheckedChange={(v) => setValue("justForRecord", v)}
        />
        <Label htmlFor="justForRecord" className="text-sm">
          Apenas para registro (não afeta saldo)
        </Label>
      </div>

      <Separator />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          "Criar Lançamento"
        )}
      </Button>
    </form>
  );
}

// ---- Credit Transaction Form ----
function CreditTransactionForm({
  creditCards,
  categories,
  onSubmit,
  isLoading,
}: {
  creditCards: { id: number; description: string }[];
  categories: { id?: number; name: string; color: string; subCategories?: { id?: number; name: string; color: string }[] }[];
  onSubmit: (data: CreateCreditPurchaseRequest) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, setValue, watch } = useForm<{
    totalAmount: string;
    totalInstallment: string;
    valueMode: "total" | "installment";
    purchaseDate: Date;
    destination: string;
    description: string;
    creditCardId: string;
    categoryId: string;
  }>({
    defaultValues: {
      totalInstallment: "1",
      purchaseDate: new Date(),
      valueMode: "total",
    },
  });

  const purchaseDate = watch("purchaseDate");
  const valueMode = watch("valueMode");
  const amount = watch("totalAmount");
  const installments = watch("totalInstallment");

  const displayValue = () => {
    const a = parseFloat(amount) || 0;
    const i = parseInt(installments) || 1;
    if (valueMode === "total") return `${i}x de R$ ${(a / i).toFixed(2)}`;
    return `Total: R$ ${(a * i).toFixed(2)}`;
  };

  function handleFormSubmit(data: Record<string, unknown>) {
    const d = data as {
      totalAmount: string;
      totalInstallment: string;
      valueMode: string;
      purchaseDate: Date;
      destination: string;
      description: string;
      creditCardId: string;
      categoryId: string;
    };
    const amount = parseFloat(d.totalAmount) || 0;
    const installments = parseInt(d.totalInstallment) || 1;
    const finalAmount =
      d.valueMode === "installment" ? amount * installments : amount;

    onSubmit({
      totalAmount: finalAmount,
      totalInstallment: installments,
      installmentsPaid: 0,
      purchaseDate: d.purchaseDate.toISOString(),
      destination: d.destination || "",
      description: d.description || undefined,
      creditCardId: parseInt(d.creditCardId),
      categoryId: parseInt(d.categoryId),
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Modo de Valor</Label>
        <Select
          value={valueMode}
          onValueChange={(v) =>
            setValue("valueMode", v as "total" | "installment")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Valor Total</SelectItem>
            <SelectItem value="installment">Valor por Parcela</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>
            {valueMode === "total" ? "Valor Total (R$)" : "Valor por Parcela (R$)"}
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            {...register("totalAmount", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Parcelas</Label>
          <Input
            type="number"
            min="1"
            max="48"
            {...register("totalInstallment", { required: true })}
          />
        </div>
      </div>

      {amount && (
        <p className="text-sm text-muted-foreground">{displayValue()}</p>
      )}

      <div className="flex flex-col gap-2">
        <Label>Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(purchaseDate, "dd/MM/yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={purchaseDate}
              onSelect={(d) => d && setValue("purchaseDate", d)}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Cartão</Label>
          <Select onValueChange={(v) => setValue("creditCardId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {creditCards.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Categoria</Label>
          <Select onValueChange={(v) => setValue("categoryId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Descrição</Label>
        <Input placeholder="Ex: Compra no site" {...register("description")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Destino</Label>
        <Input placeholder="Ex: Amazon" {...register("destination")} />
      </div>

      <Separator />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          "Criar Despesa de Cartão"
        )}
      </Button>
    </form>
  );
}

// ---- Transfer Form ----
function TransferForm({
  accounts,
  onSubmit,
  isLoading,
}: {
  accounts: { id: number; bank: string; color: string }[];
  onSubmit: (data: CreateTransferenceRequest) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, setValue, watch } = useForm<{
    amount: string;
    description: string;
    purchaseDate: Date;
    accountOriginId: string;
    accountDestinyId: string;
  }>({
    defaultValues: { purchaseDate: new Date() },
  });

  const purchaseDate = watch("purchaseDate");

  function handleFormSubmit(data: Record<string, unknown>) {
    const d = data as {
      amount: string;
      description: string;
      purchaseDate: Date;
      accountOriginId: string;
      accountDestinyId: string;
    };
    if (d.accountOriginId === d.accountDestinyId) {
      toast.error("As contas de origem e destino devem ser diferentes");
      return;
    }
    onSubmit({
      amount: parseFloat(d.amount),
      description: d.description || null,
      purchaseDate: d.purchaseDate.toISOString(),
      accountOriginId: parseInt(d.accountOriginId),
      accountDestinyId: parseInt(d.accountDestinyId),
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Valor (R$)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          {...register("amount", { required: true })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(purchaseDate, "dd/MM/yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={purchaseDate}
              onSelect={(d) => d && setValue("purchaseDate", d)}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Conta Origem</Label>
          <Select onValueChange={(v) => setValue("accountOriginId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    {a.bank}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Conta Destino</Label>
          <Select onValueChange={(v) => setValue("accountDestinyId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    {a.bank}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Descrição</Label>
        <Input placeholder="Ex: Pagamento de aluguel" {...register("description")} />
      </div>

      <Separator />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          "Realizar Transferência"
        )}
      </Button>
    </form>
  );
}
