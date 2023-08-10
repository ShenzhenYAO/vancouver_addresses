
const global_geocoder_actions_dict = {
    "define file locations": define_location_of_files,
    // "load bccs csv": js_geocoder_01_load_bccs_csv,
    "show bccs original addresses (test)": display_bccs_original_addresses,
    "get bc geocoder standard (test)": test_get_bc_geocoder,
    // "save json to backend (test)": test_save_json_to_backend,
    "load bccs std addr (before review)": js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review,
    "show bccs standard addresses (test)": display_bccs_standard_addresses,
    "show poor matching geocoder bc bccs std addr (before review)": test_show_poormatching_geocoder_bc_bccs_standard_addresses_before_review
}

async function define_location_of_files() {
    console.log("define file locations")

    // show questions and ask for input in the display box
    let displaybox_d3pn = d3.select('div#display').styles({ 'display': 'block' })
    displaybox_d3pn.html('')

    // nay... it is impossible to open a local file by its absolute path (for security concern)

    // displaybox_d3pn.append('label').text('Where is the file containing original addresses?').styles({ 'font-size': '12px'})
    // displaybox_d3pn.append('p')
    // let placehodertext = "c:\\mydata\\addresses.csv"
    // displaybox_d3pn.append('input').attrs({ 'id': 'fullpath_sourcefile', 'placeholder':placehodertext }).styles({ 'font-size': '12px', 'line-height': '18px', 'width': '70%', 'border': 'solid 0px black', 'border-bottom': 'solid 0.5px black', 'outline': '0px solid transparent' })
    // .on('keyup', (ev) => {
    //     if (ev.key === 'Enter') { d3.select('button#submit_fullpath_sourcefile').node().click() }
    // })
    displaybox_d3pn.append('button').attrs({ 'id': 'open_sourcefile' }).text('open the file containing original addresses').styles({ 'margin-left': '5px' })
        .on('click', test_getting_src_file)

    displaybox_d3pn.append('p')
    displaybox_d3pn.append('button').attrs({ 'id': 'show_colnames' }).text('list out column names of the source data').styles({ 'margin-left': '5px' })
        .on('click', show_srcdata_colnames)
    displaybox_d3pn.append('p')

    // a div to select colnames
    displaybox_d3pn.append('div').attrs({ 'id': 'select_colnames' })

    // test reading it
    displaybox_d3pn.append('p')
    displaybox_d3pn.append('button').attrs({ 'id': 'get_original_addresses' }).text('get original addresses').styles({ 'margin-left': '5px' })
        .on('click', get_original_addresses)
    displaybox_d3pn.append('p')

    // display the original addresses
    displaybox_d3pn.append('p')
    displaybox_d3pn.append('button').attrs({ 'id': 'display_original_addresses' }).text('display_original_addresses').styles({ 'margin-left': '5px' })
        .on('click', display_original_addresses)
    displaybox_d3pn.append('p')

    // test the address data

}

async function display_original_addresses() { // note: similar to display_bccs_original_addresses
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_original_address'
    let datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

    // if there is nothing saved in the html_identifier, try to load it from backend
    if (!datajson) {
        // probably need to start from getting the original src file (e.g., a csv file)
        // and define the colnames, and make address data again
        await  get_original_addresses()
        return // need to pause until the src file data is loaded, the colnames selected, and the address data is made
    }

    // console.log(datajson) // like {addr1: ["lat1, long1", ...]}
    if (!datajson) { return }
    // display it as a list 
    let display_div_d3pn = d3.select('div#display')
    display_div_d3pn.html('')
    display_div_d3pn.styles({ 'display': 'block' })
    let addrs_ul_d3pn = display_div_d3pn.append('ul').styles({ 'font-size': '12px', 'padding': '6px' })
    let addrs_dict = datajson.data
    let addrs_arr = Object.keys(addrs_dict)
    addrs_arr.sort()
    for (let i = 0; i < addrs_arr.length; i++) {
        let this_arr = addrs_arr[i]
        let gps = addrs_dict[this_arr]['gps']
        addrs_ul_d3pn.append('li').text(this_arr).attrs({ 'gps': gps, 'title': gps ? gps : '' })
    }
}


async function get_original_addresses(){ //

    // load original data
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name1 = 'src_address_data'
    let src_address_data_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name1) // like[[colnames..], []]
    if (! src_address_data_json){ 
        await test_getting_src_file()
        src_address_data_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name1) // like[[colnames..], []]
    }
    // console.log(src_address_data_json)

    let src_address_data_arr = src_address_data_json.data
    let colnames_in_original_data_arr = src_address_data_arr[0]
    // console.log(colnames_in_original_data_arr)

    // load addr_col_sets
    let attrname2 = 'original_data_address_colnames'
    let colname_sets_arr = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attrname2) // like [{address: , latitude:, longitude:}, {}]
    // console.log(colname_sets_arr)

    if (! colname_sets_arr ){
        await show_srcdata_colnames()
        return
    }

    // loop for each colname_sets
    let original_addrs_dict = Object.create(null) 
    colname_sets_arr.forEach(c=>{
        let colname_address = c.address
        let index_colname_address = colnames_in_original_data_arr.indexOf(colname_address)
        let original_addresses_arr = src_address_data_arr.map(x=>x[index_colname_address])
        // console.log(original_addresses_arr)

        let colname_lat = c.latitude
        let index_colname_lat = colnames_in_original_data_arr.indexOf(colname_lat)
        let original_lats_arr = src_address_data_arr.map(x=>x[index_colname_lat])


        let colname_long = c.longitude
        let index_colname_long = colnames_in_original_data_arr.indexOf(colname_long)
        // console.log(index_colname_long)
        let original_longs_arr = src_address_data_arr.map(x=>x[index_colname_long])
        // console.log(original_longs_arr)

        original_addresses_arr.forEach((x, i)=>{
            if (i===0){return} // skip the first row as it is the col names
            let addr_value = original_addresses_arr[i]
            if (! addr_value || addr_value.trim().length===0){return}
            let lat_value = original_lats_arr[i]?original_lats_arr[i]:''
            // console.log(original_longs_arr[i])
            let long_value = original_longs_arr[i]?original_longs_arr[i]:''
            let gps_str=''
            if (lat_value.length>0 && long_value.length>0){
                gps_str = `${lat_value},${long_value}`
            }
            if (! original_addrs_dict[addr_value]){original_addrs_dict[addr_value] = {gps:[gps_str]}}
            else{
                if (! original_addrs_dict[addr_value]['gps'].includes(gps_str)){original_addrs_dict[addr_value]['gps'].push(gps_str)}
            }
            
        })
    })
    console.log(original_addrs_dict)

    await update_original_addresses_at_frontend(original_addrs_dict)
}

async function update_original_addresses_at_frontend(new_original_addrs_dict){

    // make meta data info
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name0 = 'src_data_file_info'
    let src_file_info_dict = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name0)
    
    let meta={
        description:'distinct addresses (with gps lat/long data) from home, injury, and death locations',
        program:['frontend/app/modules/geocoder/geocoder.js'],
        source: src_file_info_dict
    }

    // load the existing original_address data
    let attr_name1 = 'geocoder_original_address'
    let datajson1 = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name1)
    let original_addrs_dict = Object.create(null) 
    if (datajson1){original_addrs_dict = datajson1['data']}

    // load the new 
    let updated_datajson = Object.create(null)
    updated_datajson['meta'] = meta
    updated_datajson['data'] = original_addrs_dict

    let new_addrs_arr = Object.keys(new_original_addrs_dict)
    new_addrs_arr.forEach(a=>{
        if (! updated_datajson['data'][a]){
            console.log('adding address dict ===')
            updated_datajson['data'][a] = new_original_addrs_dict[a]
        }
        else {
            new_original_addrs_dict[a]['gps'].forEach(g=>{
                if ( (! updated_datajson['data'][a]['gps']) || (! updated_datajson['data'][a]['gps'].includes(g))){
                    console.log('add a gps ====')
                    updated_datajson['data'][a]['gps'].push(g)
                }
            })
        }
    })

    // console.log(updated_datajson)
    await save_json_to_html_attr_base64str_of_gzbuffer(updated_datajson, html_identifier, attr_name1)

}


