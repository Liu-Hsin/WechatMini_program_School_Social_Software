这算得上自己第一个独立完成的项目吧，不太完美，但还是满足了基本功能。

**1、这个小程序是我的毕业设计，基本实现了社交软件的基本功能**

**2、代码是直接从微信开发者工具内推送，如需使用请 修改其中部分代码**

### 修改部分

#####   1、/could/update_index/index.js

 exports.main = async (event, context) => {

​		 return await db.collection('index').where({

​			  '_id':'b00064a76054bf6b0adc04827ae254ba',     // 修改此 id，该id为json数据库中字段的 id 

​	 })

######      数据库字段

![image-20210531210925087](C:\Users\青轩\AppData\Roaming\Typora\typora-user-images\image-20210531210925087.png)

##### 2、/miniprogram/pages/index / index.js        /pages/admin/admin.js

![image-20210531211136641](C:\Users\青轩\AppData\Roaming\Typora\typora-user-images\image-20210531211136641.png)

![image-20210531211616579](C:\Users\青轩\AppData\Roaming\Typora\typora-user-images\image-20210531211616579.png)

改为自己数据库中的字段



