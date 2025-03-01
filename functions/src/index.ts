import * as admin from "firebase-admin";

admin.initializeApp();

import { updateDashboard } from "./functions/dashboard";
import { generateKundali } from "./functions/kundali";
import { addSocialProfile } from "./functions/social";
import { updateMemories } from "./functions/journal";
import { getChatResponse } from "./functions/chat";


export { generateKundali, addSocialProfile, updateMemories, getChatResponse, updateDashboard };
