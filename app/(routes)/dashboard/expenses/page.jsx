"use client"

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from "@/utils/dbConfig";
import { eq, sql, desc } from "drizzle-orm";
import { budgets, expenses } from "@/utils/schema";
import ExpensesListTable from './_components/ExpensesListTable';
function page() {
    const [budgetList, setBudgetList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...budgets,
        totalSpends: sql`sum(${expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${expenses.id})`.mapWith(Number),
      })
      .from(budgets)
      .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
      .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(budgets.id, ...Object.keys(budgets))
      .orderBy(desc(budgets.id));
    setBudgetList(result);
    console.log(result);
    console.log("Hello from BudgetList");
    getAllExpenses();
  };

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: expenses.id,
        name: expenses.name,
        amount: expenses.amount,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .leftJoin(budgets, eq(expenses.budgetId, budgets.id))
      .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(expenses.id));
    setExpenseList(result);
    console.log(result);
  };

  return (
    <div className='p-10'>
    <h2 className='font-bold text-3xl'>My Budgets</h2>
    <ExpensesListTable
          expenseList={expenseList}
          refreshData={()=>getBudgetList()}/> 
     </div>
  )
}

export default page
