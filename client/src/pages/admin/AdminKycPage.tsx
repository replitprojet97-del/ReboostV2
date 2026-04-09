import { useQuery, useMutation } from "@tanstack/react-query";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminHeader from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface KycDocument {
  id: string;
  userId: string;
  userFullName: string;
  documentType: string;
  status: string;
  fileName: string;
  uploadedAt: string;
  cloudinaryPublicId: string;
}

export default function AdminKycPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: documents, isLoading } = useQuery<KycDocument[]>({
    queryKey: ["/api/admin/all-kyc-documents"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/kyc-documents/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/all-kyc-documents"] });
      toast({ title: "Statut mis à jour", description: "Le statut du document a été modifié avec succès." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de mettre à jour le statut." });
    }
  });

  const handleDownload = async (docId: string) => {
    try {
      const res = await fetch(`/api/admin/kyc-documents/${docId}/download`);
      if (!res.ok) throw new Error("Erreur lors de la récupération du lien");
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de générer le lien de téléchargement." });
    }
  };

  const columns = [
    {
      accessorKey: "userFullName",
      header: "Utilisateur",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("userFullName") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Type",
      cell: ({ row }: any) => (
        <div className="capitalize">{row.getValue("documentType").replace(/_/g, " ")}</div>
      ),
    },
    {
      accessorKey: "uploadedAt",
      header: "Date d'envoi",
      cell: ({ row }: any) => (
        <div className="text-muted-foreground text-sm">
          {format(new Date(row.getValue("uploadedAt")), "PPp", { locale: fr })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge 
            variant={status === 'verified' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}
            className={cn(
              "flex w-fit items-center gap-1",
              status === 'verified' && "bg-green-500 hover:bg-green-600 text-white"
            )}
          >
            {status === 'verified' ? <CheckCircle className="w-3 h-3" /> : 
             status === 'rejected' ? <XCircle className="w-3 h-3" /> : 
             <Clock className="w-3 h-3" />}
            {status === 'verified' ? 'Validé' : status === 'rejected' ? 'Rejeté' : 'En attente'}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const doc = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleDownload(doc.id)}
              disabled={!doc.cloudinaryPublicId}
              title="Télécharger depuis Cloudinary"
            >
              <Download className="w-4 h-4 mr-1" />
              Tél.
            </Button>
            {doc.status !== 'verified' && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => updateStatusMutation.mutate({ id: doc.id, status: 'verified' })}
              >
                Valider
              </Button>
            )}
            {doc.status !== 'rejected' && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => updateStatusMutation.mutate({ id: doc.id, status: 'rejected' })}
              >
                Rejeter
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setLocation("/admin")}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <AdminHeader 
          title="Gestion KYC" 
          description="Vérifiez et validez les documents d'identité et justificatifs des utilisateurs."
        />
      </div>
      <AdminDataTable 
        columns={columns} 
        data={documents || []} 
        isLoading={isLoading}
      />
    </div>
  );
}
