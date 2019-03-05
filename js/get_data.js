const url='http://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101C/BefArealTathetKon';
const MunicipalityURL = "kommun.json"; // Municipality data from https://gist.github.com/miroli/4280679f81d0006e3142
const BackupPopulationURL = "Population-backup.json" //loaded when post request fails;
const BackupMetaDataURL = "metadata-backup.json" //loaded when post request fails;
var PopulationData;
var selectedYear;

//Needed to prevent error messages in the console when readin data from json file
$.ajaxSetup({beforeSend: function(xhr){
  if (xhr.overrideMimeType)
    xhr.overrideMimeType("application/json");
  }
});

query = {
  "query": [
    {
      "code": "Region",
      "selection": {
        "filter": "vs:RegionKommun07EjAggr",
        "values": [
          "0114",
          "0115",
          "0117",
          "0120",
          "0123",
          "0125",
          "0126",
          "0127",
          "0128",
          "0136",
          "0138",
          "0139",
          "0140",
          "0160",
          "0162",
          "0163",
          "0180",
          "0181",
          "0182",
          "0183",
          "0184",
          "0186",
          "0187",
          "0188",
          "0191",
          "0192",
          "0305",
          "0319",
          "0330",
          "0331",
          "0360",
          "0380",
          "0381",
          "0382",
          "0428",
          "0461",
          "0480",
          "0481",
          "0482",
          "0483",
          "0484",
          "0486",
          "0488",
          "0509",
          "0512",
          "0513",
          "0560",
          "0561",
          "0562",
          "0563",
          "0580",
          "0581",
          "0582",
          "0583",
          "0584",
          "0586",
          "0604",
          "0617",
          "0642",
          "0643",
          "0662",
          "0665",
          "0680",
          "0682",
          "0683",
          "0684",
          "0685",
          "0686",
          "0687",
          "0760",
          "0761",
          "0763",
          "0764",
          "0765",
          "0767",
          "0780",
          "0781",
          "0821",
          "0834",
          "0840",
          "0860",
          "0861",
          "0862",
          "0880",
          "0881",
          "0882",
          "0883",
          "0884",
          "0885",
          "0980",
          "1060",
          "1080",
          "1081",
          "1082",
          "1083",
          "1214",
          "1230",
          "1231",
          "1233",
          "1256",
          "1257",
          "1260",
          "1261",
          "1262",
          "1263",
          "1264",
          "1265",
          "1266",
          "1267",
          "1270",
          "1272",
          "1273",
          "1275",
          "1276",
          "1277",
          "1278",
          "1280",
          "1281",
          "1282",
          "1283",
          "1284",
          "1285",
          "1286",
          "1287",
          "1290",
          "1291",
          "1292",
          "1293",
          "1315",
          "1380",
          "1381",
          "1382",
          "1383",
          "1384",
          "1401",
          "1402",
          "1407",
          "1415",
          "1419",
          "1421",
          "1427",
          "1430",
          "1435",
          "1438",
          "1439",
          "1440",
          "1441",
          "1442",
          "1443",
          "1444",
          "1445",
          "1446",
          "1447",
          "1452",
          "1460",
          "1461",
          "1462",
          "1463",
          "1465",
          "1466",
          "1470",
          "1471",
          "1472",
          "1473",
          "1480",
          "1481",
          "1482",
          "1484",
          "1485",
          "1486",
          "1487",
          "1488",
          "1489",
          "1490",
          "1491",
          "1492",
          "1493",
          "1494",
          "1495",
          "1496",
          "1497",
          "1498",
          "1499",
          "1715",
          "1730",
          "1737",
          "1760",
          "1761",
          "1762",
          "1763",
          "1764",
          "1765",
          "1766",
          "1780",
          "1781",
          "1782",
          "1783",
          "1784",
          "1785",
          "1814",
          "1860",
          "1861",
          "1862",
          "1863",
          "1864",
          "1880",
          "1881",
          "1882",
          "1883",
          "1884",
          "1885",
          "1904",
          "1907",
          "1960",
          "1961",
          "1962",
          "1980",
          "1981",
          "1982",
          "1983",
          "1984",
          "2021",
          "2023",
          "2026",
          "2029",
          "2031",
          "2034",
          "2039",
          "2061",
          "2062",
          "2080",
          "2081",
          "2082",
          "2083",
          "2084",
          "2085",
          "2101",
          "2104",
          "2121",
          "2132",
          "2161",
          "2180",
          "2181",
          "2182",
          "2183",
          "2184",
          "2260",
          "2262",
          "2280",
          "2281",
          "2282",
          "2283",
          "2284",
          "2303",
          "2305",
          "2309",
          "2313",
          "2321",
          "2326",
          "2361",
          "2380",
          "2401",
          "2403",
          "2404",
          "2409",
          "2417",
          "2418",
          "2421",
          "2422",
          "2425",
          "2460",
          "2462",
          "2463",
          "2480",
          "2481",
          "2482",
          "2505",
          "2506",
          "2510",
          "2513",
          "2514",
          "2518",
          "2521",
          "2523",
          "2560",
          "2580",
          "2581",
          "2582",
          "2583",
          "2584"
        ]
      }
    },
    {
      "code": "Kon",
      "selection": {
        "filter": "item",
        "values": [
          "1",
          "2"
        ]
      }
    },
    {
      "code": "ContentsCode",
      "selection": {
        "filter": "item",
        "values": [
          "BE0101U1"
        ]
      }
    }
  ],
  "response": {
    "format": "json"
  }
};

