import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  parseArray(inputObj: any) {
    const outputArr = [];
    for (const key in inputObj) {
      const object = {
        Id: key,
        ...inputObj[key],
      };
      outputArr.push(object);
    }

    return outputArr;
  }

  parseObj(inputArr: any) {
    const outputObj: any = {};
    for (const row of inputArr) {
      let obj = { ...row };
      delete obj.Id;
      outputObj[row.Id] = obj;
    }

    return outputObj;
  }
}
