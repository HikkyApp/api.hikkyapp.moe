import path from 'path';
import fs from 'fs';

export const handlePath = (
  filePath: string,
  baseUrl: string = path.resolve(process.cwd(), './build/src'),
) => path.join(baseUrl, filePath);


export const readfile = (filePath: string, basePath?: string) => {
  const fileDir = handlePath(filePath, basePath);

  if (!fs.existsSync(fileDir)) return null;

  return fs.readFileSync(fileDir, { encoding: 'utf-8' });
}
export const writeFile = (
  filePath: string,
  data: string,
  basePath?: string,
) => {
  // Remove leading directory markers, and remove ending /file-name.extension
  const pathname = filePath.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, '');

  const pathDir = handlePath(pathname, basePath);

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, { recursive: true });
  }

  const fileDir = handlePath(filePath, basePath);

  fs.writeFileSync(fileDir, data, { flag: 'w' });
};

export const isHTML = (str: string | any) => {
  return /<[a-z][\s\S]*>/i.test(str);
};

// check if the url is valid
export const isValidUrl = (text: string) => {
  let url: URL;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const isVietnamese = (text: string) => {
  const REGEX =
    /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ/g;

  return REGEX.test(text.toLowerCase());
};

export const fulfilledPromises = <T extends Promise<any>>(promises: T[]) =>
  Promise.allSettled(promises).then((results) =>
    results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Awaited<T>>).value),
  );

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));