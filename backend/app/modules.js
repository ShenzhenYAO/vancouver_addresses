
module.exports = {

    convert_xlsx_to_csv_and_json:
        // read the source xlsx file and covert to csv and json separately
        async function convert_xlsx_to_csv_and_json(srcxlsxfile, targetcsvfile, targetjsonfile) {
            const fs = require('fs')
            const beautify = require('beautify')
            const Excel = require('exceljs')
            // let srcxlsxfile = 'data/in/Copy of FROM CHRIS_Merged 2018_21 master address file for review ND HH updates 28OCT.xlsx'
            const workbook = new Excel.Workbook();
            let theworkbook = await workbook.xlsx.readFile(srcxlsxfile)
                .then(d => { return d });

            // get number of sheets
            let sheetcount = theworkbook.worksheets.length
            // console.log(sheetcount)

            // identify the sheet named 'Sheet1'    
            let thesheet
            for (let i = 0; i < theworkbook.worksheets.length; i++) {
                if (theworkbook.worksheets[i].name = 'Sheet1') { thesheet = theworkbook.worksheets[i]; break; }
            } // for i

            // console.log(thesheet.getCell(1,1).value)
            // return
            // simply save it as an csv file. Note, exceljs knows to wrap strings with comma, so as to be distinguished from the delimiter commas. 
            // https://github.com/exceljs/exceljs
            // https://c2fo.github.io/fast-csv/docs/parsing/options/#quote
            // let targetcsvfile = 'data/out/hops_raw.csv'
            await theworkbook.csv.writeFile(targetcsvfile, { sheetName: thesheet.name })

            // alternatively, save to a json
            // // get the number of rows and columns
            // let rowcount = thesheet.rowCount
            // let colcount = thesheet.columnCount
            // let maxrows = thesheet.maxrows
            // let maxcols = thesheet.maxcols
            let data_arr = [], keys_arr = []
            // note: the row and col number starts from 0, not one!
            for (let i = 1; i <= thesheet.rowCount; i++) {
                // let therow = thesheet.row[i]
                let rowdata_dict = { rowid: i }
                // if it is row[0], save the cell values as keys of the json
                for (let j = 1; j <= thesheet.columnCount; j++) {
                    if (i === 1) { keys_arr.push(thesheet.getCell(i, j).value + '__' + j); } // like when i=0, j=0, get the cell value 'City of Vancouver' as the key or column name           
                    else {
                        // console.log(keys_arr[j-1])
                        rowdata_dict[keys_arr[j - 1]] = thesheet.getCell(i, j).text // like when i = 1, j=0, get the cel value like {'City of Vancouver':'Y'}
                    }
                    if (i > 1 && j === thesheet.columnCount - 1) { data_arr.push(rowdata_dict) } // at the last column, push the whole row into the data_arr
                } //for (let j =0;j < thesheet.columnCount; j++)
            } //for (let i=0;i<.length; i++) 

            let data_str = JSON.stringify(data_arr)
            data_str = beautify(data_str, { format: 'json' })
            // let targetjsonfile = 'data/out/hops_raw.json'
            await fs.writeFileSync(targetjsonfile, data_str)

        } //convert_xlsx_to_csv_and_json()
    ,


    // given an address
    get_std_addr_geocoder:
        async function get_std_addr_geocoder(addr_str, delaysec = 1) {

            const delay = sec => new Promise(res => setTimeout(res, sec * 1000));
            const jsdom = require("jsdom");
            const { window } = new jsdom.JSDOM(`...`);
            var $ = require("jquery")(window);

            // define a promise to resolve data obtained from the website
            let get_geocoder_addrdata = urlStr => new Promise(
                res => $.ajax({
                    url: urlStr,
                    type: 'GET',
                    success: async function (receiveddata) {
                        // console.log('success', result)
                        let data = receiveddata.features[0]
                        res(data)
                    }
                })
            );

            await delay(delaysec)
            // convert the str to percentage encoding (URL encoding)
            let percentStr = encodeURI(addr_str)
            let urlStr = 'https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=' + percentStr
            return await get_geocoder_addrdata(urlStr)

        }, //async function get_std_addr_geocoder(addr_str)


    // read data from the raw file and get address data from geocoder.api.gov.bc.ca
    get_geocoder_data_alladdr:
        async function get_geocoder_data_alladdr(keys_arr, srcjsonfile, targetjsonfile) {

            // the key 'StandardizedAddress__10' is most likely to have a well formatted address,
            // but when it is null, other keys might also contains address info, inlcuding:
            // BuildingName__8, Address__11, Address__13, Address__14, Address__15, and Nalin 2018 Address notes__16

            // const keys_arr = ['StandardizedAddress__10', 'BuildingName__8', 'Address__11', 'Address__13', 'Address1__14', 'Address2__15', 'Nalin 2018 Address notes__16']
            const fs = require('fs');
            const beautify = require('beautify');

            // read the json data
            // let srcjsonfile = 'data/out/hops_raw.json'
            let data_str = await fs.readFileSync(srcjsonfile, 'utf8')
            let data_arr = JSON.parse(data_str)
            // console.log(data_arr.length)
            // loop for each record in data_arr
            for (let i = 0; i < data_arr.length; i++) {
                console.log('row ======', i)
                let therow = data_arr[i]
                let debug_datafound = 0
                therow.geocoderdata = {}
                for (let j = 0; j < keys_arr.length; j++) {
                    let key = keys_arr[j]
                    if (therow[key]) {
                        let addr_str, addr_str1 = therow[key].trim()
                        // if the first char is '#', remove it. the geocoder search for #40 1234 SOME ST ( like number 40 1234 some street) won't return correct values as the # is not recognized.
                        if (addr_str1.substring(0, 1) === '#') { addr_str1 = addr_str1.substring(1, addr_str1.length) }
                        if (!addr_str1.toLowerCase().includes('vancouver')) { addr_str = addr_str1 + ', Vancouver, BC' } else { addr_str = addr_str1 }
                        let delaysec = .3 // note: the site specify that do not send >400 requests per minute!
                        let geocoderdata = await this.get_std_addr_geocoder(addr_str, delaysec)
                        geocoderdata.searchstr = addr_str1
                        // console.log(geocoderdata)
                        therow.geocoderdata[key] = geocoderdata
                        console.log('key=', key)
                        console.log(addr_str)
                        // debug_datafound =1
                        // break
                    } // if (therow[key]) {
                } // for (let i=0; i< data_arr.length; i++)
                // if (debug_datafound===1){break}

                //save after each row is done
                // save the data_arr back
                data_str = JSON.stringify(data_arr)
                data_str = beautify(data_str, { format: 'json' })
                // let targetjsonfile = 'data/out/hops_geocoder.json'
                await fs.writeFileSync(targetjsonfile, data_str)

            } //for (let i=0; i< data_json.length; i++) {
        }, //async function get_geocoder_data_alladdr


    make_summary_xlsx:
        async function make_summary_xlsx(keys_arr, srcjsonfile, targetworkbookname, autofilter_dist) {
            // We have had addresses by geocoder!
            // list all addresses in the raw data, and the std addresses from geocoder

            // const keys_arr = ['StandardizedAddress__10', 'BuildingName__8', 'Address__11', 'Address__13', 'Address__14', 'Address__15', 'Nalin 2018 Address notes__16']
            const fs = require('fs');

            // create a workbook
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Addresses');

            // freeze rows and cols
            sheet.views = [
                { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'O2' }
            ]
            // autofilter column O:R
            sheet.autoFilter = {
                from: autofilter_dist.fromcell,
                to: autofilter_dist.tocell,
            }


            // read the json file with geocoder data
            // let srcjsonfile = 'data/out/hops_geocoder.json'
            let data_str = await fs.readFileSync(srcjsonfile, 'utf8')
            let data_arr = JSON.parse(data_str)

            // first, loop for each key to print the column head
            for (let j = 0; j < keys_arr.length; j++) {
                let key = keys_arr[j]
                // write the column header in the xlsx workbook
                sheet.getCell(1, 1 + j * 2).value = key
            }//for (let j = 0; j < keys_arr.length; j++) {

            let j = 1 + keys_arr.length * 2
            sheet.getCell(1, j).value = 'Field'
            sheet.getCell(1, j + 1).value = 'Search str'
            sheet.getCell(1, j + 2).value = 'Most close'
            sheet.getCell(1, j + 3).value = 'Block ID'
            sheet.getCell(1, j + 4).value = 'Match score'
            sheet.getCell(1, j + 5).value = 'Match rowid'
            sheet.getCell(1, j + 6).value = 'Match Latitude'
            sheet.getCell(1, j + 7).value = 'Match Longitude'

            // loop for each row
            for (let i = 0; i < data_arr.length; i++) {
                let maxscore = 0
                let searchStr_max = "_"
                let geocoder_str_max = "_"
                let blockid = ""
                let therow = data_arr[i]
                let geocoder_data_dict = therow.geocoderdata
                let rowid = therow.rowid
                let latitude_max= ""
                let longitude_max = ""

                // loop for each key again, this time to get geocoder data
                for (let j = 0; j < keys_arr.length; j++) {
                    let key = keys_arr[j]
                    if (geocoder_data_dict[key]) {
                        sheet.getCell(i + 2, 1 + j * 2).value = geocoder_data_dict[key].searchstr
                        sheet.getCell(i + 2, 2 + j * 2).value = geocoder_data_dict[key].properties.fullAddress
                        if (geocoder_data_dict[key].properties.score && geocoder_data_dict[key].properties.score > maxscore) {
                            maxkey = key
                            maxscore = geocoder_data_dict[key].properties.score
                            searchStr_max = geocoder_data_dict[key].searchstr
                            geocoder_str_max = geocoder_data_dict[key].properties.fullAddress
                            blockid = geocoder_data_dict[key].properties.blockID
                            latitude_max= geocoder_data_dict[key].geometry.coordinates[1]
                            longitude_max = geocoder_data_dict[key].geometry.coordinates[0]
                            // convert like 'UNIT 81 -- 83 W Pender' to '83 W Pender', i.e., removing UNIT number as they are not correct (the original address is 81 to 83, meaning that the block shares multiple civic numbers)
                            if (geocoder_str_max.substring(0, 5) === 'UNIT ') {
                                let pos = geocoder_str_max.indexOf('--') + 2
                                let strlen = geocoder_str_max.length
                                // console.log(geocoder_str_max, pos, strlen)
                                geocoder_str_max = geocoder_str_max.substring(pos, strlen).trim()
                            }
                        } // if a new max score is met
                    } //if (geocoder_data_dict[key]){
                }//for (let j = 0; j < keys_arr.length; j++) {

                // print the search str and the max
                let j = 1 + keys_arr.length * 2
                sheet.getCell(i + 2, j).value = maxkey
                sheet.getCell(i + 2, j + 1).value = searchStr_max
                sheet.getCell(i + 2, j + 2).value = geocoder_str_max
                sheet.getCell(i + 2, j + 3).value = blockid
                sheet.getCell(i + 2, j + 4).value = maxscore
                sheet.getCell(i + 2, j + 5).value = rowid
                sheet.getCell(i + 2, j + 6).value = latitude_max
                sheet.getCell(i + 2, j + 7).value = longitude_max

            }//for (let i = 0; i < data_arr.length; i++) {

            // let targetworkbookname = 'data/out/hops_geocoder.xlsx'
            await workbook.xlsx.writeFile(targetworkbookname);
        }, // make_summary_xlsx

    concatkeys:
        async function concatkeys(srcjsonfile, keys_to_concat_arr, targetjsonfile, filterstr = '', max_n_target = 'all') {

            const fs = require('fs')
            const beautify = require('beautify')

            // read the source json file
            let data_str = await fs.readFileSync(srcjsonfile, 'utf8')
            let data_arr = JSON.parse(data_str)
            // console.log(data_arr.length)
            // return

            let data_arr2 = []
            if (max_n_target === 'all') { max_n_target = data_arr.length }
            let n_target = 1 // count number of rows pushed to the target json

            // loop for each record in data_arr
            for (let i = 0; i < data_arr.length; i++) {
                let tmp_dict = data_arr[i]
                for (let j = 0; j < keys_to_concat_arr.length; j++) { // keys_to_concat_arr = ['inj_strt_nm__1, inj_city__2, inj_prvnc__3', 'inj_strt_nm__1, inj_city__2'], each element contains a set of keys in the src json of which the value should be concat into a new key. 
                    let newkey = '__concatkey_' + (j + 1)
                    let origin_keys_arr = keys_to_concat_arr[j].split(',').map(x => x.trim())
                    let concat_value_str = ''
                    origin_keys_arr.forEach(e => {
                        concat_value_str = concat_value_str + ' ' + tmp_dict[e]
                    }) // loop for all key, and concat the values

                    tmp_dict[newkey] = concat_value_str.trim()

                } //for (let j=0; j< keys_to_merge_arr.length; j++

                // if it satisfies the filterstr (given there is any), push it to data_arr2
                if (n_target <= max_n_target) {
                    if (filterstr.length === 0) {
                        data_arr2.push(tmp_dict)
                        n_target++
                    } else if (eval(filterstr)) {
                        data_arr2.push(tmp_dict)
                        n_target++
                    } //  if (eval(filterstr))
                } //if (n_target <= max_n_target)


            } // for (let i = 0; i < data_arr.length; i++)

            // save the updated data 
            // console.log(data_arr2.length)
            data_str = JSON.stringify(data_arr2)
            data_str = beautify(data_str, { format: 'json' })
            // let targetjsonfile = 'data/out/hops_geocoder.json'
            await fs.writeFileSync(targetjsonfile, data_str)

        }, // async function mergekeys(srcjsonfile, keys_to_merge_arr, targetjsonfile)



    // pupeteer, copied from https://github.com/ShenzhenYAO/webscrape_pricetracing/blob/master/jstools/mymodules.js
    startBrowser:
        // an async function to start the browser, and open a new page
        async function startBrowser() {

            // adapted from https://browsee.io/blog/web-scraper-using-puppeteer-how-to-login-to-a-website/
            // create an instance of puppeteer method
            const puppeteer = require('puppeteer');
            // const theurl =  (pagename) => `https://www.walmart.ca/${pagename}`;
            // const pagename = `en`;

            // define the browser instance
            const browser = await puppeteer.launch({
                headless: true, // not to display the browser
                defaultViewport: {
                    width: 1365,
                    height: 925,
                    isMobile: false
                },
                slowMo: 100, // slow down for __ ms as defined (e.g., 100)
                // proxy is from http://us4.freeproxy.win/index.php?q=zKmsp6VwkZHJpMqVkaHXn6ivY6PLrKRlpJallQ
                // https://www.us-proxy.org/
                args: ['--proxy-server = 144.34.180.240:8080'] // visit behind a proxy
            });

            // open a new page in the brower
            let page = await browser.newPage();

            // remove the naviation time out waiting (default is 30000 ms)
            await page.setDefaultNavigationTimeout(0);

            return { browser, page };

        } // end of startBrower function
    ,
    search_addr:

           // search addr by giving url 
           /* example:
           let theurl = 'https://www.google.com/search?q=Matheson+Heights+Co-op'
            let selector_filter_str= 'span[class=LrzXr]'
            let addr= await mymodules.search_addr(theurl, selector_filter_str)
            let addr_arr = await search_addr(theurl, selector_filter_str)
           */
        async function search_addr(theurl, selector_filter_str) {
            const beautify = require('beautify')
            const fs = require('fs')

            let { browser, page } = await this.startBrowser();

            // let theurl = 'https://www.google.com/search?q=Matheson+Heights+Co-op'
            // let selector_filter_str='span[class=LrzXr]'

            // go to url 
            await page.goto(theurl, { waitUntil: 'networkidle0' });

            // https://pptr.dev/
            // let body_html = await page.evaluate(() => { return document.body.innerHTML })

            let target_addrs_arr = await page.evaluate((selector_filter_str) => { // 2. tricky, must parse it into the function (provided that 1 is done (see the last line of this section))  
                let elements_arr = Array.from(document.querySelectorAll(selector_filter_str))
                let elements_text_arr = elements_arr.map(x => x.textContent)
                return selector_filter_str
            }, selector_filter_str ) //1. tricky, must first add selector_filter_str as option here, 
            // console.log(target_addrs_arr)

            // data_str = beautify(data_arr, { format: 'html' })
            // let targetjsonfile = 'data/out/pagetest.html'
            // await fs.writeFileSync(targetjsonfile, body_html)

            await browser.close();

            return target_addrs_arr
        }, //function search_addr (theurl, selector_filter_str)

} // modules.export
