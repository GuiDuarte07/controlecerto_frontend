// ============================================================
// Enums - Controle Certo
// ============================================================

export enum TransactionTypeEnum {
  EXPENSE = 0,
  INCOME = 1,
  CREDITEXPENSE = 2,
  TRANSFERENCE = 3,
  INVOICEPAYMENT = 4,
}

export enum BillTypeEnum {
  EXPENSE = 0,
  INCOME = 1,
}

export enum AccountTypeEnum {
  CHECKING = 0,
  SAVINGS = 1,
  CREDIT = 2,
  INVESTMENT = 3,
  WALLET = 4,
  OTHER = 5,
}

export enum NotificationTypeEnum {
  SYSTEMUPDATE = 0,
  SYSTEMALERT = 1,
  INVOICEPENDING = 2,
  CONFIRMRECURRENCE = 3,
  CATEGORYSPENDINGLIMIT = 4,
}

// ============================================================
// Enum Label Maps (Portuguese - pt-BR)
// ============================================================

export const transactionTypeLabels: Record<TransactionTypeEnum, string> = {
  [TransactionTypeEnum.EXPENSE]: "Despesa",
  [TransactionTypeEnum.INCOME]: "Receita",
  [TransactionTypeEnum.CREDITEXPENSE]: "Despesa de Cartão",
  [TransactionTypeEnum.TRANSFERENCE]: "Transferência",
  [TransactionTypeEnum.INVOICEPAYMENT]: "Pagamento de Fatura",
};

export const billTypeLabels: Record<BillTypeEnum, string> = {
  [BillTypeEnum.EXPENSE]: "Despesa",
  [BillTypeEnum.INCOME]: "Receita",
};

export const accountTypeLabels: Record<AccountTypeEnum, string> = {
  [AccountTypeEnum.CHECKING]: "Conta Corrente",
  [AccountTypeEnum.SAVINGS]: "Poupança",
  [AccountTypeEnum.CREDIT]: "Crédito",
  [AccountTypeEnum.INVESTMENT]: "Investimento",
  [AccountTypeEnum.WALLET]: "Carteira",
  [AccountTypeEnum.OTHER]: "Outro",
};

export const notificationTypeLabels: Record<NotificationTypeEnum, string> = {
  [NotificationTypeEnum.SYSTEMUPDATE]: "Atualização do Sistema",
  [NotificationTypeEnum.SYSTEMALERT]: "Alerta do Sistema",
  [NotificationTypeEnum.INVOICEPENDING]: "Fatura Pendente",
  [NotificationTypeEnum.CONFIRMRECURRENCE]: "Confirmar Recorrência",
  [NotificationTypeEnum.CATEGORYSPENDINGLIMIT]: "Limite de Categoria",
};
