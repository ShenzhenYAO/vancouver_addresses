
// const { supportsPropertyIndex } = require('jsdom/lib/jsdom/living/generated/utils');

const mymodules = require('../../../backend/app/js/modules');
const fs = require('fs');
(async () => {


    a = 1

    if (eval(`a< 10`)) {console.log(a)}
    // // Array.isArray(data)
    // let file_location = String.raw`\\vch.ca\departments\Public Health SU (Dept VCH-PHC)\\Restricted\Overdose surveillance\master_data\_demographic\bc_geocoder_standard_address\geocoder_bccs_standard_addresses_before_review.json`.replace(/\\/g, '/')
    // let datajson = await mymodules.read_file(file_location)
    // let std_addr_before_review_dict = datajson.data
    // // console.log(mymodules.get_data_type(std_addr_before_review_dict))

    
    // let matching_stats_dict = get_match_statistics(std_addr_before_review_dict)
    // console.log(matching_stats_dict)

    // let poor_matches_dict = get_poor_matches(std_addr_before_review_dict)
    // console.log(Object.keys(poor_matches_dict).length)
    
})();


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



function get_poor_matches(data){
    let original_addr_arr = Object.keys(data)

    let poor_matches_dict = Object.create(null)

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

           let poor_match =0
           if (features_arr.length === 0 || features_arr.length  > 1 || features_arr[0].properties.score < 90 || features_arr[0].properties.precisionPoints < 90 || features_arr[0].properties.locationPositionalAccuracy !== 'high' ) {poor_match =1}

           if (poor_match === 1) {
                poor_matches_dict[this_origin_addr] = this_std_addr_before_review_dict
           }
    }

    return poor_matches_dict

}



