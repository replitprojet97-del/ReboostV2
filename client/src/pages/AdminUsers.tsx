import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ban, Trash2, CheckCircle, Trash, Shield } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "@/components/admin";
import { Checkbox } from "@/components/ui/checkbox";

const SUSPENSION_REASONS = [
  { value: 'violation_of_terms', label: 'Violation of terms of service' },
  { value: 'suspicious_activity', label: 'Suspicious activity detected' },
  { value: 'non_payment', label: 'Non-payment or overdraft' },
  { value: 'kyc_verification_failed', label: 'KYC verification failed' },
  { value: 'regulatory_compliance', label: 'Regulatory compliance issue' },
  { value: 'security_breach', label: 'Account security breach' },
  { value: 'user_requested', label: 'Requested by user' },
  { value: 'administrative_decision', label: 'Administrative decision' },
];

export default function AdminUsers() {
  const { toast } = useToast();
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendUntil, setSuspendUntil] = useState("");
  const [bulkDeleteReason, setBulkDeleteReason] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ id, until, reason }: { id: string; until: string; reason: string }) => {
      return await apiRequest("POST", `/api/admin/users/${id}/suspend`, { until, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Utilisateur suspendu",
        description: "L'utilisateur a été suspendu avec succès",
      });
      setSuspendDialogOpen(false);
      setSuspendReason("");
      setSuspendUntil("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de suspendre l'utilisateur",
        variant: "destructive",
      });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/users/${id}/unblock`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Utilisateur activé",
        description: "L'utilisateur a été activé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible d'activer l'utilisateur",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteUserMutation = useMutation({
    mutationFn: async ({ userIds, reason }: { userIds: string[]; reason: string }) => {
      return await apiRequest("POST", "/api/admin/users/bulk-delete", { userIds, reason });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedUsers(new Set());
      setBulkDeleteReason("");
      setBulkDeleteDialogOpen(false);
      toast({
        title: "Suppression réussie",
        description: data.message || "Les utilisateurs ont été supprimés avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer les utilisateurs",
        variant: "destructive",
      });
    },
  });

  const approveKycMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/users/${id}/approve-kyc`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "KYC validé",
        description: "Le KYC de l'utilisateur a été validé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de valider le KYC",
        variant: "destructive",
      });
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: async ({ id, tier }: { id: string; tier: string }) => {
      return await apiRequest("PATCH", `/api/admin/users/${id}`, { verificationTier: tier });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Tier mis à jour",
        description: "Le niveau de confiance a été modifié avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de modifier le tier",
        variant: "destructive",
      });
    },
  });

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleSelectAll = () => {
    const userList = Array.isArray(users) ? users : [];
    if (selectedUsers.size === userList.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(userList.map((user: any) => user.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un utilisateur à supprimer",
        variant: "destructive",
      });
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = () => {
    if (!bulkDeleteReason.trim() || bulkDeleteReason.length < 5) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une justification (minimum 5 caractères)",
        variant: "destructive",
      });
      return;
    }
    bulkDeleteUserMutation.mutate({ 
      userIds: Array.from(selectedUsers),
      reason: bulkDeleteReason 
    });
  };

  const handleSuspend = (userId: string) => {
    setSelectedUserId(userId);
    setSuspendDialogOpen(true);
  };

  const handleSuspendConfirm = () => {
    if (!suspendReason || !suspendUntil) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    suspendUserMutation.mutate({ 
      id: selectedUserId, 
      until: new Date(suspendUntil).toISOString(), 
      reason: suspendReason 
    });
  };

  const handleActivate = (userId: string) => {
    unblockUserMutation.mutate(userId);
  };

  const handleDelete = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Gestion des Utilisateurs"
        description="Gérer tous les comptes utilisateurs de la plateforme"
      >
        <div className="space-y-6" data-testid="loading-admin-users">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent data-testid="dialog-suspend-user">
          <DialogHeader>
            <DialogTitle>Suspendre l'utilisateur</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la durée et la raison de la suspension
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspendUntil">Suspendre jusqu'au</Label>
              <Input
                id="suspendUntil"
                type="datetime-local"
                value={suspendUntil}
                onChange={(e) => setSuspendUntil(e.target.value)}
                data-testid="input-suspend-until"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspendReason">Raison</Label>
              <Select value={suspendReason} onValueChange={setSuspendReason}>
                <SelectTrigger id="suspendReason" data-testid="select-suspend-reason">
                  <SelectValue placeholder="Sélectionnez une raison..." />
                </SelectTrigger>
                <SelectContent>
                  {SUSPENSION_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendDialogOpen(false)}
              data-testid="button-cancel-suspend"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSuspendConfirm}
              disabled={suspendUserMutation.isPending}
              data-testid="button-confirm-suspend"
            >
              {suspendUserMutation.isPending ? "Suspension..." : "Suspendre"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminLayout
        title="Gestion des Utilisateurs"
        description="Gérer tous les comptes utilisateurs de la plateforme"
      >
        <div className="space-y-6" data-testid="page-admin-users">
          <Card data-testid="card-users-table">
          <CardHeader>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <CardTitle>Tous les Utilisateurs</CardTitle>
                <CardDescription>Liste complète des comptes utilisateurs</CardDescription>
              </div>
              {selectedUsers.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteUserMutation.isPending}
                  data-testid="button-bulk-delete-users"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer ({selectedUsers.size})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={Array.isArray(users) && selectedUsers.size === users.length && users.length > 0}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all-users"
                    />
                  </TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Complétés</TableHead>
                  <TableHead>Défauts</TableHead>
                  <TableHead>Solde</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(users) && users.map((user: any) => (
                  <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                        disabled={user.role === "admin"}
                        data-testid={`checkbox-select-user-${user.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium" data-testid={`text-user-name-${user.id}`}>
                      {user.fullName}
                    </TableCell>
                    <TableCell data-testid={`text-user-email-${user.id}`}>{user.email}</TableCell>
                    <TableCell data-testid={`text-user-type-${user.id}`}>{user.accountType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'active' ? 'default' :
                          user.status === 'suspended' ? 'destructive' : 'secondary'
                        }
                        data-testid={`badge-user-status-${user.id}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.kycStatus === 'approved' || user.kycStatus === 'verified' ? 'default' : 'secondary'}
                        data-testid={`badge-user-kyc-${user.id}`}
                      >
                        {user.kycStatus === 'approved' || user.kycStatus === 'verified' ? 'KYC Valide' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <span className="text-sm text-muted-foreground">-</span>
                      ) : (
                        <Select
                          value={user.verificationTier || 'bronze'}
                          onValueChange={(value) => updateTierMutation.mutate({ id: user.id, tier: value })}
                          disabled={updateTierMutation.isPending}
                        >
                          <SelectTrigger className="w-24" data-testid={`select-tier-${user.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bronze">Bronze</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell data-testid={`text-user-completed-${user.id}`}>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {user.completedLoansCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-user-defaulted-${user.id}`}>
                      <Badge variant={(user.defaultedLoansCount || 0) > 0 ? "destructive" : "outline"} className={(user.defaultedLoansCount || 0) === 0 ? "bg-gray-50 text-gray-500" : ""}>
                        {user.defaultedLoansCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-user-balance-${user.id}`}>
                      {(user.balance ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === "admin" ? (
                        <span className="text-sm text-muted-foreground">Compte admin</span>
                      ) : (
                        <div className="flex justify-end gap-2 flex-wrap">
                          {(user.kycStatus === 'pending' || !user.kycStatus || user.kycStatus === 'rejected') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveKycMutation.mutate(user.id)}
                              disabled={approveKycMutation.isPending}
                              data-testid={`button-approve-kyc-${user.id}`}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Valider KYC
                            </Button>
                          )}
                          {user.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(user.id)}
                              disabled={suspendUserMutation.isPending || unblockUserMutation.isPending}
                              data-testid={`button-suspend-${user.id}`}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Suspendre
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivate(user.id)}
                              disabled={suspendUserMutation.isPending || unblockUserMutation.isPending}
                              data-testid={`button-activate-${user.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Activer
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={deleteUserMutation.isPending}
                                data-testid={`button-delete-${user.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Cela supprimera définitivement le compte de{' '}
                                  <strong>{user.fullName}</strong> et toutes ses données associées.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-testid={`button-cancel-delete-${user.id}`}>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  data-testid={`button-confirm-delete-${user.id}`}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>

        <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <DialogContent data-testid="dialog-bulk-delete-users">
            <DialogHeader>
              <DialogTitle>Supprimer {selectedUsers.size} utilisateur(s)</DialogTitle>
              <DialogDescription>
                Cette action est irréversible. Veuillez fournir une justification pour cette suppression en masse.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-delete-reason">Justification de suppression *</Label>
                <Textarea
                  id="bulk-delete-reason"
                  placeholder="Ex: Comptes dupliqués, inactifs, frauduleux, etc."
                  value={bulkDeleteReason}
                  onChange={(e) => setBulkDeleteReason(e.target.value)}
                  rows={4}
                  data-testid="input-bulk-delete-reason-users"
                />
                <p className="text-sm text-muted-foreground">Minimum 5 caractères</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setBulkDeleteDialogOpen(false);
                  setBulkDeleteReason("");
                }}
                data-testid="button-cancel-bulk-delete-users"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDeleteConfirm}
                disabled={bulkDeleteUserMutation.isPending || !bulkDeleteReason.trim() || bulkDeleteReason.length < 5}
                data-testid="button-confirm-bulk-delete-users"
              >
                Supprimer {selectedUsers.size} utilisateur(s)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
}
