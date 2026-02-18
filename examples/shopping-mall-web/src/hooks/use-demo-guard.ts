import { useAuthStore } from "@/stores/auth-store";
import { DEMO_EMAIL } from "@/lib/constants";

export function useDemoGuard() {
  const user = useAuthStore((s) => s.user);
  const isDemoAccount = user?.email === DEMO_EMAIL;
  return { isDemoAccount };
}
