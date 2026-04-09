import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-orange-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Page introuvable
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <Link href="/">
            <Button className="gap-2" data-testid="button-home">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
