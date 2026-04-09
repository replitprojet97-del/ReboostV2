import { Helmet } from "react-helmet-async";

interface UserLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  customHeader?: React.ReactNode;
  maxWidth?: string;
  children: React.ReactNode;
}

export function UserLayout({
  title,
  description,
  actions,
  secondaryActions,
  customHeader,
  maxWidth = "7xl",
  children,
}: UserLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title} - KreditPass</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      <div className="p-4 md:p-8 min-h-screen bg-background/50 backdrop-blur-3xl">
        <div className={`mx-auto max-w-${maxWidth} space-y-6 md:space-y-8 animate-fade-in`}>
          {customHeader ? (
            customHeader
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-1 md:mb-2" data-testid="text-page-title">
                  {title}
                </h1>
                {description && (
                  <p className="text-sm md:text-base text-muted-foreground font-medium" data-testid="text-page-description">
                    {description}
                  </p>
                )}
              </div>
              {(actions || secondaryActions) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {secondaryActions}
                  {actions}
                </div>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </>
  );
}
