import { budgets } from '@/utils/schema';
import Link from 'next/link';
import React from 'react'

function BudgetItem({budget}) {

  const calculateProgressPer=()=>{
    const perc=(budget.totalSpends/budget.amount)*100;
    return perc.toFixed(2)
  }


  if (!budget) {
    return null; // Prevent rendering if budget is undefined
  }

  return (
    <Link href={'/dashboard/expenses/'+budget?.id} >
      <div className="p-5 border rounded-lg hover:shadow-sm cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center ">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full ">
            {budget?.icon}
          </h2>
          <div>
            <h2 className='font-bold'>{budget.name}</h2>
            <h2>{budget.totalItems} Item</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">$ {budget.amount}</h2>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-slate-400">
            ${budget.totalSpends ? budget.totalSpends : 0} Spent
          </div>
          <div className="text-xs text-slate-400">
            ${budget.amount-budget.totalSpends} Remaining
          </div>
        </div>
        <div className="w-full bg-slate-300 h-2 rounded-full">
          <div className=" bg-primary h-2 rounded-full" style={{width:`${(calculateProgressPer())}%`}}></div>
        </div>
      </div>
      </div>
    </Link>
  );
}

export default BudgetItem
