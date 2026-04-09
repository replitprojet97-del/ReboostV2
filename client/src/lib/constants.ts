import { Users, TrendingUp, Award, Globe } from "lucide-react";

export const getOfficialStats = (t: any) => [
  { 
    icon: Users, 
    label: t.officialStats.clients, 
    value: "2,500+", 
    color: "from-blue-500 to-indigo-600",
    key: "clients"
  },
  { 
    icon: TrendingUp, 
    label: t.officialStats.funded, 
    value: "€250M+", 
    color: "from-indigo-500 to-purple-600",
    key: "amount"
  },
  { 
    icon: Award, 
    label: t.officialStats.satisfaction, 
    value: "98%", 
    color: "from-purple-500 to-pink-600",
    key: "satisfaction"
  },
  { 
    icon: Globe, 
    label: t.officialStats.countries, 
    value: "12+", 
    color: "from-pink-500 to-rose-600",
    key: "countries"
  }
] as const;
