import { TransactionTypeEnum } from '../enums/TransactionTypeEnum';

export function transactionTypeToText(type: TransactionTypeEnum): string {
  switch (type) {
    case TransactionTypeEnum.EXPENSE:
      return 'Despesa';
    case TransactionTypeEnum.INCOME:
      return 'Receita';
    case TransactionTypeEnum.CREDITEXPENSE:
      return 'Despesa Cartão';
    case TransactionTypeEnum.INVOICEPAYMENT:
      return 'Pagamento Fatura';
    case TransactionTypeEnum.TRANSFERENCE:
      return 'Transferência';
    default:
      return 'Indefinido';
  }
}