async function show_srcdata_colnames() {
// list out the column names (order as appeared in the src file)
    // read data from the html file
    let html_identifier = `div#${global_project_datadiv_id}`
    // console.log(97, d3.select(html_identifier).node())
    let attr_name = `src_address_data`
    let datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

    let src_addr_arr

    // set default value for debugging
    if (!datajson) {
        // src_addr_arr = [['addr1', 'lat1', 'long1', 'add3', 'add2', 'lat2', 'long2',]]
        await test_getting_src_file()
        datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)
        src_addr_arr = datajson.data
    } else {
        src_addr_arr = datajson.data
    }
    let colnames_arr = src_addr_arr[0]

    // make a table for selected colnames for addr, lat and long
    let displaybox_d3pn = d3.select('div#display').styles({ 'display': 'block' })
    let select_colnames_box_d3pn = d3.select('div#select_colnames')
    select_colnames_box_d3pn.select('table#src_colnames').remove()
    let colnames_table_d3pn = select_colnames_box_d3pn.append('table').attrs({ 'id': 'src_colnames' }).styles({'font-size':'12px', 'width':'99%'})
    let colnames_titletr_d3pn = colnames_table_d3pn.append('tr').attrs({ 'id': 'src_colnames_title' })
    let col_types_arr = ['address', 'latitude', 'longitude']
    col_types_arr.forEach(t => {
        let width = '30%'
        if (t === 'address'){width='30%'}
        colnames_titletr_d3pn.append('td').text(`${t}`).styles({'width': width})
    })
    let buttons_td_d3pn = colnames_titletr_d3pn.append('td')


    // add the first row
    await add_one_row(col_types_arr, colnames_arr)
    

}

function make_original_addresses_colnames(){ 

    let colname_sets_arr =[] // [{address:, lat:, long:}]
    // get colnames from the input
    let trs_arr = d3.selectAll('tr.colnames_tr').nodes()
    trs_arr.forEach(r=>{
        let tr_d3pn = d3.select(r)
        // let rowi = r.attr('rowi')
        let data_type_arr = ['address', 'latitude', 'longitude']
        let tmp_dict=Object.create(null)
        data_type_arr.forEach(t=>{
            let input_dom_this_datatype = tr_d3pn.select(`input#${t}`).node()
            tmp_dict[t] =  input_dom_this_datatype.value
        })
        colname_sets_arr.push(tmp_dict)
    })
    return colname_sets_arr
}

async function add_one_row(col_types_arr, colnames_arr){ // use input - datalist, not select-options
    let displaybox_d3pn = d3.select('div#display').styles({ 'display': 'block' })
    let colnames_table_d3pn = displaybox_d3pn.select('table#src_colnames')

    // determine the number of trs before adding a new tr
    let tr_doms_arr = colnames_table_d3pn.selectAll('tr.colnames_tr').nodes()
    tr_doms_length = tr_doms_arr.length
    // console.log(tr_doms_length)

    // add a new tr
    let colnames_tr_d3pn = colnames_table_d3pn.append('tr').attrs({'class':'colnames_tr', 'rowi': tr_doms_length})
    col_types_arr.forEach(t => {
        let td_d3pn= colnames_tr_d3pn.append('td').attrs({'id':`${t}`, 'rowi':tr_doms_length})

        let select_d3pn = td_d3pn.append('input').attrs({'id': `${t}`, 'class':'colnames', 'type':'text', 'list':`${t}_colnames_${tr_doms_length}`}).styles({'width':'80%'})
        let datalist_d3pn = td_d3pn.append('datalist').attrs({'id':`${t}_colnames_${tr_doms_length}`})
        select_d3pn
        .on('blur', async (ev)=>{ // blur -- losing focus of this element, focusout -- losing focus of this element and all its descendants

            let inputvalue = ev.target.value
            if (! colnames_arr.includes(inputvalue) && inputvalue.length>''){
                console.log('invalid input:', inputvalue)
                let previous_inputvalue = ev.target.getAttribute('previous_inputvalue')
                if (! previous_inputvalue) {
                    ev.target.value = ''
                } else {
                    ev.target.value = previous_inputvalue
                }
            }
            ev.target.setAttribute('previous_inputvalue', ev.target.value)

            // console.log('changed')
            // check all values in the select elements
            let unselected_colnames_arr= get_unselected_colnames(colnames_arr)
            // update all the select elements options
            update_colnames_select_elements(unselected_colnames_arr)  
            
            // save selected_colnames_arr {address:{gps: [lat, long]}}
            let colname_sets_arr = make_original_addresses_colnames()
            // save it to project data div
            let html_identifier = `div#${global_project_datadiv_id}`
            let attr_name = 'original_data_address_colnames'
            await save_json_to_html_attr_base64str_of_gzbuffer(colname_sets_arr, html_identifier, attr_name)

        })

        // datalist_d3pn.append('option').attrs({'value':'', 'selected':true}).text('')
        let unselected_colnames_arr= get_unselected_colnames(colnames_arr)
        // console.log(unselected_colnames_arr)
        unselected_colnames_arr.forEach(d=>[
            datalist_d3pn.append('option').attrs({'value': `${d}`, 'title':`${d}`}).text(`${d}`)
        ])
        // console.log(td_d3pn.node())
    })
    buttons_td_d3pn = colnames_tr_d3pn.append('td')
    buttons_td_d3pn.append('button').text('+').on('click', async ()=>{
        // console.log('+ clicked')
        await add_one_row(col_types_arr, colnames_arr)
    })
    buttons_td_d3pn.append('button').text('-').on('click', async (ev)=>{
        let thisbutton_dom = ev.target
        // determine the tr where thisbutton_dom is in (.parent is a td, .parent.parent is the tr)
        let tr_of_thisbutton_dom = thisbutton_dom.parentElement.parentElement
        let tr_rowi = parseInt(tr_of_thisbutton_dom.getAttribute('rowi'))
        if (tr_rowi>0) {colnames_table_d3pn.selectAll('tr.colnames_tr').nodes()[tr_rowi].remove()}
        let unselected_colnames_arr= get_unselected_colnames(colnames_arr)
        update_colnames_select_elements(unselected_colnames_arr)
        // need to update the rowi of the following tr, td, input.colnames, and datalist
        colnames_table_d3pn.selectAll('tr.colnames_tr').nodes().forEach((r,i)=>{
            let rowi=i
            d3.select(r).attrs({'rowi':rowi})
            d3.select(r).select('td').attrs({'rowi':rowi})
            let type = d3.select(r).select('td').attr('id') // like address, lat, long
            let x =`${type}_colnames_${rowi}`
            d3.select(r).select('td').select('input.colnames').attrs({'list':`${x}`})
            d3.select(r).select('td').select('datalist').attrs({'id':`${x}`})
        })

        // save selected_colnames_arr {address:{gps: [lat, long]}}
        let colname_sets_arr = make_original_addresses_colnames()
        // save it to project data div
        let html_identifier = `div#${global_project_datadiv_id}`
        let attr_name = 'original_data_address_colnames'
        await save_json_to_html_attr_base64str_of_gzbuffer(colname_sets_arr, html_identifier, attr_name)

    })
}




function update_colnames_select_elements(unselected_colnames_arr){
    // console.log('update colnames select elements=====')
    let select_doms_arr = d3.selectAll('input.colnames').nodes()
    // console.log(select_doms_arr)
    select_doms_arr.forEach(s=>{
        // if (s === ev.target) {console.log ('skip the current select'); return}
        let select_d3pn = d3.select(s)
        let td_d3pn = d3.select(s.parentElement)
        let rowi = td_d3pn.attr('rowi')
        // console.log(td_d3pn.node().id)
        let datalist_d3pn = td_d3pn.select(`datalist#${td_d3pn.node().id}_colnames_${rowi}`)
        // console.log(datalist_d3pn.node().id)
        let current_select_value = s.value
        // console.log(current_select_value)
        datalist_d3pn.selectAll('option').remove()
        // datalist_d3pn.append('option').attrs({'value':''}).text('')                
        let unselected_colnames_thisselect_arr=[current_select_value, ...unselected_colnames_arr]
        unselected_colnames_thisselect_arr = unselected_colnames_thisselect_arr.filter(x=>x.length>0)
        // console.log(unselected_colnames_thisselect_arr)
        unselected_colnames_thisselect_arr.forEach(c=>{
            datalist_d3pn.append('option').attrs({'id':`${c}`, 'value':`${c}`, 'title':`${c}`}).text(`${c}`)
        })
        // console.log(datalist_d3pn.node())
        s.value = current_select_value
    })
}

