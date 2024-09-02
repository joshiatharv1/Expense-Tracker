import React from 'react'
import { Trash } from 'lucide-react'
import { db } from '@/utils/dbConfig'
import { expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
function ExpensesListTable({expenseList, refreshData}) {

    const deleteExpense = async (expense) => {
          const result = await db.delete(expenses)
            .where(eq(expenses.id, expense.id))
            .returning();
          if (result) {
            toast("Expense Deleted");
            refreshData();
          }
      };
      

  return (
    <div className='my-4'>
      <h2 className='font-bold text-xl'>All Expenses so far !</h2>
      <div className="font-bold grid grid-cols-4 bg-slate-200 p-4">
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>
      {expenseList.map((expense,index)=>(
        <div key={index} className="grid grid-cols-4 bg-slate-50 p-4">
        <h2>{expense.name}</h2>
        <h2>{expense.amount}</h2>
        <h2>{expense.createdAt}</h2>
        <h2>
            <Trash 
            onClick={()=>deleteExpense(expense)}
            className="text-red-600 cursor-pointer"/>
        </h2>
      </div>
      ))}
    </div>
  )
}

export default ExpensesListTable
