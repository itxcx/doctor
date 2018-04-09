
export class Calendar{
  constructor(){
    const nowDate = new Date();
    this.year = nowDate.getFullYear();
    this.month = nowDate.getMonth();
    this.day = nowDate.getDay();
  }
  
  static getInstance (){
    if(!Calendar.instance){
      Calendar.instance = new Calendar();
    }
    return Calendar.instance;
  }

  change(direction=true){
    let n = 1;
    if(!direction){
      n = -1;
    }
    this.month +=n;
  }

  getDateList(){
    this.sourceMap();
    return Array.from(this.map);
  }

  sourceMap(){
    let arr = new Array();
    let emptydata = new Array();
    let totalDay = new Date(this.year, this.month + 1, 0).getDate();
    let n = new Date(this.year, this.month, 1).getDay();
    let today = new Date();
    let currentY = today.getFullYear();
    let currentM = today.getMonth();
    let currentD = today.getDate();
    for (let i = 0; i < n; i++) {
      emptydata.push([`empty${i}`, {}]);
    }
    for (let i = 0; i < totalDay; i++) {
      if(this.year===currentY&&this.month===currentM&&currentD===i+1){
        arr.push([i + 1, { day: i + 1 ,today:true}]);
      }else if(new Date(this.year,this.month,i+1).getTime()<today.getTime()){
        arr.push([i + 1, { day: i + 1 ,isOver:true}]);
      }else{
        arr.push([i + 1, { day: i + 1 }]);
      }
    }
    this.map = new Map(emptydata.concat(arr));
  }

  setMapObject(key,obj={}){
    if(this.map.has(key)){
      let currentObj = this.map.get(key);
      this.map.set(key,Object.assign({},currentObj,obj));
    }
  }
  
  rmMapObject(key){
    for(let[map,value] of this.map){
      if (value.hasOwnProperty(key)){
        delete value[key];
      }
    }
  }
  
  isOwn (key,property){
    if(this.map.has(key)){
      let currentObj = this.map.get(key);
      if (currentObj.hasOwnProperty(property)){
        return true
      }else{
        return false
      }
    }
  }
}
