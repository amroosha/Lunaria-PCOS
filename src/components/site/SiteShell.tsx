import type { ReactNode } from "react";

import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getCurrentUser } from "@/lib/auth";
import { getPublicChatConfig } from "@/lib/config";
import { getProviderStatus } from "@/lib/provider-status";

/**
 * Wraps content pages with the header, footer and the slide-over chat.
 * Only non-secret configuration is passed to the browser.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const config = getPublicChatConfig();
  const [status, current] = await Promise.all([
    getProviderStatus(),
    config.historyEnabled ? getCurrentUser() : Promise.resolve(null),
  ]);
  const user = current ? { email: current.email } : null;

  return (
    <ChatProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
      <ChatDrawer config={config} status={status} user={user} />
    </ChatProvider>
  );
}
