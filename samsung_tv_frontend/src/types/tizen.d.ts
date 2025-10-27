declare global {
  interface Window {
    tizen?: {
      tvinputdevice?: {
        registerKey?: (keyName: string) => void;
      };
    };
  }
}

export {};
