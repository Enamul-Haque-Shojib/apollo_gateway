
import { AuthUser } from "./auth/verifyToken";


export type DataSourceContext = {
  user?: AuthUser | null;
};