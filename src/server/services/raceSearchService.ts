import { env } from "~/env";

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  isRaceSite: boolean; // True if from a known race registration site
}

export interface ParsedRaceDetails {
  name: string;
  date: Date | null;
  location: string | null;
  city: string | null;
  state: string | null;
  distance: string | null;
  description: string | null;
  websiteUrl: string;
  imageUrl: string | null;
  registrationLink: string | null;
  type: string | null;
}

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[];
  };
}

// Known race registration and event listing sites
const RACE_SITE_DOMAINS = [
  "runsignup.com",
  "active.com",
  "ultrasignup.com",
  "athlinks.com",
  "runningintheusa.com",
  "ultrarunning.com",
  "marathonguide.com",
  "raceentry.com",
  "itsyourrace.com",
  "raceroster.com",
  "endurancecui.active.com",
];

// Sites to exclude from results (forums, social media, etc.)
const EXCLUDED_DOMAINS = [
  "reddit.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "youtube.com",
  "tiktok.com",
  "pinterest.com",
  "quora.com",
  "stackoverflow.com",
  "medium.com",
  "wordpress.com",
  "blogspot.com",
  "tumblr.com",
  "linkedin.com",
];

export class RaceSearchService {
  private readonly API_KEY = env.BRAVE_SEARCH_API_KEY;
  private readonly BASE_URL = "https://api.search.brave.com/res/v1/web/search";

