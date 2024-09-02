"use client"
import React,{useState} from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { expenses } from '@/utils/schema';
import { toast } from 'sonner';
import { db } from '@/utils/dbConfig';
import { budgets } from '@/utils/schema';
import moment from 'moment/moment';
import { Loader } from 'lucide-react';

function AddExpense({budgetId, user, refreshData}) {


    const [name, setName]=useState();
    const [amount, setAmount]=useState();
    const [loading, setLoading]=useState(false);
    const addNewExpense=async()=>{
      setLoading(true)
        const result=await db.insert(expenses).values(
            {
                name:name,
                amount:amount,
                budgetId:budgetId,
                createdAt:moment().format('MM/DD/yyyy')
            }).returning({insertedId: budgets.id})

            if(result){
              setLoading(false);
                refreshData()
                toast("New Expense Added")
            }
            setLoading(false);
            setAmount("")
            setName("")
    }

  return (
    <div className='ml-2 p-5 border rounded-lg'>
        <h2 className='font-bold text-lg'>Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
        value={name}
          placeholder="e.g. Home Decore"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Budget</h2>
        <Input
        value={amount}
          placeholder="e.g. $1000"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button 
      onClick={()=>addNewExpense()}
      disabled={!(name&&amount)|| loading} className="mt-3 w-full"
      {...loading?<Loader className='animate-spin'/>:"Add new Expense"}
      >Add New Expense</Button>
    </div>
  );
}

export default AddExpense
