(async () => {
    // make elements    
    await makeElements_mainpage()

    // customize actions of the nav selections
    set_actions_nav_selections()

    
    let navselects_arr= d3.selectAll('li.nav_select').nodes()
    // console.log(navselects_arr)
    navselects_arr[0].click()
    
})()