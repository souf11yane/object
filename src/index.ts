import cloneDeep from "lodash/cloneDeep";

/**
 *
 * @description
 * - The function uses recursion to traverse the object and handle nested properties
 * - It can create properties if they do not exist, but this behavior is optional and controlled by the createIfUndefined parameter
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @param createIfUndefined a boolean indicating whether to create the property if it does not exist (default is false)
 * @returns An array containing the last path segment and the accessed property
 */
export function accessObjectByPath(
  obj: any,
  path: string,
  createIfUndefined = false
): [string, any] {
  if (typeof path !== "string") {
    throw new Error(`the given path \`${path}\` is not of type string`);
  }

  let pathSegments = path.split(".");
  let last = pathSegments.splice(-1, 1)[0] ?? "";

  let data = obj;

  while (pathSegments.length) {
    const prop = pathSegments.shift()!;

    if (!(prop in data) || !data[prop]) {
      if (createIfUndefined) {
        data[prop] = isNaN(+pathSegments[0]) ? {} : [];
      } else {
        return [last, undefined];
      }
    }

    data = data[prop];
  }

  return [last, data];
}

/**
 *
 * @description traverses the object using dot notation to get the value of a property at a given path
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @param createIfUndefined a boolean indicating whether to create the property if it does not exist (default is false)
 * @returns the value of the property at the given path
 */
export function getValueByPath(
  obj: any,
  path: string,
  createIfUndefined = false
): any {
  try {
    let [last, data] = accessObjectByPath(obj, path, createIfUndefined);

    return data[last];
  } catch (error) {
    console.error(
      `there was an error while getting the value of the path \`${path}\` \ndetail: `,
      error
    );
    return obj;
  }
}

/**
 *
 * @description traverses the object using dot notation to set the value of a property at a given path, creating nested objects or arrays as needed
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @param createIfUndefined a boolean indicating whether to create the property if it does not exist (default is false)
 * @returns the updated object with the new property value
 */
export function setValueByPath<T extends {}>(
  obj: T,
  path: string,
  value: { path: string; obj: any },
  createIfUndefined: boolean
): T;
export function setValueByPath<T extends {}>(
  obj: T,
  path: string,
  value: { path: string },
  createIfUndefined?: boolean
): T;
export function setValueByPath<T extends {}>(
  obj: T,
  path: string,
  value: any,
  createIfUndefined?: boolean
): T;
export function setValueByPath<T extends {}>(
  obj: T,
  path: string,
  value: any,
  createIfUndefined = false
): T {
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
          if (returnedData) data[last] = returnedData;
        }
      } else {
        data[last] = value;
      }
    }
  } catch (error) {
    console.error(
      `there was an error while setting the value \`${value}\` in the path \`${path}\`\ndetail: `,
      error
    );
  } finally {
    return obj;
  }
}

export type Paths = (
  | [string, string]
  | { path: string; value: { path: string; obj?: any } }
  | { path: string; value: any }
)[];

/**
 *
 * @description sets multiple values in an object using an array of paths and values
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @param createIfUndefined a boolean flag indicating whether to create nested objects if they don't exist
 * @returns the updated object with the new property values
 */
export function setValuesByPaths<T extends {}>(
  obj: T,
  paths: Paths,
  createIfUndefined?: boolean
) {
  try {
    for (const pathItem of paths) {
      if (Array.isArray(pathItem)) {
        setValueByPath(
          obj,
          pathItem[0],
          { path: pathItem[1] ?? "" },
          createIfUndefined
        );
      } else {
        setValueByPath(obj, pathItem.path, pathItem.value, createIfUndefined);
      }
    }
  } catch (error) {
    console.error(
      `there was an error while setting the values \ndetail: `,
      error
    );
  } finally {
    return obj;
  }
}

/**
 *
 * @description deletes a property at a given path in an object
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @return the updated object with the property at the given path deleted
 */
export function deleteAttributeByPath<T = any>(obj: any, path: string): T {
  try {
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
  } catch (error) {
    console.error(
      `there was an error while deleting the attribute ${path}\ndetail:`,
      error
    );
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
