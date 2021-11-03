import readXlsxFile from "read-excel-file";

class ExcelToSql {
    constructor(file, table, schema) {
        this.file = file;
        this.table = table;
        this.schema = schema;
        this.data = [];
    }

    readFile = async () => {
        await readXlsxFile(this.file, {schema: this.schema}).then(({rows}) => {
            this.data = rows;
        });
    }

    turnIntoQuery = () => {
        let insertQuery = `DBCC CHECKIDENT (${this.table}, RESEED, 0); \nINSERT INTO ${this.table} (${this.joinHeaders()}) VALUES \n \t`;
        this.data.map((row, index) => {
            insertQuery += '(';
            Object.values(this.schema).forEach((header, index) => {
                const {prop: column, type} = header;
                if (!row.hasOwnProperty(column)) {
                    row[column] = null;
                }
                insertQuery += this.formatData(row[column], type, index);
            })

            insertQuery += `)${index !== this.data.length - 1 ? ', \n \t' : ''}`;
        });
        insertQuery += ';';

        return insertQuery;
    }

    formatData = (data, type, index) => {
        if (type === String && data !== null) {
            if (data.includes("'")) {
                data = data.replace("'", "''");
            }
            return `'${data}'${this.addComa(index)}`
        }
        return `${data}${this.addComa(index)}`;
    }

    addComa = (index) => {
        return index === Object.keys(this.schema).length - 1 ? '' : ', '
    }

    joinHeaders = () => {
        return [...Object.values(this.schema).map((header) => header.prop)].join(', ');
    }

}

export default ExcelToSql;