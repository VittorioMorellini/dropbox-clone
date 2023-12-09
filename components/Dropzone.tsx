"use client"
import { db, storage } from '@/firebase'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Store } from 'lucide-react'
import React, { useState } from 'react'
import DropzoneCompnent from 'react-dropzone'
import toast from 'react-hot-toast'

export default function Dropzone() {
    const [loading, setLoading] = useState(false)
    const { isLoaded, isSignedIn, user } = useUser()

    const onDrop = (acceptedFiles: File[]) => {
        //console.log(acceptedFiles)
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader()
            reader.onabort = () => console.log("File reading was aborted")
            reader.onerror = () => console.log("File reading was in error")
            reader.onload = async () => {
                await uploadPost(file)
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const uploadPost = async (selectedFile: File) => {
        //console.log('I am in upload file')
        if (loading) return
        if (!user) return

        const toastId = toast.loading('Uploading file ...')
        setLoading(true)
        // manage firebase Store
        // addDoc -> users/user12345/files
        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            filenam: selectedFile.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timestamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size
        }) 
        //create a reference to the file in DB
        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`)
        //upload the content of the file
        uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef)
            await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                downloadURL: downloadURL,
            })
        })

        toast.success('Uploaded success', {
            id: toastId
        })
        setLoading(false)
    }
    //Maximum size 20MB
    const maxSize = 20971520
    return (    
        <DropzoneCompnent
            minSize={0}
            maxSize={maxSize} 
            onDrop={onDrop}
        >
        {({getRootProps, 
            getInputProps, 
            isDragAccept,
            isDragActive,
            isDragReject,
            fileRejections,
        }) => {
            const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize
            return (
                <section className='m-4'>
                    <div {...getRootProps()} 
                    className={cn('w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center',
                               isDragActive ? "bg-[#035ffe] text-white animate-pulse" : 
                                                "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"                  
                    )}
                    >
                        <input {...getInputProps()} />
                        <p>Drag & drop some files here, or click to select files</p>
                        {!isDragActive && "Click here or drop a file to upload!"}
                        {isDragActive && !isDragReject && "Drop to upload this file!"}
                        {isDragReject && "File type not accepted, sorry !"}
                        {isFileTooLarge && (
                            <div className='text-danger mt-2'>File is too large</div>
                        )}
                    </div>
                </section>
            )}
        }
        </DropzoneCompnent>  
    )
}
