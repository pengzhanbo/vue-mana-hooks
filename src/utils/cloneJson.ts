export const cloneJson = <T>(json: T): T => JSON.parse(JSON.stringify(json))
