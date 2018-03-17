# 数据协议

## IOrder数据定义
    ```
    {
      // 预约时间
      year:number,
      month:number,
      day:number,
      hour:number,
      minute:number,
      // 个人信息
      name:string,
      age:number,
      // 0-男,1-女
      gender:number,
      mobile:number,
      note:string,
    }
    ```

## 医生
### 登录
- route:/login/
- method:POST
- body:
```
{
  regCode?:string,
}
```
- response
```
{
  code?:
  info:{
    hospital:string,
    
  }

}
```
### 设置上班时间
- route:/doctor/setWorkTime
- method:POST
- body
```
  {
    // 小时
    hour:number,
    // 分钟
    minute:number,
  }
```
- response
    ```
      {
        code?:number,
      }
    ```


### 开启或者关闭可以预约的日子
- route:/doctor/setWorkDays
- method:POST
- body
    ```
        {
          year:number,
          // 从1开始数
          month:number,
          // 从1开始数
          day:number,
          // 开启还是关闭
          // 0表示关闭,1表示开启
          tag:number,
        }[]
    ```
- response
    ```
    {
      code?:number,
    }
    ```

### 查看某日的预约信息列表
- route:/doctor/getOrders/:year/:month/:day
- method:GET
- response
    ```
    IOrder[]
    ```

## 患者
### 填写预约信息
- route:/patient/order
- method:POST
- body
  IOrder
- response
    ```
    {
      code?:number,
    }
    ```

### 查看当前预约
- route:/patient/view
- method:GET
- response
    ```
    IOrder?
    ```


### 取消当前预约 
- route:/patient/cancelView
- method:POST
- response
    ```
    {
      code?:number
    }
    ```