  async searchRaces(query: string): Promise<WebSearchResult[]> {
    if (!this.API_KEY) {
      throw new Error("Brave Search API key not configured");
    }

    // Enhance query for race-specific results
    const enhancedQuery = `${query} running race Georgia`;

    const url = new URL(this.BASE_URL);
    url.searchParams.set("q", enhancedQuery);
    url.searchParams.set("count", "20");
    url.searchParams.set("safesearch", "moderate");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": this.API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Search rate limit exceeded. Please try again later.");
      }
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = (await response.json()) as BraveSearchResponse;
    const results = data.web?.results ?? [];

    // Filter and transform results
    return this.filterAndTransformResults(results);
  }

  private filterAndTransformResults(
    results: BraveSearchResult[]
  ): WebSearchResult[] {
    return results
      .filter((result) => {
        const url = result.url.toLowerCase();

        // Exclude social media, forums, and blog sites
        const isExcluded = EXCLUDED_DOMAINS.some((domain) =>
          url.includes(domain)
        );
        if (isExcluded) return false;

        // Check if it's a known race site
        const isRaceSite = RACE_SITE_DOMAINS.some((domain) =>
          url.includes(domain)
        );

        // Also include results that mention race-related keywords
        const text = `${result.title} ${result.description}`.toLowerCase();
        const hasRaceKeywords =
          text.includes("race") ||
          text.includes("run") ||
          text.includes("marathon") ||
          text.includes("5k") ||
          text.includes("10k") ||
          text.includes("50k") ||
          text.includes("100k") ||
          text.includes("ultra") ||
          text.includes("trail") ||
          text.includes("endurance") ||
          text.includes("registration");

        return isRaceSite || hasRaceKeywords;
      })
      .map((result) => {
        const url = result.url.toLowerCase();
        const isRaceSite = RACE_SITE_DOMAINS.some((domain) =>
          url.includes(domain)
        );

        return {
          title: this.cleanText(result.title),
          url: result.url,
          snippet: this.cleanText(result.description),
          source: this.extractDomain(result.url),
          isRaceSite,
        };
      })
      // Sort race sites first
      .sort((a, b) => (b.isRaceSite ? 1 : 0) - (a.isRaceSite ? 1 : 0))
      .slice(0, 10); // Limit to top 10 results
  }

  private extractDomain(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return url;
    }
  }

  async fetchRaceDetails(url: string): Promise<ParsedRaceDetails> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; NorthGeorgiaRunning/1.0; +https://northgeorgiarunning.com)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.statusText}`);
      }

      const html = await response.text();
      return this.parseRaceDetails(html, url);
    } catch (error) {
      // Return minimal details if parsing fails
      return {
        name: "",
        date: null,
        location: null,
        city: null,
        state: null,
        distance: null,
        description: null,
        websiteUrl: url,
        imageUrl: null,
        registrationLink: url,
        type: null,
      };
    }
  }

  private parseRaceDetails(html: string, url: string): ParsedRaceDetails {
    const details: ParsedRaceDetails = {
      name: this.extractTitle(html),
      date: this.extractDate(html),
      location: null,
      city: this.extractCity(html),
      state: this.extractState(html),
      distance: this.extractDistance(html),
      description: this.extractDescription(html),
      websiteUrl: url,
      imageUrl: this.extractImage(html, url),
      registrationLink: url,
      type: this.extractEventType(html),
    };

    // Build location from city and state
    if (details.city && details.state) {
      details.location = `${details.city}, ${details.state}`;
    } else if (details.city) {
      details.location = details.city;
    }

    return details;
  }

  private extractTitle(html: string): string {
    // Try og:title first
    const ogMatch = /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/.exec(
      html
    );
    if (ogMatch?.[1]) return this.decodeHtml(ogMatch[1]);

    // Try regular title tag
    const titleMatch = /<title>([^<]*)<\/title>/i.exec(html);
    if (titleMatch?.[1]) {
      // Clean up common suffixes
      return this.decodeHtml(titleMatch[1])
        .replace(/\s*[-|]\s*RunSignUp.*$/i, "")
        .replace(/\s*[-|]\s*Active\.com.*$/i, "")
        .replace(/\s*[-|]\s*Registration.*$/i, "")
        .trim();
    }

    return "";
  }

  private extractDate(html: string): Date | null {
    // Common date patterns
    const datePatterns = [
      // ISO format
      /(\d{4}-\d{2}-\d{2})/,
      // Month Day, Year
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i,
      // MM/DD/YYYY
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      // Schema.org startDate
      /"startDate"\s*:\s*"([^"]+)"/,
    ];

    for (const pattern of datePatterns) {
      const match = pattern.exec(html);
      if (match?.[1]) {
        const parsed = new Date(match[1]);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    return null;
  }

  private extractCity(html: string): string | null {
    // Try Schema.org address
    const schemaMatch =
      /"addressLocality"\s*:\s*"([^"]+)"/.exec(html) ??
      /"city"\s*:\s*"([^"]+)"/.exec(html);
    if (schemaMatch?.[1]) return this.decodeHtml(schemaMatch[1]);

    // Look for Georgia cities in content
    const georgiaLocations = [
      "Atlanta",
      "Marietta",
      "Alpharetta",
      "Roswell",
      "Kennesaw",
      "Duluth",
      "Johns Creek",
      "Lawrenceville",
      "Athens",
      "Gainesville",
      "Dahlonega",
      "Blue Ridge",
      "Helen",
      "Cumming",
      "Canton",
      "Woodstock",
      "Decatur",
      "Sandy Springs",
      "Brookhaven",
      "Dunwoody",
      // Additional cities from ultrarunning.com calendar
      "Griffin",
      "Winder",
      "Brooklet",
      "Cleveland",
      "Thomaston",
      "Ellijay",
      "Chickamauga",
      "Rocky Face",
      "Lithia Springs",
      "Sylvania",
      "Blairsville",
      "Jackson",
      "Louisville",
      "Chatsworth",
      "Savannah",
      "Suwanee",
      "Pine Mountain",
      "Dalton",
      "Dacula",
      "Dillard",
      "Ringgold",
      "Rising Fawn",
      "Columbus",
    ];

    for (const city of georgiaLocations) {
      if (html.includes(city)) {
        return city;
      }
    }

    return null;
  }

  private extractState(html: string): string | null {
    // Try Schema.org address
    const schemaMatch =
      /"addressRegion"\s*:\s*"([^"]+)"/.exec(html) ??
      /"state"\s*:\s*"([^"]+)"/.exec(html);
    if (schemaMatch?.[1]) return schemaMatch[1];

    // Check for Georgia mentions
    if (/\bGeorgia\b/i.test(html) || /\bGA\b/.test(html)) {
      return "GA";
    }

    return null;
  }

  private extractDistance(html: string): string | null {
    const distancePatterns = [
      /\b(5K|10K|15K|25K|50K|100K)\b/i,
      /\b(\d+(?:\.\d+)?)\s*(mile|miles|mi)\b/i,
      /\b(half\s*marathon)\b/i,
      /\b(marathon)\b/i,
      /\b(ultra)\b/i,
    ];

    const distances: string[] = [];
    for (const pattern of distancePatterns) {
      const match = pattern.exec(html);
      if (match?.[0]) {
        distances.push(match[0].trim());
      }
    }

    if (distances.length > 0) {
      return distances.slice(0, 3).join(", ");
    }

    return null;
  }

  private extractDescription(html: string): string | null {
    // Try og:description
    const ogMatch = /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/.exec(html);
    if (ogMatch?.[1]) return this.decodeHtml(ogMatch[1]).slice(0, 500);

    // Try meta description
    const metaMatch = /<meta[^>]*name="description"[^>]*content="([^"]*)"/.exec(html);
    if (metaMatch?.[1]) return this.decodeHtml(metaMatch[1]).slice(0, 500);

    return null;
  }

  private extractImage(html: string, baseUrl: string): string | null {
    // Try og:image
    const ogMatch = /<meta[^>]*property="og:image"[^>]*content="([^"]*)"/.exec(html);
    if (ogMatch?.[1]) {
      const imgUrl = ogMatch[1];
      // Make relative URLs absolute
      if (imgUrl.startsWith("/")) {
        try {
          const base = new URL(baseUrl);
          return `${base.origin}${imgUrl}`;
        } catch {
          return imgUrl;
        }
      }
      return imgUrl;
    }

    return null;
  }

  private extractEventType(html: string): string | null {
    const htmlLower = html.toLowerCase();

    if (htmlLower.includes("trail")) return "Trail Run";
    if (htmlLower.includes("ultra")) return "Ultra Marathon";
    if (htmlLower.includes("marathon") && !htmlLower.includes("half"))
      return "Marathon";
    if (htmlLower.includes("half marathon") || htmlLower.includes("half-marathon"))
      return "Half Marathon";
    if (/\b10k\b/.test(htmlLower)) return "10K";
    if (/\b5k\b/.test(htmlLower)) return "5K";
    if (htmlLower.includes("virtual")) return "Virtual";

    return "Running Event";
  }

  private decodeHtml(html: string): string {
    return html
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  }

  // Clean text by removing HTML tags and decoding entities
  private cleanText(text: string): string {
    return text
      // Remove HTML tags like <strong>, <em>, <b>, etc.
      .replace(/<[^>]*>/g, "")
      // Decode HTML entities
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
      // Clean up multiple spaces
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Wait for specified milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Discover events from a specific domain/source for automated imports
   * Searches for races and fetches details with rate limiting
   */
  async discoverEventsFromSource(
    sourceDomain: string,
    searchTerms: string[]
  ): Promise<ParsedRaceDetails[]> {
    const allEvents: ParsedRaceDetails[] = [];

    for (const term of searchTerms) {
      try {
        // Search for races on this source
        const query = `${term} site:${sourceDomain}`;
        const results = await this.searchRaces(query);

        // Fetch details for top results
        for (const result of results.slice(0, 5)) {
          try {
            const details = await this.fetchRaceDetails(result.url);
            // Only include if we have at least a date and city
            if (details.date && details.city) {
              allEvents.push(details);
            }
            // Rate limiting - respect API limits
            await this.delay(2000);
          } catch (error) {
            console.warn(
              `Failed to fetch details for ${result.url}:`,
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        }
      } catch (error) {
        console.warn(
          `Failed to search for "${term}" on ${sourceDomain}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      // Rate limiting between search terms
      await this.delay(1000);
    }

    return allEvents;
  }

  /**
   * Get default Georgia-focused search terms for automated discovery
   */
  static getGeorgiaSearchTerms(): string[] {
    return [
      "North Georgia trail race",
      "Atlanta area 5K 10K",
      "Georgia ultra marathon",
      "North Georgia half marathon",
      "Atlanta weekend races",
    ];
  }
}
