import path from "path"

export const handlePath = (
    filePath: string,
    baseUrl: string = path.resolve(process.cwd(), './build/src')
) => path.join(baseUrl, filePath)

export const writeFile = {

}