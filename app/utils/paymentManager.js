exports.makePayment = function(ccnumber, expDate, cvv, orderNumber, amount, itbis, updateStatus) {
    var fs = require('fs');
    var https = require('https');
    var jsonData = {
        "Channel":"EC",
        "Store":"39039050034",
        "CardNumber":ccnumber,
        "Expiration":expDate,
        "CVC":cvv,
        "PosInputMode":"E-Commerce",
        "TrxType":"Sale",
        "Amount":amount,
        "Itbis":itbis,
        "CurrencyPosCode":"$",
        "Payments":"1",
        "Plan":"0",
        "AcquirerRefData":"1",
        "RRN":null,
        "CustomerServicePhone":"809-792-4852",
        "OrderNumber":orderNumber,
        "ECommerceUrl":"www.codika.net"
    }
    var options = {
        hostname: 'pruebas.azul.com.do',
        port: 443,
        path: '/webservices/JSON/Default.aspx',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Auth1": "codika", "Auth2": "codika" },
        json:true,
        key: fs.readFileSync('certificates_desa/codika_key.pem'),
        cert: fs.readFileSync('certificates_desa/codika_cert.pem')
    };
    var req = https.request(options, function(res) {
        res.on('data', function(data) {
            console.log("response " + data)
            var azulResponse = JSON.parse(data)

            if(azulResponse["ResponseMessage"] == "APROBADA" && azulResponse["IsoCode"] == "00") {
                updateStatus("aprobada", azulResponse["AuthorizationCode"])
                req.end()
            }
            else
            {
                updateStatus("declinada", "blah")
                req.end()
            }
        });
    });

    req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(jsonData));
    req.end();
}

exports.testPayment = function(updateStatus) {
    var fs = require('fs');
    var https = require('https');
    var jsonData = {
        "Channel":"EC",
        "Store":"39039050034",
        "CardNumber":"5424180279791732",
        "Expiration":"202012",
        "CVC":"732",
        "PosInputMode":"E-Commerce",
        "TrxType":"Sale",
        "Amount":"10000",
        "Itbis":"00",
        "CurrencyPosCode":"$",
        "Payments":"1",
        "Plan":"0",
        "AcquirerRefData":"1",
        "RRN":null,
        "CustomerServicePhone":"809-792-4852",
        "OrderNumber":"1234",
        "ECommerceUrl":"www.codika.net"
    }
    var options = {
        hostname: 'pruebas.azul.com.do',
        port: 443,
        path: '/webservices/JSON/Default.aspx',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Auth1": "codika", "Auth2": "codika" },
        json:true,
        key: fs.readFileSync('certificates_desa/codika_key.pem'),
        cert: fs.readFileSync('certificates_desa/codika_cert.pem')
    };
    var req = https.request(options, function(res) {
        res.on('data', function(data) {
            console.log("response " + data)
            updateStatus(JSON.parse(data))
            // var azulResponse = JSON.parse(data)
            //
            // if(azulResponse["ResponseMessage"] == "APROBADA")
            // {
            //     updateStatus("aprobada", azulResponse["AuthorizationCode"])}
            // req.end()
            // if(azulResponse["ResponseMessage"] == "DECLINADA")
            // {
            //     updateStatus("declinada", "blah")
            //     req.end()
            // }
            // // else {
            // //     console.log("response message " + azulResponse["ResponseMessage"])
            // //     updateStatus("declinada", "blah")
            // //     req.end();
            // // }
        });
    });

    req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(jsonData));
    req.end();
}