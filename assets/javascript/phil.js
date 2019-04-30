$( document ).ready(function() {

    // declare these five variables with no value
    var zheader, version, url, latitude, longitude;
    // declare u with beginning of URL... will be added to later for differet functions
    var u = "https://developers.zomato.com/api/";
    
    $("button").on("click", function () {
       event.preventDefault();
       //grab inputs and concat to create input for citysearch
       var cityState = $("#cityName").val().trim() + ", " + $("#stateName").val().trim();
    
       //function call on var zomato init function with input of key value
       Zomato.init({
           key: "981652a2504d91717090180727e2f6b8"
       });
           //TODO: create a delay so that values returned from Location are stored in the variables before geocode runs
        Zomato.location({
            input:  cityState
            // What do the following two lines do?
        }, function(locResponse) {
            console.log(locResponse),
            Zomato.geocode({
                latitude: locResponse.location_suggestions[0].latitude,
                longitude: locResponse.location_suggestions[0].longitude
            }, function(geoResponse) {
                console.log(geoResponse)
            });
        });
        
    
    });
    // declare object Zomato with functions as internal objects
    var Zomato = {
        // initialization using key input from 
        init: function(opts) {
                zheader = {
                    Accept: "text/plain; charset=utf-8",
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-Zomato-API-Key": opts.key
                };
            version = opts.version || "v2.1";
            url = u + version;
        },
        location: function(cityState, scb, ecb) {
            this.request({
                url: url + "/locations",
                headers: zheader,
                data: {
                    query: cityState.input
                },
                success: function(response) {
                    scb(response);
                },
                error: function(res) {
                    ecb(res);
                }
            });
        },
        geocode: function(coords, scb, ecb) {
                this.request({
                    url: url + "/geocode",
                    headers: zheader,
                    data: {
                        lat: coords.latitude,
                        lon: coords.longitude
                    },
                    success: function(response) {
                        scb(response);
                    },
                    error: function(res) {
                        ecb(res);
                    }
                });
        },
        restaurant: function(resid, scb, ecb) {
                console.log("restaurant running")
                this.request({
                    url: url + "/restaurant",
                    headers: zheader,
                    data: {
                        res_id: resid
                    },
                    success: function(response) {
                        scb(response);
                    },
                    error: function(res) {
                        ecb(res);
                    }
                });
        },
        request: function(opts) {
            var req;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                req = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            req.responseType = 'json';
            if (opts.type === undefined || opts.type === "GET") {
                var q = "?";
                for (var j = 0; j < Object.keys(opts.data).length; j++) {
                    var element = Object.keys(opts.data)[j];
                    q += element + "=" + opts.data[Object.keys(opts.data)[j]];
                    if (j !== Object.keys(opts.data).length - 1) {
                        q += "&";
                    }
                }
                opts.url = opts.url + q;
            }
    
            //setting data
    
            req.open(opts.type === undefined ? "GET" : opts.type, opts.url, true);
            //setting headers
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            if (opts.headers !== undefined || typeof opts.headers === "object") {
                for (var index = 0; index < Object.keys(opts.headers).length; index++) {
                    req.setRequestHeader(Object.keys(opts.headers)[index], opts.headers[Object.keys(opts.headers)[index]]);
                }
            }
            //so many problems with this, what does this do?
            req.onreadystatechange = function() {
                console.log(req.readyState)
                if (req.readyState === 4 && req.status === 200) {
                    opts.success(req.response);
                } else if (req.status === "400" || req.status === "401" || req.status === "403" || req.status === "404") {
                    opts.error(req);
                } else {
    
                }
            };
    
            req.send(opts.type === "GET" ? null : opts.data);
        }
    };
    
    
    //end of document.(ready)
    });