function get_unselected_colnames(colnames_arr){
    let selected_colnames_arr = []
    let colname_select_doms_arr = d3.selectAll('input.colnames').nodes()
    colname_select_doms_arr.forEach(c=>{
        let select_colname = c.value
        // console.log(c.value)
        if (select_colname.length > 0 && ! selected_colnames_arr.includes(select_colname)){selected_colnames_arr.push(select_colname)}
    })
    // console.log(selected_colnames_arr)

    // remove the selected value from the unselected 
    let unselected_colnames_arr = colnames_arr.filter(x=> ! selected_colnames_arr.includes(x) && x.length >0)
    // console.log(unselected_colnames_arr)
    return unselected_colnames_arr   
}


// async function show_srcdata_colnames1() {
//     // list out the column names (order as appeared in the src file)
//     // read data from the html file
//     let html_identifier = `div#${global_project_datadiv_id}`
//     // console.log(97, d3.select(html_identifier).node())
//     let attr_name = `src_address_data`
//     let datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

//     let src_addr_arr

//     // set default value for debugging
//     if (!datajson) {
//         src_addr_arr = [['addr1', 'lat1', 'long1', 'add3', 'add2', 'lat2', 'long2',]]
//     } else {
//         src_addr_arr = datajson.data
//     }
//     let colnames_arr = src_addr_arr[0]
//     // console.log(colnames_arr)

//     let displaybox_d3pn = d3.select('div#display').styles({ 'display': 'block' })
//     displaybox_d3pn.select('table#src_colnames').remove()
//     let colnames_table_d3pn = displaybox_d3pn.append('table').attrs({ 'id': 'src_colnames' })
//     let colnames_tr_d3pn = colnames_table_d3pn.append('tr').attrs({ 'id': 'src_colnames' })
//     // left
//     let src_colnames_td_d3pn = colnames_tr_d3pn.append('td').attrs({ 'id': 'src_colnames' }).styles({ 'width': '40%', 'max_width': '45%' })
//     src_colnames_td_d3pn.select('select#src_colnames').remove()
//     let select_srccolnames_d3pn = src_colnames_td_d3pn.append('select').attrs({ 'id': 'src_colnames', 'multiple': true, 'size': '30' }).styles({ 'width': '99%' })
//     colnames_arr.forEach(d => {
//         select_srccolnames_d3pn.append('option').attrs({ 'id': `left_${d}`, 'value': `${d}`, 'colname': `${d}`, 'title': `${d}` }).text(`${d}`)
//     })

//     // middle and right, make into one table of three rows
//     let select_columns_td_d3pn = colnames_tr_d3pn.append('td').attrs({ 'id': 'select_buttons' }).styles({ 'vertical-align': 'middle', 'padding': '5px', 'width': '50%', 'max_width': '54%' })
//     let select_columns_table_d3pn = select_columns_td_d3pn.append('table')

//     // add three rows
//     let col_types_arr = ['address', 'latitude', 'longitude']
//     col_types_arr.forEach(t => {
//         // add tr elements for each col type
//         let tr_d3pn = select_columns_table_d3pn.append('tr').attrs({'id': 'select_colnames_rows'})
//         // add a td for buttons
//         let td_button_d3pn = tr_d3pn.append('td').styles({'width':'8%'})
//         // add buttons
//         td_button_d3pn.append('p').text(`${t}`)
//         td_button_d3pn.append('button').text('>').on('click', () => {
//             d3.select(`select#selected_colnames_${t}`).styles({ 'display': 'inline' })
//             $(`select#src_colnames`).find(':selected').appendTo(`select#selected_colnames_${t}`);
//         })
//         td_button_d3pn.append('p')
//         td_button_d3pn.append('button').text('<').on('click', () => {
//             $(`select#selected_colnames_${t}`).find(':selected').appendTo(`select#src_colnames`);
//             // hide the selected select element if there is no options
//             let n_selected_options = d3.select(`select#selected_colnames_${t}`).selectAll('option').nodes()
//             if (!n_selected_options || n_selected_options.length === 0) {
//                 d3.select(`select#selected_colnames_${t}`).styles({ 'display': 'none' })
//             }
//         })

//         // add a td for selected colnames
//         let td_selected_colnames_d3pn = tr_d3pn.append('td').styles({'width':'40%', 'max-width':'45%'})
//         // add a select
//         td_selected_colnames_d3pn.append('select').attrs({ 'id': `selected_colnames_${t}`, 'multiple': true, 'size': '10' }).styles({ 'display': 'none', 'width': '99%' })
    

//     })


//     // let button_td_d3pn = select_buttons_table_d3pn.append('tr').append('td')
    


//     // // right
//     // // hmmm, there would be multiple select elements, each for address, lat and long
//     // let selected_colnames_td_d3pn = colnames_tr_d3pn.append('td').attrs({ 'id': 'selected_colnames' }).styles({ 'width': '40%', 'max_width': '45%', 'border': '0px solid grey' })
//     // // in this td, add a table with three tr and tr 
//     // let selected_colnames_table_d3pn = selected_colnames_td_d3pn.append('table').styles({ 'width': '99%' })
//     // selected_colnames_table_d3pn.append('tr').append('td').text('addr').append('select').attrs({ 'id': 'selected_colnames_address', 'multiple': true, 'size': '10' }).styles({ 'display': 'none', 'width': '99%' })
//     // selected_colnames_table_d3pn.append('tr').append('td').text('lat').append('select').attrs({ 'id': 'selected_colnames_latitude', 'multiple': true, 'size': '10' }).styles({ 'display': 'none', 'width': '99%' })
//     // selected_colnames_table_d3pn.append('tr').append('td').text('long').append('select').attrs({ 'id': 'selected_colnames_longitude', 'multiple': true, 'size': '10' }).styles({ 'display': 'none', 'width': '99%' })

// }


async function test_getting_src_file() {

    let html_identifier = `div#${global_project_datadiv_id}`
    let src_file_obj = await openfileAsObj()
    console.log(src_file_obj)

    let attr_name0 = 'src_data_file_info'
    await save_json_to_html_attr_base64str_of_gzbuffer(src_file_obj, html_identifier, attr_name0)

    let datastr = await get_datastr_from_local_fileobj(src_file_obj)
    // console.log(datastr)

    let filenamesegs_arr = src_file_obj.name.split('.')
    let extname = filenamesegs_arr[filenamesegs_arr.length - 1]
    console.log(extname)

    let src_datajson = { 'meta': { src: src_file_obj }, data: null }

    let xlsx_filetypes_arr = ['xlsx', 'xlsm']
    if (xlsx_filetypes_arr.includes(extname)) {
        // https://www.npmjs.com/package/exceljs?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library#reading-csv
        let databuffer = convert_base64str_to_buffer(datastr)
        let workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(databuffer)
        console.log('55', workbook)
        workbook.eachSheet(function (worksheet, sheetId) {
            // ...
            console.log(sheetId, worksheet.name)
        });

        // ask which worksheets to get data from

        // for each sheet, ask // ask which row contains the column names

        // what column names to get data from


    }
    else if (extname === 'csv') {

        // ExcelJS does not work well with csv files (need to convert datastr to stream, whic cannot be done at client side!)
        // use papaparse instead https://www.papaparse.com/docs#local-files
        let parsed_dict = Papa.parse(datastr,
            {
                complete: function (d) {
                    // console.log('completed', d)
                }
            })

        src_datajson['data'] = parsed_dict.data

        // list out the colnames and ask what columns to select
    }

    if (!src_datajson.data) { console.log('there is no data loaded'); return }

    // save the src json to 

    
    // console.log(97, d3.select(html_identifier).node())
    let attr_name = `src_address_data`
    await save_json_to_html_attr_base64str_of_gzbuffer(src_datajson, html_identifier, attr_name)

}



// get data (as str) from a local fileobj
async function get_datastr_from_local_fileobj(fileobj) {

    let data_str

    // determine whether it is a text or a binary file
    // get the extension name
    let binaryfile = false
    let filenamesegs_arr = fileobj.name.split('.')
    let extname = filenamesegs_arr[filenamesegs_arr.length - 1]
    // console.log(extname)

    let binary_file_extnames_arr = ['gz', 'zip', 'xlsx', 'xlsm']
    if (binary_file_extnames_arr.includes(extname)) {
        binaryfile = true
        // read data as a buffer file
        console.log(`the file ${fileobj.name} is read as a buffer`)
        let databuffer = await get_data_from_binary_fileobj(fileobj)
        // console.log(databuffer)
        let data_base64str = convert_buffer_to_base64(databuffer) // note: does not work using lines like: let base64str = gzbuffer.toString('base64') Buffer.toString() only works in backend Node.js
        data_str = data_base64str
    }
    else {
        // read data as a txt file
        console.log(`the file ${fileobj.name} is read as a txt file`)
        data_str = await get_data_from_text_fileobj(fileobj)
        // save it to the metadatadiv
    }

    return data_str
}

