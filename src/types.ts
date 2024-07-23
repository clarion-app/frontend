import { LaravelModelType } from "@clarion-app/types";

export interface MenuDataType {
    [key: string]: {
      name: string;
      entries: {
        [key: string]: string;
      };
    };
}

export interface UserType extends LaravelModelType{
  name: string;
  email: string;
  password?: string;
  c_password?: string;
}