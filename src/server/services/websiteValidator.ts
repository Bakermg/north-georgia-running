/**
 * Validates that a website URL is accessible and appears to be a legitimate race event
 */

const RACE_KEYWORDS = [
  "race",
  "marathon",
  "running",
  "5k",
  "10k",
  "half marathon",
  "10-k",
  "5-k",
  "run",
  "runner",
  "event",
  "trail run",
  "ultra",
  "triathlon",
  "fun run",
  "road race",
  "cross country",
  "track",
  "registration",
  "register now",
  "sign up",
  "distance",
  "kilometer",
  "mile",
  "finish",
  "start time",
  "course",
  "runner bib",
];

export async function validateRaceWebsite(websiteUrl: string): Promise<{
  isValid: boolean;
  warning?: string;
}> {
  try {
    // Add timeout of 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(websiteUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RaceValidator/1.0)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if status is 200-299
    if (!response.ok) {
      return {
        isValid: false,
        warning: `Website returned status ${response.status}. Please verify the URL is correct.`,
      };
    }

    // Try to get the content and check for race-related keywords
    const text = await response.text();

    // Convert to lowercase for case-insensitive search
    const lowerText = text.toLowerCase();

    // Check if any race keywords are present
    const hasRaceKeywords = RACE_KEYWORDS.some((keyword) =>
      lowerText.includes(keyword)
    );

    if (!hasRaceKeywords) {
      return {
        isValid: false,
        warning:
          "The website does not appear to contain race/running event information. Please verify this is the correct website.",
      };
    }

    return {
      isValid: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Network errors, timeouts, etc.
    if (errorMessage.includes("AbortError") || errorMessage.includes("timeout")) {
      return {
        isValid: false,
        warning:
          "Website took too long to respond. Please verify the URL is correct and try again.",
      };
    }

    if (
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("ENOTFOUND")
    ) {
      return {
        isValid: false,
        warning:
          "Could not reach the website. Please verify the URL is correct.",
      };
    }

    // For other errors, be lenient and allow the submission
    return {
      isValid: false,
      warning:
        "Could not verify website, but your submission was accepted. Our team will review it.",
    };
  }
}
