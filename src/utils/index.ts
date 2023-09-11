import path from "path"
import fs from 'fs';

export const handlePath = (
    filePath: string,
    baseUrl: string = path.resolve(process.cwd(), './build/src')
) => path.join(baseUrl, filePath)


export const writeFile = (
    filePath: string,
    data: string,
    basePath?: string,
) => {
    const pathname = filePath.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension

    const pathDir = handlePath(pathname, basePath);

    if (!fs.existsSync(pathDir)) {
        fs.mkdirSync(pathDir, { recursive: true });
    }

    const fileDir = handlePath(filePath, basePath);

    fs.writeFileSync(fileDir, data, { flag: 'w' });
};