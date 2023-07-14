// src/index.ts
import cloneDeep from "lodash/cloneDeep";
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
  return cloneDeep(obj);
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
