class APIFeatures{
    constructor(query, queryStr){
        this.query= query,
        this.queryStr = queryStr
    }

    //creating the search method
    search(){
    const keyword = this.queryStr.keyword ? {
        name:{
            $regex:this.queryStr.keyword,
            $options: 'i'
        }

    }: {}
    this.query = this.query.find({...keyword})
    return this;
}

// Building the filtering functionality on the routes
filter(){
    const queryCopy = {...this.queryStr};

    //removing fields from the query
    const removeFields = ['keyword', 'limit', 'page']
    removeFields.forEach(el => delete queryCopy[el]);

    this.query = this.query.find(queryCopy)
    return this;
}

}
module.exports = APIFeatures