
const mymodules = require('../../backend/app/modules');

(async () => {

    // // convert and save the source xlsx file into a json and a csv file
    // let srcxlsxfile = 'data/in/Addr from BCCS 20220503.xlsx'
    // let targetcsvfile = 'data/out/bccstest_raw.csv'
    // let targetjsonfile = 'data/out/bccstest_raw.json'
    // await mymodules.convert_xlsx_to_csv_and_json(srcxlsxfile, targetcsvfile, targetjsonfile)

    // // further data treatment to concat three columns into one, as did for bccs data
    // let srcjsonfile = 'data/out/bccstest_raw.json'
    // let keys_to_concat_arr = ['inj_strt_nm__1, inj_city__2, inj_prvnc__3']// , 'inj_strt_nm__1, inj_city__2']
    // let targetjsonfile = 'data/out/bccstest_keysconcat.json'
    // let filterstr = ' tmp_dict["inj_strt_nm__1"].trim().toLowerCase() !== "null" '
    // // // let max_n_target = 31 //
    // await mymodules.concatkeys(srcjsonfile, keys_to_concat_arr, targetjsonfile, filterstr)

    // // Now that we can read the json data !
    // // with the raw address data json, obtain standardized address data from geocoder.api.gov.bc.ca
    // let keys_arr = ['__concatkey_1']    
    // let srcjsonfile = 'data/out/bccstest_keysconcat.json'
    // let targetjsonfile = 'data/out/bccstest_geocoder.json'
    // await mymodules.get_geocoder_data_alladdr(keys_arr, srcjsonfile, targetjsonfile )

    // let keys_arr = ['StandardizedAddress__10', 'BuildingName__8', 'Address__11', 'Address1__14', 'Address2__15', 'Nalin 2018 Address notes__16']
    // let srcjsonfile = 'data/out/hops_raw.json'
    // let targetjsonfile = 'data/out/hops_geocoder.json'
    // await mymodules.get_geocoder_data_alladdr(keys_arr, srcjsonfile, targetjsonfile )

    // // make a summary xlsx, list the most closely matched geocoder address with score
    // let keys_arr = ['__concatkey_1']
    // let srcjsonfile = 'data/out/bccstest_geocoder.json'
    // let targetworkbookname = 'data/out/bccstest_geocoder_summary.xlsx'
    // let autofilter_dist = {fromcell: 'A1', tocell: 'G1'}
    // await mymodules.make_summary_xlsx(keys_arr, srcjsonfile, targetworkbookname, autofilter_dist)

    // let keys_arr = ['StandardizedAddress__10', 'BuildingName__8', 'Address__11', 'Address1__14', 'Address2__15', 'Nalin 2018 Address notes__16']
    // let srcjsonfile = 'data/out/hops_geocoder.json'
    // let targetworkbookname = 'data/out/hops_geocoder_summary.xlsx'
    // let autofilter_dist = {fromcell: 'M1', tocell: 'Q1'}
    // await mymodules.make_summary_xlsx(keys_arr, srcjsonfile, targetworkbookname, autofilter_dist)

    console.log('done')

})()
    ;
