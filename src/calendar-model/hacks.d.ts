// Avoid an error from hebcal's type declarations, which import this type in csv.d.ts.
// We never use that file, but TypeScript still sees it.
declare module 'node:fs' {
  export type WriteStream = never
}
