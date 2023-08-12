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
declare function accessObjectByPath(obj: any, path: string, createIfUndefined?: boolean): [string, any];
/**
 *
 * traverses the object using dot notation to get the value of a property at a given path
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @param createIfUndefined a boolean indicating whether to create the property if it does not exist (default is false)
 * @returns the value of the property at the given path
 */
declare function getValueByPath(obj: any, path: string, createIfUndefined?: boolean): any;
/**
 *
 * traverses the object using dot notation to set the value of a property at a given path, creating nested objects or arrays as needed
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @param createIfUndefined a boolean indicating whether to create the property if it does not exist (default is false)
 * @returns the updated object with the new property value
 */
declare function setValueByPath<T extends Object>(obj: T, path: string, value: {
    path: string;
    obj: any;
}, createIfUndefined: boolean): T;
declare function setValueByPath<T extends Object>(obj: T, path: string, value: {
    path: string;
}, createIfUndefined?: boolean): T;
declare function setValueByPath<T extends Object>(obj: T, path: string, value: any, createIfUndefined?: boolean): T;
type Paths = ([string, string] | {
    path: string;
    value: {
        path: string;
        obj?: any;
    };
} | {
    path: string;
    value: any;
})[];
/**
 *
 * sets multiple values in an object using an array of paths and values
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @param createIfUndefined a boolean flag indicating whether to create nested objects if they don't exist
 * @returns the updated object with the new property values
 */
declare function setValuesByPaths<T extends Object>(obj: T, paths: Paths, createIfUndefined?: boolean): T;
/**
 *
 * deletes a property at a given path in an object
 * @param obj any JavaScript object
 * @param path a string representing a path to a property in the object, using dot notation to traverse nested properties
 * @return the updated object with the property at the given path deleted
 */
declare function deleteAttributeByPath<T extends Object>(obj: T, path: string): T;
/**
 *
 * deletes multiple properties in an object using an array of paths
 * @param obj any JavaScript object
 * @param paths an array of strings or objects with properties path and value
 * @return the updated object with the properties at the given paths deleted
 */
declare function deleteAttributesByPaths<T extends Object>(obj: T, paths: string[]): T;
/**
 *
 * converts a JavaScript object to form data, including handling media files
 * @param data a JavaScript object to be converted to form data, used in convertToFormData function
 * @param media an optional array of objects with properties file and title, used in convertToFormData function
 * @return a FormData object representing the JavaScript object
 */
declare function convertToFormData(data: Record<string, any>, media?: {
    file: any;
    title: string;
}[]): FormData;
/**
 *
 * a recursive function that creates a deep copy of a JavaScript object. It takes an object obj as input and an optional parameter ignoreUnaccessibleFields which determines whether to ignore unaccessible fields (default is false)
 * @param obj any JavaScript object
 * @param [ignoreUnaccessibleFields=false]
 * @return a deep copy of the JavaScript object
 */
declare function cloneObject<T extends Object>(obj: T, ignoreUnaccessibleFields?: boolean): T;
/**
 *
 * updates an object with new properties and values
 * @param obj any JavaScript object
 * @param updateValue an object with properties to update an object
 * @return the updated object
 */
declare function updateObject<T extends Object>(obj: T, updateValue: Object): T;
/**
 *
 * updates an object with new properties and values, only updating existing properties
 * @param obj any JavaScript object
 * @param updateValue an object with properties to update an object
 * @return the updated object
 */
declare function updateObjectStrict<T = any>(obj: T, updateValue: Partial<T>): T & object;

export { Paths, accessObjectByPath, cloneObject, convertToFormData, deleteAttributeByPath, deleteAttributesByPaths, getValueByPath, setValueByPath, setValuesByPaths, updateObject, updateObjectStrict };
