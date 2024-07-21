export interface MenuDataType {
    [key: string]: {
      name: string;
      entries: {
        [key: string]: string;
      };
    };
}
