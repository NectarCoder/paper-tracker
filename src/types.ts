export type PublicationType = 'Conference' | 'Journal';
export type ConferenceRanking = 'A*' | 'A' | 'B' | 'C' | 'National' | 'Regional' | 'Unranked';

export interface Paper {
  id: string; // Internal UUID
  title: string;
  doi: string; // The core identifier for linking
  link: string; // Link to ACM/IEEE etc.
  year: number;
  type: PublicationType;
  
  // Conditional fields based on type
  ranking?: ConferenceRanking; // If Conference
  reputation?: string; // If Journal
  
  abstract: string;
  
  // Optional fields
  authors?: string;
  tags?: string[];
  notes?: string;
}

export interface PaperLink {
  id: string;
  source: string; // Source DOI
  target: string; // Target DOI
}

export interface Collection {
  id: string;
  name: string;
  papers: Paper[];
  links: PaperLink[];
}

export interface WorkspaceData {
  version: string;
  name: string;
  collections: Collection[];
}
