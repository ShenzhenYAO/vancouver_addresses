
const { fstat } = require('fs');
const mymodules = require('../../../backend/app/js/modules');

(async () => {

    const express = require('express');
    const app = express();
    const http = require('http').Server(app);

    const cors = require('cors');
    app.use(cors())
    app.options('*', cors()) // include before other routes

    // const ncrypt = require("ncrypt-js");
    // const ncryptObj = new ncrypt('ncrypt-js');

    const bodyParser = require('body-parser');
    app.use(bodyParser.json({ limit: '500mb', extended: true }))
    app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

    // set the local back end server at localhost:1292
    app.set('port', process.env.PORT || 1292);
    // launch the server
    http.listen(app.get('port'), function () {
        console.log('listening on port', app.get('port'));
    });

    /*part 1, parse data of what has been poted by the front end */

    // use the post method to get data that were sent from the front end
    app.post('/backend', async function (req, res) {
        // console.log(req.body) // req.body is the datajson sent from the front end (note, it is the json, not stringified json)
        let requestdatajson = req.body
        // console.log(33, typeof requestdatajson)

        let resbody, result
        let requesttask = requestdatajson.requesttask

        console.log(38, requesttask)


        // perform tasks according to the tasks
        if (requesttask === 'js00_demo') {
            // result = await js00_demo(requestdatajson) //             
        } else if (requesttask === 'js_00a_save_json_to_backend') {
            result = await js_00a_save_json_to_backend(requestdatajson) //             
        }
        else if (requesttask === 'js_geocoder_01_load_bccs_csv') {
            result = await js_geocoder_01_load_bccs_csv(requestdatajson) //             
        }
        else if (requesttask === 'js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review') {
            result = await js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review(requestdatajson) //             
        }

        








        else {
            result = { meta: { description: `The requested backend nodejs task ${requesttask} is an unknown task` }, data: [] }
        }

        resbody = { responsedatafrombackend: result }
        // console.log(47, 'ready to send to frontend ===', resbody.responsedata)
        res.send(resbody)
    });
})()


async function js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review(requestdatajson){
    let fs = require('fs')

    let requestdatajson_data = requestdatajson.data
    let file_location = requestdatajson_data.file_location

    // read the json file
    let src_data_json = Object.create(null)
    try {
        src_data_json = await mymodules.read_file(file_location) // it is a dict object
    }
    catch(err){

    }

    let response_json = src_data_json
    
    return response_json
}

async function js_00a_save_json_to_backend(requestdatajson){
    let fs = require('fs')
    let requestdatajson_data = requestdatajson.data
    let file_location = requestdatajson_data.file_location
    let datajson = requestdatajson_data.data
    

    let response_json = Object.create(null)
    response_json.meta = { description: `geocoder bccs standard addresses saved in ${file_location}.` }
    response_json.meta.sources = ["data from frontend"]
    response_json.meta.programs = [__filename.replace(/\\/g, '/')] // not __dirname
    response_json.data = datajson

    let datajsonstr = JSON.stringify(response_json)
    fs.writeFileSync(file_location, datajsonstr)

    response_json.data = [] // no need to send back the data that is received from frontend

    return response_json
}

async function js_geocoder_01_load_bccs_csv(requestdatajson){

    let requestdatajson_data = requestdatajson.data
    let file_location = requestdatajson_data.file_location

    // this is to make it general, -- the vars to pull data from
    let vars_set_arr=[
        {addr_var: 'Home_Location', gps_lat_var: 'Home_Derived_Lat', gps_long_var:'Home_Derived_Long'},
        {addr_var: 'Injury_Location', gps_lat_var: 'Injury_Derived_Lat', gps_long_var:'Injury_Derived_Long'},
        {addr_var: 'Death_Location', gps_lat_var: 'Death_Derived_Lat', gps_long_var:'Death_Derived_Long'},
    ]

    // read the csv file
    let src_data_json = await mymodules.read_file(file_location)
    // console.log(78, src_data_json.length)
    // console.log(78, src_data_json[0])

    // the src_data_json is an array, each element is a dictionary about a case with keys like "Home_Location", "InJury_Location", "Death_Location", etc
    // from the src_data, make a list of distinct addresses, IN THERE ORIGINAL FORM
    // in addition, the location lat and long gps coordinates is important to keep

    let addrs_dict = Object.create(null)
    for (let i =0; i < src_data_json.length; i++ ){ // loop for each
        let thisrec_dict = src_data_json[i] // the current row in the data
        let this_addr, addr_var, gps_lat_var, gps_long_var, lat, long

        for (let j=0; j< vars_set_arr.length; j++){ // loop for each set of location and gps coordinates (for home, injury, and death locaitons)
            let this_vars_dict = vars_set_arr[j]

            addr_var = this_vars_dict['addr_var']
            gps_lat_var = this_vars_dict['gps_lat_var']
            gps_long_var = this_vars_dict['gps_long_var']
            this_addr = thisrec_dict[addr_var]
            if (this_addr && this_addr.length > 0 &&  this_addr.toLowerCase() !=='null' &&  (! addrs_dict[this_addr])){addrs_dict[this_addr]={gps:[]}}
            if ( gps_lat_var && gps_long_var) { // only do it when the gps_lat and long vars are defined in vars_set_arr
                lat = thisrec_dict[gps_lat_var] === null || thisrec_dict[gps_lat_var].toLowerCase() === 'null' || thisrec_dict[gps_lat_var].trim().length===0?  "": thisrec_dict[gps_lat_var].toString()
                long = thisrec_dict[gps_long_var] === null || thisrec_dict[gps_long_var].toLowerCase() === 'null' || thisrec_dict[gps_long_var].trim().length===0?  "": thisrec_dict[gps_long_var].toString()
                // console.log(thisrec_dict[gps_lat_var], thisrec_dict[gps_long_var])
                // console.log(lat, long, lat.length, long.length, lat.length>0 && long.length>0)
                let gps
                if (lat.length>0 && long.length>0) {gps = `${lat},${long}`} // (lat, long)}
                if ( gps && addrs_dict[this_addr]['gps'] && (! addrs_dict[this_addr]['gps'].includes(gps))){addrs_dict[this_addr]['gps'].push(gps)}

            }
        }

        // thus, all addresses are in addrs_dict, each as a key of the addrs_dict object
        // addrs_dict[this_addr] would be an empty array if there is no gps data or the gps var is not sepcified. Otherwise GPS data is like ["lat1,long1", "lat2, long2"]

    }

    let response_json = Object.create(null)
    response_json.meta = { description: `distinct addresses (with gps lat/long data) from home, injury, and death locations in ${file_location}.` }
    response_json.meta.sources = [file_location]
    response_json.meta.programs = [__dirname.replace(/\\/g, '/')]
    response_json.data = addrs_dict

    return response_json

}