function getRegion (regionCode) {
    var regionIndex = metadata.variables[0].values.indexOf(regionCode);
    return metadata.variables[0].valueTexts[regionIndex];
}

function loadMunicipalityData(TopoSweden) {

  //Initialize each municipality with an empty array of population values;
  for(var i = 0; i < TopoSweden.objects.kommuner.geometries.length; ++i) {
    TopoSweden.objects.kommuner.geometries[i].properties.popDensity = [];
    TopoSweden.objects.kommuner.geometries[i].properties.popDensityMen = [];
    TopoSweden.objects.kommuner.geometries[i].properties.popDensityWomen = [];
  }

  //loop through each municipality
  for(var i =0 ; i< PopulationData.data.length ; i+=(timespan*2)) {
    var regionCode = PopulationData.data[i].key[0];
    var regionIndex;
    var regionFound= false;

    //find index of municipality in topoJSON object
    for(var j = 0; j < TopoSweden.objects.kommuner.geometries.length; ++j) {
      var regionCode2 = TopoSweden.objects.kommuner.geometries[j].properties.KNKOD;
      //municipality found
      if(regionCode == regionCode2) {
        regionIndex= j;
        regionFound =true;
        TopoSweden.objects.kommuner.geometries[j].properties.KNNAMN = getRegion(regionCode);
        break;
      }
    }

    if(!regionFound) {
      console.log(regionCode);
      continue;
    }

    //add population values to topojson object
    for(var j = 0; j < timespan; ++j) {
      var thisData = PopulationData.data[i+j];
      TopoSweden.objects.kommuner.geometries[regionIndex].properties.popDensityMen[j] = parseFloat(thisData.values[0]);
    }
    for(var j = timespan; j < timespan*2; ++j) {
      var thisData = PopulationData.data[i+j];
      TopoSweden.objects.kommuner.geometries[regionIndex].properties.popDensityWomen[j-timespan] = parseFloat(thisData.values[0]);
      
      TopoSweden.objects.kommuner.geometries[regionIndex].properties.popDensity[j-timespan] = (TopoSweden.objects.kommuner.geometries[regionIndex].properties.popDensityMen[j-timespan]+TopoSweden.objects.kommuner.geometries[regionIndex].properties.popDensityWomen[j-timespan]);
    }
  }
  console.log(TopoSweden);
  return TopoSweden;
}

function timelineChange(currYear) {
  var currentYear = parseInt(currYear);
  var firstYear = parseInt(metadata.variables[3].values[0]);
  selectedYear =  currentYear-firstYear;
  restyleLayer(selectedYear);
}

function processSCBMetaData(result) {
  metadata = result;
  timespan = metadata.variables[3].values.length;
  selectedYear=timespan-1;
  for(var i = 0; i < timespan; ++i) {
    if(i < timespan -1 )
      $('#timeline').append('<div data-year="' +  metadata.variables[3].values[i] + '"></div>');
    else
    $('#timeline').append('<div data-year="' +  metadata.variables[3].values[i] + '" class="active" ></div>');
  }
  $('#timeline').timeliny({
    afterChange: timelineChange
  });
  return $.getJSON(MunicipalityURL).then(loadMunicipalityData);
}

function processSCBData (response) {
  PopulationData= response;
  return $.getJSON(BackupMetaDataURL)
  //return $.getJSON(url)
  .then(processSCBMetaData)
  .fail(function(result) {
    console.log("failed to download metadata from SCB, using backup");
    return $.getJSON(BackupMetaDataURL).then(processSCBMetaData);
  });

}
async function getData() {
    return $.getJSON(BackupPopulationURL)
   //return $.post(url, JSON.stringify(query))
   .then(processSCBData)
    .fail(function(response) {
    console.log("failed to download data from SCB, using backup");
    return $.getJSON(BackupPopulationURL).then(processSCBData);
  });
}