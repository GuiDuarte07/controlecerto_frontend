export class BalanceStatement {
  balance: number;
  incomes: number;
  expenses: number;
  invoices: number;

  constructor(
    balance: number,
    incomes: number,
    expenses: number,
    invoices: number
  ) {
    this.balance = balance;
    this.incomes = incomes;
    this.expenses = expenses;
    this.invoices = invoices;
  }
}
