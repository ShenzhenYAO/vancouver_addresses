// to copy files to the bc address folder
const fs = require('fs')
const path = require('path');
const path_thisfile = path.resolve(__dirname);
let dir_hierarchy_arr = path_thisfile.split(path.sep);
dir_hierarchy_arr.splice(-3, 3); // oldvar.splice(): remove (and replace) the elements; newvar = oldvar.splice: the remainign elements after removing 
const path_project = dir_hierarchy_arr.join('/');
dir_hierarchy_arr.splice(-1, 1);
const path_project_parent= dir_hierarchy_arr.join('/');
const path_target_project = `${path_project_parent}/bc_address`;
const mymodules = require('./modules');
const path_logfile = `${path_target_project}/.log`;
(async ()=>{

    // add the following part into the index.html. This is to set a warning for the users to save data before reloading or closing the page
    let warning_html = `    <script>
        window.addEventListener('beforeunload', function (e) {
            e.returnValue = 'This message is ignored by modern browers'; // the browser will display default message and ignore the customized text here
        });
    </script>
`

    // get the html from the src index.html
    let path_src_indexhtml = `${path_project}/frontend/index.html`
    let src_indexhtml_str = fs.readFileSync(path_src_indexhtml, 'utf-8')
    let part1_str = src_indexhtml_str.split('</body>')[0]
    let part2_str = src_indexhtml_str.split('</body>')[1]
    let new_part2_str = `${warning_html}${part2_str}`
    let target_indexhtml_str = `${part1_str}${new_part2_str}`

    if (! fs.existsSync(`${path_target_project}/frontend`)){fs.mkdirSync(`${path_target_project}/frontend`)}
    let path_target_indexhtml = `${path_target_project}/frontend/index.html`
    fs.writeFileSync(path_target_indexhtml, target_indexhtml_str)


    // // copy file config/config_main 
    if (! fs.existsSync(`${path_target_project}/frontend/config`)){fs.mkdirSync(`${path_target_project}/frontend/config`)}
    let path_src_configmain = `${path_project}/frontend/config/config_main.js`
    let path_target_configmain = `${path_target_project}/frontend/config/config_main.js`
    fs.copyFileSync(path_src_configmain, path_target_configmain)

    // // copy file app/js/modules/geocoder/geocoder.js
    if (! fs.existsSync(`${path_target_project}/frontend/app`)){fs.mkdirSync(`${path_target_project}/frontend/app`)}
    if (! fs.existsSync(`${path_target_project}/frontend/app/js`)){fs.mkdirSync(`${path_target_project}/frontend/app/js`)}
    if (! fs.existsSync(`${path_target_project}/frontend/app/js/modules`)){fs.mkdirSync(`${path_target_project}/frontend/app/js/modules`)}
    if (! fs.existsSync(`${path_target_project}/frontend/app/js/modules/geocoder`)){fs.mkdirSync(`${path_target_project}/frontend/app/js/modules/geocoder`)}
    let path_src_geocoder = `${path_project}/frontend/app/js/modules/geocoder/geocoder.js`
    let path_target_geocoder = `${path_target_project}/frontend/app/js/modules/geocoder/geocoder.js`
    fs.copyFileSync(path_src_geocoder, path_target_geocoder)

    // copy file app/js/common.js 
    let path_src_common = `${path_project}/frontend/app/js/common.js`
    let path_target_common = `${path_target_project}/frontend/app/js/common.js`
    fs.copyFileSync(path_src_common, path_target_common)

    // copy file app/js/main.js
    let path_src_main = `${path_project}/frontend/app/js/main.js`
    let path_target_main = `${path_target_project}/frontend/app/js/main.js`
    fs.copyFileSync(path_src_main, path_target_main)

    // save the copy date and time into the log file
    let currentTime = new Date()
    let datatime_stampstr = mymodules.make_date_time_stamp(currentTime)
    // console.log(48, datatime_stampstr)

    if (! fs.existsSync(path_logfile)){fs.writeFileSync(path_logfile, '')}
    // read txt from .log
    let logtext = fs.readFileSync(path_logfile, 'utf-8')
    // console.log(logtext)
    let logtext_lines_arr = logtext.split('\r\n')
    // console.log(logtext_lines_arr)
    
    let newlines_arr= []
    logtext_lines_arr.forEach(t=>{
        if(t.substring(0, 'lastupdated:'.length) === 'lastupdated:' || t.trim().length === 0){ 
            // do nothing -- this line will be replaced by the current date time stamp
        }
        else {
            newlines_arr.push(t)
        }
    })
    newlines_arr.push (`lastupdated:${datatime_stampstr}\r\n`)
    let newtext = newlines_arr.join('\r\n')
    // ensure a new line at the end of the newtext 
    // console.log(60, newtext.substring(newtext.length-1, newtext.length)) // ==='\r\n'
    fs.writeFileSync(path_logfile, newtext)

})()