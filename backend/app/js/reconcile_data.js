// to reconcile data from two json files
// in C:\Users\syao2\AppData\Local\MyWorks\js\bchome_analysis\data\out\std_addrs_202309290823.json, the searched address start with # are not right
// and need to be replaced by the data from atd_addres_with_hashtags.json


// const { supportsPropertyIndex } = require('jsdom/lib/jsdom/living/generated/utils');

const mymodules = require('../../../backend/app/js/modules');
const fs = require('fs');
(async () => {

    let sr1_fullpath = String.raw`C:\Users\syao2\AppData\Local\MyWorks\js\bchome_analysis\data\out\std_addrs_202309290823.json`.replace(/\\/g, '/')
    let sr2_fullpath = String.raw`C:\Users\syao2\AppData\Local\MyWorks\js\bchome_analysis\data\out\std_addrs_with_hashtags.json`.replace(/\\/g, '/')
    let target_fullpath = String.raw`C:\Users\syao2\AppData\Local\MyWorks\js\bchome_analysis\data\out\std_addrs_updated.json`.replace(/\\/g, '/')

    // get updated data of address starting with #
    let updateed_json_str = fs.readFileSync(sr2_fullpath, 'utf-8' )
    let updated_json= JSON.parse(updateed_json_str)
    let updated_data= updated_json.data 
    let addresses_arr = Object.keys(updated_data)
    // console.log(19, addresses_arr.length, addresses_arr[2])

    // get the original data
    let orginal_json_str = fs.readFileSync(sr1_fullpath, 'utf-8' )
    let original_json= JSON.parse(orginal_json_str)
    
    for (let i =0; i< addresses_arr.length; i++){
        let this_address = addresses_arr[i]
        original_json.data[this_address] = updated_data[this_address]
    }

    // save the updated json (still named original_json)
    fs.writeFileSync(target_fullpath, JSON.stringify(original_json))
    
})();

