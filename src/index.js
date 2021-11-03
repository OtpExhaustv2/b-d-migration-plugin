import ExcelToSql from "./ExcelToSql";
import readXlsxFile from "read-excel-file";

const form = document.querySelector('form');
const file = document.querySelector('#file');

const types = {
    String: String,
    Number: Number
}

let excelHeaders = [];

file.addEventListener('change', () => {
    const headers = document.querySelector('#headers');
    headers.innerHTML = null;
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    readXlsxFile(file.files[0]).then((rows) => {
        const trInputs = document.createElement('tr');
        const trDrop = document.createElement('tr');
        excelHeaders = rows[0];
        rows[0].forEach((header) => {
            const th = document.createElement('th');
            th.innerHTML = header.toString();
            thead.appendChild(th);

            const td = document.createElement('td');
            const input = document.createElement("input");
            input.type = "text";
            input.name = 'fields[]';
            td.appendChild(input);
            trInputs.appendChild(td);

            const tdDrop = document.createElement('td');
            const drop = document.createElement("select");

            Object.keys(types).forEach((type) => {
                const option = document.createElement('option');
                option.value = type;
                option.innerHTML = type;
                drop.appendChild(option);
            })

            drop.name = 'types[]';
            tdDrop.appendChild(drop);
            trDrop.appendChild(tdDrop);

        })
        tbody.appendChild(trInputs);
        tbody.appendChild(trDrop);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    headers.appendChild(table);
    document.querySelectorAll('.hide').forEach((element) => {
        element.classList.remove('hide')
    });
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = [...document.querySelectorAll('[name="fields[]"]')].map((field) => field.value);
    const types = [...document.querySelectorAll('[name="types[]"]')].map((type) => type.value);
    const table = document.querySelector('#datatable');
    const options = generateOption(fields, types);
    const excel = file.files[0];

    if (excel) {
        const fileNameSplit = excel.name.split('.');
        if (excel && fileNameSplit[fileNameSplit.length - 1] === 'xlsx') {
            if (table.value) {
                const excelToSql = new ExcelToSql(excel, table.value, options);
                await excelToSql.readFile();
                document.querySelector('#query').innerHTML = excelToSql.turnIntoQuery();
            } else {
                alert("You forgot the database name!");
            }
        } else {
            alert("Provide a xlsx file please!");
        }
    } else {
        alert("Provide a file please!");
    }

});

const generateOption = (fields, dropTypes) => {
    const options = {};
    fields.forEach((field) => {
        if (field) {
            options[excelHeaders[fields.indexOf(field)]] = {
                prop: field,
                type: types[dropTypes[fields.indexOf(field)]],
            }
        }
    });

    return options;
}