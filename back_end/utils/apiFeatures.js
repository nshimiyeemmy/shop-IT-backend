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

    //Advance filter functionality for price, ratings and many others
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
     
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
}

//Implementing Pagination method

pagination(resPerPage){
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;

}

}
module.exports = APIFeatures