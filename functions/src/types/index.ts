import { z } from "zod";

export const AuthSchema = z.object({
  provider: z.union([z.literal("google"), z.literal("apple")]), // Ensuring specific provider values
  email: z.string().email(),
  createdAt: z.date(),
});
export type Auth = z.infer<typeof AuthSchema>;

export const ProfileSchema = z.object({
  name: z.string(),
  gender: z.union([z.literal("Male"), z.literal("Female")]),
  location: z.string(),
  kundali_birth_details_ref: z.string(), // Reference to Kundali birth details
});
export type Profile = z.infer<typeof ProfileSchema>;

export const UserSchema = z.object({
  userId: z.string(),
  auth: AuthSchema,
  profile: ProfileSchema,
});
export type User = z.infer<typeof UserSchema>;

export const BirthDetailsSchema = z.object({
  date: z.number(),
  month: z.number(),
  year: z.number(),
  hour: z.number(),
  minute: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  place_of_birth: z.string(),
  timezone: z.string(),
});
export type BirthDetails = z.infer<typeof BirthDetailsSchema>;

export const KundaliSchema = z.object({
  birth_details: BirthDetailsSchema,
  kundali_summary: z.string(),
  life_details: z.object({
    personality: z.string(),
    relationships: z.string(),
    career_and_money: z.string(),
    health: z.string(),
  }),
  kundali_chart: z.object({
    north_chart_svg: z.string().url(),
    south_chart_svg: z.string().url(),
  }),
});
export type Kundali = z.infer<typeof KundaliSchema>;

export const DashboardEntrySchema = z.object({
  daily_quote: z.string(),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  suggestions: z.array(z.string()),
  transition: z.string(),
  mood_of_the_day: z.string(),
  auspicious_time: z.string(),
});
export type DashboardEntry = z.infer<typeof DashboardEntrySchema>;

export const JournalEntrySchema = z.object({
  createdAt: z.date(),
  content: z.string(),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const JournalMemorySchema = z.object({
  memories: z.record(z.string()), // memory_1, memory_2, etc.
});
export type JournalMemory = z.infer<typeof JournalMemorySchema>;

export const CompatibilitySchema = z.object({
  received_points: z.number(),
  manglik: z.object({
    status: z.boolean(),
    male_percentage: z.number(),
    female_percentage: z.number(),
  }),
  rajju_dosha: z.object({
    status: z.boolean(),
  }),
  vedha_dosha: z.object({
    status: z.boolean(),
  }),
  match_report: z.string(),
});

export const SocialProfileSchema = z.object({
  profileId: z.string(),
  name: z.string(),
  kundali_ref: z.string(), // Reference to Kundali
  compatibility: CompatibilitySchema.optional(), // Optional to allow for different profile types
});

export type SocialProfile = z.infer<typeof SocialProfileSchema>;
export type Compatibility = z.infer<typeof CompatibilitySchema>;

export const ChatMessageSchema = z.object({
  sender: z.union([z.literal("user"), z.literal("ai")]),
  text: z.string(),
  createdAt: z.date(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ============== Below is the Kundali Doc In Depth (Not Needed but good for Reference)

export const KundaliSummarySchema = z.object({
  full_name: z.string(),
  date_of_birth: z.date(),
  time_of_birth: z.date(),
  place_of_birth: z.string(),
  timezone: z.string(),
  chart_type: z.union([z.literal("North Indian"), z.literal("South Indian")]),
  lagna: z.string(),
  rashi: z.string(),
  nakshatra: z.string(),
  planetary_positions: z.array(
    z.object({
      planet: z.string(),
      zodiac_sign: z.string(),
      house_number: z.number(),
      status: z.string(),
    }),
  ),
  vimshottari_dasha: z.object({
    current_mahadasha: z.object({
      planet: z.string(),
      start_date: z.date(),
      end_date: z.date(),
    }),
    current_antardasha: z.object({
      planet: z.string(),
      start_date: z.date(),
      end_date: z.date(),
    }),
  }),
  yogas: z.array(z.string()),
  doshas: z.object({
    manglik_dosha: z.boolean(),
    kaal_sarp_dosha: z.boolean(),
  }),
  transits: z.array(
    z.object({
      planet: z.string(),
      current_sign: z.string(),
      house_number: z.number(),
      effect: z.string(),
    }),
  ),
  key_insights: z.object({
    career_and_money: z.string(),
    relationships_and_marriage: z.string(),
    health_and_wellbeing: z.string(),
    spiritual_growth: z.string(),
  }),
});
export type KundaliSummary = z.infer<typeof KundaliSummarySchema>;
