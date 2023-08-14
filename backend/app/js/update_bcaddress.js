// to copy files to the bc address folder
const fs = require('fs')
const path = require('path');
const path_thisfile = path.resolve(__dirname);
let dir_hierarchy_arr = path_thisfile.split(path.sep);
dir_hierarchy_arr.splice(-3, 3); // oldvar.splice(): remove (and replace) the elements; newvar = oldvar.splice: the remainign elements after removing 
const path_project = dir_hierarchy_arr.join('/');
dir_hierarchy_arr.splice(-1, 1);
const path_project_parent= dir_hierarchy_arr.join('/');
const target_project = `${path_project_parent}/bc_address`;
(async ()=>{
    console.log(12, path_project)
    console.log(12, target_project)
    // copy the index file to 
    let path_src_indexhtml = `${path_project_parent}/frontend/index.html`
    let path_target_indexhtml = 
    fs.copyFileSync(fullpath, newfullpath)
    // copy files from the config folder to 
    // copy the module and common js file
    // save the copy date and time into the log file
})()