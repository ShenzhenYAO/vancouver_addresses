const mymodules = require('../../backend/app/modules');

(async () => {

    // it works to read a file from outside the project

        const Excel = require('exceljs')

        // // read an xlsx file
        // let srcxlsxfile = 'P:/Restricted/Overdose surveillance/shenzhen/Projects/HOPS/mapping hops and bccs data.xlsx'
        // let srcxlsxfile = 'P:\\Restricted\\Overdose surveillance\\shenzhen\\Projects\\HOPS\\mapping hops and bccs data.xlsx'
        // const workbook = new Excel.Workbook();
        // let theworkbook = await workbook.xlsx.readFile(srcxlsxfile)
        //     .then(d => { return d });
    
        // let sheetcount = theworkbook.worksheets.length
        // console.log(sheetcount)
    
        // read a csv file:
        let srccsvfile = 'x:/BCCS/BCCS_VCH_2022-05-03.csv'
        const workbook = new Excel.Workbook();
        let thesheet = await workbook.csv.readFile(srccsvfile) // different from reading xlsx file, here, there is only one sheet
            .then(d => { return d });
    
        let rowcount = thesheet.rowCount
        console.log(rowcount)


})();