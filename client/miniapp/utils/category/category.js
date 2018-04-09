export const format = (input) => {
  let ret = [];
  for (var i = 0; i < input.length; i++) {
    let ii = input[i];


    // hospital
    if (!ret.some(n => n.hospital == ii.hospital)) {
      ret.push({
        hospital: ii.hospital,
        officeList: [],
      });
    }

    // office
    let officeList = ret.find(n => n.hospital == ii.hospital).officeList;
    if (!officeList.some(n => n.office == ii.office)) {
      officeList.push({
        office: ii.office,
        nameList: []
      });
    }

    // name
    let nameList = officeList.find(n => n.office == ii.office).nameList;
    nameList.push({
      name: ii.name,
      id: ii.id
    });
  }
  return ret;
};
