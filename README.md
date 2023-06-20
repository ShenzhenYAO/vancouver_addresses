This project is for matching given addresses to standardized addresses provided by the City of Vancouver.

**Standard addresses provided by City of Vancouver**
URL: https://opendata.vancouver.ca/explore/dataset/property-addresses/information/
1. Access to data
The data can be downloaded in various formats (e.g., csv, xls, json, shape, etc.). As it is updated weekly, better to obtain the most updated data on a regular base using an API. The information on API can be found at : https://opendata.vancouver.ca/explore/dataset/property-addresses/api/.

Alternatively, the data can be obtained by api request. Examples are provided at:
https://opendata.vancouver.ca/explore/dataset/property-addresses/
On that page, there are several choices on top (Information, Table, Map, Export, and API). Click 'API' to bring up a form to fill. 
For example, enter 43 w pender st in the input area labled 'q', and click 'Submit' button (at the bottom of the form)
It will return the property json on the right of the form. 

***Note:*** the entered address must be fully matched (e.g., it does not return anything if the q string is changed to 'pender street west 43')

The URL for api search appears below the submit button. For the above example, the URL string is:
"api/records/1.0/search/?dataset=property-addresses&q=43+w+pender&facet=geo_local_area", and the hyperlink behind the string is:
https://opendata.vancouver.ca/api/records/1.0/search/?dataset=property-addresses&q=43+w+pender&facet=geo_local_area

The URL can be used directly via ajax GET request to obtain a data json in return. 

{"nhits": 2, "parameters": {"dataset": "property-addresses", "q": "43 w pender", "rows": 10, "start": 0, "facet": ["geo_local_area"], "format": "json", "timezone": "UTC"}, "records": [{"datasetid": "property-addresses", "recordid": "e384729ed174ea45569eb53d143ccb0a767b61ab", "fields": {"p_parcel_id": "__FJ0TP6", "geom": {"coordinates": [-123.11279251105425, 49.282966636639905], "type": "Point"}, "pcoord": "59213834", "geo_local_area": "Downtown", "site_id": "015488161", "civic_number": "430", "std_street": "W PENDER ST"}, "record_timestamp": "2022-04-25T12:26:43.848Z"}, {"datasetid": "property-addresses", "recordid": "4ec4decacae95e06d1ee35e3b7593ae64901db5e", "fields": {"p_parcel_id": "__FJ0TUW", "geom": {"coordinates": [-123.11234435655868, 49.28337186511964], "type": "Point"}, "pcoord": "59213837", "geo_local_area": "Downtown", "site_id": "013192779", "civic_number": "435", "std_street": "W PENDER ST"}, "record_timestamp": "2022-04-25T12:26:43.848Z"}], "facet_groups": [{"name": "geo_local_area", "facets": [{"name": "Downtown", "count": 2, "state": "displayed", "path": "Downtown"}]}]}

2. Variables and data dictionary
There is no data dictionary. Following are the variables (could be incomplete) that can be found in the xls form of data.

- CIVIC_NUMBER
    The building number? e.g., 43 stands for building number of 43 of the street
- Geo Local Area
    Geographic locations such as downtown, mount pleasant, etc.
- Geom	
    GPS coordinates
- P_PARCEL_ID
    Unique id for parcel delivery polygons. 
    ***Note:*** The same address might repeat for multiple lines, each having a different P_PARCEL_ID (if it falls into multiple parcel delivery polygons). However, each P_PARCEL_ID is unique. 
- PCOORD
    Unknown, it is not unique.
- SITE_ID
    It is not unique. It is called PID or Parcel ID in the BC ASSESSMENT site (https://www.bcassessment.ca/?sp=1&act=). For example:
    In this database:
        CIVIC_NUMBER 295
        SITE_ID: 013350340 
        STD_STREET: W 22nd AVE 
    in BC ASSESSMENT site: 
        Address: 295 22nd ave w vancouver V5Y 2G3
        PID: 013-350-340
- STD_STREET
    Standardized stree names. A standardized address is like CIVID NUMBER + STD_STREET, e.g., 43 W PENDER ST

3. Limitations
    a) it only contains addresss in city of Vancouver (not including addresses in Richmond, not to mention the coastal rural areas)
    b) there is no postal code !


**BC Address Geocoder**
https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/geocoder
Batch reuqest are open to gov users, need to fill in a form to request API keys

The following url provides developer guide
https://github.com/bcgov/ols-geocoder/blob/gh-pages/geocoder-developer-guide.md#apichanges

For example, to search an address of 43 w pender st, vancouver

Searching by precise match of civicNumber and streeName does not return correct address
url = 'https://geocoder.api.gov.bc.ca/addresses.geojson?civicNumber=43&streetName=pender&streetType=st&localityName=vancouver&provinceCode=BC'