// get data from a text fileobj
async function get_data_from_text_fileobj(fileobj) {
    let newpromise = new Promise(
        // then new promise is to define a resolved value
        (resolve) => {
            readlocaltxtfileobj(fileobj, async function (f) {
                // console.log(f)
                resolve(f.target.result) // f.target.result is a string
            });
        })
    let resolved = await newpromise.then(d => {
        // console.log(d)
        return d
    });
    return resolved
}
// read binary file from a fileobj as buffer  
// note: a similar function is readgzfile() in frontend\js\modules\writing\pyapp_writing.js
async function get_data_from_binary_fileobj(fileobj) {
    let newpromise = new Promise(
        // then new promise is to define a resolved value
        (resolve) => {
            readlocalbinaryfile(fileobj, async function (f) {
                // console.log(f.target.result)
                resolve(f.target.result) // f.target.result is a string
            });
        })
    let resolved = await newpromise.then(d => {
        // console.log(d)
        return d
    });
    return resolved
}

// read contents from a fileobj
function readlocaltxtfileobj(thefileobj, callback_whendoneDosomething) { // the fileobj is a file system object, containing file name, size, path, etc.
    var newreaderinstance = new FileReader(); // create a new instance of FileReader() class
    newreaderinstance.readAsText(thefileobj); // use the method readAsText of the new instance to read the file
    newreaderinstance.onload = callback_whendoneDosomething; // when the loading is done, run the call back function defined in the readfile instance
};
// read contents as buffer from a fileobj
function readlocalbinaryfile(thefileobj, callback_whendoneDosomething) { // the fileobj is a file system object, containing file name, size, path, etc.
    var newreaderinstance = new FileReader(); // create a new instance of FileReader() class
    newreaderinstance.readAsArrayBuffer(thefileobj); // use the method readAsText of the new instance to read the file
    newreaderinstance.onload = callback_whendoneDosomething; // when the loading is done, run the call back function defined in the readfile instance
};

async function makepage_geocoder() {

    d3.select('div#stage').html()
    d3.select('textarea#status').text('status')
    let thisdom = d3.select('textarea#status').node()
    thisdom.style.height = "" // must have -- to set height to 0
    // console.log(thisdom.scrollHeight)
    let thisdom_ht = thisdom.scrollHeight > 80 ? '80px' : thisdom.scrollHeight + "px"
    thisdom.style.height = thisdom_ht // resize the textarea

    console.log('makepage_geocoder')

    // add a list of actions in the stage
    let stage_d3pn = d3.select('div#stage')

    // make a stage for this 
    let geocoder_stage_d3pn = stage_d3pn.append('div')
        .attrs({
            'id': 'lit_stage',
        })
        .styles({
            'position': 'absolute',
            //    'top': '120px',
            'width': '50%',
            'border': '1px solid grey'
        })

    let ul_action_d3pn = geocoder_stage_d3pn.append('ul').attrs({ 'id': 'actions' })
    let geocoder_actions_str = "define file locations, load bccs csv, show bccs original addresses (test), get bc geocoder standard (test), save json to backend (test), load bccs std addr (before review), show bccs standard addresses (test), show poor matching geocoder bc bccs std addr (before review)"
    let geocoder_actions_arr = geocoder_actions_str.split(",").map(x => x.trim())
    geocoder_actions_arr = geocoder_actions_arr.filter(x => x.length > 0)
    let exclude_actions_str = "load bccs csv, save json to backend (test), show bccs standard addresses (test)"
    let exclude_actions_arr = exclude_actions_str.split(",").map(x => x.trim())
    geocoder_actions_arr = geocoder_actions_arr.filter(x => !exclude_actions_arr.includes(x))
    for (let i = 0; i < geocoder_actions_arr.length; i++) {
        let geocoder_actionname = geocoder_actions_arr[i]
        let action_d3pn = ul_action_d3pn.append('li').attrs({ 'id': `li_${geocoder_actionname}`, 'class': 'geocoder_actions', 'action': geocoder_actionname }).text(geocoder_actionname)
            .styles({ 'padding': '6px', 'font-size': '12px' })
        let geocoder_action_function = global_geocoder_actions_dict[geocoder_actionname]
        if (geocoder_action_function) {
            action_d3pn.on('click', geocoder_action_function)
        }
    }
}


async function display_bccs_original_addresses() {
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_bccs_original_addresses'
    let datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

    // if there is nothing saved in the html_identifier, try to load it from backend
    if (!datajson) {
        let confirm_result = confirm(' The original bccs addresses are not loaded, would you like to load the data now?')
        if (confirm_result) {
            await js_geocoder_01_load_bccs_csv()
            datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

        } else {
            console.log('stopped')
            return
        }
    }

    console.log(datajson) // like {addr1: ["lat1, long1", ...]}
    if (!datajson) { return }
    // display it as a list 
    let display_div_d3pn = d3.select('div#display')
    display_div_d3pn.html('')
    display_div_d3pn.styles({ 'display': 'block' })
    let addrs_ul_d3pn = display_div_d3pn.append('ul').styles({ 'font-size': '12px', 'padding': '6px' })
    let addrs_dict = datajson.data
    let addrs_arr = Object.keys(addrs_dict)
    addrs_arr.sort()
    for (let i = 0; i < addrs_arr.length; i++) {
        let this_arr = addrs_arr[i]
        let gps = addrs_dict[this_arr]['gps']
        addrs_ul_d3pn.append('li').text(this_arr).attrs({ 'gps': gps, 'title': gps ? gps : '' })
    }
}

async function display_bccs_standard_addresses() {
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_bccs_standard_addresses_before_review'
    let datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

    if (!datajson) {
        let confirm_result = confirm(' The existing standard bc geo addresses are not loaded, would you like to load the data now?')
        if (confirm_result) {
            await js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review()
            datajson = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)
        }
    }

    console.log(datajson)
}



async function js_geocoder_01_load_bccs_csv() {
    console.log('js_geocoder_01_load_bccs_csv')

    // send request to get the bccs data from the backend
    let backend_type = 'nodejs'
    let requesttask = 'js_geocoder_01_load_bccs_csv'
    let file_location = String.raw`\\vch.ca\departments\Public Health SU (Dept VCH-PHC)\Restricted\Overdose surveillance\master_data\bccs\data\bccs_master.csv`.replace(/\\/g, '/')
    let frontend_datajson = { file_location: file_location, attr_name: 'geocoder_bccs_original_addresses' }
    // console.log(frontend_datajson)
    let save_to_metadiv_spec = { html_identifier: `div#${global_project_datadiv_id}`, attr_name: frontend_datajson.attr_name }
    await restful(requesttask, backend_type, null, frontend_datajson, null, null, null, save_to_metadiv_spec)
}


async function js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review() {
    // send request to get the bccs data from the backend
    let backend_type = 'nodejs'
    let requesttask = 'js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review'
    let file_location = String.raw`\\vch.ca\departments\Public Health SU (Dept VCH-PHC)\\Restricted\Overdose surveillance\master_data\_geographic\bc_geocoder_standard_address\geocoder_bccs_standard_addresses_before_review.json`.replace(/\\/g, '/')
    let frontend_datajson = { file_location: file_location, attr_name: 'geocoder_bccs_standard_addresses_before_review' }
    // console.log(frontend_datajson)
    let save_to_metadiv_spec = { html_identifier: `div#${global_project_datadiv_id}`, attr_name: frontend_datajson.attr_name }
    await restful(requesttask, backend_type, null, frontend_datajson, null, null, null, save_to_metadiv_spec)
}

