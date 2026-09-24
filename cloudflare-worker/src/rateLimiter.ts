interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * Bezplatný a rychlý in-memory rate limiter pro Cloudflare Worker.
 * Běží přímo v paměti worker instance bez potřeby placených databází.
 */
export class InMemoryRateLimiter {
  private ipRequests = new Map<string, RateLimitRecord>();
  private globalRequests: RateLimitRecord = { count: 0, resetTime: 0 };

  private maxPerIpPerMinute: number;
  private maxGlobalPerMinute: number;

  constructor(maxPerIpPerMinute = 5, maxGlobalPerMinute = 12) {
    this.maxPerIpPerMinute = maxPerIpPerMinute;
    this.maxGlobalPerMinute = maxGlobalPerMinute;
  }

  public check(ip: string): { allowed: boolean; reason?: string } {
    const now = Date.now();

    // 1. Kontrola globálního limitu (chrání před překročením limitu Gemini Free Tier 15 RPM)
    if (now > this.globalRequests.resetTime) {
      this.globalRequests = { count: 1, resetTime: now + 60_000 };
    } else {
      this.globalRequests.count++;
      if (this.globalRequests.count > this.maxGlobalPerMinute) {
        return {
          allowed: false,
          reason: "Chatbot je momentálně vytížen. Počkejte prosím chvíli a zkuste to znovu.",
        };
      }
    }

    // 2. Kontrola limitu na konkrétní IP adresu (ochrana proti spamu a skriptům)
    const record = this.ipRequests.get(ip);
    if (!record || now > record.resetTime) {
      this.ipRequests.set(ip, { count: 1, resetTime: now + 60_000 });

      // Pravidelné promazání starých záznamů pro prevenci zaplnění paměti
      if (this.ipRequests.size > 500) {
        for (const [key, val] of this.ipRequests.entries()) {
          if (now > val.resetTime) this.ipRequests.delete(key);
        }
      }

      return { allowed: true };
    }

    record.count++;
    if (record.count > this.maxPerIpPerMinute) {
      return {
        allowed: false,
        reason: "Příliš mnoho dotazů z vaší adresy. Počkejte prosím minutu a zkuste to znovu.",
      };
    }

    return { allowed: true };
  }
}
