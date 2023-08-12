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

  if (path.length == 0) return ["", obj];

  let pathSegments = path.split(".");
  let last = pathSegments.splice(-1, 1)[0];

  let data = obj;

  while (pathSegments.length) {
    const prop = pathSegments.shift()!;

    if (!(prop in data) || !data[prop]) {
      if (createIfUndefined) {
        if (isNaN(+(pathSegments[0] ?? last))) {
          data[prop] = {};
        } else {
          data[prop] = [];
        }
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
 * traverses the object using dot notation to get the value of a property at a given path
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

    if (Array.isArray(data) && isNaN(+last)) {
      return data.map((item) => item[last]);
    } else {
      return data[last];
    }
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
 * traverses the object using dot notation to set the value of a property at a given path, creating nested objects or arrays as needed
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @param createIfUndefined a boolean indicating whether to create the property if it does not exist (default is false)
 * @returns the updated object with the new property value
 */
export function setValueByPath<T extends Object>(
  obj: T,
  path: string,
  value: { path: string; obj: any },
  createIfUndefined: boolean
): T;
export function setValueByPath<T extends Object>(
  obj: T,
  path: string,
  value: { path: string },
  createIfUndefined?: boolean
): T;
export function setValueByPath<T extends Object>(
  obj: T,
  path: string,
  value: any,
  createIfUndefined?: boolean
): T;
export function setValueByPath<T extends Object>(
  obj: T,
  path: string,
  value: any,
  createIfUndefined = false
): T {
  try {
    let [last, data] = accessObjectByPath(obj, path, createIfUndefined);

    if (!createIfUndefined && !(last in data)) {
      return obj;
    }

    if (data && (last in data || createIfUndefined)) {
      if (Array.isArray(data) && isNaN(+last)) {
        data.forEach((item) => {
          let returnedData = value.path
            ? getValueByPath(value.obj || item[last], value.path)
            : value;

          if (returnedData !== undefined) item[last] = returnedData;
        });
      } else {
        let returnedData = value.path
          ? getValueByPath(value.obj || data[last], value.path)
          : value;

        if (returnedData !== undefined) data[last] = returnedData;
      }

      // if (value.path) {
      //   let returnedData = getValueByPath(value.obj || data[last], value.path);
      //   if (returnedData !== undefined) {
      //     if (Array.isArray(data) && isNaN(+last)) {
      //       data.splice(0, data.length - 1, ...data.map((item) => item[last]));
      //     } else {
      //       data[last] = returnedData;
      //     }
      //   }
      // } else {
      //   data[last] = value;
      // }
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
 * sets multiple values in an object using an array of paths and values
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @param createIfUndefined a boolean flag indicating whether to create nested objects if they don't exist
 * @returns the updated object with the new property values
 */
export function setValuesByPaths<T extends Object>(
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
          { path: pathItem[1] },
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
 * deletes a property at a given path in an object
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @return the updated object with the property at the given path deleted
 */
export function deleteAttributeByPath<T extends Object>(
  obj: T,
  path: string
): T {
  if (!obj) return obj;
  try {
    let [last, data] = accessObjectByPath(obj, path);

    if (data && last in data) {
      delete data[last];
    }
  } catch (error) {
    console.error(
      `there was an error while deleting the values \ndetail: `,
      error
    );
  } finally {
    return obj;
  }
}

/**
 *
 * deletes multiple properties in an object using an array of paths
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @return the updated object with the properties at the given paths deleted
 */
export function deleteAttributesByPaths<T extends Object>(
  obj: T,
  paths: string[]
) {
  if (!(obj && paths)) return obj;
  for (const pathItem of paths) {
    deleteAttributeByPath(obj, pathItem);
  }
  return obj;
}

/**
 *
 * converts a JavaScript object to form data, including handling media files
 * @param data a JavaScript object to be converted to form data, used in convertToFormData function
 * @param media an optional array of objects with properties file and title, used in convertToFormData function
 * @return a FormData object representing the JavaScript object
 */
export function convertToFormData(
  data: Record<string, any>,
  media?: { file: any; title: string }[]
): FormData {
  let formData = new FormData();

  try {
    if (data && typeof data === "object") {
      for (let key of Object.keys(data)) {
        if (data[key] !== undefined) {
          formData.set(key, JSON.stringify(data[key]));
        }
      }
    } else {
      console.error("data parameter is not an object");
    }

    if (media?.length) {
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
      `there was an error while converting to formData \ndetail: `,
      error
    );
  } finally {
    return formData;
  }
}

/**
 *
 * a recursive function that creates a deep copy of a JavaScript object. It takes an object obj as input and an optional parameter ignoreUnaccessibleFields which determines whether to ignore unaccessible fields (default is false)
 * @param obj any JavaScript object
 * @param [ignoreUnaccessibleFields=false]
 * @return a deep copy of the JavaScript object
 */
export function cloneObject<T extends Object>(
  obj: T,
  ignoreUnaccessibleFields = false
): T {
  const clonedObjects = new WeakMap();
  const CloneRec = (obj: any) => {
    if (
      obj === undefined ||
      obj === null ||
      !["object", "symbol"].includes(typeof obj)
    ) {
      return obj; // Return primitive values and null as is
    }

    if (typeof obj === "symbol") return Symbol(obj.description); // return new Symbol

    // Handle special object types
    if (obj instanceof Date) return new Date(obj.getTime());

    if (obj instanceof RegExp) return new RegExp(obj);

    if (obj instanceof Map) {
      const newMap: any = new Map();
      obj.forEach((value, key) => {
        newMap.set(CloneRec(key), CloneRec(value));
      });
      return newMap;
    }

    if (obj instanceof Set) {
      const newSet: any = new Set();
      obj.forEach((value) => {
        newSet.add(CloneRec(value));
      });
      return newSet;
    }

    if (obj instanceof ArrayBuffer) return obj.slice(0);

    if (obj instanceof DataView) return new DataView(obj.buffer.slice(0));

    if (
      Array.isArray(obj) ||
      obj instanceof Int8Array ||
      obj instanceof Int16Array ||
      obj instanceof Int32Array ||
      obj instanceof Uint8Array ||
      obj instanceof Uint8ClampedArray ||
      obj instanceof Uint16Array ||
      obj instanceof Uint32Array ||
      obj instanceof Float32Array ||
      obj instanceof Float64Array ||
      obj instanceof BigInt64Array ||
      obj instanceof BigUint64Array
    ) {
      const length = obj.length;
      const newArray: any = new (<any>obj).constructor(length);
      clonedObjects.set(obj, newArray);
      for (let i = 0; i < length; i++) {
        newArray[i] = CloneRec(obj[i]);
      }
      return newArray;
    }

    if (clonedObjects.has(obj)) return clonedObjects.get(obj);

    const newObj: any = {};
    clonedObjects.set(obj, newObj);

    if (!ignoreUnaccessibleFields) {
      let descriptor = Object.getOwnPropertyDescriptors(obj);

      for (let key in descriptor) {
        Object.defineProperty(newObj, key, {
          ...descriptor[key],
          value: CloneRec((<any>obj)[key]),
        });
      }

      return newObj;
    }

    for (let key in obj) newObj[key] = CloneRec(obj[key]);

    return newObj;
  };

  return CloneRec(obj);
}

/**
 *
 * updates an object with new properties and values
 * @param obj any JavaScript object
 * @param updateValue an object with properties to update an object
 * @return the updated object
 */
export function updateObject<T extends Object>(obj: T, updateValue: Object) {
  if (
    !(
      obj &&
      updateValue &&
      typeof obj == "object" &&
      typeof updateValue == "object"
    )
  ) {
    throw new Error("Invalid input parameters. Expected objects.");
  }

  Object.assign(obj, updateValue);

  return obj;
}

/**
 *
 * updates an object with new properties and values, only updating existing properties
 * @param obj any JavaScript object
 * @param updateValue an object with properties to update an object
 * @return the updated object
 */
export function updateObjectStrict<T = any>(obj: T, updateValue: Partial<T>) {
  if (
    !(
      obj &&
      updateValue &&
      typeof obj == "object" &&
      typeof updateValue == "object"
    )
  ) {
    throw new Error("Invalid input parameters. Expected objects.");
  }

  for (const key in updateValue) {
    // @ts-ignore
    if (key in obj) obj[key] = updateValue[key];
  }

  return obj;
}
