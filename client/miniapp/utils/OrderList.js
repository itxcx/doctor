class SourceDate{
  constructor(arg){
    this.month = arg.month;
    this.year = arg.year;
    this.day = arg.day;
    this.type  = arg.type;
    this.id = arg.id;
    this._init();
  }

  _init(){
    let month = this.month;
    let year = this.year;
    let day = this.day;
    let currentType =this.type;
    this.dateArr = [new Date(`${year}-${month}-${day}`).getTime(),{"type":currentType,'id':this.id}]
  }
}


export class OrderList {
  static getInstance(){
    if(!OrderList.instance){
      OrderList.instance = new OrderList();
    }
    return OrderList.instance
  }

  sourceMap(list){
    this.map = new Map();
    if(Array.isArray(list)){
      for(let i of list){
        if (i.hasOwnProperty('doctorId')){
            let id = i.doctorId;
            let { dateArr } = new SourceDate(i);
            if(!this.map.has(id)){
              this.map.set(id,[]);
            };
            this.map.get(id).push(dateArr);
        }
      }
    }
  }

  getMap(id){
    this.dateMap = new Map();
    if(this.map.has(id)){
      let list = this.map.get(id);
      for (let i of list) {
     
        if (!this.dateMap.has(i[0])) {
          this.dateMap.set(i[0], []);
        };
        this.dateMap.get(i[0]).push(i[1]);
      }
    }
  }
}
