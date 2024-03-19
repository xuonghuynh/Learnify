'use client';

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "@/components/ui/use-toast";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => onChange(res?.[0].url)}
            onUploadError={(error: Error) => {
                toast({
                    description: `${error.message}`,
                    variant: "destructive",
                    duration: 2000,
                })
            }}
        />
    )
}