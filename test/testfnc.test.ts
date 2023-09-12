// import { handlePath } from '../src/utils/index';
import path from 'path';

jest.setTimeout(120000);

test('handlePath', async () => {

    // const filePath = 'test/testfnc.spec.ts';
    // const baseUrl = 'C:/Users/username/Documents/Projects/ProjectName/build/src';
    // const result = handlePath(filePath, baseUrl);

    console.log(`test`, path.resolve(process.cwd(), './build/src'));

    // expect(result).toBe('C:/Users/username/Documents/Projects/ProjectName/build/src/test/testfnc.spec.ts');

})