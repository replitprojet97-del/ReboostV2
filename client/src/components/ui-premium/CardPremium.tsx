import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
};

export default function CardPremium({ children, className="", hoverable = false }: Props) {
  return (
    <div className={`bg-card dark:bg-card rounded-2xl shadow-sm dark:shadow-md p-6 border border-card-border transition-all duration-200 ${hoverable ? 'hover:shadow-md hover:border-border/60 dark:hover:border-border/80' : ''} ${className}`}>
      {children}
    </div>
  );
}
