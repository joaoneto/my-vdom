export default function clone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    var clonedArr = [];
    obj.forEach(function (element) {
      clonedArr.push(clone(element));
    });
    return clonedArr;
  }

  let clonedObj = new obj.constructor();
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      clonedObj[prop] = clone(obj[prop]);
    }
  }

  return clonedObj;
}
