export function splitToChunks(array: any[], chunk: number) {
    var result = array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunk);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)

        return resultArray;
    }, []);

    return result;
}