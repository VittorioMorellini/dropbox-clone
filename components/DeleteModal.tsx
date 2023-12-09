import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db, storage } from "@/firebase"
import { useAppStore } from "@/store/store"
import { auth, useUser } from "@clerk/nextjs"
import { deleteDoc, doc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import toast from 'react-hot-toast'

export function DeleteModal() {
    const {user} = useUser()
    const [setIsDeleteModalOpen, 
        isDeleteModalOpen,
        setFileId,
        fileId] = 
    useAppStore(state => [
      state.setIsDeleteModalOpen,
      state.isDeleteModalOpen, 
      state.setFileId,
      state.fileId
    ])

    async function deleteFile() {
        if (!user || !fileId) return;

        const toastId = toast.loading('Deleting started... ')
        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`)
        deleteObject(fileRef).then(async () => {
            await deleteDoc(doc(db, "users", user.id, "files", fileId))
            console.log('Deleted!')

            toast.success('Deleted Successfully', {
                id: toastId
            })
        })
        .catch((error) => {
            console.log('Error occurred: ' + error, error)
            toast.error('Deleted failed', {
                id: toastId
            })
        })
        .finally(() => {
            setIsDeleteModalOpen(false)
        })
    }
    return (
        <Dialog
            open={isDeleteModalOpen}
            onOpenChange={(isOpen: boolean) => {
                setIsDeleteModalOpen(isOpen)
            }}
        >
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Delete the file</DialogTitle>
            
            </DialogHeader>
            <div className="flex space-x-2 py-3">
                <Button 
                    size="sm" 
                    className="px-3 flex-1"
                    variant={"ghost"}
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <span className="sr-only">Cancel</span>
                    <span>Cancel</span>
                </Button>
                <Button 
                    size="sm" 
                    type="submit"
                    className="px-3 flex-1"
                    variant={"destructive"}
                    onClick={() => deleteFile()}
                >
                    <span className="sr-only">Delete</span>
                    <span>Delete</span>
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
