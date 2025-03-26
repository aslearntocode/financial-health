interface ParsedPdfData {
  sections?: {
    equities?: Array<{
      [key: string]: any;  // or define specific properties if known
    }>;
    mutualFunds?: Array<{
      [key: string]: any;  // or define specific properties if known
    }>;
  }
}