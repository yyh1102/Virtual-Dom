var webpack=require("webpack");
var path=require("path");
var pack=require("../package.json");

module.exports={
    entry: {
        virtualDom:'./src/index'
    },
    output:{
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
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:false,
                drop_console:false
            },
            comments:false,
            minimize:false
        }),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:'"production"'
            }
        }),
        new webpack.BannerPlugin({
            raw:true,
            banner:'/*!\n' + ' * ' + pack.name + ' v' + pack.version + '\n'
            + ' * (c) ' + new Date().getFullYear() + ' ' + pack.author + '\n'
            + ' * Released under the ' + pack.license + ' License.\n'
            + ' */'
        })
    ]
};