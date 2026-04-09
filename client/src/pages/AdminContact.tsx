import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AdminLayout } from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminContact() {
  const { toast } = useToast();
  const [messageUserId, setMessageUserId] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('info');

  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });
  
  const users = Array.isArray(usersResponse) ? usersResponse : [];

  const sendMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/admin/messages', data);
    },
    onSuccess: () => {
      setMessageUserId('');
      setMessageSubject('');
      setMessageContent('');
      setMessageSeverity('info');
      toast({
        title: "Message envoyé",
        description: "Le message a été envoyé à l'utilisateur avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'envoi",
        description: error?.message || "Impossible d'envoyer le message. Veuillez réessayer",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageUserId || !messageSubject || !messageContent) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs avant d'envoyer",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      userId: messageUserId,
      subject: messageSubject,
      content: messageContent,
      severity: messageSeverity,
    });
  };

  if (usersLoading) {
    return (
      <AdminLayout
        title="Contact Utilisateurs"
        description="Envoyer des messages directement aux utilisateurs"
      >
        <div className="max-w-3xl mx-auto" data-testid="loading-admin-contact">
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Contact Utilisateurs"
      description="Communiquer directement avec vos utilisateurs via leur Dashboard"
    >
      <div className="max-w-3xl mx-auto" data-testid="page-admin-contact">
        <Card data-testid="card-send-message">
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
            <CardDescription>
              Le message sera affiché dans le Dashboard de l'utilisateur sélectionné
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-select">Destinataire *</Label>
                <Select value={messageUserId} onValueChange={setMessageUserId}>
                  <SelectTrigger data-testid="select-user">
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(users) && users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity-select">Priorité</Label>
                <Select value={messageSeverity} onValueChange={setMessageSeverity}>
                  <SelectTrigger data-testid="select-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-subject">Sujet *</Label>
              <Input
                id="message-subject"
                placeholder="Objet du message"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                data-testid="input-message-subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-content">Message *</Label>
              <Textarea
                id="message-content"
                placeholder="Écrivez votre message ici..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
                data-testid="textarea-message-content"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !messageUserId || !messageSubject || !messageContent}
              data-testid="button-send-message"
              className="w-full md:w-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendMessageMutation.isPending ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
