export type WaitlistInterest = "debate" | "watch";

export type WaitlistEntry = {
  email: string;
  username?: string;
  state?: string;
  interest: WaitlistInterest;
  economicScore: number;
  socialScore: number;
  governanceScore: number;
  archetype: string;
};

export type WaitlistResponse = {
  success: boolean;
  position?: number;
  id?: string;
  error?: string;
};

export type WaitlistProfile = {
  id: string;
  email: string;
  username: string | null;
  state: string | null;
  interest: string;
  economic_score: number;
  social_score: number;
  governance_score: number;
  archetype: string;
  created_at: string;
};
