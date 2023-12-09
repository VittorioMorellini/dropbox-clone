"use client"
import { useAppStore } from '@/store/store'
import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from './ui/input'
import { ref } from 'firebase/storage'
import { db, storage } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

function RenameModal() {
    const {user} = useUser()
    const [input, setInput] = useState('')
    const [setIsRenameModalOpen, 
        isRenameModalOpen,
        setFileId,
        fileId,
        filename,
        setFilename] = 
    useAppStore(state => [
      state.setIsRenameModalOpen,
      state.isRenameModalOpen, 
      state.setFileId,
      state.fileId,
      state.filename,
      state.setFilename
    ])
    
    async function renameFile() {
        if (!user || !fileId) return;

        const toastId = toast.loading('Renamig the file...')
        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`)

        await updateDoc(doc(db, "users", user.id, "files", fileId), {
            filename: input
        })

        toast.success("Renamed successfully", {
            id: toastId
        })
        setInput('')
        setIsRenameModalOpen(false)

        // renameObject(fileRef).then(async () => {
        //     await deleteDoc(doc(db, "users", user.id, "files", fileId))
        //     console.log('Deleted!')
        // })

    }
    return (
        <Dialog
            open={isRenameModalOpen}
            onOpenChange={(isOpen: boolean) => {
                setIsRenameModalOpen(isOpen)
            }}
        >
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Rename the file</DialogTitle>
            </DialogHeader>
            <Input 
                id="link"
                defaultValue={filename}
                onChange={(e) => setInput(e.target.value)}
                onKeyDownCapture={(e) => {
                    if (e.key === "Enter") {
                        renameFile()
                    }
                }} 
            />
            <div className="flex space-x-2 py-3">
                <Button 
                    size="sm" 
                    className="px-3 flex-1"
                    variant={"ghost"}
                    onClick={() => setIsRenameModalOpen(false)}
                >
                    <span className="sr-only">Cancel</span>
                    <span>Cancel</span>
                </Button>
                <Button 
                    size="sm" 
                    type="submit"
                    className="px-3 flex-1"
                    onClick={() => renameFile()}
                >
                    <span className="sr-only">Rename</span>
                    <span>Rename</span>
                </Button>
            </div>
            {/* <DialogFooter className="flex space-x-2 py-3">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Close
                    </Button>
                </DialogClose>
            </DialogFooter>*/}
        </DialogContent> 
        </Dialog>
    )
}

export default RenameModal