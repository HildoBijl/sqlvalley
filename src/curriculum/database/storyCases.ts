export const personnelCases = [
	{ id: 72738553, name: 'Noah Chen', salary: 165000, recordedSalary: 149000, city: 'San Jose, CA', recordedCity: 'New York, NY', contactField: 'email', contact: 'n.chen@herishare.com', leaveStart: '2024-01-22', leaveEnd: '2024-01-26', leave: 'SICK_LEAVE', recordedLeave: 'PTO' },
	{ id: 47132966, name: 'Priya Desai', salary: 108000, recordedSalary: 99000, city: 'Fremont, CA', recordedCity: 'Boston, MA', contactField: 'phone', contact: '510-748-3023', leaveStart: '2023-12-11', leaveEnd: '2023-12-15', leave: 'PTO', recordedLeave: 'SICK_LEAVE' },
	{ id: 69733054, name: 'Aisha Patel', salary: 160000, recordedSalary: 144000, city: 'Palo Alto, CA', recordedCity: 'Miami, FL', contactField: 'email', contact: 'a.patel@herishare.com', leaveStart: '2024-04-22', leaveEnd: '2024-04-26', leave: 'SICK_LEAVE', recordedLeave: 'PTO' },
] as const

export const expenseCases = [
	{ originalId: 509901, duplicateId: 509902, amount: 12500, department: 2200, requester: 69733054, approver: 14338498, description: 'Database support - invoice LS-184', firstDate: '2025-02-03', secondDate: '2025-02-21' },
	{ originalId: 509903, duplicateId: 509904, amount: 17600, department: 4100, requester: 47132966, approver: 60706330, description: 'Provenance services - invoice LS-227', firstDate: '2025-03-03', secondDate: '2025-03-21' },
	{ originalId: 509905, duplicateId: 509906, amount: 18750, department: 2100, requester: 72738553, approver: 14338498, description: 'Platform support - invoice LS-316', firstDate: '2025-04-02', secondDate: '2025-04-11' },
] as const

export const saleCases = [
	{ id: 25031001, date: '2025-03-10', product: 100088, category: 'PAINTING', price: 195500, recordedPrice: 39500 },
	{ id: 25031204, date: '2025-03-12', product: 100264, category: 'CERAMIC', price: 406500, recordedPrice: 86500 },
	{ id: 25041119, date: '2025-04-11', product: 100725, category: 'HISTORIC_OBJECT', price: 2861000, recordedPrice: 286100 },
] as const

export const performanceCases = [
	{ category: 'PAINTING', revenue: 1084054, recordedRevenue: 108405.4 },
	{ category: 'SPORTS_MEMORABILIA', revenue: 1171735.5, recordedRevenue: 117173.55 },
	{ category: 'CERAMIC', revenue: 183458, recordedRevenue: 18345.8 },
] as const

export const caseGroups = [[0, 1], [0, 2], [0, 1, 2]] as const
export const sqlLiteral = (value: string | number | null) => value === null ? 'NULL' : typeof value === 'number' ? String(value) : `'${value.replace(/'/g, "''")}'`
export const money = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
