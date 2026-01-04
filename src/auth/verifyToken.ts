import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}



export function verifyToken(token: string): AuthUser {
    
 return jwt.verify(token, config.jwt_secret as string) as AuthUser;
 
 
}
