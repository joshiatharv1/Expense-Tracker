"use client"

import React, { useEffect, useState }from 'react'
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
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
  
  import { Input } from '@/components/ui/input'
  import EmojiPicker from 'emoji-picker-react'
import { budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { db } from '@/utils/dbConfig'

function EditBudget({budgetInfo, refreshData})

{
    const [emojiIcon, setEmojiIcon]=useState(budgetInfo?.icon);
    const [openEmojiPicker,setOpenEmojiPicker]=useState(false)

    const [amount,setAmount]=useState()
    const [name,setName]=useState()

    const onUpdateBuget=async()=>{
        const result=await db.update(budgets).set({
            name:name,
            amount:amount,
            icon:emojiIcon
        }).where (eq(budgets.id, budgetInfo.id))
        .returning();
        if(result){
            refreshData();
            toast("Budget Updated")
        }
    }


    useEffect(()=>{
        if(budgetInfo){
            setEmojiIcon(budgetInfo?.icon)
            setAmount(budgetInfo?.amount)
            setName(budgetInfo?.name)
        }
    },[budgetInfo])

  return (
    <div>
      <Dialog>
        <DialogTrigger>
            <div>
            <Button className="flex gap-2">
            <PenBox />
            Edit
          </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Update Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <div>
                <Button
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  variant="outline"
                >
                  {emojiIcon}
                </Button>
                </div>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                  defaultValue={budgetInfo?.name}
                    placeholder="e.g. Home Decore"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    defaultValue={budgetInfo?.amount}
                    placeholder="e.g. $5000 "
                    type="number"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBuget()}
                className="mt-5 w-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget
