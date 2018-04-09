export class Order {
  constructor(arg){
    this.type = arg.type===0?"上午":'下午';
    this.date = `${arg.year}-${arg.month}-${arg.day}`;
    this.name = arg.name;
    this.office = arg.office;
    this.hospital = arg.hospital;
  }

  getNowtime(){
      let date = new Date();
      this.nowYear = date.getFullYear();
      this.nowMonth = date.getMonth() + 1;
      this.nowDay  = date.getDate();
      this.nowdate = `${this.nowYear}-${this.nowMonth}-${this.nowDay}`;
  }

  getStatus(){
      this.getNowtime();
      let getDate = new Date(this.date).getTime();
      let currentDate = new Date(this.nowdate).getTime();
      if(getDate == currentDate){
        this.status = 'today'
      }else if(getDate > currentDate){
        this.status = 'after';
      }else{
        this.status = 'before';
      }
  }
}