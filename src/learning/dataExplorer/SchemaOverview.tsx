import { Box, Typography, Grid, Card, CardContent, Chip, Divider, Paper } from '@mui/material'

import type { TableInfo } from './useTableSchema'

export function SchemaOverview({ tableInfo }: { tableInfo: TableInfo[] }) {
	return <Box>
		<Typography variant="h6" gutterBottom>
			Schema overview
		</Typography>

		<Grid container spacing={3}>
			{tableInfo.map(table => (
				<Grid size={{ xs: 12, md: 6, lg: 4 }} key={table.name}>
					<Card variant="outlined" sx={{ height: 'fit-content' }}>
						<CardContent>
							<Typography
								variant="h6"
								color="primary"
								gutterBottom
								sx={{
									fontWeight: 'bold',
									borderBottom: 2,
									borderColor: 'primary.main',
									pb: 1,
									mb: 2
								}}
							>
								{table.name}
							</Typography>

							<Box>
								{table.columns.map((column, index) => (
									<Box
										key={column.name}
										sx={{
											display: 'flex',
											alignItems: 'center',
											py: 0.5,
											backgroundColor: index % 2 === 0 ? 'action.hover' : 'transparent',
											px: 1,
											borderRadius: 0.5
										}}
									>
										<Typography
											variant="body2"
											sx={{
												fontWeight: column.isPrimaryKey ? 'bold' : 'normal',
												color: column.isPrimaryKey ? 'primary.main' : 'text.primary',
												minWidth: 120
											}}
										>
											{column.name}
										</Typography>

										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ ml: 1, minWidth: 60 }}
										>
											{column.type}
										</Typography>

										<Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
											{column.isPrimaryKey && (
												<Chip
													label="PK"
													size="small"
													color="primary"
													variant="outlined"
													sx={{ height: 20, fontSize: '0.7rem' }}
												/>
											)}
											{column.isForeignKey && (
												<Chip
													label="FK"
													size="small"
													color="secondary"
													variant="outlined"
													sx={{ height: 20, fontSize: '0.7rem' }}
												/>
											)}
										</Box>
									</Box>
								))}
							</Box>

							{/* Show relationships */}
							{table.relationships.length > 0 && (
								<Box sx={{ mt: 2 }}>
									<Divider sx={{ mb: 1 }} />
									<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
										Relationships:
									</Typography>
									{table.relationships.map((rel, index) => (
										<Typography
											key={index}
											variant="caption"
											display="block"
											color="text.secondary"
											sx={{ ml: 1 }}
										>
											{rel.fromColumn} → {rel.toTable}.{rel.toColumn}
										</Typography>
									))}
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>

		{/* Legend */}
		<Paper sx={{ p: 2, mt: 3, bgcolor: 'action.hover' }}>
			<Typography variant="subtitle2" gutterBottom>
				Legend:
			</Typography>
			<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Chip label="PK" size="small" color="primary" variant="outlined" />
					<Typography variant="caption">Primary Key</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Chip label="FK" size="small" color="secondary" variant="outlined" />
					<Typography variant="caption">Foreign Key</Typography>
				</Box>
			</Box>
		</Paper>
	</Box>
}

