import { splitToChunks } from "./splitToChunks";

export function getPaginatedData(data: any[], limit: number, page: number) {
    return {
        items: splitToChunks(data, limit)?.[page - 1] ?? [],
        pages: Math.ceil(data.length / limit),
        rowsCount: data.length
    }
}