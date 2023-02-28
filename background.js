var ModHeaderValid;
var modHeaderJson;
var requestContentList=[];

const CHROME_VERSION = getChromeVersion();
const requiresExtraHeaders = CHROME_VERSION && CHROME_VERSION.major >= 72;
const url = chrome.runtime.getURL('modHeader.json');

/* get chrome version */
function getChromeVersion() {
    let pieces = navigator.userAgent.match(
      /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
    );
    if (pieces == null || pieces.length != 5) {
      return undefined;
    }
    pieces = pieces.map(piece => parseInt(piece, 10));
    return {
      major: pieces[1],
      minor: pieces[2],
      build: pieces[3],
      patch: pieces[4]
    };
}

/* read modHeader.json */
async function getmodHeaderJson(){
    // console.log("onStartup")
    await fetch(url)
    .then((response) => response.json()) 
    .then((responseJson) => {
        // console.log("responseJson: ", responseJson); 
        modHeaderJson = responseJson? responseJson: [];
        ModHeaderValid = modHeaderJson.length > 0? true: false;
        // console.log("modHeaderJson: ", modHeaderJson); 
    }); 
}

/*
    Get request content except header
    Include: method, url, body(if post)
    Deal header in onBeforeSendHeaders
*/
chrome.webRequest.onBeforeRequest.addListener(function(info) {
    requestContent = {}
    console.log('onBeforeRequet Info: ', info);
    // Get Get body
    if(info['method']=='GET'){
        requestContent['method']='GET';
        requestContent['url']=info['url'];
    }
    // Get Post body
    if(info['method']=='POST'){
        requestContent['method']='POST';
        requestContent['url']=info['url'];
        requestContent['requestBody']=info['requestBody'];
    }
    requestContentList.push(requestContent)
    },
    // Mach all urls
    {
        urls: ["<all_urls>"]
    },

    // opt_extraInfoSpec, defined by ChromeVersion
    ['requestBody']
)

/*
    Add listener for onBeforeSendHeaders events
    change header
*/
chrome.webRequest.onBeforeSendHeaders.addListener(function(info) {
        // get header which used to be added
        if(modHeaderJson == undefined){
            getmodHeaderJson();
        }
        
        // If modHeaderJson is valid, modify header
        if (ModHeaderValid) {
            // Iterate over headers from JSON. If its new, then add header. 
            // If header is existing, then update value.
            for (var i = 0; i < modHeaderJson.length; i++) {
                var headerObj = modHeaderJson[i];
                var existing = false;

                // Check header is existing?
                // info.requestHeaders.forEach(function(header, i) {
                //     console.log("header - " + headerObj.name.toLowerCase());
                //     if (header.name.toLowerCase() == headerObj.name.toLowerCase()) {
                //         header.value = headerObj.value;
                //         existing = true;
                //     }
                // });

                if (!existing) {
                    info.requestHeaders.push({
                        name: headerObj.name,
                        value: headerObj.value
                    });
                }
            }

            info.requestHeaders.push({
                name: "headerObj.name",
                value: "headerObj.value"
            });
            
            console.log('info: ', info)
        }

        // Get Request body
        if( requestContentList.length != 0){
            requestContentList[requestContentList.length-1]['requestHeaders']=info['requestHeaders'];       
        }
        
        // Return updated header list.
        return {
            requestHeaders: info.requestHeaders
        };
    },

	// Mach all urls
    {
        urls: ["<all_urls>"]
    },

    // opt_extraInfoSpec, defined by ChromeVersion
    requiresExtraHeaders
    ? ['requestHeaders', 'blocking', 'extraHeaders']
    : ['requestHeaders', 'blocking']
);

/*
    Download Request content
*/
function downloadRequest(){
    stringRequestContentList = JSON.stringify(requestContentList, null, 2)
    var blob = new Blob([stringRequestContentList], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url,
        filename: "requestContent.txt"
    });
}

/*
    Clear Request content
*/
function clearRequestContentList(){
    requestContentList=[];
}