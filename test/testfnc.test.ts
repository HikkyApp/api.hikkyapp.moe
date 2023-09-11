import { handlePath } from '../src/utils/index';

test('handlePath', () => {

    const filePath = 'test/testfnc.spec.ts';
    const baseUrl = 'C:/Users/username/Documents/Projects/ProjectName/build/src';
    const result = handlePath(filePath, baseUrl);

    console.log(result);

})