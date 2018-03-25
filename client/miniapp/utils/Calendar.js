export class Calendar {
  constructor(){
    const nowDate = new Date();
    this.year = nowDate.getFullYear();
    this.month = nowDate.getMonth();
    this.day = nowDate.getDay();
  }
  
  change(direction=true){
    let n = 1;
    if(!direction){
      n = -1;
    }

    this.month +=n;
  }

  getDateList(){
    let arr = new Array();
    let totalDay = new Date(this.year,this.month+1,0).getDate();
    let n = new Date(this.year, this.month, 1).getDay();
    let emptydata = new Array(n);
    for(let i=0;i<totalDay;i++){
        arr.push({value:i+1});
    }
    return emptydata.concat(arr);
  }

}