async function test_get_bc_geocoder() {


    // get the original addresses
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name1 = 'geocoder_bccs_original_addresses'
    let datajson1 = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name1)
    if (!datajson1) {
        let confirm_result = confirm(' The original bccs addresses are not loaded, would you like to load the data now?')
        if (confirm_result) {
            await js_geocoder_01_load_bccs_csv()
            datajson1 = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name1)

        } else {
            console.log('stopped')
            return
        }
    }
    // console.log(datajson)


    // get the existing std address 
    let attr_name2 = 'geocoder_bccs_standard_addresses_before_review'
    let datajson2 = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name2)
    if (!datajson2) {
        let confirm_result = confirm(' The existing standard bc geo addresses are not loaded, would you like to load the data now?')
        if (confirm_result) {
            await js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review()
            datajson2 = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name2)
        }
    }
    let std_addrs_dict = Object.create(null)
    if (datajson2) { std_addrs_dict = datajson2.data }
    // console.log(std_addrs_dict)

    // get the original addresses from the csv file
    let original_addrs_dict = datajson1.data
    // original_addrs_arr = original_addrs_arr.slice(0,2)
    let original_addrs_arr = Object.keys(original_addrs_dict)
    original_addrs_arr.sort()
    console.log(original_addrs_arr.length)

    // get the existing orginal addresses from the std bc geo addresses data
    let existing_original_addrs_arr = Object.keys(std_addrs_dict)
    console.log(existing_original_addrs_arr.length)


    let file_location = String.raw`\\vch.ca\departments\Public Health SU (Dept VCH-PHC)\Restricted\Overdose surveillance\master_data\_geographic\bc_geocoder_standard_address\geocoder_bccs_standard_addresses_before_review.json`.replace(/\\/g, '/')
    let count_new_address = 0

    for (let i = 0; i < original_addrs_arr.length; i++) {

        let original_address = original_addrs_arr[i]
        // console.log(`=== original address ${i + 1} of ${original_addrs_arr.length}`)

        if (existing_original_addrs_arr.includes(original_address)) {
            // console.log(`${original_address} has been searched.`); 
            continue;
        }

        count_new_address++
        // console.log(`${original_address} is new. Getting standard geo BC address...`)

        let std_addr_json = await get_bc_geocoder(original_address, null)
        if (!std_addr_json) { std_addr_json = { features: [{}] } }
        let refined_std_addr_json = { original_data: original_addrs_dict[original_address], geocoder_bc: std_addr_json.features } // only save the refined data, which is relevant and is saved in the key features
        std_addrs_dict[original_address] = refined_std_addr_json


        // make a new json adding meta data
        let new_json = {
            meta: {
                "description": `${file_location}`,
                "sources": [
                    "data from frontend"
                ],
                "programs": [
                    "C:/Users/syao2/AppData/Local/MyWorks/js/vancouver_addresses/backend/app/js/main.js"
                ]
            },
            data: std_addrs_dict
        }


        if (i / 500 === Math.floor(i / 500)) {
            // save to the project data div
            await save_json_to_html_attr_base64str_of_gzbuffer(new_json, html_identifier, attr_name2) // save the new json (with meta data)

            // also, save the std_addrs_dict to frontend\testdata using as a backend nodejs task
            await save_json_to_backend(file_location, std_addrs_dict) // but send to backend the dict only (without meta data as meta data will be added at backend)
        }
    }
    console.log('new searches', count_new_address)

    let new_json = { // have to define the new_json in and out the for loop above ...
        meta: {
            "description": `${file_location}`,
            "sources": [
                "data from frontend"
            ],
            "programs": [
                "C:/Users/syao2/AppData/Local/MyWorks/js/vancouver_addresses/backend/app/js/main.js"
            ]
        },
        data: std_addrs_dict
    }

    // save to the project data div    
    await save_json_to_html_attr_base64str_of_gzbuffer(new_json, html_identifier, attr_name2)

    // also, save the std_addrs_dict to frontend\testdata using as a backend nodejs task
    await save_json_to_backend(file_location, std_addrs_dict)
}

// async function test_save_json_to_backend() {
//     let file_location = String.raw`\\vch.ca\departments\Public Health SU (Dept VCH-PHC)\Restricted\Overdose surveillance\master_data\_geographic\bc_geocoder_standard_address\geocoder_bccs_standard_addresses_before_review.json`.replace(/\\/g, '/')
//     let datajson = { "test": "datajson" }
//     await save_json_to_backend(file_location, datajson)
// }

async function save_json_to_backend(file_location, datajson) {
    let requesttask = 'js_00a_save_json_to_backend'
    let backend_type = 'nodejs'
    let frontend_datajson = { file_location: file_location, data: datajson }
    await restful(requesttask, backend_type, null, frontend_datajson, null, null, null, null)
}


async function get_bc_geocoder(inputstr, search_type) { // get geocoder of a single address
    // let address = "12544 251ST sT, MAPLE RIDGE"
    // console.log('get_bc_geocoder')
    // make sure that there won't be > 1000 requests within one minute
    // i.e., each request should take at least 60/1000 seconds
    // console.log('waiting...')
    await waitfor(0.1)

    // console.log('address', address)
    // determine the search type
    // geocoder bc offers various search types
    // https://openapi.apps.gov.bc.ca/?url=https://raw.githubusercontent.com/bcgov/api-specs/master/geocoder/geocoder-combined.json#/occupants/get_occupants_nearest__outputFormat_
    if (!search_type) { search_type = 'addresses' }

    // test getting std addr data from https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=
    let api_prefix = "https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=" // by default -- search_type is addresses

    if (search_type !== 'addresses') {
        // must check if the inputstr is a point represented by gps coordinates (long, lat)
        let pattern = "^\\\s{0,}(-|)\\\d{1,}\\\.\\\d{1,}(\\\s{0,}),(\\\s{0,})(-||)\\\d{1,}\\\.\\\d{1,}"// "[0-9]+.\\\d+,( )(-)\\\d+.\\\d+"
        // may or may not start with any length of spaces
        // may or may not followed by a -
        // followed by any length of digits (0-9)
        // followed by a dot
        // followed by any length of digits
        // may or may not followed by spaces
        // followed by a comma
        //  may or may not followed by spaces
        // // followed by any length of digits (0-9)
        // followed by a dot
        // followed by any length of digits
        // like "   ddd.dddd  ,    -ddd.dddd   "
        let re = new RegExp(pattern)
        inputstr = inputstr.trim()
        let test = re.test(inputstr)
        if (!test) { alert('please input a gps point in the format of "longitude, latitude", e.g., ( -128.09288, 52.14843 )'); return }
        else {
            let gps_arr = inputstr.split(',').map(x => (x.trim()))
            let long_num = parseFloat(gps_arr[0])
            let lat_num = parseFloat(gps_arr[1])
            // long_num must be between -180 and 180
            // lat_num must be between -90 and 90
            if (long_num > 180 || long_num < -180) { alert(`The longitude value you input ${long_num} is not legal, it should be within -180 and 180. Make sure to input the longitude value first, followed by a latitude value.`); return }
            if (lat_num > 90 || lat_num < -90) { alert(`The latitude value you input ${lat_num} is not legal, it should be within -90 and 90. Make sure to input the longitude value first, followed by a latitude value. `); return }
            // for a gps long/lat in North America, long_num must be <0, and lat_num must >0
            if (long_num > 0) { alert(`The longitude value you input ${long_num} does not sounds like in North America. It should be within 0 and -180. Make sure to input a correct North American longitude value.`); return }
            if (lat_num < 0) { alert(`The lat_num value you input ${lat_num} does not sounds like in North America. It should be within 0 and 90. Make sure to input a correct North American latitude value.`); return }

            inputstr = gps_arr.join('%2C')
        }

    }


    if (search_type === 'sites') {
        api_prefix = "https://geocoder.api.gov.bc.ca/sites/nearest.geojson?point="
    } else if (search_type === 'intersections') {
        api_prefix = "https://geocoder.api.gov.bc.ca/intersections/nearest.geojson?point="
    } else if (search_type === 'occupants') {
        api_prefix = "https://geocoder.api.gov.bc.ca/occupants/nearest.geojson?point="
    }
    let urlstr = `${api_prefix}${inputstr}`
    // console.log(urlstr)

    let requesttask = 'get_bc_geocoder_stdaddress'
    let backend_type = 'frontend_api'
    let frontend_datajson = { url: urlstr }

    let function_to_run_after_receiving_response = async (d) => {
        // console.log(d)
        // the result will be saved to a temp location, so as to be picked up later

        let datastr = ""
        if (d) {
            datastr = JSON.stringify(d)
        }
        d3.select(`div#${global_project_datadiv_id}`).attrs({ 'tmp1': datastr })
    }

    await restful(
        requesttask,
        backend_type = backend_type,
        url_backend = urlstr,
        frontend_datajson = null,
        requestdatafromfrontend_json = null,
        json_from_frontend = null,
        function_to_run_after_receiving_response = function_to_run_after_receiving_response,
        save_to_metadiv_spec = null
    )

    // after it is done, the data should have been stored in 'tmp1' of global_project_datadiv_id
    let datastr = d3.select(`div#${global_project_datadiv_id}`).attr('tmp1')
    // remove the temp attr
    d3.select(`div#${global_project_datadiv_id}`).attrs({ 'tmp1': null })
    let datajson
    if (datastr.length > 0) {
        datajson = JSON.parse(datastr)
    }

    // console.log(datajson)
    return datajson

}



