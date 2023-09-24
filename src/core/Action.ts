import chunk from 'lodash/chunk';
import uniqBy from 'lodash/uniqBy';
import uniqWith from 'lodash/uniqWith';
import pick from 'lodash/pick';
import supabase from '../lib/supabase';

export const pickArrayOfObject = <T, K extends keyof T>(data: T[], keys: K[]) =>
    data.map((each) => pick(each, keys));

export type Keys<T> = (keyof T)[];

export type InsertAction<T, K> = {
    table: string;
    keys: Keys<K>;
    transform?: (data: T[]) => K[];
    uniqueKey?: keyof K | Keys<K>;
    onDone?: (data: K[]) => any;
    upsertOptions?: UpsertOptions;
}

export type UpsertOptions = {
    onConflict?: string;
    // returning?: 'minimal' | 'representation';
    count?: 'exact' | 'planned' | 'estimated';
    ignoreDuplicates?: boolean;
};

export const createAction = <T, K = T>(properties: InsertAction<T, K>) =>
    properties;

export const insertData = async <T>(
    data: T[],
    actions: InsertAction<T, any>[],
    transformUniqueKey?: keyof T,
) => {
    const defaultTransform = (data: T[]) => data as any[];

    for (const action of actions) {
        const {
            table,
            transform = defaultTransform,
            keys,
            uniqueKey,
            onDone,
            upsertOptions = {},
        } = action;

        const transformedData = transform(uniqBy(data, transformUniqueKey));
        let pickedData = pickArrayOfObject(transformedData, keys);

        if (Array.isArray(uniqueKey)) {
            pickedData = uniqWith(pickedData, (a, b) =>
                uniqueKey.every((key: string) => a[key] === b[key]),
            );
        } else if (uniqueKey) {
            pickedData = uniqBy(pickedData, uniqueKey);
        }

        if (!pickedData.length) continue;

        const chunkedData = chunk(pickedData, 3000);

        let chunkNumber = 1;
        const totalReturnedData = [];

        for (const chunk of chunkedData) {
            console.log(`INSERT ${table}: ${chunkNumber} (${chunk.length})`);

            const { data, error } = await supabase
                .from(table)
                .upsert(chunk, {
                    // returning: 'minimal',
                    ...upsertOptions,
                });

            if (error) {
                console.log(error);

                throw error;
            }

            totalReturnedData.push(data);

            chunkNumber++;
        }

        onDone?.(totalReturnedData.flat());
        console.log('INSERTED TABLE ' + table);
    }

    return true;
};
