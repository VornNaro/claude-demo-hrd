import { useEffect, useState } from "react";

/**
 * True only after the component has mounted on the client. Use it to gate any
 * UI that depends on persisted (localStorage) state, so the server-rendered
 * HTML — which can't see localStorage — matches the first client render and we
 * avoid hydration mismatches.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
