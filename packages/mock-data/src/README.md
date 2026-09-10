# Mock Data

This folder contains all the mock data used within SQL Valley. It also has helper functions to easily load and work with this mock data.

## Folder set-up

This folder contains the following files/subfolders, in order of dependency.

- **[parseCsv/](./parseCsv/)** defines CSV row types, parses CSV data, and converts it into typed table rows.
- **[tables/](./tables/)** contains the table-definition types, table definitions, CSV data, and the central registry.
- **[buildSql/](./buildSql/)** builds dataset SQL and the schema used for SQL completion.
