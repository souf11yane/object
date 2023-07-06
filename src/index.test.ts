import { describe, expect, it } from "vitest";
import {
  simpleCloneObject,
  cloneObjectDeep,
  convertToFormData,
  deleteAttributeByPath,
  deleteAttributesByPaths,
  getValueByPath,
  setValueByPath,
  setValuesByPaths,
  updateObject,
  updateObjectStrict,
} from "./index";

// Tests that setValueByPath sets a value at a given path in an object
it("test_set_value_by_path_happy_path", () => {
  const obj = { a: { b: { c: 1 } } };
  setValueByPath(obj, "a.b.c", 2);
  expect(obj.a.b.c).toEqual(2);
});

// Tests that getValueByPath gets a value at a given path in an object
it("test_get_value_by_path_happy_path", () => {
  const obj = { a: { b: { c: 1 } } };
  const value = getValueByPath(obj, "a.b.c");
  expect(value).toEqual(1);
});

// Tests that setValuesByPaths handles arrays with numeric indices
it("test_set_values_by_paths_edge_case", () => {
  const obj = { a: [1, 2, 3], b: { c: 2 } };
  setValuesByPaths(obj, [["b", "c"], { path: "a.2", value: 5 }]);
  expect(obj.b).toEqual(2);
  expect(obj.a).toEqual([4, 2, 5]);
});

// Tests that deleteAttributeByPath handles arrays with numeric indices
it("test_delete_attribute_by_path_edge_case", () => {
  const obj = { a: [1, 2, 3] };
  deleteAttributeByPath(obj, "a.1");
  expect(obj.a).toEqual([1, 3]);
});

// Tests that convertToFormData converts a JavaScript object to form data
it("test_convert_to_form_data_happy_path", () => {
  const data = { a: 1, b: "hello" };
  const media = [{ file: new File([""], "file.txt"), title: "file" }];
  const formData = convertToFormData(data, media);
  expect(formData.get("a")).toEqual("1");
  expect(formData.get("b")).toEqual('"hello"');
  expect(formData.get("file")).toBeInstanceOf(File);
});

// Tests that simpleCloneObject handles null and undefined values
it("test_simple_clone_object_edge_case", () => {
  const obj1 = null;
  const obj2 = undefined;
  const obj3 = { a: 1 };
  const clonedObj1 = simpleCloneObject(obj1);
  const clonedObj2 = simpleCloneObject(obj2);
  const clonedObj3 = simpleCloneObject(obj3);
  expect(clonedObj1).toEqual(null);
  expect(clonedObj2).toEqual(undefined);
  expect(clonedObj3).toEqual({ a: 1 });
});

// Tests that deleteAttributesByPaths deletes multiple properties in an object using an array of paths
it("test_deleteAttributesByPaths_happy_path", () => {
  const obj = {
    a: {
      b: {
        c: 1,
        d: 2,
      },
      e: {
        f: 3,
        g: 4,
      },
    },
    h: {
      i: 5,
      j: 6,
    },
  };
  const expected = {
    a: {
      b: {
        d: 2,
      },
      e: {
        f: 3,
      },
    },
    h: {
      j: 6,
    },
  };
  const paths = ["a.b.c", "a.e.g", "h.i"];
  const result = deleteAttributesByPaths(obj, paths);
  expect(result).toEqual(expected);
});

// Tests that updateObject updates an object with new properties and values
it("test_updateObject_happy_path", () => {
  const obj = { a: 1, b: 2 };
  updateObject(obj, { b: 3, c: 4 });
  expect(obj).toEqual({ a: 1, b: 3, c: 4 });
});

// Tests that cloneObjectDeep creates a deep copy of a JavaScript object
it("test_clone_object_deep", () => {
  const obj = { a: 1, b: { c: 2 } };
  const clonedObj = cloneObjectDeep(obj);
  expect(clonedObj).toEqual(obj);
  expect(clonedObj).not.toBe(obj);
  expect(clonedObj.b).not.toBe(obj.b);
});

// Tests that updateObjectStrict updates an object with new properties and values, only updating existing properties
it("test_updateObjectStrict_happy_path", () => {
  const obj = { a: 1, b: { c: 2 } };
  updateObjectStrict(obj, { a: 3, b: { c: 4, d: 5 } });
  expect(obj).toEqual({ a: 3, b: { c: 4 } });
});
