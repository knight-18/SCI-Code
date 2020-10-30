// const XLSX = require('xlsx');
// const workbook = XLSX.readFile("Data.xlsx");
// let sheetNames = workbook.SheetNames;
// console.log(sheetNames);

// sheetNames.forEach((sheet)=>{
//     let worksheet = workbook.Sheets[sheet];

//     var headers = {};
//     var data = [];
//     for(item in worksheet){
//         var col = item.substring(0,1);
//         var row = parseInt(item.substring(1));

//         var value = worksheet[item].v;

//         if(row == 1){
//             headers[col] = value;
//             continue;
//         }
//         if(!data[row]) data[row] = {};
//         data[row][headers[col]] = value;
//     }
//     data.shift();
//     data.shift();
//     console.log(data);
// })
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs');
const schema = {
    'Industry' : {
        type: String,
        prop : 'Industry'
    },
    '3 Digit SIC Code': {
        type: String,
        prop : '3 Digit SIC Code'
    },
    'siccode-2digit': {
        type: String,
        prop : 'siccode-2digit'
    },
    'siccodetext-2digit-industry':{
        type : String,
        prop : 'siccodetext-2digit-industry'
    },
    'siccode-3digit': {
        type : String,
        prop : 'siccode-3digit'
    },
    'siccodetext-3digit-industry':{
        type: String,
        prop: 'siccodetext-3digit-industry'
    } ,
    'noofcompanies-3digit-industry': {
        type: String,
        prop: 'noofcompanies-3digit-industry'
    },
    'empsize-3digit-industry': {
        type: String,
        prop: 'empsize-3digit-industry',
        default: 0
    },
    'siccode-4digit': {
        type: String,
        prop : 'siccode-4digit'
    },
    'siccodetext-4digit-industry':{
        type: String,
        prop : 'siccodetext-4digit-industry'
    },
    'noofcompanies-4digit-industry': {
        type: String,
        prop : 'noofcompanies-4digit-industry'
    },
    'empsize-4digit-industry': {
        type: String,
        prop : 'empsize-4digit-industry'
    }
}


readXlsxFile('./Data.xlsx',{
    schema,
    transformData(data) {
        return data.filter(row => row.filter(column => column !== null).length > 0)
      }    
}).then(({ rows, errors }) => {
    rows.forEach(async(row)=>{
        if(row['siccode-2digit'].toString().length < 2)
            row['siccode-2digit'] = `0${row['siccode-2digit']}`;
        else
            row['siccode-2digit'] = `${row['siccode-2digit']}`;
        if(row['siccode-3digit'].toString().length < 3)
            row['siccode-3digit'] = `0${row['siccode-3digit']}`;
        else
            row['siccode-3digit'] = `${row['siccode-3digit']}`;
        if(row['siccode-4digit'].toString().length < 4)
            row['siccode-4digit'] = `0${row['siccode-4digit']}`;
        else
            row['siccode-4digit'] = `${row['siccode-4digit']}`;
        if(row['empsize-3digit-industry'] === 'N/A')
            row['empsize-3digit-industry'] = 0;
        if(row['empsize-4digit-industry'] === 'N/A')
            row['empsize-4digit-industry'] = 0;
    })
    let dataArray = [];
    rows.forEach(row=>{
        dataArray.push(row);
    })
    const text = dataArray.map(JSON.stringify).reduce((prev, next) => `${prev}\n${next}`);
    fs.writeFileSync('originalData.js', text, 'utf-8');
    console.log(dataArray);
    
})
.catch(err=>{
      console.log('Error',err);
});