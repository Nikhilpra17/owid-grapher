import { JsonString } from "../domainTypes/Various.js"

export const ExplorersTableName = "explorers"
export interface DbInsertExplorer {
    config: JsonString
    createdAt?: Date | null
    isPublished: number
    slug: string
    updatedAt?: Date | null
}
export type DbPlainExplorer = Required<DbInsertExplorer>
// TODO: add enriched type and type config properly
