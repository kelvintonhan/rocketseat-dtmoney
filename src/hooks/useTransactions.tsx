import {createContext, useEffect, useState, ReactNode, useContext} from 'react'
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>; //Herda todos os campos de Transaction menos 'id' e 'createdAt'

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData{
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({children}: TransactionsProviderProps){
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('/transactions')
    .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: TransactionInput){
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    })
    const {transaction} = response.data;

    //Mutabilidade React, add nova info em um vetor, copiando o que já estão dentro, adicionando as novas
    setTransactions([
      ...transactions, 
      transaction,
    ])
  }

  return (
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
        {children}
    </TransactionsContext.Provider>
  )

}

export function useTransactions(){
  const context = useContext(TransactionsContext);
  return context;
}