declare module 'path-validation' {
    export function isAbsolutePath(path: string, separator: string): boolean;
    export function isAbsoluteLinuxPath(path: string): boolean;
    export function isAbsoluteWindowsPath(path: string): boolean;
}
