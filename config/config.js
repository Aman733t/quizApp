module.exports = {
    server:{
        port:9005,
        name:'quiz api',
        version:'1.0'
    },
    allowDomains:{
        URLS:["*"]
    },
    allowHeaders:{
        HEADERS:['*']
    },
    authkey:{
        secretkey : 'MY53Cr3T',
        tokenSecretKey : '5{)=K]5xYTac6YGs8hY+MB}9#<QPe/JD__&SqXb/Y2-'
    },
    allowedFunctions:['*'],
}