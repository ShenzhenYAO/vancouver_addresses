async function makeElements_mainpage() {

    // change page title
    document.title = global_title

    // append a div for data (this one is to be hidden...)
    d3.select('body').append('div')
        .attrs({ 'id': global_project_datadiv_id })
        .styles({ 'display': 'none' })

    // make a nav bar
    make_nav_bar()

    // make the stage div
    let stage_d3pn = d3.select('body').append('div')
        .attrs({
            'class': 'stage',
            'id': 'stage',
            'name': 'stage'
        })
        .styles({
            'background-color': 'white',
            'margin-top': '90px',
            'margin-left': '10px',
            'width': '100%',
            'font-family': 'ms sans serif',
            'height': window.innerHeight * .8 + 'px',
            // 'border':'1px solid grey'
        })

    // make a display box

    let div_display_d3pn = stage_d3pn.append('div')
        .attrs({ 'id': 'display' })
        .styles({ 
            'position': 'absolute', 
            'border': 'solid 0px grey', 
            'margin-top': '0px', 
            'margin-left': '52%', 
            'max-height': '700px', 
            'overflow': 'auto', 
            'width': '40%' ,
            'display':'none'
        })


    // make the status textarea
    d3.select('body').append('textarea')
        .attrs({
            'id': 'status',
        })
        .styles({
            "position": "absolute", "bottom": "5px", "font-family": "sans-serif", "font-size": "10px",
            "width": '99%', 'border': 'solid 0px grey', 'resize': 'vertical',

        })
        .text('status')



}; //function makeElements()

function set_actions_nav_selections() {
    const nav_select_actions_dict = {
       "geocoder addresses" : makepage_geocoder
    }

    // # get all nav select elements 
    let nav_selectelements_arr = d3.selectAll('li.nav_select').nodes()
    for (let i =0; i <nav_selectelements_arr.length; i ++){
        let nav_select_ele = nav_selectelements_arr[i]
        let action = nav_select_ele.getAttribute('action')
        if (action && action.length >0){            
            let action_function = nav_select_actions_dict[action]
            // console.log(action_function)
            if (action_function){d3.select(nav_select_ele).on('click', action_function)}
        }
    }
}


function make_nav_bar() {

    // 1. the nav bar div
    let navbar_d3pn = d3.select('body').append('div')
        .attrs({
            'class': 'navbar',
            'id': 'navbar',
            'name': 'navbar',
            'data': ''
        })
        .styles({
            'background-color': 'rgba(0,0,0,1)',
            // 'border':'solid red 3px',
            'position': 'fixed',
            'width': '100%',
            'height': '70px',
            'top': '0px',
            'z-index': '10000', // note: very important to put the nav bar and its offsprings above all other elements!,
        })

    // 2. the title div
    navbar_d3pn.append('div')
        .attrs({ 'id': 'homepagetitle' })
        .styles({ 'color': 'white', 'text-align': 'center', 'font-weight': 'bold', 'font-size': '30px', 'height': '50%', 'vertical-align': 'middle', 'border': '0px grey solid' })
        .text(global_title)

    // 3. the nav selection div
    let navselectiondiv_d3pn = navbar_d3pn.append('div')
        .attrs({ 'id': 'navselections' })
        .styles({ 'float': 'left', 'height': '40%', 'border': '0px grey solid', 'vertical-align': 'center' })
    let navlist_d3pn = navselectiondiv_d3pn.append('ul').attrs({ 'id': 'navselections' })
        .styles({
            'display': 'inline',  // to do, once auth is enabled, change it to display: 'none' (by default not showing the selections if not log in) 
            "list-style-type": "none", "margin": '0px', 'padding': '0px', 'position': 'relative', 'top': '15%'
        }) // by default margin and padding of ul element are insanely large!
    // the 'position':'relative','top':'25%' might be the only way to move the ul down to nearly middle vertically ('vertical-align': 'center' does not work)

    // add nave selections
    let navselection_arr = global_nav_selections_str.split(',').map(x => x.trim())
    navselection_arr.forEach(d => {
        let display_text = d.replace(/ /g, '_')
        navlist_d3pn.append('li')
            .attrs({ 'id': `nav_select_${display_text}`, 'class': 'nav_select' , 'action':d})
            .styles({ 'display': 'inline', 'color': 'lightgrey', 'text-align': 'center', 'width': '60px', 'font-family': 'arial', 'font-weight': 'bold', 'font-size': '12px', 'vertical-align': 'middle', 'border': '0px grey solid', 'cursor': 'pointer', 'margin-left': '15px' })
            .text(d)
            .on('mouseover', (event) => { d3.select(event.target).styles({ 'color': 'white' }) })
            .on('mouseleave', (event) => { d3.select(event.target).styles({ 'color': 'lightgrey' }) })
    })

    //4. the credential div
    let navuserdiv_d3pn = navbar_d3pn.append('div')
        .attrs({ 'id': 'navuser' })
        .styles({ 'border': '0px grey solid', 'height': '40%', 'vertical-align': 'center' })
    let userlist_d3pn = navuserdiv_d3pn.append('ul')
        .styles({ 'display': 'inline-block', "list-style-type": "none", "margin": '0px', 'padding': '0px', 'padding-right': '20px', 'position': 'relative', 'top': '15%', 'border': '0px red solid', 'float': 'right' }) // by default margin and padding of ul element are insanely large!
    // the 'position':'relative','top':'25%' might be the only way to move the ul down to nearly middle vertically ('vertical-align': 'center' does not work)
    // must have 'display': 'inline-block' to keep the ul within the div
    let userselection_arr = global_credential_selections_str.split(',').map(x => x.trim())
    userselection_arr.forEach(d => {
        let buttontext = d
        if (d === 'userstatus') { buttontext = 'No user logged in' }
        userlist_d3pn.append('li')
            .attrs({ 'id': `${d}button` })
            .styles({ 'display': 'inline', 'color': 'lightgrey', 'text-align': 'right', 'width': '60px', 'font-family': 'arial', 'font-weight': 'bold', 'font-size': '12px', 'vertical-align': 'middle', 'border': '0px grey solid', 'cursor': 'pointer', 'margin-left': '15px' })
            // display: inline to autofit width of li elements 
            .text(buttontext)
            .on('mouseover', (event) => { d3.select(event.target).styles({ 'color': 'white' }) })
            .on('mouseleave', (event) => { d3.select(event.target).styles({ 'color': 'lightgrey' }) })
    })

}

