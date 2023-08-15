
module.exports = {

    read_file:
        async function read_file(fullpath) {
            let result_data

            let path = require('path')
            let fs = require('fs')

            // get the file and determine file ext name
            let ext = path.extname(fullpath)

            if (ext === '.csv') {
                result_data = await this.read_csv_file(fullpath) // it returns an array
            }

            else if (ext === '.json') {
                let result_data_str = fs.readFileSync(fullpath, 'utf-8')
                result_data = JSON.parse(result_data_str) // it could be an array or a dict object ...
            }

            return result_data
        },

    read_csv_file:
        async function read_csv_file(fullpath) {
            let result_arr
            let csv_inst = require('csvtojson')
            result_arr = await csv_inst().fromFile(fullpath)
            return result_arr
        },
    get_data_type:
        function get_data_type(data) {
            let result
            let type1 = typeof (data)
            // console.log(type1)
            if (type1 === 'string') { result = 'string' }
            else if (type1 === 'object') {
                if (Array.isArray(data)) { result = 'array' }
                else { result = 'object' }
            }
            else if (type1 === 'function') { result = 'function' }
            return result
        },
        make_date_time_stamp:
        function make_date_time_stamp(currentTime) {
            let year = currentTime.toLocaleString('default', { year: 'numeric' })
            let month = currentTime.toLocaleString('default', { month: "2-digit" })
            let day = currentTime.toLocaleString('default', { day: "2-digit" })
            let hours = currentTime.toLocaleString('default', { hour: '2-digit', hourCycle: 'h23' })
            let minutes = currentTime.toLocaleString('default', { minute: "2-digit" })
            let seconds = currentTime.toLocaleString('default', { second: "2-digit" })
            let datetime_stampstr = `${year}${month}${day}${hours}${minutes}${seconds}`
            return datetime_stampstr
        },
    
} // modules.export
