import cloneDeep from "lodash/cloneDeep";

function accessObjectByPath(obj: any, path: string, createIfUndefined = false) {
  let accessObjectByPathRec = (obj: any, path: string) => {
    if (obj && typeof obj == "object" && path) {
      let [first, ...rest] = path.split(".");

      if (!obj.hasOwnProperty(first) && createIfUndefined) {
        obj[first] = isNaN(+first) ? {} : [];
      }

      if (rest.length) {
        return accessObjectByPathRec(obj, rest.join("."));
      } else {
        return obj[first];
      }
    } else {
      return obj;
    }
  };

  return accessObjectByPathRec(obj, path);
}

/**
 *
 * @description traverses the object using dot notation to get the value of a property at a given path
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @returns the value of the property at the given path
 */
export function getValueByPath(obj: any, path: string): any {
  // if (!obj) return obj;

  // let [first, ...rest] = path.split(".");

  // if (rest.length) {
  //   if (Array.isArray(obj[first]) && isNaN(+rest[0])) {
  //     return obj[first].map((d: any) => getValueByPath(d, rest.join(".")));
  //   } else {
  //     return getValueByPath(obj[first], rest.join("."));
  //   }
  // } else {
  //   return obj[first];
  // }

  let pathSegments = path.split(".");
  let last = pathSegments.splice(-1, 1)[0];

  let data = accessObjectByPath(obj, pathSegments.join("."));

  console.log("🚀 ~ file: index.ts:51 ~ getValueByPath ~ data:", data);

  if (data[last]) {
    return data[last];
  } else {
    return data;
  }
}

/**
 *
 * @description traverses the object using dot notation to set the value of a property at a given path, creating nested objects or arrays as needed
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @returns the updated object with the new property value
 */
export function setValueByPath<T = any>(
  obj: T,
  path: string,
  value: { path: string; obj: any }
): T;
export function setValueByPath<T = any>(
  obj: T,
  path: string,
  value: { path: string }
): T;
export function setValueByPath<T = any>(obj: T, path: string, value: any): T;
export function setValueByPath<T = any>(obj: any, path: string, value: any): T {
  if (obj && typeof obj == "object" && path) {
    let [first, ...rest] = path.split(".");

    if (rest.length) {
      if (!obj.hasOwnProperty(first)) {
        obj[first] = isNaN(+rest[0]) ? {} : [];
        setValueByPath(obj, rest.join("."), value as any);
      } else {
        if (Array.isArray(obj[first]) && isNaN(+rest[0])) {
          obj[first].forEach((val: any) =>
            setValueByPath(val, rest.join("."), value as any)
          );
        } else {
          setValueByPath(obj[first], rest.join("."), value as any);
        }
      }
    } else {
      if (Array.isArray(obj[first])) {
        obj[first] = obj[first].map((d: any) => {
          if (value?.value !== undefined) {
            return value?.value;
          }

          return getValueByPath(value?.obj || d, value?.path || "");
        });
      } else {
        if (value?.value != undefined) {
          obj[first] = value?.value;
        } else {
          obj[first] =
            getValueByPath(value?.obj || obj[first], value?.path || "") ??
            obj[first];
        }
      }
    }
  }

  return obj;
}

/**
 *
 * @description sets multiple values in an object using an array of paths and values
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @returns the updated object with the new property values
 */
export function setValuesByPaths<T = any>(obj: T, paths: [string, string][]): T;
export function setValuesByPaths<T = any>(
  obj: T,
  paths: { path: string; value: any }[]
): T;
export function setValuesByPaths<T = any>(
  obj: T,
  paths: { path: string; value: { path: any; obj?: any } }[]
): T;
export function setValuesByPaths<T = any>(
  obj: T,
  paths: ([string, string] | { path: string; value: any })[]
): T;
export function setValuesByPaths<T = any>(
  obj: T,
  paths: ([string, string] | { path: string; value: any })[]
) {
  paths.forEach((p) => {
    if (p instanceof Array) {
      setValueByPath(obj, p[0], { path: p[1] || "" });
    } else {
      setValueByPath(obj, p.path, p.value);
    }
  });

  return obj;
}