async function restful(
    requesttask,
    backend_type = null,
    url_backend = null,
    frontend_datajson = null,
    requestdatafromfrontend_json = null,
    json_from_frontend = null,
    function_to_run_after_receiving_response = null,
    save_to_metadiv_spec = null
) {

    // 1. define the request task
    // let requesttask = "js_pa_dl_01_make_section_texts_with_meta"
    // console.log('run', requesttask)

    if (!backend_type) {
        backend_type = 'nodejs'
    }

    // 2. define the url 
    if (!url_backend) {
        if (backend_type === 'python_local') { url_backend = "http://127.0.0.1:1299/backend" }
        else if (backend_type === 'nodejs') { url_backend = "http://127.0.0.1:1292/backend" }
    }


    // 3. define the data from the frontend
    if (!frontend_datajson) {
        frontend_datajson = {
            text: "this is from frontend"
        }
    }

    // 4. define the request json
    if (!requestdatafromfrontend_json) {
        requestdatafromfrontend_json = {
            requesttask: requesttask,
            data: frontend_datajson,
            // ask_attrs: ask_attrs
        }
    }
    let requestdatafromfrontend_json_str = JSON.stringify(requestdatafromfrontend_json)

    // 5. define the ajax setting
    if (!json_from_frontend) {
        if (backend_type === 'python_local') {
            json_from_frontend = {
                url: url_backend,
                requesttask: requesttask,
                data: requestdatafromfrontend_json_str, // for python, must send a stringified json, not a json
                // dataType: 'json', // for sending data to python, do not specify dataType but contentType instead
                contentType: 'application/json', // for 
                // crossDomain: true // not necessary,
                timeout: 30 * 60 * 1000, // 30 minutes -- it takes around 12 mintues to add dep tokens for 1700 docs
                backendapp_cmd: 'flask run',
            }
        } else if (backend_type === 'nodejs') {
            json_from_frontend = {
                url: url_backend,
                requesttask: requesttask,
                data: requestdatafromfrontend_json_str,
                // dataType: 'json', // for sending data to python, do not specify dataType but contentType instead
                // for sending data to node.js backend, also use contentType, not dataType
                // for sending request to pubmed, use dataType, not contentType
                contentType: 'application/json', // for 
                // crossDomain: true // not necessary
                backendapp_cmd: 'node backend/app/js/main.js',
            }
        }else if (backend_type === 'frontend_api') {
            json_from_frontend = {
                url: url_backend,
                requesttask: requesttask,
                data: null, // note: do not send data to the api, otherwise causes error
                type: 'GET'
                // dataType: 'json', // for sending data to python, do not specify dataType but contentType instead
                // for sending data to node.js backend, also use contentType, not dataType
                // for sending request to pubmed, use dataType, not contentType
                // contentType: 'application/json', // for 
                // crossDomain: true // not necessary
                // backendapp_cmd: 'node backend/app/js/main.js',
            }
        }
    }

    let status_msg_txt = `Running task ${requesttask}...`
    d3.select('textarea#status').node.value = status_msg_txt


    // define the tasks to perform after receiving response from backend
    if (!function_to_run_after_receiving_response) {
        function_to_run_after_receiving_response = async (d) => {
            console.log(d)

            if (!d.responsedatafrombackend.meta || !d.responsedatafrombackend.meta.description){
                d.responsedatafrombackend.meta = {description: 'no description received from backend'}
            }
            // display the result in the status textarea
            let text1 = d.responsedatafrombackend.meta.description
            let text2 = JSON.stringify(d.responsedatafrombackend.meta, null, 2).replace(/\\r\\n/g, '\n') // in the stringified string, the original \r\n is escaped as \\r\\n, which is wrong (should be corrected as \n, i.e., a line braker)
            let displaytext = `${text1}\n${text2}`
            d3.select('textarea#status').node().value = displaytext
            let thisdom = d3.select('textarea#status').node()
            // console.log(thisdom.scrollHeight)
            thisdom.style.height = ""
            let thisdom_ht = thisdom.scrollHeight > 80 ? '80px' : thisdom.scrollHeight + "px"
            thisdom.style.height = thisdom_ht // resize the textarea

            // save the data in metadatadiv
            console.log(save_to_metadiv_spec)
            console.log(d.responsedatafrombackend.data)

            if (save_to_metadiv_spec && d.responsedatafrombackend.data) {

                let html_identifier = save_to_metadiv_spec.html_identifier
                let attr_name = save_to_metadiv_spec.attr_name
                let datajson = d.responsedatafrombackend
                console.log(datajson, attr_name)
                await save_json_to_html_attr_base64str_of_gzbuffer(datajson, html_identifier, attr_name)
            }

            // if (d.responsedatafrombackend.system_log){console.log(d.responsedatafrombackend.system_log)}
        }
    }


    // run the general process to interact with backend 
    // console.log(json_from_frontend)
    await interact_with_backend(json_from_frontend, function_to_run_after_receiving_response)
}