Search by fuzz string returns very good address!
url = 'https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=43%20w%20pender%20st,%20vancouver,%20bc'
even if the address is like 43 pender w (without specifying st or street or ave...)
url = 'https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=43%20pender%20w,%20vancouver,%20bc'

The site also provides search by gps points, 
https://geocoder.api.gov.bc.ca/addresses.xhtml?&parcelPoint=-123.11279251105425,49.282966636639905
https://geocoder.api.gov.bc.ca/sites/nearest.xhtml?point=-123.112792511,49.282966636
https://geocoder.api.gov.bc.ca/addresses.xhtml?&bbox=-119.8965522070019%2C49.70546831817266%2C-119.2157397287486%2C50.06954472056336
However, it is not practical, as the GPS coordinate used in Geocode might be quite different from that used in other databases (using different version of GPS coordinates).

**BC Assessment Authority**
https://www.bcassessment.ca/

**Openaddresses.io**
https://batch.openaddresses.io/data
Login as office account, pass 123456
provide city based address data (address and GPS coordinates), no PID

https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=2617%20sunShine%20coast,%roberts%20creek,%20bc
2617 SUNSHINE COAST


**Solutions**
***Standard address from https://geocoder.api.gov.bc.ca***
There is a demo in front end to illustrate how it works to get a json with standardized address information from https://geocoder.api.gov.bc.ca, i.e., input an address string, and click submit. The returned json appears in the box below. 

A more detailed backend solution is available.

It reads the 'hops_messy.csv' from data/in. hops_messy.csv was prepared from 'C:\Users\syao2\AppData\Local\Microsoft\Windows\INetCache\Content.Outlook\INEJTKHI\FROM CHRIS_Merged 2018_21 master address file for review ND HH updates 28OCT.xlsx'. 

About the methods:
Read xlsx from a buffer
https://github.com/exceljs/exceljs/issues/592

location of files
ehs and pcr:
\\phsabc\root\BCCDC\Groups\Data_Surveillance\Harm_Reduction\Shared\VCH\Overdose\
    there are two files:
        BCEHS_Dispatch_IP_VCH.csv, BCEHS_PCR_VCH.csv
Coroner's service
X:\BCCS

**The Case of Matheson Heights Co-op**
This address appears in:
C:\Users\syao2\AppData\Local\MyWorks\js\vancouver_addresses\data\in\Copy of FROM CHRIS_Merged 2018_21 master address file for review ND HH updates 28OCT.xlsx
as:
row 31: 
    BuildingName: Matheson Heights Co-op
    StandardizedAddress: 3502 BlueJay Cr, Vancouver, BC
    Address: 3502 BLUEJAY CR

***runing get_geocoder_data_alladdr(), it determined that the standard address is*** 
    3502 Blue Jay Cres, Vancouver, BC, BlockID: 109087, Score: 99

row 124: Matheson Heights Co-op
    BuildingName: Matheson Heights Co-op
    Address1: 3502-98 BLUEJAY

***Running get_geocoder_data_alladdr(), it determined that the standard address is*** 
    Matheson Cres, Vancouver, BC, BlockID: "", Score: 72

***Running search_addr ***
Google search (url = 'https://www.google.com/search?q=Matheson+Heights+Co-op') returns (the first address) the address: 
3554 Sparrow Pl, Vancouver, BC V5S 4E3

*** on https://opendata.vancouver.ca/explore/dataset/property-addresses/information/***
Search by the phrase 'blue jay' returns only one address:
3502 Blue Jay Crescent, Pcoord: 31881833, site_id: 007240724

*** on https://www.bcassessment.ca/ ***
Search by the phrase 'blue jay' returns nothing in Vancouver. 

*** and finally, on the co-op's website: http://mathesonheights.com/orientation/ ***
It says:
Our mailing address is:3514 Blue Jay Crescent
Vancouver, BC
V5S-4E4
Message/ Fax: 604-433-8668

***Conclusion***
- Address provided in the messy document could be wrong. 
- For organizations (e.g., Matheson Heights Co-op), better to google its website, go into the webpage of the organziation, and get its address.
- the sites ('https://opendata.vancouver.ca', and 'https://www.bcassessment.ca/) may not return anything. In this case, opendata found a property on Blue Jay St, but is not the one searching for; bc assessment found nothing!


**Other links**
THe following shows how to find the google place id
https://www.launch2success.com/guide/find-any-google-id/#:~:text=The%20standard%20way%20to%20find,of%20articles%20that%20cover%20this.)

The video demo is here:
data/how to find google place id.mp4


**Geocode.ca: https://geocoder.ca/?api=1**
this geocode is NOT the geocode site of BC government
It provides addr data for ALL address in North America. 
The url refers to 'Throttled XML API for not-for-profits, which limits request to 500-2000 lookups per day. 