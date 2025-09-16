import { container} from "hardwired"
import { AuthStore } from "../auth.store"

export const useAuth = () => {
  return container.use(AuthStore.providers)
}
