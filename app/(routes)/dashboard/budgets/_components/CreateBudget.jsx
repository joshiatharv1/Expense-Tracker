"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
    DialogClose,
  } from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { toast } from 'sonner';
import { budgets } from '@/utils/schema';
function CreateBudget({refreshData}) {

    const [emojiIcon, setEmojiIcon]=useState('😊 ');
    const [openEmojiPicker,setOpenEmojiPicker]=useState(false)

    const [amount,setAmount]=useState()
    const [name,setName]=useState()

    const {user}=useUser();
    const onCreateBuget=async()=>{
        const result=await db.insert(budgets)
        .values({
            name:name,
            amount:amount,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            icon:emojiIcon,
        }).returning({insertedId:budgets.id})
            if(result){
              refreshData();
                toast('New Budget Created !')
            }
        
    }

  return (
    <div>
    
      <Dialog>
        <DialogTrigger asChild>
        <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
        <h2 className="text-3xl">+</h2>
        <h2>Create new Budget</h2>
      </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
           <div className='mt-5'>
            <Button
            className='text-lg'
            onClick={()=>setOpenEmojiPicker(!openEmojiPicker)} 
            variant='outline'>{emojiIcon}</Button>
            <div className='absolute z-20'>
                <EmojiPicker
                open={openEmojiPicker}
                onEmojiClick={(e)=>{
                setEmojiIcon(e.emoji)
                setOpenEmojiPicker(false)}}/>
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Budget Name</h2>
                <Input placeholder="e.g. Home Decore"
                onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                <Input placeholder="e.g. $5000 "
                type="number"
                onChange={(e)=>setAmount(e.target.value)}/>
            </div>
            </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
          <Button
            disabled={!(name&&amount)}
            onClick={()=>onCreateBuget()}
            className='mt-5 w-full'>Add Budget</Button>
          </DialogClose>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget
