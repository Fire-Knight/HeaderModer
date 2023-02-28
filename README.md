# ModHeader for chrome

#### 功能

* 一个chrome扩展插件
* 在浏览网页时，为请求添加自定义请求头。
* 记录所有请求内容并提供下载（可在下载的请求记录中查看添加的header内容）
* ![image-20230228214328433](.\assets\image-20230228214328433.png)



#### 修改Header

1. add headers in modHeader.json

   ```json
   [
       {"name":"headerName1","value":"headerValue1"},
       {"name":"headerName2","value":"headerValue2"}
   ]
   ```

   empty as

   ```
   []
   ```

2. run program

   

#### 下载request

- 下载request：点击插件，点击“下载Request记录”
- 清空记录的request：点击插件，点击“清空Request记录”



#### 安装

* 方法一：浏览器扩展插件 - 开发者模式 - 加载已解压的插件 - 选中项目文件夹即可

* 方法二：通过python代码启动

  ```python
  options = webdriver.ChromeOptions();
  # "load-extension=path of ModHeader_Chrome"
  options.add_argument("load-extension=/home/xxx/ModHeader_Chrome"); 
  driver = webdriver.Chrome(chrome_options=options)
  ```

  