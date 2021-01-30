const Qutils = require('../utils/utils.query');
const Autils = require('../utils/utils.answer');
const config = require('../config/config');
module.exports.getMonth=(month)=>{
    let retVal='';
    switch(month){
        case 1:
            retVal = 'Jan';
            break;
        case 2:
            retVal = 'Feb';
            break;
        case 3:
            retVal = 'Mar';
            break;
        case 4:
            retVal = 'Apr';
            break;
        case 5:
            retVal = 'May';
            break;
        case 6:
            retVal = 'Jun';
            break;
        case 7:
            retVal = 'Jul';
            break;
        case 8:
            retVal = 'Aug';
            break;
        case 9:
            retVal = 'Sep';
            break;
        case 10:
            retVal = 'Oct';
            break;
        case 11:
            retVal = 'Nov';
            break;
        case 12:
            retVal = 'Dec';
            break;
    }
    return retVal;
}
module.exports.getTimeInFormat=(dateTimeFormat, dateTime)=>{
    let currentDt = new Date();
    if( dateTime)
        currentDt = new Date(dateTime);
    let dt = currentDt.getDate() ;
    let mth = currentDt.getMonth() +1;
    let year = currentDt.getFullYear();
    let hyphenSep = '-';
    let tmSep = ':';
    let retVal = '';
    let obliqueSep = '/';
    let curTime = currentDt.getHours() + tmSep + currentDt.getMinutes() + tmSep + currentDt.getSeconds();
    switch(dateTimeFormat){
        case config.date_format.ONE:
            retVal = dt + hyphenSep + mth + hyphenSep + year + ' ' + curTime;
            break;
        case config.date_format.TWO:
            retVal = dt + obliqueSep + mth +obliqueSep + year + ' ' + curTime;
            break;
        case config.date_format.THREE:
            retVal = this.getMonth(mth) + ' ' + dt + ', ' + year + ' ' + curTime;
            break;
        case config.date_format.FOUR:
            retVal = mth + hyphenSep + dt + hyphenSep + year + ' ' + curTime;
            break;
    }
    return retVal;
}
/**
 * @author: Sopra Steria
 * @description:Get sort data from any key based on type ASC or DESC.
 * @param:arr is array,key is based on sorting,type is asc or desc
 * @return:return sort data in asc or desc
 */
module.exports.sortData = (arr ,key_func, reverse=false)=>{
    return arr.sort( (a, b) => {
        var keyA = key_func(a),
            keyB = key_func(b);
        if(keyA < keyB) return reverse? 1: -1;
        if(keyA > keyB) return reverse? -1: 1;
        return 0;
    }); 
}

/**
 * @author: Sopra Steria
 * @description:Get sorted data on the basis of time.
 * @param:arr is array MAKE Sure that the array elements have lastUpdatedDate as a feild
 * @return:return sort data in new->old sorting
 */
module.exports.sortDataWithTime = (arr)=>{
    return arr.sort(function(a, b) {
        a = new Date(a.lastUpdatedDate);
        b = new Date(b.lastUpdatedDate);
        return a>b ? -1 : a<b ? 1 : 0;
    }); 
}
/**
 * @author: Sopra Steria
 * @description:Remove duplicate item from array  .
 * @param:id is int value
 * @return:return unique array of object
 */
module.exports.removeDuplicateItem = (arr,field)=>{
    return arr.filter((v,i,a)=>a.findIndex(t=>(t.field === v.field))===i)
}
/**
 * @author: Sopra Steria
 * @description:it's convert string first latter is uppercase .
 * @param:str is string value
 * @return:add first latter capital in string 
 */
module.exports.firstLetterCap = (str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports.getMyAnsweredQueries=(uid)=>{
   return new Promise((resolve,reject)=>{
    Promise.all([Autils.getAllanswers({answeredByID:uid}),Qutils.getAllqueries({})]).then(values=>{
        // sorting data
        data = this.sortDataWithTime(values[0]); 
        let modified = [];
        // remove duplicate;
        data=data.filter((v,i,a)=>a.findIndex(t=>(t.questionId === v.questionId))===i)
        // create new array with question Id and lastUpdatedDate
        modified= data.map(o =>{
            return{
                questionId:o.questionId._id, lastUpdatedDate:o.lastUpdatedDate
            }
        });
      
        let queryData = values[1];
        let finalData = [];
        modified.forEach(element => {
            let elem = queryData.filter(item=> item.id == element.questionId)[0];
            finalData.push(elem);
        });
        return resolve(finalData);
       });
   })
}