async function test_show_poormatching_geocoder_bc_bccs_standard_addresses_before_review() {
    // get the bccs std addresses before review
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_bccs_standard_addresses_before_review'
    let std_addr_before_review_dict_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)

    if (!std_addr_before_review_dict_json) {
        let confirm_result = confirm(' The existing standard bc geo addresses are not loaded, would you like to load the data now?')
        if (confirm_result) {
            await js_geocoder_01a_load_geocoder_bc_bccs_standard_address_before_review()
            std_addr_before_review_dict_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)
        }
    }


    let std_addr_before_review_dict = std_addr_before_review_dict_json.data // like {"Original address": {geocoder_bc: {...}}}
    // console.log(std_addr_before_review_dict)

    let matching_stats_dict = get_match_statistics(std_addr_before_review_dict)
    console.log(matching_stats_dict)

    let conditions_arr = [
        "features_arr.length === 0",
        "features_arr.length > 1",
        "features_arr[0].properties.score < 90",
        // "features_arr[0].properties.precisionPoints < 90 ",
        // "features_arr[0].properties.locationPositionalAccuracy !== 'high'", // seems locationPositionalAccuracy does not matter 
    ]
    let poor_matches_dict = get_poor_matches(std_addr_before_review_dict, conditions_arr)
    console.log(Object.keys(poor_matches_dict).length)

    // display the poor matches in the display box
    let display_div_d3pn = d3.select('div#display').styles({ "display": "block" })
    display_div_d3pn.html('')
        .styles({ 'height': '90%' })
    // append a select element and list out original addresses of the poorly matched

    let original_addrs_poor_matched_arr = Object.keys(poor_matches_dict)
    let addr_select_d3pn = display_div_d3pn.append('select').attrs({ 'id': 'addrs' })
    let index_addr_d3pn = display_div_d3pn.append('label').attrs({ 'id': 'index_addr' }).styles({ "margin-left": '5px', 'font-size': '10px', 'color': 'grey' })

    // addr_select_d3pn.append('option').attrs({ 'value': 'none', 'selected': true, 'disabled': true, 'hidden': true }).text('Select an address')
    for (let i = 0; i < original_addrs_poor_matched_arr.length; i++) {
        let this_addr = original_addrs_poor_matched_arr[i]
        addr_select_d3pn.append('option').attrs({ 'class': 'option_addr', 'addr': this_addr, 'value': this_addr, 'addr_index': i }).text(this_addr)
    }
    // on select change, display the json of the poorly matched
    addr_select_d3pn.on('change', async (ev) => {

        await display_std_geocoder_data(ev.target)
    })

    let original_addrs_arr = Object.keys(poor_matches_dict)
    let index_this_original_addr = original_addrs_arr.indexOf(original_addrs_arr[0])
    let index_str = `${index_this_original_addr + 1} of ${original_addrs_arr.length}`
    d3.select('label#index_addr').text(index_str)

    // insert a try box for re-entering new addr
    display_div_d3pn.append('p')
    display_div_d3pn.append('input').attrs({ 'id': 'retry_input' }).styles({ 'font-size': '12px', 'line-height': '18px', 'width': '70%', 'border': 'solid 0px black', 'border-bottom': 'solid 0.5px black', 'outline': '0px solid transparent' })
        .on('keyup', (ev) => {
            if (ev.key === 'Enter') { d3.select('button#retry_submit').node().click() }
        })
    let search_type_select_d3pn = display_div_d3pn.append('select').attrs({ 'id': 'search_type' }).styles({ 'font-size': '12px' })
    let search_types_arr = ['addresses', 'sites', 'intersections', 'occupants']
    search_types_arr.forEach((d, k) => {
        search_type_select_d3pn.append('option')
            .attrs({
                'class': 'search_option',
                'value': d, 'index': k
            })
            .text(d)
    })
    search_type_select_d3pn.node().value = 'addresses'

    display_div_d3pn.append('button').attrs({ 'id': 'retry_submit' }).styles({ 'font-size': '12px', 'line-height': '18px', 'margin-left': '5px' }).text('re-try')
        .on('click', get_bc_gecoder_by_input_addr)

    display_div_d3pn.append('p').attrs({ 'id': 'match_stats' }).styles({ 'font-size': '12px', 'line-height': '18px' })

    // check box to inidcate whether the poorly matched is a correct address or not 
    display_div_d3pn.append('input').attrs({ 'id': 'matched', 'type': 'radio', 'value': 'matched', 'name': 'matched_decision' })
        .on('click', async (ev) => {
            // confirm
            let confirm_result = confirm('Proceed to remove the current address from the poorly matched list?')
            // remember the current original addr
            let current_original_addr = d3.select('select#addrs').node().value
            console.log(current_original_addr)

            // get the index of the current address in all poorly matched addresses
            let options_doms_arr = d3.select('select#addrs').selectAll('option.option_addr').nodes()
            // console.log(options_doms_arr)
            let addrs_arr = []
            for (let j = 0; j < options_doms_arr.length; j++) {
                let thisaddr = options_doms_arr[j].getAttribute('addr')
                addrs_arr.push(thisaddr)
            }
            // console.log(addrs_arr)
            let index_currentaddr = addrs_arr.indexOf(current_original_addr)
            // console.log(index_currentaddr, current_original_addr)


            // console.log(confirm_result)
            if (!confirm_result) { ev.target.checked = false } else {

                // update and save the poorly matched list
                await update_std_addr_before_review_data()
                // update the options
                await test_show_poormatching_geocoder_bc_bccs_standard_addresses_before_review()

                // get the option address again. this time, the current addr has been deleted from the addr list
                let options_doms_arr2 = d3.select('select#addrs').selectAll('option.option_addr').nodes()
                // console.log(options_doms_arr)
                let addrs_arr2 = []
                for (let j = 0; j < options_doms_arr2.length; j++) {
                    let thisaddr2 = options_doms_arr2[j].getAttribute('addr')
                    addrs_arr2.push(thisaddr2)
                }

                // as the current addr has been deleted, now that the next addr has the same index as index_currentaddr, unless the current addr was the last in the arr
                let index_nextaddr = index_currentaddr < addrs_arr2.length ? index_currentaddr : 0
                let nextaddr = addrs_arr2[index_nextaddr]
                // console.log(index_nextaddr, nextaddr)
                let addr_select_dom = d3.select('select#addrs').node() // must select it again instead of using addr_select_d3pn
                addr_select_dom.value = nextaddr
                await display_std_geocoder_data(addr_select_dom)
            }
        })
    display_div_d3pn.append('label').text('yes the standard address is correct.').styles({ 'font-size': '12px' })
    // display_div_d3pn.append('input').attrs({'id':'unmatched', 'type':'radio', 'value': 'unmatched', 'name':'matched_decision'}) // by giving the same name, it only allows to check one of the radio input
    // display_div_d3pn.append('label').text('no, it is correct.').styles({'font-size': '12px'})
    display_div_d3pn.append('p')


    // insert a p for match  stats of the newly tried re-enterred addr
    display_div_d3pn.append('p').attrs({ 'id': 'retry_match_stats' }).styles({ 'font-size': '12px', 'line-height': '18px' })

    let textarea_d3pn = display_div_d3pn.append('textarea').attrs({ 'id': 'std_geocoderbc_data_for_review' }).styles({ 'display': 'none' })

}

