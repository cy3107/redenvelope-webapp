declare module 'minimatch' {
  type MinimatchOptions = Record<string, unknown>;

  interface MinimatchInstance {
    pattern: string;
    options: MinimatchOptions;
    match(path: string, partial?: boolean): boolean;
  }

  interface MinimatchExport {
    (path: string, pattern: string, options?: MinimatchOptions): boolean;
    filter(pattern: string, options?: MinimatchOptions): (path: string) => boolean;
    match(paths: string[], pattern: string, options?: MinimatchOptions): string[];
    Minimatch: {
      new (pattern: string, options?: MinimatchOptions): MinimatchInstance;
    };
  }

  const minimatch: MinimatchExport;
  export = minimatch;
}
