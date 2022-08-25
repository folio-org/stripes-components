/**
 * All of the properties in `T` must be present, or none of them.
 * Useful for JSX properties that rely on each other
 * @see https://stackoverflow.com/a/53074842/
 */
export type AllOrNone<ObjectType> =
  | ObjectType
  | { [K in keyof ObjectType]?: never };

/**
 * Create a type that requires exactly one of the given keys and disallows more. The remaining keys
 * are kept as is.
 * Use-cases:
 * - Creating interfaces for components that only need one of the keys to display properly (and
 *   both would silently ignore one).
 * - Declaring generic keys in a single place for a single use-case that gets narrowed down via
 *   `RequireExactlyOne`.
 * The caveat with `RequireExactlyOne` is that TypeScript doesn't always know at compile time every
 * key that will exist at runtime. Therefore `RequireExactlyOne` can't do anything to prevent extra
 * keys it doesn't know about.
 * @example
 * import type {RequireExactlyOne} from 'type-fest';
 * type Responder = {
 *  text: () => string;
 *  json: () => string;
 *  secure: boolean;
 * };
 * const responder: RequireExactlyOne<Responder, 'text' | 'json'> = {
 *  // Adding a `text` key here would cause a compile error.
 *  json: () => '{"message": "ok"}',
 *  secure: true
 * };
 * @see https://github.com/sindresorhus/type-fest/blob/main/source/require-exactly-one.d.ts
 */
export type RequireExactlyOne<
  ObjectType,
  KeysType extends keyof ObjectType = keyof ObjectType
> = {
  [Key in KeysType]: Required<Pick<ObjectType, Key>> &
    Partial<Record<Exclude<KeysType, Key>, never>>;
}[KeysType] &
  Omit<ObjectType, KeysType>;

/**
 * Creates a type that either accepts one of the properties, or none of them
 * (at most one).  This combines {@link AllOrNone} and {@link RequireExactlyOne}
 * The caveat with `RequireExactlyOne` is that TypeScript doesn't always know
 * at compile time every key that will exist at runtime. Therefore `RequireExactlyOne`
 * can't do anything to prevent extra keys it doesn't know about.
 */
export type RequireOneOrNone<
  ObjectType,
  KeysType extends keyof ObjectType = keyof ObjectType
> = Omit<ObjectType, KeysType> &
  AllOrNone<RequireExactlyOne<Pick<ObjectType, KeysType>, KeysType>>;

/**
 * Make key(s) optional from a given type `T`.  Useful if you want to extend an
 * existing interface but provide defaults (or some other case where a prop is
 * no longer required)
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Rename types in `T` based on the object `RenameMap`.
 * @example
 * type Foo = {
 *   a: number;
 *   b: string;
 *   c: SomethingElse;
 * }
 * type Bar = RenameByT<Foo, {
 *   a: "x";
 *   b: "y";
 *   notPresent: "baz";
 * }>;
 * // Bar: {
 * //   x: number;
 * //   y: string;
 * //   c: SomethingElse;
 * // }
 * @see https://stackoverflow.com/a/71912306/
 */
//
export type RenameByT<T, RenameMap> = {
  [K in keyof T as K extends keyof RenameMap
    ? RenameMap[K] extends string
      ? RenameMap[K]
      : never
    : K]: K extends keyof T ? T[K] : never;
};