async function get_bc_gecoder_by_input_addr() {
    let original_address = d3.select('select#addrs').node().value
    let retry_address = d3.select('input#retry_input').node().value
    // console.log(retry_address)
    // get search type (site, occupancy, intersection)
    let search_type = d3.select('select#search_type').node().value
    // console.log(search_type)

    let std_addr_json = await get_bc_geocoder(retry_address, search_type)
    if (!std_addr_json) { return }
    // console.log(std_addr_json) // -128.09288, 52.14843

    // only save the refined data, which is relevant and is saved in the key features
    // bc geocoder returns different type of data depending on search_type
    // if search_type is 'addresses', it returns a json dict with a features key
    // if search_type is sites, intersections, or occupants, it returns a json dict which is an element for the feature!!!
    let features_arr
    if (std_addr_json.features) { features_arr = std_addr_json.features }
    else { features_arr = [std_addr_json] }
    console.log(features_arr)
    features_arr[0].retry_data = { search_type: search_type, address: retry_address }
    let features_cnt1 = features_arr.length
    let score1 = features_arr[0].properties ? features_arr[0].properties.score : ""
    let precisionPoints1 = features_arr[0].properties ? features_arr[0].properties.precisionPoints : ""
    let locationPositionalAccuracy1 = features_arr[0].properties ? features_arr[0].properties.locationPositionalAccuracy : ""

    let faults_arr = features_arr[0].properties.faults
    let notinanyblock_str = ""
    if (faults_arr && faults_arr.length > 0) {
        for (let j = 0; j < faults_arr.length; j++) {
            let this_fault = faults_arr[j]['fault']
            console.log(this_fault)
            if (this_fault.toLowerCase().trim() === 'notinanyblock') { notinanyblock_str = `<br /><span style="color: red; "><strong> The civic number you are searching for does not belong to any block on this street.</strong></span>` }

        }
    }
    let civic_number = features_arr[0].civic_number
    let civic_number_str = ""
    if ((!civic_number || civic_number.length === 0) && notinanyblock_str.length === 0) {
        civic_number_str = `<br /><span style="color: red; "><strong>Missing or incorrect civic number.</strong></span>`
    }

    // display the new addr in the display box
    let std_address = features_arr[0].properties.fullAddress
    let html1 = `<strong>${std_address}</strong><br>`
    let html2 = `# std addr: ${features_cnt1}, score: ${score1}, precisionPoints:${precisionPoints1}, locationPositionalAccuracy: ${locationPositionalAccuracy1}.`
    d3.select('p#match_stats').html(`${html1}${html2}${notinanyblock_str}${civic_number_str}`)

    // update the geocoder data saved in mega data
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_bccs_standard_addresses_before_review'
    let std_addr_before_review_dict_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)
    let std_addr_before_review_dict = std_addr_before_review_dict_json.data // like {"Original address": {geocoder_bc: {...}}}
    // find the existing data of the original addr
    // console.log(std_addr_before_review_dict)
    let std_data_this_addr_dict = std_addr_before_review_dict[original_address]
    // find the geocoder_bc
    let existing_geocoder_bc_arr = std_data_this_addr_dict.geocoder_bc
    // insert the first element of the new geocoder_data (features_arr) as the first element of the existing
    existing_geocoder_bc_arr = [features_arr[0], ...existing_geocoder_bc_arr]
    std_data_this_addr_dict.geocoder_bc = existing_geocoder_bc_arr // must have, otherwise std_data_this_addr_dict is NOT updated
    // console.log(existing_geocoder_bc_arr)
    console.log(std_addr_before_review_dict_json.data[original_address])

    // update the display data in std_geocoderbc_data_for_review
    let textarea_d3pn = d3.select('textarea#std_geocoderbc_data_for_review')
    std_data_this_addr_dict['original_data']['original addr'] = original_address
    console.log(std_data_this_addr_dict)
    let geocoder_data_dict_str = JSON.stringify(std_data_this_addr_dict, null, 4)
    textarea_d3pn.text(geocoder_data_dict_str)
        .attrs({ 'data': geocoder_data_dict_str })

    // save it to 'geocoder_bccs_standard_addresses_before_review'
    console.log(std_addr_before_review_dict_json)
    await save_json_to_html_attr_base64str_of_gzbuffer(std_addr_before_review_dict_json, html_identifier, attr_name)


}

async function update_std_addr_before_review_data() {

    // get the current original_addr
    let original_addr = d3.select('select#addrs').node().value
    // console.log(original_addr)

    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_bccs_standard_addresses_before_review'
    let std_addr_before_review_dict_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)
    let std_addr_before_review_dict = std_addr_before_review_dict_json.data // like {"Original address": {geocoder_bc: {...}}}
    // console.log(std_addr_before_review_dict)

    // get the 
    let std_addr_before_review_thisaddr = std_addr_before_review_dict[original_addr]
    let std_addrs_dict = std_addr_before_review_thisaddr.geocoder_bc[0]
    std_addrs_dict.validation = 'validated'
    // console.log(std_addr_before_review_dict_json.data[original_addr].geocoder_bc[0]) // the above also update the std_addr_before_review_dict_json

    // save the updated json back to the html
    await save_json_to_html_attr_base64str_of_gzbuffer(std_addr_before_review_dict_json, html_identifier, attr_name)

    // also, save the std_addrs_dict to frontend\testdata using as a backend nodejs task
    let file_location = String.raw`\\vch.ca\departments\Public Health SU (Dept VCH-PHC)\Restricted\Overdose surveillance\master_data\_geographic\bc_geocoder_standard_address\geocoder_bccs_standard_addresses_before_review.json`.replace(/\\/g, '/')
    await save_json_to_backend(file_location, std_addr_before_review_dict_json.data)

}

async function display_std_geocoder_data(thisdom) {

    d3.select('input#retry_input').node().value = ""

    let this_original_addr = thisdom.value
    let html_identifier = `div#${global_project_datadiv_id}`
    let attr_name = 'geocoder_bccs_standard_addresses_before_review'
    let std_addr_before_review_dict_json = await get_json_from_html_attr_base64str_of_gzbuffer(html_identifier, attr_name)
    let std_addr_before_review_dict = std_addr_before_review_dict_json.data // like {"Original address": {geocoder_bc: {...}}}

    let conditions_arr = [
        "features_arr.length === 0",
        "features_arr.length > 1",
        "features_arr[0].properties.score < 90",
        // "features_arr[0].properties.precisionPoints < 90 ",
        // "features_arr[0].properties.locationPositionalAccuracy !== 'high'", // seems locationPositionalAccuracy does not matter 
    ]
    let poor_matches_dict = get_poor_matches(std_addr_before_review_dict, conditions_arr)
    // console.log(poor_matches_dict)

    // console.log('after removing gps corrdinates', Object.keys(poor_matches_dict).length)
    // console.log(Object.keys(poor_matches_dict))

    // get the index
    let original_addrs_arr = Object.keys(poor_matches_dict)
    let index_this_original_addr = original_addrs_arr.indexOf(this_original_addr)
    let index_str = `${index_this_original_addr + 1} of ${original_addrs_arr.length}`
    d3.select('label#index_addr').text(index_str)

    let geocoder_data_dict = poor_matches_dict[this_original_addr]

    // make a line about the matching stats
    let features_arr = geocoder_data_dict.geocoder_bc
    let features_cnt1 = features_arr.length
    let score1 = features_arr[0].properties.score
    let precisionPoints1 = features_arr[0].properties.precisionPoints
    let locationPositionalAccuracy1 = features_arr[0].properties.locationPositionalAccuracy

    let faults_arr = features_arr[0].properties.faults
    let notinanyblock_str = ""
    if (faults_arr && faults_arr.length > 0) {
        for (let j = 0; j < faults_arr.length; j++) {
            let this_fault = faults_arr[j]['fault']
            // console.log(this_fault)
            if (this_fault.toLowerCase().trim() === 'notinanyblock') { notinanyblock_str = `<br /><span style="color: red; "><strong> The civic number you are searching for does not belong to any block on this street.</strong></span>` }
        }
    }
    let civic_number = features_arr[0].civic_number
    let civic_number_str = ""
    if ((!civic_number || civic_number.length === 0) && notinanyblock_str.length === 0) {
        civic_number_str = `<br /><span style="color: red; "><strong>Missing or incorrect civic number.</strong></span>`
    }

    let std_address = features_arr[0].properties.fullAddress
    let html1 = `<strong>${std_address}</strong><br>`
    let html2 = `# std addr: ${features_cnt1}, score: ${score1}, precisionPoints:${precisionPoints1}, locationPositionalAccuracy: ${locationPositionalAccuracy1} `
    d3.select('p#match_stats').html(`${html1}${html2}${notinanyblock_str}${civic_number_str}`)

    // uncheck the confirm button
    d3.select('input#matched').node().checked = false

    // console.log(geocoder_data_dict)
    geocoder_data_dict['original_data']['original_address'] = this_original_addr
    let geocoder_data_dict_str = JSON.stringify(geocoder_data_dict, null, 4)
    let textarea_d3pn = d3.select('textarea#std_geocoderbc_data_for_review').styles({ "width": '99%', 'height': '75%', 'display': 'block' })
    textarea_d3pn.text(geocoder_data_dict_str)
        .attrs({ 'data': geocoder_data_dict_str })
}




