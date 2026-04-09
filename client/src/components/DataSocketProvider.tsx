import { useDataSocket } from "@/hooks/useDataSocket";
import { useUser } from "@/hooks/use-user";

export function DataSocketProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  
  if (user) {
    return <DataSocketHandler>{children}</DataSocketHandler>;
  }
  
  return <>{children}</>;
}

function DataSocketHandler({ children }: { children: React.ReactNode }) {
  useDataSocket();
  return <>{children}</>;
}
