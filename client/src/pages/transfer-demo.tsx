import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  Globe, 
  Shield, 
  Clock, 
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Euro,
  DollarSign,
  Banknote,
  Lock,
  User,
  MapPin,
  Hash,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Fingerprint,
  ShieldCheck,
  CircleDollarSign,
  Send,
  Receipt
} from "lucide-react";

type TransferType = "sepa" | "swift" | null;

interface TransferData {
  type: TransferType;
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryCountry: string;
  iban: string;
  bic: string;
  bankName: string;
  bankAddress: string;
  amount: string;
  currency: string;
  reference: string;
  motif: string;
  urgency: string;
  fraisOption: string;
}

interface PaymentStep {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "current";
}

const initialTransferData: TransferData = {
  type: null,
  beneficiaryName: "",
  beneficiaryAddress: "",
  beneficiaryCountry: "",
  iban: "",
  bic: "",
  bankName: "",
  bankAddress: "",
  amount: "",
  currency: "EUR",
  reference: "",
  motif: "",
  urgency: "standard",
  fraisOption: "SHA",
};

const sepaCountries = [
  "Allemagne", "Autriche", "Belgique", "Bulgarie", "Chypre", "Croatie", 
  "Danemark", "Espagne", "Estonie", "Finlande", "France", "Grèce", 
  "Hongrie", "Irlande", "Italie", "Lettonie", "Lituanie", "Luxembourg",
  "Malte", "Pays-Bas", "Pologne", "Portugal", "République tchèque", 
  "Roumanie", "Slovaquie", "Slovénie", "Suède"
];

const swiftCountries = [
  "États-Unis", "Royaume-Uni", "Suisse", "Canada", "Australie", "Japon",
  "Chine", "Singapour", "Hong Kong", "Émirats arabes unis", "Brésil",
  "Mexique", "Inde", "Afrique du Sud", "Russie", "Corée du Sud"
];

