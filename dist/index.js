"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  accessObjectByPath: () => accessObjectByPath,
  cloneObject: () => cloneObject,
  convertToFormData: () => convertToFormData,
  deleteAttributeByPath: () => deleteAttributeByPath,
  deleteAttributesByPaths: () => deleteAttributesByPaths,
  getValueByPath: () => getValueByPath,
  setValueByPath: () => setValueByPath,
  setValuesByPaths: () => setValuesByPaths,
  updateObject: () => updateObject,
  updateObjectStrict: () => updateObjectStrict
});
module.exports = __toCommonJS(src_exports);
var import_cloneDeep = __toESM(require("lodash/cloneDeep"));
function accessObjectByPath(obj, path, createIfUndefined = false) {
  var _a;
  if (typeof path !== "string") {
    throw new Error(`the given path \`${path}\` is not of type string`);
  }
  let pathSegments = path.split(".");
  let last = (_a = pathSegments.splice(-1, 1)[0]) != null ? _a : "";
  let data = obj;
  while (pathSegments.length) {
    const prop = pathSegments.shift();
    if (!(prop in data) || !data[prop]) {
      if (createIfUndefined) {
        data[prop] = isNaN(+pathSegments[0]) ? {} : [];
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
    return data[last];
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
    if (data && (last in data || createIfUndefined)) {
      let objKeysLength = Object.keys(value || {}).length;
      if (objKeysLength > 0 && objKeysLength <= 2) {
        if (!("path" in value)) {
          data[last] = value;
        } else {
          let returnedData = getValueByPath(
            value.obj || data[last],
            value.path
          );
          if (returnedData)
            data[last] = returnedData;
        }
      } else {
        data[last] = value;
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
  var _a;
  try {
    for (const pathItem of paths) {
      if (Array.isArray(pathItem)) {
        setValueByPath(
          obj,
          pathItem[0],
          { path: (_a = pathItem[1]) != null ? _a : "" },
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
function cloneObject(obj = {}) {
  if (typeof obj !== "object" || !obj)
    return obj;
  return (0, import_cloneDeep.default)(obj);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
