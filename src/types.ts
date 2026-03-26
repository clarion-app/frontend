import { LaravelModelType } from "@clarion-app/types";

export interface MenuDataType {
    [key: string]: {
      name: string;
      entries: {
        [key: string]: string;
      };
      pinnedEntries?: string[];
    };
}

export interface UserType extends LaravelModelType{
  name: string;
  email: string;
  password?: string;
  c_password?: string;
  email_verified_at?: string;
}

export interface LoginAnswerType {
  token?: string;
  user?: UserType;
  message?: string;
}

/* 
{
  "componentRoutes": {
    "ComponentName": "route/to/component",
    "AnotherComponent": "route/to/another/component"
  },
  "packageName": "package-name"
}
*/
export interface ImportSpec {
  componentRoutes: {
    [key: string]: string;
  };
  packageName:  string;
}