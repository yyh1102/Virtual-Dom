var webpack=require("webpack");
var path=require("path");

module.exports={
    // entry: {
    //     example:'./example/index'
    // },
    output:{
        libraryTarget:'umd',
        library:'[name]',
        path:path.resolve(__dirname,'..','dist'),
        publicPath:'/dist/',
        filename:'[name].js',
    },
    module:{
        rules:[
            {
                test:/\.js[x]?$/,
                use:'babel-loader',
                exclude:/node_modules/
            }
        ]
    },
    resolve:{
        extensions:['.js']
    },
    plugins:[]
}