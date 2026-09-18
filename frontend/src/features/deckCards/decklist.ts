export interface ParsedLine {
    raw: string
    quantity: number
    name: string
    set?: string
    collectorNumber?: string
}

export function parseDecklist(text: string): ParsedLine[] {
    const result: ParsedLine[] = []

    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    

    for (const raw of lines) {
        const match = raw.match(
            /^(?:(\d+)\s+)?(.+?)(?:\s+\(([A-Za-z0-9]+)\)\s+(\S+))?$/
        )

        if (!match) {
            continue
        }


        const [, quantity, name, set, collectorNumber] = match

        result.push({
            raw,
            quantity: quantity ? Number(quantity) : 1,
            name: name.trim(),
            set: set?.toLowerCase(),
            collectorNumber,
        })
    }

    return result
}
