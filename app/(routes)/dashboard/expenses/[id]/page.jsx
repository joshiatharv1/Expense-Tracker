"use client";
import { useState } from 'react'
import { db } from "@/utils/dbConfig";
import { React, useEffect } from "react";
import { budgets, expenses } from "@/utils/schema";
import { eq, getTableColumns, sql, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from '../_components/AddExpense';
import ExpensesListTable from '../_components/ExpensesListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const[budgetInfo, setBudgetInfo]=useState();
  const[expenseList, setExpenseList]=useState([]);
  const router = useRouter();
  useEffect(() => {
    user&&getBudgetInfo();
  }, [user]);
// useEffect(() => {
//     if (user) {
//       getBudgetInfo();
//     }
//   }, [user]);
  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...budgets,
        totalSpends: sql`sum(${expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${expenses.id})`.mapWith(Number),
      })
      .from(budgets)
      .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
      .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(budgets.id, params.id))
      .groupBy(budgets.id);

      setBudgetInfo(result[0]);
    console.log(result);
    getExpenseList();

  };

  const getExpenseList=async()=>{
    const result=await db.select().from(expenses)
    .where(eq(expenses.budgetId, params.id))
    .orderBy(desc(expenses.id))
    setExpenseList(result);
    console.log(result);
  }

  const deleteExpense=async()=>{
    const deleteExpenseResult=await db.delete(expenses)
    .where(eq(expenses.budgetId, params.id))
    .returning();
    
    if(deleteExpenseResult){
      const result=await db.delete(budgets)
      .where(eq(budgets.id, params.id))
      .returning();
    }
    toast("Budget Deleted")
    router.replace('/dashboard/budgets')
  }

  {
    return (
      <div className="p-10">
        <h2 className="text-2xl font-bold flex justify-between items-center pb-2">
        <span className='flex gap-2 items-center'>
            <ArrowLeft onClick={()=>router.back()} className='cursor-pointer'/>
            My Expenses
          </span>
          <div className='flex gap-2 items-center'>
            <EditBudget budgetInfo={budgetInfo}
            refreshData={()=>getBudgetInfo()}/>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="flex gap-2" variant="destructive">
                <div>
                <Trash />
                </div>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your Budget and remove your Expenses from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{deleteExpense()}}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {budgetInfo ? (
            <BudgetItem budget={budgetInfo} />
          ) : (
            <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
          )}
          <AddExpense
            budgetId={params.id}
            user={user}
            refreshData={() => getBudgetInfo()}
          />
        </div>
        <div className="mt-4">
          <h2 className="font-bold text-lg">Latest Expenses</h2>
          <ExpensesListTable
            expenseList={expenseList}
            refreshData={() => getBudgetInfo()}
          />
        </div>
      </div>
    );
  }
}
export default ExpensesScreen;
