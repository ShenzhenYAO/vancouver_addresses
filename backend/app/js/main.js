
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
    let src_data_json = await mymodules.read_file(file_location) // it is a dict object

    let response_json = src_data_json
    
    return response_json
}

async function js_00a_save_json_to_backend(requestdatajson){
    let fs = require('fs')
    let requestdatajson_data = requestdatajson.data
    let file_location = requestdatajson_data.file_location
    let datajson = requestdatajson_data.data
    let datajsonstr = JSON.stringify(datajson)
    fs.writeFileSync(file_location, datajsonstr)

    let response_json = Object.create(null)
    response_json.meta = { description: `geocoder bccs standard addresses saved in ${file_location}.` }
    response_json.meta.sources = ["data from frontend"]
    response_json.meta.programs = [__dirname.replace(/\\/g, '/')]
    response_json.data = []

    return response_json
}

async function js_geocoder_01_load_bccs_csv(requestdatajson){

    let requestdatajson_data = requestdatajson.data
    let file_location = requestdatajson_data.file_location

    // read the csv file
    let src_data_json = await mymodules.read_file(file_location)
    // console.log(78, src_data_json.length)
    // console.log(78, src_data_json[0])

    // the src_data_json is an array, each element is a dictionary about a case with keys like "Home_Location", "InJury_Location", "Death_Location", etc
    // from the src_data, make a list of distinct addresses, IN THERE ORIGINAL FORM
    let addresses_arr = []
    for (let i =0; i < src_data_json.length; i++ ){
        let thisrec_dict = src_data_json[i]
        let this_addr = thisrec_dict['Home_Location']
        if (this_addr && ! addresses_arr.includes(this_addr)){addresses_arr.push(this_addr)}
        this_addr = thisrec_dict['InJury_Location']
        if (this_addr && ! addresses_arr.includes(this_addr)){addresses_arr.push(this_addr)}
        this_addr = thisrec_dict['Death_Location']
        if (this_addr && ! addresses_arr.includes(this_addr)){addresses_arr.push(this_addr)}
    }

    addresses_arr.sort()

    let response_json = Object.create(null)
    response_json.meta = { description: `distinct addresses from home, injury, and death locations in ${file_location}.` }
    response_json.meta.sources = [file_location]
    response_json.meta.programs = [__dirname.replace(/\\/g, '/')]
    response_json.data = addresses_arr

    return response_json

}

