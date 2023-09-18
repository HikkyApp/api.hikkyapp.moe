import AnimeVietsubScraper from '../src/sources/anime/avs';
jest.setTimeout(120000);

test('handlePath', async () => {
  // const filePath = 'test/testfnc.spec.ts';
  // const baseUrl = 'C:/Users/username/Documents/Projects/ProjectName/build/src';
  // const result = handlePath(filePath, baseUrl);

  const result = new AnimeVietsubScraper();

  console.log(result);

  // expect(result).toBe('C:/Users/username/Documents/Projects/ProjectName/build/src/test/testfnc.spec.ts');
});
