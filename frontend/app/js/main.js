(async () => {
    // make elements    
    await makeElements_mainpage()

    // customize actions of the nav selections
    set_actions_nav_selections()

    
    let navselects_arr= d3.selectAll('li.nav_select').nodes()
    // console.log(navselects_arr)
    navselects_arr[0].click()

    d3.select('li[id="li_define file locations"]').node().click()

    
    return

    //// following are for testing
    // click to load bbcs standard addresses
    d3.select('li[id="li_load bccs std addr (before review)"]').node().click()

    // wait
    await waitfor(2)

    // click to show the poorly matched
    d3.select('li[id="li_show poor matching geocoder bc bccs std addr (before review)"]').node().click()

    await waitfor(1)

    // click to select the first option of the poorly matched 
    let addr_select_d3pn = d3.select('select#addrs')

    // find the options
    let first_option_addrr_dom =  addr_select_d3pn.select('option.option_addr').node()
    // console.log(first_option_addrr_dom)
    let first_option_addrr = first_option_addrr_dom.getAttribute('addr') 
    console.log(first_option_addrr)

    addr_select_d3pn.node().value = first_option_addrr
    await display_std_geocoder_data(addr_select_d3pn.node())
    
    
})()