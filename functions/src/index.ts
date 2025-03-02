import * as admin from "firebase-admin";

admin.initializeApp();

import { getChatResponse } from "./functions/chat";
import { updateDashboard } from "./functions/dashboard";
import { updateMemories } from "./functions/journal";
import { generateKundali } from "./functions/kundali";
import { addSocialProfile } from "./functions/social";

export {
  addSocialProfile,
  generateKundali,
  getChatResponse,
  updateDashboard,
  updateMemories,
};
