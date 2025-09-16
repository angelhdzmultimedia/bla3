import type { KebabCase, Replace } from "type-fest"
import type { AuthController } from "../server/auth.controller"

export const useAuthApi = useApi<`/api/auth/${
 KebabCase<Replace<keyof typeof AuthController['prototype'], 'get', ''>>
}`>

