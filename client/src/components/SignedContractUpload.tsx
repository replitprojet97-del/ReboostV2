import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSignature, Check, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

async function uploadSignedContract(loanId: string, file: File): Promise<any> {
  const formData = new FormData();
  formData.append('signedContract', file);

  const response = await apiRequest('POST', `/api/loans/${loanId}/upload-signed-contract`, formData);
  return response.json();
}

interface SignedContractUploadProps {
  loanId: string;
  loanAmount: string | number;
}

export function SignedContractUpload({ loanId, loanAmount }: SignedContractUploadProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadSignedContract(loanId, file),
    onSuccess: () => {
      toast({
        title: t.contracts.uploadSuccess,
        description: t.contracts.uploadSuccessDescription,
      });
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t.contracts.uploadError,
        description: error.message || t.contracts.uploadErrorDescription,
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: t.contracts.fileTooLarge,
          description: t.contracts.fileTooLargeDescription,
        });
        return;
      }

      if (!file.type.includes('pdf')) {
        toast({
          variant: 'destructive',
          title: t.contracts.invalidFileType,
          description: t.contracts.invalidFileTypeDescription,
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: t.contracts.noFileSelected,
        description: t.contracts.noFileSelectedDescription,
      });
      return;
    }

    uploadMutation.mutate(selectedFile);
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  return (
    <Card className="mt-3 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-600/10 dark:bg-yellow-600/20 flex items-center justify-center flex-shrink-0">
            <FileSignature className="w-5 h-5 text-yellow-700 dark:text-yellow-500" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                {t.contracts.uploadTitle}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t.contracts.uploadDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploadMutation.isPending}
                data-testid={`input-contract-${loanId}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
                data-testid={`button-choose-file-${loanId}`}
              >
                <Upload className="w-4 h-4" />
                {selectedFile ? t.contracts.changeFile : t.contracts.chooseFile}
              </Button>

              {selectedFile && (
                <>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="gap-1"
                    data-testid={`button-upload-${loanId}`}
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {t.contracts.sending}
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {t.contracts.send}
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={uploadMutation.isPending}
                    className="gap-1"
                    data-testid={`button-cancel-${loanId}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
