// function mergeReferences<TReferences>(
//     originalReferences: TReferences,
//     appendReferences: TReferences,
//     idKeys: { [key: string]: string }
// ): TReferences {
//     // ...
//     return originalReferences;
// }

// interface UserInfo {
//     uid: string;
//     name: string;
//     display_name: string;
// }

// interface TagInfo {
//     _id: string;
//     name: string;
//     color: string;
// }

// interface References {
//     users: UserInfo[];
//     tags: TagInfo[];
//     project?: { name: string };
// }

// const references: References = {
//     users: [],
//     tags: []
// };

// mergeReferences(references, references, { users: 'uid', departments: '_id' });
// mergeReferences(references, references, { users1: 'uid', departments: '_id' });

// // 抽取
// type ReferencesExtract<T> = { [Key in keyof T]: T[Key] extends Array<infer P> ? P : never };
// type ReferencesExtractNames<T> = { [Key in keyof T]: T[Key] extends Array<any> ? Key : never };
// type ReferencesExtractAllowNames<T> = { [Key in ReferencesExtractNames<T>[keyof T]]: ReferencesExtractNames<T>[Key] };
// type ReferencesExtractIdKeys<T> = {
//     [Key in keyof ReferencesExtractAllowNames<T>]?: keyof ReferencesExtract<T>[Key];
// };

// type R01 = ReferencesExtract<References>;
// type R02 = ReferencesExtractNames<References>;
// type R03 = ReferencesExtractAllowNames<References>;
// type R04 = ReferencesExtractIdKeys<References>;

// function mergeReferencesNext<TReferences>(
//     originalReferences: TReferences,
//     appendReferences: TReferences,
//     idKeys: ReferencesExtractIdKeys<TReferences>
// ): TReferences {
//     // ...
//     return originalReferences;
// }

// mergeReferencesNext(references, references, { users: 'uid', tags: "_id" });