/**
 *
 * @description deletes a property at a given path in an object
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @return the updated object with the property at the given path deleted
 */
export function deleteAttributeByPath<T = any>(obj: any, path: string): T {
  if (!(obj && path)) return obj;

  let [first, ...rest] = path.split(".");

  if (rest.length) {
    if (Array.isArray(obj[first])) {
      if (isNaN(+rest[0])) {
        obj[first].forEach((d: any) =>
          deleteAttributeByPath(d, rest.join("."))
        );
      } else {
        deleteAttributeByPath(obj[first][+rest[0]], rest.slice(1).join("."));
      }
    } else {
      deleteAttributeByPath(obj[first], rest.join("."));
    }
  } else {
    if (Array.isArray(obj)) {
      if (isNaN(+first)) {
        obj.forEach((item: any) => {
          delete item[first];
        });
      } else {
        obj.splice(+first, 1);
      }
    } else {
      delete obj[first];
    }
  }

  return obj;
}

/**
 *
 * @description deletes multiple properties in an object using an array of paths
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @return the updated object with the properties at the given paths deleted
 */
export function deleteAttributesByPaths<T = any>(obj: T, paths: string[]) {
  paths.forEach((p) => deleteAttributeByPath(obj, p));
  return obj;
}

/**
 *
 * @description converts a JavaScript object to form data, including handling media files
 * @param data a JavaScript object to be converted to form data, used in convertToFormData function
 * @param media an optional array of objects with properties file and title, used in convertToFormData function
 * @return a FormData object representing the JavaScript object
 */
export function convertToFormData(
  data: Record<string, any>,
  media?: { file: any; title: string }[]
): FormData {
  let formData = new FormData();

  for (let key of Object.keys(data)) {
    if (data[key] !== undefined) {
      formData.set(key, JSON.stringify(data[key]));
    }
  }

  if (media?.length) {
    media.forEach((item) => {
      if (item.file instanceof Array) {
        if (item.file.length) {
          formData.delete(item.title);

          item.file.forEach((file) => {
            formData.append(item.title, file);
          });
        }
      } else if (item.file) {
        formData.set(item.title, item.file);
      }
    });
  }

  return formData;
}

/**
 *
 * @description creates a deep copy of a JavaScript object
 * @param obj any JavaScript object
 * @return a deep copy of the JavaScript object
 */
export function simpleCloneObject<T = any>(obj: T): T {
  return !obj ? obj : JSON.parse(JSON.stringify(obj));
}

/**
 *
 * @description creates a deep copy of a JavaScript object
 * @param obj any JavaScript object
 * @return a deep copy of the JavaScript object
 */
export function cloneObjectDeep<T = any>(obj: T): T {
  return cloneDeep(obj);
}

/**
 *
 * @description updates an object with new properties and values
 * @param obj any JavaScript object
 * @param updateValue an object with properties to update an object
 * @return the updated object
 */
export function updateObject(obj: any, updateValue: any) {
  Object.keys(updateValue || {}).forEach((k) => {
    obj[k] = updateValue[k];
  });
}

/**
 *
 * @description updates an object with new properties and values, only updating existing properties
 * @param obj any JavaScript object
 * @param updateValue an object with properties to update an object
 * @return the updated object
 */
export function updateObjectStrict(obj: any, updateValue: any) {
  let objKeys = Object.keys(obj || {});
  Object.keys(updateValue || {})
    .filter((key) => objKeys.includes(key))
    .forEach((k) => {
      if (typeof obj[k] == "object" && !(obj[k] instanceof Array)) {
        updateObjectStrict(obj[k], updateValue[k]);
      } else {
        obj[k] = updateValue[k];
      }
    });
}
