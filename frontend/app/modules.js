async function makeElements() {

    d3.select('body').append('h2').text('Standard address')

    d3.select('body').append('p')

    d3.select('body').append('label').text('Input Address: ')
    d3.select('body').append('input').attrs({ 'id': 'inputaddresss' })
    d3.select('input#inputaddresss').node().value = '43 pender st, vancouver, bc'
    d3.select('body').append('p')
    d3.select('body').append('button').attrs({ 'id': 'submit' }).text('Submit').on('click', async (e) => { await getStdAddrJSON() })
    d3.select('body').append('p')
    d3.select('body').append('pre').attrs({ 'id': 'returnedjson' }).text('returned json').styles({ 'border': 'solid 1px lightgrey', 'width': '50%', 'height': '50%' })

}; //function makeElements()

async function getStdAddrJSON() {
    // get the input text
    let inputstr = d3.select('input#inputaddresss').node().value
    // convert the str to percentage encoding (URL encoudling)
    let percentStr = encodeURI(inputstr)
    let urlStr = 'https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=' + percentStr
    // console.log(urlStr)

    $.ajax({
        url: urlStr,
        type: 'GET',
        success: async function (receiveddata) {
            // console.log('success', result)

            let data = receiveddata.features[0]
            let datastr = JSON.stringify(data, null, '    ') // to display beautified json!
            $("pre#returnedjson").html(datastr); // must be a pre to display the beautified text correctly! won't work in div
        }
    });

} //getStdAddrJSON