async function interact_with_backend(json_from_frontend, function_to_run_after_receiving_response) {
    // make a cover modal, so that the page is locked when the backend is running. 
    make_wait_modal()

    // send the request json to backend, receive the response json from backend, and do something at the frontend
    let responsedata = await $.when(ajaxcall(json_from_frontend))//  ... .done(async (d) => {return d })
    // console.log(typeof responsedata)

    // When the backend process is complete and the response data is received, remove the cover modal. 
    d3.select('div#coverall').remove()

    // the response data can be a string (if it is from python api), or a json object (if it is from node.js backend app js)
    // the following is to parse the string to json if it is a string
    let responsedatajson = responsedata
    if (typeof responsedata === 'string') {
        responsedatajson = JSON.parse(responsedata)
    }

    function_to_run_after_receiving_response(responsedatajson)
}

// it works for js and Python sites
function ajaxcall(json_from_frontend) {

    let url = json_from_frontend.url ? json_from_frontend.url : "http://127.0.0.1:1234/backend" // if the url is not defined, use the default url of ""http://127.0.0.1:1234/backend""
    let backendapp_cmd = json_from_frontend.backendapp_cmd ? json_from_frontend.backendapp_cmd : ""

    // console.log(requestdatajson_str)
    let dataType = json_from_frontend.dataType ? json_from_frontend.dataType : null
    let format = json_from_frontend.format ? json_from_frontend.format : null
    let type = json_from_frontend.type ? json_from_frontend.type : 'POST'
    let crossDomain = json_from_frontend.crossDomain ? json_from_frontend.crossDomain : true
    let data = json_from_frontend.data ? json_from_frontend.data : null
    let contentType = json_from_frontend.contentType ? json_from_frontend.contentType : null
    let timeout = json_from_frontend.timeout ? json_from_frontend.timeout : null

    console.log(url, type, contentType, dataType, crossDomain, data, format, timeout)

    return $.ajax({
        url: url,
        type: type,
        contentType: contentType,
        dataType: dataType,
        crossDomain: crossDomain,
        data: data,
        format: format,
        timeout: timeout,
        // success: function (responsedatajson_str) {
        //     // do something with responsedatajson_str
        // } // success
        error: function (err) {
            console.log(err)
            d3.select('div#coverall').remove()
            let backendapp_cmd_str = backendapp_cmd.length > 0 ? `Activate the backend server by going to the root folder of the javascript project or the Python project, and typing the following in a powershell or dos command terminal:\n\n${backendapp_cmd}` : ""
            alert(`Error! There is no response from the backend. Make sure the virtual server is running at ${url}. ${backendapp_cmd_str}`)
        }
    }) // ajax
} // function ajaxcall

