var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/index.ts
function accessObjectByPath(obj, path, createIfUndefined = false) {
  var _a;
  if (typeof path !== "string") {
    throw new Error(`the given path \`${path}\` is not of type string`);
  }
  if (path.length == 0)
    return ["", obj];
  let pathSegments = path.split(".");
  let last = pathSegments.splice(-1, 1)[0];
  let data = obj;
  while (pathSegments.length) {
    const prop = pathSegments.shift();
    if (!(prop in data) || !data[prop]) {
      if (createIfUndefined) {
        if (isNaN(+((_a = pathSegments[0]) != null ? _a : last))) {
          data[prop] = {};
        } else {
          data[prop] = [];
        }
      } else {
        return [last, void 0];
      }
    }
    data = data[prop];
  }
  return [last, data];
}
function getValueByPath(obj, path, createIfUndefined = false) {
  try {
    let [last, data] = accessObjectByPath(obj, path, createIfUndefined);
    if (Array.isArray(data) && isNaN(+last)) {
      return data.map((item) => item[last]);
    } else {
      return data[last];
    }
  } catch (error) {
    console.error(
      `there was an error while getting the value of the path \`${path}\` 
detail: `,
      error
    );
    return obj;
  }
}
function setValueByPath(obj, path, value, createIfUndefined = false) {
  try {
    let [last, data] = accessObjectByPath(obj, path, createIfUndefined);
    if (!createIfUndefined && !(last in data)) {
      return obj;
    }
    if (data && (last in data || createIfUndefined)) {
      if (Array.isArray(data) && isNaN(+last)) {
        data.forEach((item) => {
          let returnedData = value.path ? getValueByPath(value.obj || item[last], value.path) : value;
          if (returnedData !== void 0)
            item[last] = returnedData;
        });
      } else {
        let returnedData = value.path ? getValueByPath(value.obj || data[last], value.path) : value;
        if (returnedData !== void 0)
          data[last] = returnedData;
      }
    }
  } catch (error) {
    console.error(
      `there was an error while setting the value \`${value}\` in the path \`${path}\`
detail: `,
      error
    );
  } finally {
    return obj;
  }
}
function setValuesByPaths(obj, paths, createIfUndefined) {
  try {
    for (const pathItem of paths) {
      if (Array.isArray(pathItem)) {
        setValueByPath(
          obj,
          pathItem[0],
          { path: pathItem[1] },
          createIfUndefined
        );
      } else {
        setValueByPath(obj, pathItem.path, pathItem.value, createIfUndefined);
      }
    }
  } catch (error) {
    console.error(
      `there was an error while setting the values 
detail: `,
      error
    );
  } finally {
    return obj;
  }
}
function deleteAttributeByPath(obj, path) {
  if (!obj)
    return obj;
  try {
    let [last, data] = accessObjectByPath(obj, path);
    if (data && last in data) {
      delete data[last];
    }
  } catch (error) {
    console.error(
      `there was an error while deleting the values 
detail: `,
      error
    );
  } finally {
    return obj;
  }
}
function deleteAttributesByPaths(obj, paths) {
  if (!(obj && paths))
    return obj;
  for (const pathItem of paths) {
    deleteAttributeByPath(obj, pathItem);
  }
  return obj;
}
function convertToFormData(data, media) {
  let formData = new FormData();
  try {
    if (data && typeof data === "object") {
      for (let key of Object.keys(data)) {
        if (data[key] !== void 0) {
          formData.set(key, JSON.stringify(data[key]));
        }
      }
    } else {
      console.error("data parameter is not an object");
    }
    if (media == null ? void 0 : media.length) {
      media.forEach((item) => {
        if (item.file instanceof Array) {
          if (item.file.length) {
            formData.delete(item.title);
            item.file.forEach((file) => {
              if (typeof item.title === "string") {
                formData.append(item.title, file);
              }
            });
          }
        } else if (item.file) {
          if (typeof item.title === "string") {
            formData.set(item.title, item.file);
          }
        }
      });
    }
  } catch (error) {
    console.error(
      `there was an error while converting to formData 
detail: `,
      error
    );
  } finally {
    return formData;
  }
}
function cloneObject(obj, ignoreUnaccessibleFields = false) {
  const clonedObjects = /* @__PURE__ */ new WeakMap();
  const deepCloneRecF = (obj2) => {
    if (obj2 === void 0 || obj2 === null || !["object", "symbol"].includes(typeof obj2)) {
      return obj2;
    }
    if (typeof obj2 === "symbol")
      return Symbol(obj2.description);
    if (obj2 instanceof Date)
      return new Date(obj2.getTime());
    if (obj2 instanceof RegExp)
      return new RegExp(obj2);
    if (obj2 instanceof Map) {
      const newMap = /* @__PURE__ */ new Map();
      obj2.forEach((value, key) => {
        newMap.set(deepCloneRecF(key), deepCloneRecF(value));
      });
      return newMap;
    }
    if (obj2 instanceof Set) {
      const newSet = /* @__PURE__ */ new Set();
      obj2.forEach((value) => {
        newSet.add(deepCloneRecF(value));
      });
      return newSet;
    }
    if (obj2 instanceof ArrayBuffer)
      return obj2.slice(0);
    if (obj2 instanceof DataView)
      return new DataView(obj2.buffer.slice(0));
    if (Array.isArray(obj2) || obj2 instanceof Int8Array || obj2 instanceof Int16Array || obj2 instanceof Int32Array || obj2 instanceof Uint8Array || obj2 instanceof Uint8ClampedArray || obj2 instanceof Uint16Array || obj2 instanceof Uint32Array || obj2 instanceof Float32Array || obj2 instanceof Float64Array || obj2 instanceof BigInt64Array || obj2 instanceof BigUint64Array) {
      const length = obj2.length;
      const newArray = new obj2.constructor(length);
      clonedObjects.set(obj2, newArray);
      for (let i = 0; i < length; i++) {
        newArray[i] = deepCloneRecF(obj2[i]);
      }
      return newArray;
    }
    if (clonedObjects.has(obj2))
      return clonedObjects.get(obj2);
    const newObj = {};
    clonedObjects.set(obj2, newObj);
    if (!ignoreUnaccessibleFields) {
      let descriptor = Object.getOwnPropertyDescriptors(obj2);
      for (let key in descriptor) {
        Object.defineProperty(newObj, key, __spreadProps(__spreadValues({}, descriptor[key]), {
          value: deepCloneRecF(obj2[key])
        }));
      }
      return newObj;
    }
    for (let key in obj2)
      newObj[key] = deepCloneRecF(obj2[key]);
    return newObj;
  };
  return deepCloneRecF(obj);
}
function updateObject(obj, updateValue) {
  if (!(obj && updateValue && typeof obj == "object" && typeof updateValue == "object")) {
    throw new Error("Invalid input parameters. Expected objects.");
  }
  Object.assign(obj, updateValue);
  return obj;
}
function updateObjectStrict(obj, updateValue) {
  if (!(obj && updateValue && typeof obj == "object" && typeof updateValue == "object")) {
    throw new Error("Invalid input parameters. Expected objects.");
  }
  for (const key in updateValue) {
    if (key in obj)
      obj[key] = updateValue[key];
  }
  return obj;
}
export {
  accessObjectByPath,
  cloneObject,
  convertToFormData,
  deleteAttributeByPath,
  deleteAttributesByPaths,
  getValueByPath,
  setValueByPath,
  setValuesByPaths,
  updateObject,
  updateObjectStrict
};
