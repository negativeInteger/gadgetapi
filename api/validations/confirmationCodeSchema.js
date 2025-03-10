import { z } from "zod";

export const confirmationCodeSchema = z.object({
    code: z.string().length(6)
}).strict();