export default function TransferDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [transferData, setTransferData] = useState<TransferData>(initialTransferData);
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPaymentStep, setCurrentPaymentStep] = useState(0);

  const totalSteps = 6;

  const updateTransferData = (field: keyof TransferData, value: string) => {
    setTransferData(prev => ({ ...prev, [field]: value }));
  };

  const calculateFees = () => {
    const amount = parseFloat(transferData.amount) || 0;
    const isSepa = transferData.type === "sepa";
    const isUrgent = transferData.urgency === "urgent";

    if (isSepa) {
      const baseFee = amount > 50000 ? 15 : (amount > 10000 ? 8 : 2.50);
      const urgentFee = isUrgent ? 25 : 0;
      return {
        baseFee,
        urgentFee,
        processingFee: 0,
        correspondentFee: 0,
        total: baseFee + urgentFee
      };
    } else {
      const baseFee = 35;
      const urgentFee = isUrgent ? 50 : 0;
      const processingFee = amount * 0.001;
      const correspondentFee = transferData.fraisOption === "OUR" ? 25 : 0;
      return {
        baseFee,
        urgentFee,
        processingFee: Math.min(processingFee, 150),
        correspondentFee,
        total: baseFee + urgentFee + Math.min(processingFee, 150) + correspondentFee
      };
    }
  };

  const generatePaymentSteps = (): PaymentStep[] => {
    const amount = parseFloat(transferData.amount) || 0;
    const fees = calculateFees();
    const isSwift = transferData.type === "swift";
    const totalAmount = amount + fees.total;

    return [
      {
        id: "step1",
        name: "Frais de dossier",
        description: "Frais d'ouverture et de traitement du dossier",
        amount: fees.total > 0 ? fees.total : totalAmount * 0.02,
        status: "pending"
      },
      {
        id: "step2",
        name: "Frais de conformité",
        description: "Vérification anti-blanchiment et conformité réglementaire",
        amount: isSwift ? totalAmount * 0.015 : totalAmount * 0.01,
        status: "pending"
      },
      {
        id: "step3",
        name: "Premier versement (25%)",
        description: "Première tranche du virement international",
        amount: amount * 0.25,
        status: "pending"
      },
      {
        id: "step4",
        name: "Deuxième versement (25%)",
        description: "Deuxième tranche du virement",
        amount: amount * 0.25,
        status: "pending"
      },
      {
        id: "step5",
        name: "Troisième versement (25%)",
        description: "Troisième tranche du virement",
        amount: amount * 0.25,
        status: "pending"
      },
      {
        id: "step6",
        name: "Solde final (25%)",
        description: "Dernière tranche et confirmation définitive",
        amount: amount * 0.25,
        status: "pending"
      }
    ];
  };

  const handleNext = () => {
    if (currentStep === 5) {
      setPaymentSteps(generatePaymentSteps());
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const processPaymentStep = async (stepIndex: number) => {
    setIsProcessing(true);
    setCurrentPaymentStep(stepIndex);

    setPaymentSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === stepIndex ? "processing" : step.status
    })));

    await new Promise(resolve => setTimeout(resolve, 2500));

    setPaymentSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === stepIndex ? "completed" : (idx === stepIndex + 1 ? "current" : step.status)
    })));

    setIsProcessing(false);

    if (stepIndex === paymentSteps.length - 1) {
      setCurrentStep(7);
    }
  };

  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: "Type", icon: CreditCard },
      { num: 2, label: "Bénéficiaire", icon: User },
      { num: 3, label: "Banque", icon: Building2 },
      { num: 4, label: "Montant", icon: CircleDollarSign },
      { num: 5, label: "Vérification", icon: ShieldCheck },
      { num: 6, label: "Paiement", icon: Send },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex items-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`
                    relative flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-medium transition-all duration-500
                    ${currentStep > step.num 
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
                      : currentStep === step.num 
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/40" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"}
                  `}>
                    {currentStep > step.num ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    {currentStep === step.num && (
                      <motion.div 
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ opacity: 0.3, zIndex: -1 }}
                      />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${
                    currentStep >= step.num ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-8 lg:w-16 h-0.5 mx-1 rounded-full transition-all duration-500 ${
                    currentStep > step.num 
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500" 
                      : "bg-slate-200 dark:bg-slate-700"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/30"
        >
          <Send className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Nouveau virement
        </h2>
        <p className="text-muted-foreground mt-2">Choisissez votre type de transfert</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card 
            className={`cursor-pointer h-full transition-all duration-300 border-2 ${
              transferData.type === "sepa" 
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-xl shadow-blue-500/20" 
                : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            }`}
            onClick={() => updateTransferData("type", "sepa")}
            data-testid="card-sepa-option"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <Euro className="w-7 h-7 text-white" />
                </div>
                {transferData.type === "sepa" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-1 rounded-full bg-blue-500"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-1">Virement SEPA</h3>
              <p className="text-sm text-muted-foreground mb-6">Zone Euro uniquement</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>1-2 jours ouvrés</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Banknote className="w-4 h-4 text-violet-600" />
                  </div>
                  <span>Frais: 0€ - 15€</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>27 pays européens</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                  Gratuit jusqu'à 10K€
                </Badge>
                <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                  IBAN requis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card 
            className={`cursor-pointer h-full transition-all duration-300 border-2 ${
              transferData.type === "swift" 
                ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-xl shadow-purple-500/20" 
                : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            }`}
            onClick={() => updateTransferData("type", "swift")}
            data-testid="card-swift-option"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                {transferData.type === "swift" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-1 rounded-full bg-purple-500"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-1">Virement SWIFT</h3>
              <p className="text-sm text-muted-foreground mb-6">International</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>2-5 jours ouvrés</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Banknote className="w-4 h-4 text-violet-600" />
                  </div>
                  <span>Frais: 35€ - 150€+</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <TrendingUp className="w-4 h-4 text-pink-600" />
                  </div>
                  <span>200+ pays</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">
                  Multi-devises
                </Badge>
                <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                  BIC/SWIFT requis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {transferData.type && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={`p-4 rounded-2xl flex items-start gap-3 ${
              transferData.type === "sepa" 
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800"
                : "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800"
            }`}>
              <Sparkles className={`w-5 h-5 mt-0.5 ${
                transferData.type === "sepa" ? "text-blue-600" : "text-purple-600"
              }`} />
              <div className="text-sm">
                <p className="font-semibold mb-1">
                  {transferData.type === "sepa" ? "Virement SEPA sélectionné" : "Virement SWIFT sélectionné"}
                </p>
                <p className="text-muted-foreground">
                  {transferData.type === "sepa" 
                    ? "Transfert rapide et économique vers la zone Euro. Idéal pour vos paiements européens."
                    : "Transfert international multi-devises. Parfait pour vos opérations mondiales."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-blue-500/30"
        >
          <User className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold">Bénéficiaire</h2>
        <p className="text-muted-foreground mt-1">Coordonnées du destinataire</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="beneficiaryName" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Nom complet
          </Label>
          <Input
            id="beneficiaryName"
            placeholder="Jean Dupont ou Société SARL"
            value={transferData.beneficiaryName}
            onChange={(e) => updateTransferData("beneficiaryName", e.target.value)}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            data-testid="input-beneficiary-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="beneficiaryAddress" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Adresse complète
          </Label>
          <Input
            id="beneficiaryAddress"
            placeholder="123 Rue de Paris, 75001 Paris"
            value={transferData.beneficiaryAddress}
            onChange={(e) => updateTransferData("beneficiaryAddress", e.target.value)}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            data-testid="input-beneficiary-address"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Pays
          </Label>
          <Select 
            value={transferData.beneficiaryCountry} 
            onValueChange={(value) => updateTransferData("beneficiaryCountry", value)}
          >
            <SelectTrigger className="h-12 rounded-xl" data-testid="select-beneficiary-country">
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {(transferData.type === "sepa" ? sepaCountries : [...sepaCountries, ...swiftCountries]).map(country => (
                <SelectItem key={country} value={country} className="rounded-lg">{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-dashed">
          <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Coordonnées bancaires
          </p>
          
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="iban" className="text-sm font-medium">IBAN</Label>
              <Input
                id="iban"
                placeholder="FR76 1234 5678 9012 3456 7890 123"
                value={transferData.iban}
                onChange={(e) => updateTransferData("iban", e.target.value.toUpperCase())}
                className="h-12 rounded-xl font-mono tracking-wider border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                data-testid="input-iban"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic" className="text-sm font-medium">BIC / SWIFT</Label>
              <Input
                id="bic"
                placeholder="BNPAFRPP"
                value={transferData.bic}
                onChange={(e) => updateTransferData("bic", e.target.value.toUpperCase())}
                className="h-12 rounded-xl font-mono tracking-wider border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                data-testid="input-bic"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-lg shadow-orange-500/30"
        >
          <Building2 className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold">Banque destinataire</h2>
        <p className="text-muted-foreground mt-1">Informations de l'établissement</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="bankName" className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Nom de la banque
          </Label>
          <Input
            id="bankName"
            placeholder="BNP Paribas"
            value={transferData.bankName}
            onChange={(e) => updateTransferData("bankName", e.target.value)}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            data-testid="input-bank-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankAddress" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Adresse de la banque
          </Label>
          <Input
            id="bankAddress"
            placeholder="16 Boulevard des Italiens, 75009 Paris"
            value={transferData.bankAddress}
            onChange={(e) => updateTransferData("bankAddress", e.target.value)}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            data-testid="input-bank-address"
          />
        </div>

        {transferData.type === "swift" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4"
          >
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Banque intermédiaire
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Optionnel - Pour certains pays, une banque correspondante peut être nécessaire.
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Nom de la banque intermédiaire"
                  className="h-11 rounded-xl"
                  data-testid="input-intermediary-bank"
                />
                <Input
                  placeholder="Code SWIFT (ex: CHASUS33)"
                  className="h-11 rounded-xl font-mono"
                  data-testid="input-intermediary-swift"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    const fees = calculateFees();
    const amount = parseFloat(transferData.amount) || 0;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg shadow-emerald-500/30"
          >
            <CircleDollarSign className="w-7 h-7 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold">Montant et options</h2>
          <p className="text-muted-foreground mt-1">Définissez les détails du transfert</p>
        </div>

        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Montant</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000.00"
                  value={transferData.amount}
                  onChange={(e) => updateTransferData("amount", e.target.value)}
                  className="h-14 rounded-xl text-2xl font-bold pl-4 pr-16 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  data-testid="input-amount"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {transferData.currency}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Devise</Label>
              <Select 
                value={transferData.currency} 
                onValueChange={(value) => updateTransferData("currency", value)}
              >
                <SelectTrigger className="h-14 rounded-xl text-lg" data-testid="select-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="EUR" className="rounded-lg">
                    <span className="flex items-center gap-2">
                      <Euro className="w-4 h-4" /> EUR - Euro
                    </span>
                  </SelectItem>
                  {transferData.type === "swift" && (
                    <>
                      <SelectItem value="USD" className="rounded-lg">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" /> USD - Dollar
                        </span>
                      </SelectItem>
                      <SelectItem value="GBP" className="rounded-lg">GBP - Livre sterling</SelectItem>
                      <SelectItem value="CHF" className="rounded-lg">CHF - Franc suisse</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Référence / Motif</Label>
            <Input
              placeholder="Facture N°2024-001"
              value={transferData.reference}
              onChange={(e) => updateTransferData("reference", e.target.value)}
              className="h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              data-testid="input-reference"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Délai de traitement</Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileTap={{ scale: 0.98 }}>
                <div 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    transferData.urgency === "standard" 
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30" 
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                  onClick={() => updateTransferData("urgency", "standard")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      transferData.urgency === "standard" ? "bg-violet-500" : "bg-slate-100 dark:bg-slate-800"
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        transferData.urgency === "standard" ? "text-white" : "text-slate-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold">Standard</p>
                      <p className="text-xs text-muted-foreground">
                        {transferData.type === "sepa" ? "1-2 jours" : "2-5 jours"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div whileTap={{ scale: 0.98 }}>
                <div 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    transferData.urgency === "urgent" 
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" 
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                  onClick={() => updateTransferData("urgency", "urgent")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      transferData.urgency === "urgent" ? "bg-amber-500" : "bg-slate-100 dark:bg-slate-800"
                    }`}>
                      <Zap className={`w-5 h-5 ${
                        transferData.urgency === "urgent" ? "text-white" : "text-slate-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold">Express</p>
                      <p className="text-xs text-muted-foreground">
                        +{transferData.type === "sepa" ? "25" : "50"}€
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {transferData.type === "swift" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Répartition des frais</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "SHA", label: "Partagés", desc: "50/50" },
                  { value: "OUR", label: "À ma charge", desc: "+25€" },
                  { value: "BEN", label: "Bénéficiaire", desc: "Déduit" }
                ].map(option => (
                  <motion.div key={option.value} whileTap={{ scale: 0.98 }}>
                    <div 
                      className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                        transferData.fraisOption === option.value 
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30" 
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                      onClick={() => updateTransferData("fraisOption", option.value)}
                    >
                      <p className="font-semibold text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Total des frais</span>
              <span className="font-semibold">{formatCurrency(fees.total)}</span>
            </div>
            <Separator className="bg-slate-700 my-4" />
            <div className="flex items-center justify-between">
              <span className="text-lg">Montant total</span>
              <span className="text-3xl font-bold">{formatCurrency(amount + fees.total)}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const renderStep5 = () => {
    const fees = calculateFees();
    const amount = parseFloat(transferData.amount) || 0;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-4 shadow-lg shadow-pink-500/30"
          >
            <ShieldCheck className="w-7 h-7 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold">Vérification</h2>
          <p className="text-muted-foreground mt-1">Confirmez les détails du virement</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                {transferData.type === "sepa" 
                  ? <Euro className="w-5 h-5 text-white" />
                  : <Globe className="w-5 h-5 text-white" />
                }
              </div>
              <div>
                <p className="font-semibold">Virement {transferData.type?.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">
                  {transferData.urgency === "urgent" ? "Express" : "Standard"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <User className="w-3 h-3" /> BÉNÉFICIAIRE
              </p>
              <p className="font-semibold">{transferData.beneficiaryName || "-"}</p>
              <p className="text-sm text-muted-foreground">{transferData.beneficiaryCountry}</p>
              <div className="mt-3 pt-3 border-t border-dashed">
                <p className="font-mono text-sm">{transferData.iban || "-"}</p>
                <p className="font-mono text-xs text-muted-foreground">{transferData.bic}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> BANQUE
              </p>
              <p className="font-semibold">{transferData.bankName || "-"}</p>
              <p className="text-sm text-muted-foreground">{transferData.bankAddress}</p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-semibold">{formatCurrency(amount, transferData.currency)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Frais</span>
                <span className="font-semibold">{formatCurrency(fees.total)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total à débiter</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(amount + fees.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-200">Vérification importante</p>
              <p className="text-amber-700 dark:text-amber-300">
                Une fois initié, ce virement ne pourra plus être annulé.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStep6 = () => {
    const completedSteps = paymentSteps.filter(s => s.status === "completed").length;
    const totalPaymentSteps = paymentSteps.length;
    
    const currentPaymentIndex = paymentSteps.findIndex(s => s.status !== "completed");
    const currentPayment = currentPaymentIndex >= 0 ? paymentSteps[currentPaymentIndex] : null;
    const isCurrentProcessing = currentPayment?.status === "processing";

    const totalAmount = paymentSteps.reduce((sum, step) => sum + step.amount, 0);
    const paidAmount = paymentSteps
      .filter(s => s.status === "completed")
      .reduce((sum, step) => sum + step.amount, 0);

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 shadow-lg shadow-violet-500/30"
          >
            <Receipt className="w-7 h-7 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold">Paiement sécurisé</h2>
          <p className="text-muted-foreground mt-1">
            Étape {completedSteps + 1} sur {totalPaymentSteps}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{Math.round((completedSteps / totalPaymentSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps / totalPaymentSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Payé: {formatCurrency(paidAmount)}</span>
            <span>Restant: {formatCurrency(totalAmount - paidAmount)}</span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2">
          {paymentSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                step.status === "completed" 
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
                  : index === currentPaymentIndex
                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 ring-4 ring-purple-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              {step.status === "completed" ? <Check className="w-5 h-5" /> : index + 1}
            </motion.div>
          ))}
        </div>

        {/* Current payment card */}
        <AnimatePresence mode="wait">
          {currentPayment && (
            <motion.div
              key={currentPayment.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className={`border-2 overflow-hidden ${
                isCurrentProcessing 
                  ? "border-violet-400 dark:border-violet-600" 
                  : "border-violet-500 shadow-xl shadow-violet-500/20"
              }`}>
                {isCurrentProcessing && (
                  <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 animate-pulse" />
                )}
                <CardContent className="p-6">
                  <div className="text-center py-6">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 ${
                        isCurrentProcessing 
                          ? "bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50" 
                          : "bg-gradient-to-br from-violet-500 to-purple-600"
                      }`}
                      animate={isCurrentProcessing ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {isCurrentProcessing ? (
                        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                      ) : (
                        <CreditCard className="w-10 h-10 text-white" />
                      )}
                    </motion.div>
                    
                    <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0">
                      Paiement {currentPaymentIndex + 1}/{totalPaymentSteps}
                    </Badge>
                    
                    <h3 className="text-xl font-bold mb-2">{currentPayment.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{currentPayment.description}</p>
                    
                    <motion.div 
                      className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                    >
                      {formatCurrency(currentPayment.amount)}
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Montant de cette étape</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-muted-foreground">Référence</span>
                      <span className="font-mono font-medium">
                        PAY-{currentPayment.id.toUpperCase()}-{Date.now().toString(36).toUpperCase().slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-muted-foreground">Bénéficiaire</span>
                      <span className="font-medium">{transferData.beneficiaryName || "-"}</span>
                    </div>
                  </div>

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button 
                      className={`w-full h-14 text-lg rounded-xl font-semibold ${
                        isCurrentProcessing 
                          ? "bg-slate-200 dark:bg-slate-700" 
                          : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30"
                      }`}
                      onClick={() => processPaymentStep(currentPaymentIndex)}
                      disabled={isCurrentProcessing}
                      data-testid={`button-pay-step-${currentPaymentIndex}`}
                    >
                      {isCurrentProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-5 h-5 mr-2" />
                          Confirmer le paiement
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {!isCurrentProcessing && currentPaymentIndex < totalPaymentSteps - 1 && (
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      {totalPaymentSteps - currentPaymentIndex - 1} paiement(s) restant(s) après celui-ci
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed payments summary */}
        <AnimatePresence>
          {completedSteps > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">{completedSteps} paiement(s) effectué(s)</span>
                </div>
                <div className="space-y-2">
                  {paymentSteps
                    .filter(s => s.status === "completed")
                    .map(step => (
                      <div key={step.id} className="flex justify-between text-sm">
                        <span className="text-emerald-600 dark:text-emerald-400">{step.name}</span>
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(step.amount)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mb-6 shadow-2xl shadow-emerald-500/40"
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-3"
      >
        Virement effectué
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground mb-8 max-w-md mx-auto"
      >
        Votre virement de {formatCurrency(parseFloat(transferData.amount) || 0, transferData.currency)} vers {transferData.beneficiaryName} a été initié avec succès.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="max-w-sm mx-auto mb-8 border-0 shadow-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Référence</span>
              <span className="font-mono font-semibold">TRF-{Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date d'exécution</span>
              <span className="font-medium">
                {new Date(Date.now() + (transferData.type === "sepa" ? 86400000 : 172800000)).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Statut</span>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                En traitement
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-3"
      >
        <Button 
          variant="outline" 
          className="rounded-xl h-12 px-6"
          onClick={() => {
            setCurrentStep(1);
            setTransferData(initialTransferData);
            setPaymentSteps([]);
          }}
          data-testid="button-new-transfer"
        >
          Nouveau virement
        </Button>
        <Button 
          className="rounded-xl h-12 px-6 bg-gradient-to-r from-violet-600 to-purple-600"
          data-testid="button-view-history"
        >
          Voir l'historique
        </Button>
      </motion.div>
    </motion.div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return transferData.type !== null;
      case 2:
        return transferData.beneficiaryName && transferData.iban && transferData.bic;
      case 3:
        return transferData.bankName;
      case 4:
        return transferData.amount && parseFloat(transferData.amount) > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Modern header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Transfer Pro</h1>
                <p className="text-xs text-muted-foreground">SEPA & SWIFT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex gap-1.5 rounded-full px-3 py-1 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sécurisé
              </Badge>
              <Badge className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0">
                Demo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {currentStep <= 6 && currentStep !== 7 && renderStepIndicator()}

        <Card className="border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
              {currentStep === 7 && renderSuccess()}
            </AnimatePresence>

            {currentStep <= 5 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-between mt-10 pt-6 border-t border-dashed"
              >
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="rounded-xl h-12 px-6"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="rounded-xl h-12 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30 disabled:shadow-none"
                  data-testid="button-next"
                >
                  {currentStep === 5 ? "Procéder au paiement" : "Continuer"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            <span>PCI DSS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>3D Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
