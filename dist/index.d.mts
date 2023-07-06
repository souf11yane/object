/**
 *
 * @description traverses the object using dot notation to get the value of a property at a given path
 * @returns the value of the property at the given path
 */
declare function getValueByPath(obj: any, path: string): any;
/**
 *
 * @description traverses the object using dot notation to set the value of a property at a given path, creating nested objects or arrays as needed
 * @returns the updated object with the new property value
 */
declare function setValueByPath<T = any>(obj: any, path: string, value?: {
    value?: any;
    path?: string;
    obj?: any;
}): T;
/**
 *
 * @description sets multiple values in an object using an array of paths and values
 * @returns the updated object with the new property values
 */
declare function setValuesByPaths<T = any>(obj: T, paths: ([string, string] | {
    path: string;
    value: {
        value?: any;
        path?: any;
        obj?: any;
    };
})[]): T;
/**
 *
 * @description converts a JavaScript object to form data, including handling media files
 * @return a FormData object representing the JavaScript object
 */
declare function convertToFormData(data: Record<string, any>, media?: {
    file: any;
    title: string;
}[]): FormData;
/**
 *
 * @description creates a deep copy of a JavaScript object
 * @return a deep copy of the JavaScript object
 */
declare function cloneObject<T = any>(obj: T): T;
/**
 *
 * @description updates an object with new properties and values
 * @return the updated object
 */
declare function updateObject(obj: any, val: any): void;
/**
 *
 * @description updates an object with new properties and values, only updating existing properties
 * @return the updated object
 */
declare function updateObjectStrict(obj: any, val: any): void;
/**
 *
 * @description deletes a property at a given path in an object
 * @return the updated object with the property at the given path deleted
 */
declare function deleteAttributeByPath(obj: any, path: string): any;
/**
 *
 * @description deletes multiple properties in an object using an array of paths
 * @return the updated object with the properties at the given paths deleted
 */
declare function deleteAttributesByPaths(obj: any, paths: string[]): void;

export { cloneObject, convertToFormData, deleteAttributeByPath, deleteAttributesByPaths, getValueByPath, setValueByPath, setValuesByPaths, updateObject, updateObjectStrict };
