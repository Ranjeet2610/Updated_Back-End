module.exports = {
    PORT : 4000,
    DB : 'mongodb+srv://prempal:Mmq0SvdyINY6MQvM@cluster0-pstjj.mongodb.net/casino?retryWrites=true&w=majority',
    //DB: "mongodb://127.0.0.1:27017/casino",
    date_format: {
        ONE: 'dd-mm-yyyy hh:mm:ss',//5-12-2020 13:18:58
        TWO:'dd/mm/yyyy hh:mm:ss',//5/12/2020 13:18:58
        THREE: 'MMM dd, yyyy hh:mm:ss',//May 12, 2020 13:18:58
        FOUR: 'mm-dd-yyyy hh:mm:ss',
    },
    TIME_FRAME_TRENDING_QUERIES: 5,
    BetFairToken:'ZBTa/wMgyGJYmCcMmF5evBBtzSyv10flf++jufI6yKc=',
    APPKey:'ZkwpavU6no0r74Tk',
    BetFairAPIURL:'https://api.betfair.com/exchange/betting/json-rpc/v1'

}

