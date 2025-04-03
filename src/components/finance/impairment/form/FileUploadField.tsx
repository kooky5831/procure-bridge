
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImpairmentFormData } from "../types";
import { useState } from "react";

interface FileUploadFieldProps {
  form: UseFormReturn<ImpairmentFormData>;
}

export function FileUploadField({ form }: FileUploadFieldProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue("attachments", files);
    setFileNames(files.map(f => f.name));
  };

  const removeFile = (index: number) => {
    const currentFiles = form.getValues("attachments") || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("attachments", newFiles);
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <FormField
      control={form.control}
      name="attachments"
      render={() => (
        <FormItem>
          <FormLabel className="text-base font-semibold">Supporting Documents</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full"
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
              {fileNames.length > 0 && (
                <div className="space-y-2">
                  {fileNames.map((name, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span className="text-sm truncate">{name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