function get_match_statistics(data) {
    // make a summary of the matching related characteristics
    let matching_stats_dict = { features_cnt: {}, score: {}, precisionPoints: {}, locationPositionalAccuracy: {} }
    let original_addr_arr = Object.keys(data)

    for (let i = 0; i < original_addr_arr.length; i++) {
        let this_origin_addr = original_addr_arr[i]
        let this_std_addr_before_review_dict = data[this_origin_addr]

        // each dict is like: geocoder_bc: [data_dict1, 2..]
        let features_arr = this_std_addr_before_review_dict.geocoder_bc
        // if (i === 0) { console.log (features_arr.length); return } else {break}
        /*
            There are several indicators for poor matching:
            1. geocoder_bc: is an empty array []
            1. geocoder_bc:  contains multiple data_dict s
            2. data_dict1.properties.score < 90
            3. data_dict1.properties.precisionPoints < 90
            4. data_dict1.properties.locationPositionalAccuracy: ! == "high"
        */

        let features_cnt1 = features_arr.length
        if (!matching_stats_dict.features_cnt[features_cnt1]) { matching_stats_dict.features_cnt[features_cnt1] = 1 } else {
            matching_stats_dict.features_cnt[features_cnt1]++
        }
        let score1 = features_arr[0].properties.score
        if (!matching_stats_dict.score[score1]) { matching_stats_dict.score[score1] = 1 } else {
            matching_stats_dict.score[score1]++
        }
        let precisionPoints1 = features_arr[0].properties.precisionPoints
        if (!matching_stats_dict.precisionPoints[precisionPoints1]) { matching_stats_dict.precisionPoints[precisionPoints1] = 1 } else {
            matching_stats_dict.precisionPoints[precisionPoints1]++
        }
        let locationPositionalAccuracy1 = features_arr[0].properties.locationPositionalAccuracy
        if (!matching_stats_dict.locationPositionalAccuracy[locationPositionalAccuracy1]) { matching_stats_dict.locationPositionalAccuracy[locationPositionalAccuracy1] = 1 } else {
            matching_stats_dict.locationPositionalAccuracy[locationPositionalAccuracy1]++
        }
    }

    return matching_stats_dict
}



function get_poor_matches(data, conditions_arr) {
    let original_addr_arr = Object.keys(data)

    let poor_matches_dict = Object.create(null)

    // define a pattern for identifying gps coordinates
    let pattern_gps = "^\\\s{0,}(-|)\\\d{1,}\\\.\\\d{1,}(\\\s{0,}),(\\\s{0,})(-||)\\\d{1,}\\\.\\\d{1,}"// "[0-9]+.\\\d+,( )(-)\\\d+.\\\d+"
    // may or may not start with any length of spaces
    // may or may not followed by a -
    // followed by any length of digits (0-9)
    // followed by a dot
    // followed by any length of digits
    // may or may not followed by spaces
    // followed by a comma
    //  may or may not followed by spaces
    // // followed by any length of digits (0-9)
    // followed by a dot
    // followed by any length of digits
    // like "   ddd.dddd  ,    -ddd.dddd   "
    let re_gps = new RegExp(pattern_gps)

    // define a pattern for postal codes
    let pattern_pscode = "^[A-Z]\\\d[A-Z](\\\S{0,})\\\d[A-Z]\\\d"
    let re_pscode = new RegExp(pattern_pscode)



    for (let i = 0; i < original_addr_arr.length; i++) {
        let this_origin_addr = original_addr_arr[i]

        // this_origin_addr is probalby indeed gps coordinates 
        // these should be ignored as there is no way to find the std address (the gps coordinates provided by the original data are usually different from the gps data from bc geodata)
        let test_gps = re_gps.test(this_origin_addr)
        if (test_gps) { continue }

        // also ignore if the address is merely a postal code
        let test_pscode = re_pscode.test(this_origin_addr)
        if (test_pscode) { continue }

        let this_std_addr_before_review_dict = data[this_origin_addr]

        // skip if the first element of geocoder_bc is validated
        let geocoder_bc_arr = this_std_addr_before_review_dict['geocoder_bc']
        let geocoder_bc_dict0 = geocoder_bc_arr[0]
        if (geocoder_bc_dict0 && geocoder_bc_dict0.validation && geocoder_bc_dict0.validation === 'validated') { continue }


        // each dict is like: geocoder_bc: [data_dict1, 2..]
        let features_arr = this_std_addr_before_review_dict.geocoder_bc
        // if (i === 0) { console.log (features_arr.length); return } else {break}
        /*
            There are several indicators for poor matching:
            1. geocoder_bc: is an empty array []
            1. geocoder_bc:  contains multiple data_dict s
            2. data_dict1.properties.score < 90
            3. data_dict1.properties.precisionPoints < 90
            4. data_dict1.properties.locationPositionalAccuracy: ! == "high"
        */

        let poor_match = 0

        for (let i = 0; i < conditions_arr.length; i++) {
            let this_condition = conditions_arr[i]
            if (eval(`${this_condition}`)) { poor_match = 1; break }
        }
        // if (features_arr.length === 0 || features_arr.length > 1 || features_arr[0].properties.score < 90 || features_arr[0].properties.precisionPoints < 90 || features_arr[0].properties.locationPositionalAccuracy !== 'high') { poor_match = 1 }

        if (poor_match === 1) {
            poor_matches_dict[this_origin_addr] = this_std_addr_before_review_dict
        }
    }

    return poor_matches_dict

}


function add_one_row_bk(col_types_arr, colnames_arr){ // use select-option not input-datalist
    let displaybox_d3pn = d3.select('div#display').styles({ 'display': 'block' })
    let colnames_table_d3pn = displaybox_d3pn.select('table#src_colnames')

    // determine the number of trs before adding a new tr
    let tr_doms_arr = colnames_table_d3pn.selectAll('tr.colnames_tr').nodes()
    tr_doms_length = tr_doms_arr.length
    console.log(tr_doms_length)

    // add a new tr
    let colnames_tr_d3pn = colnames_table_d3pn.append('tr').attrs({'class':'colnames_tr', 'rowi': tr_doms_length})
    col_types_arr.forEach(t => {
        let td_d3pn= colnames_tr_d3pn.append('td').attrs({'id':`${t}`})

        let select_d3pn = td_d3pn.append('select').attrs({'id': `${t}`, 'class':'colnames'}).styles({'width':'80%'})
        .on('input', (ev)=>{
            console.log('changed')

            // check all values in the select elements
            let unselected_colnames_arr= get_unselected_colnames(colnames_arr)

            // update all the select elements options
            update_colnames_select_elements(unselected_colnames_arr)
           
        })
        select_d3pn.append('option').attrs({'value':'', 'selected':true}).text('')
        let unselected_colnames_arr= get_unselected_colnames(colnames_arr)
        unselected_colnames_arr.forEach(d=>[
            select_d3pn.append('option').attrs({'value': `${d}`}).text(`${d}`)
        ])
    })
    buttons_td_d3pn = colnames_tr_d3pn.append('td')
    buttons_td_d3pn.append('button').text('+').on('click', ()=>{
        console.log('+ clicked')
        add_one_row_bk(col_types_arr, colnames_arr)

    })
    buttons_td_d3pn.append('button').text('-').on('click', (ev)=>{
        let thisbutton_dom = ev.target
        // determine the tr where thisbutton_dom is in (.parent is a td, .parent.parent is the tr)

        let tr_of_thisbutton_dom = thisbutton_dom.parentElement.parentElement
        let tr_rowi = parseInt(tr_of_thisbutton_dom.getAttribute('rowi'))
        if (tr_rowi>0) {colnames_table_d3pn.selectAll('tr.colnames_tr').nodes()[tr_rowi].remove()}

        let unselected_colnames_arr= get_unselected_colnames(colnames_arr)
        update_colnames_select_elements(unselected_colnames_arr)
    })
}