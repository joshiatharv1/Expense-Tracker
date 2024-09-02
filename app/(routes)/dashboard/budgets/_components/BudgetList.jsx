"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { db } from "@/utils/dbConfig";
import { eq, getTableColumns, sql,desc } from "drizzle-orm";
import { budgets, expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";


function BudgetList({budget}) {
  const [budgetList, setBudgetList] = useState([]);
  useEffect(() => {
    getBudgetList();
  }, []);
  const { user } = useUser();
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
      .orderBy(desc(budgets.id))
    setBudgetList(result);
    console.log(result);
    console.log("Hello from BudgetList")
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget 
        refreshData={() => getBudgetList()} />
        {budgetList?.length>0?budgetList.map((budget, index) => (
          <BudgetItem key={index} budget={budget} />
        ))
      :[1,2,3,4,5].map((item,index)=>(
        <div key={index} className="w-full bg-slate-200 rounded-lg  h-[150px] animate-pulse">
        </div>
      ))
      }
      </div>
    </div>
  );
}

export default BudgetList;
