const { json } = require("express/lib/response");

class ApiFeatures {
    constructor(query ,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    // search function for search feature
    search(){
        const keyword = this.queryStr.keyword
        ?{
            name: {
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        } :{};
        this.query = this.query.find({...keyword});
        return this;
    }


    // filter function to filter out reesult acc. to price category etc
    filter(){
        const copyQuery= {...this.queryStr};

        //  Removing some fields for category
        const removeFields = ['keyboard','page','limit'];
        removeFields.forEach((key)=> delete copyQuery[key]);

        1//-----// filter for price
        console.log(copyQuery)
        let queryStr= JSON.stringify(copyQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr)); 
        return this;

            ////

        this.query = this.query.find(copyQuery);
        return this;
    }

    // function to display products acc to limit
    perPage(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip_items = resultPerPage * (currentPage - 1)  //logic to skip page with per page items

        this.query = this.query.limit(resultPerPage).skip(skip_items);

        return this;
    }

}

module.exports =ApiFeatures;