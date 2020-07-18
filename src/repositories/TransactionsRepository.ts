import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((total, element) => {
      if (element.type === 'income') return (total += element.value);
      return total;
    }, 0);

    const outcome = this.transactions.reduce((total, element) => {
      if (element.type === 'outcome') return (total += element.value);
      return total;
    }, 0);

    const total = income - outcome;
    const balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const checkBalance = this.checkBalance(transaction);
    if (!checkBalance) {
      throw Error('Insuficient balance');
    }

    this.transactions.push(transaction);
    return transaction;
  }

  public checkBalance(transaction: Transaction): boolean {
    // TODO calcular o balance e verificar se o valor é valido, se for returnar true, se nao for retornar false
    const balance = this.getBalance();
    if (transaction.type === 'outcome') {
      return balance.total >= transaction.value;
    }
    return true;
  }
}

export default TransactionsRepository;
