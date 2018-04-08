### 配置

#### 我的目录结构：
最简单粗暴的方法是使用Linux本身后台执行的特性
使用&符号后台执行，并利用nohup命令实现进程禁止挂起

nohup node app.js &

使用forever让node.js持久运行
npm install forever -g   #安装
forever start app.js  #启动应用
forever stop app.js  #关闭应用
forever restartall  #重启所有应用

#输出日志和错误
forever start -l forever.log -o out.log -e err.log app.js   

# 指定forever信息输出文件，当然，默认它会放到~/.forever/forever.log
forever start -l forever.log app.js  

# 指定app.js中的日志信息和错误日志输出文件，  
# -o 就是console.log输出的信息，-e 就是console.error输出的信息
forever start -o out.log -e err.log app.js 

# 追加日志，forever默认是不能覆盖上次的启动日志，  
# 所以如果第二次启动不加-a，则会不让运行  
forever start -l forever.log -a app.js

# 监听当前文件夹下的所有文件改动（不太建议这样）  
forever start -w app.js  

# 显示所有运行的服务 
forever list  

######停止操作

# 停止所有运行的node App  
forever stopall  
  
# 停止其中一个node App  
forever stop app.js  

# 当然还可以这样  
# forever list 找到对应的id，然后：  
forever stop [id]

# 开发环境下  
NODE_ENV=development forever start -l forever.log -e err.log -a app.js  
# 线上环境下  
NODE_ENV=production forever start -l ~/.forever/forever.log -e ~/.forever/err.log -w -a app.js
#上面加上NODE_ENV为了让app.js辨认当前是什么环境用的

作者：极地瑞雪
链接：https://www.jianshu.com/p/669a618f3212
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


```
├── app.js   # Express Server
├── bin
│   └── www  # 启动Server
├── dist     # 编译压缩目录(部署目录)
├── gulpfile.js  # Gulp配置文件
├── package.json
├── public       # 开发目录
│   ├── img
│   ├── js
│   └── sass
├── routes
│   ├── index.js
│   └── users.js
└── views      # html：swig模板引擎
    ├── error.html
    ├── login.html
    └── index.html
```

