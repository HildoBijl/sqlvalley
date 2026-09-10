export type DatasetSize = 'full' | 'small' // Available dataset sizes.
export type SqlCell = string | number | null | boolean // SQL cell value types.
export type AttributeType = 'string' | 'number' | 'boolean' | 'date' // Attribute type definitions for automatic row building.
export type Attributes = Record<string, AttributeType> // Map of column names to their attribute types.

// Table definition with full and small row sets.
export interface TableDefinition {
	name: string // Table name in the database.
	attributes: Attributes // Attribute definitions for each column (useful for ER diagrams, etc.).
	createStatement: string // CREATE TABLE statement.
	rows: { // Row data for different dataset sizes.
		full: SqlCell[][]
		small: SqlCell[][]
	}
}
