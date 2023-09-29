
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
            // note: the 2-digits option is NOT relaible! e.g., for seconds, it create a str of 9 instead of 09
            let year = currentTime.toLocaleString('default', { year: 'numeric' })
            let month = currentTime.toLocaleString('default', { month: "numeric" })
            month = this.add_leading_zeros(month, "00")
            let day = currentTime.toLocaleString('default', { day: "numeric" })
            day = this.add_leading_zeros(day, "00")
            let hours = currentTime.toLocaleString('default', { hour: 'numeric', hourCycle: 'h23' })
            hours = this.add_leading_zeros(hours, "00")
            let minutes = currentTime.toLocaleString('default', { minute: "numeric" })
            minutes = this.add_leading_zeros(minutes, "00")
            // console.log(53, minutes, typeof(minutes))
            let seconds = currentTime.toLocaleString('default', { second: "numeric" })
            seconds = this.add_leading_zeros(seconds, "00")
            // console.log(55, seconds, typeof(seconds))

            let datetime_stampstr = `${year}${month}${day}${hours}${minutes}${seconds}`
            return datetime_stampstr
        },
        add_leading_zeros:
        function add_leading_zeros(num, pattern) {
            let numstr = num.toString();
            let length = pattern.length
            while (numstr.length < length) numstr = "0" + numstr;
            return numstr;
        },
    
} // modules.export