function make_wait_modal() {
    d3.select('div#coverall').remove()

    d3.select('body').append('div').attrs({ 'id': 'coverall' }).styles(
        {
            'background-color': 'rgba(0,0,0,0.0)', 'width': '100%', 'height': '100%', 'z-index': '100000', 'position': 'absolute', 'left': '0px', 'top': '0px',
            'color': 'lightgrey', 'text-align': 'center', 'line-height': (window.innerHeight * 1.5) + 'px', 'font-family': 'arial', 'font-size': '100px', 'font-weight:': 'bold'
        }
    ).text('Wait...')
} // make_cover_modal

// get a json which was stored in a html element's attribute as a base64str of a gzip buffer
async function get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name) {
    let base64str = d3.select(html_identifier).attr(attr_name)
    let datajson = null
    if (base64str){
        let gzbuffer = convert_base64str_to_buffer(base64str)
        // if (attr_name === 'src_data_file_info') {
        //     // console.log(base64str)
        //     // console.log(gzbuffer)
        // }
        datajson = convert_gzbuffer_to_json(gzbuffer)
        // console.log(datajson)
    }
    return datajson
}


async function save_json_to_html_attr_base64str_of_gzbuffer(datajson, html_identifier, attr_name) {
    // console.log(datajson, attr_name )
    // note: it overwrites the existing data!
    let json_str = JSON.stringify(datajson)
    let gzbuffer = await pako.gzip(json_str)
    let base64str = convert_buffer_to_base64(gzbuffer)
    // console.log(`updated ${attr_name} base64str`, base64str.length)
    let existing_base64str = d3.select(html_identifier).attr(attr_name)
    if (existing_base64str) { console.log('existing base64str is overwritten', attr_name, existing_base64str.length) }
    d3.select(html_identifier).attr(attr_name, base64str)
}


// to convert base64 str back to buffer
function convert_base64str_to_buffer(base64str) {
    let binary_string = atob(base64str)
    let len = binary_string.length;
    let buffer = new Uint8Array(len); // buffer is actuall an array of bytes
    for (let i = 0; i < len; i++) {
        buffer[i] = binary_string.charCodeAt(i);
    }
    return buffer
}


// to convert a gzbuffer to data json
function convert_gzbuffer_to_json(gzbuffer) {
    let datajsonstr = pako.ungzip(gzbuffer, { 'to': 'string' })
    let datajson = JSON.parse(datajsonstr)
    return datajson
}

// base64str = btoa(String.fromCharCode(...gzbuffer.Uint8Array)) // not work and causes memory exceeds capacity
function convert_buffer_to_base64(bufferArray) {
    // https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
    let base64str = btoa(
        new Uint8Array(bufferArray)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    return base64str
} // convert_buffer_to_base64

function bufferToStream (buffer) {
    let stream = new Duplex()
    stream.push(buffer)
    stream.push(null)
    return stream
  }

async function waitfor(seconds){
    return await new Promise((resolve) => {setTimeout(()=>{ resolve(`waited for ${seconds} second(s)`)}, seconds*1000);}).then(d => { console.log(d)}) 
}


// load data at frontend from a local file within the project



// open a file, -- load data at frontend from a file from any local folder
// the following won't work as it does not allow loading local file by XML HttpRequest()
async function readTextFile_byfilenamepath(filenamepath) {
    let newpromise = new Promise(
        // then new promise is to define a resolved value
        (resolve) => {
            let rawFile = new XMLHttpRequest();
            rawFile.open("GET", filenamepath, false);
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status == 0) {
                        let allText = rawFile.responseText;
                        // console.log(allText)
                        resolve(allText)
                    }//
                }//
            }//
            rawFile.send(null)
        }//resolve
    ) // new promise;
    let resolved = await newpromise.then(d => {
        return d
    })
    return resolved
};//readTextFile_byfilenamepath

// load file by openfile as an obj
async function openfileAsObj() {

    let inputem = document.createElement('input');
    inputem.type = 'file';
    inputem.click();

    const newpromise = new Promise(
        // then new promise is to define a resolved value
        (resolve) => {
            // the resolved value is obtained by the https.get method
            // to get response on the url (i.e., esearchstr)
            inputem.onchange = _ => {
                let thefirstfileobj = inputem.files[0]
                resolve(thefirstfileobj)
            };
        })

    const resolved = await newpromise.then(d => {
        // console.log(d)
        return d
    });

    inputem.remove()
    return resolved
} // d3network_importData


// load data at backend from a local file, or a url
////////////////////////////////////////////////////



/////////////////////////////////////////////////////


