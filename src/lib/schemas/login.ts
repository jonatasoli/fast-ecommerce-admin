import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, 'Nome de usuário deve ter no mínimo 3 caracteres'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})