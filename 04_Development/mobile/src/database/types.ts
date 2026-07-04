export type DatabaseRecord = {
  key: string;
  value: string;
};

export type DatabaseAdapter = {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  getAllKeys: () => string[];
};
