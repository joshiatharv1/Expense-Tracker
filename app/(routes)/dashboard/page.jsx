"use client"; // Ensure this is at the top to make the component a client-side component

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_components/CardInfo';
import { db } from "@/utils/dbConfig";
import { eq, sql, desc } from "drizzle-orm";
import { budgets, expenses } from "@/utils/schema";
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpensesListTable from './expenses/_components/ExpensesListTable';

function Dashboard() {
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
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.fullName}</h2>
      <p className='text-gray-500'>Here is what's happening to your money, Let's manage it</p>
      <CardInfo budgetList={budgetList} />

      <div className='grid grid-cols-1 md:grid-cols-3'>
        <div className='md:col-span-2 p-5'>
          <BarChartDashboard budgetList={budgetList} />

          <ExpensesListTable
          expenseList={expenseList}
          refreshData={()=>getBudgetList()}/>

        </div>
        <div className='p-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
