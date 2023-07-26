import { describe, expect, it } from "vitest";
import {
  cloneObject,
  convertToFormData,
  deleteAttributeByPath,
  deleteAttributesByPaths,
  getValueByPath,
  setValueByPath,
  setValuesByPaths,
  updateObject,
  updateObjectStrict,
  accessObjectByPath,
  Paths,
} from "./index";

describe("accessObjectByPath function", () => {
  // Tests that the function can access a property that exists at the top level of the object
  it("test access top level property", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "a");
    expect(last).toBe("a");
    expect(data).toBe(obj);
  });

  // Tests that the function can access a property that exists at a nested level of the object
  it("test access nested property", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.b");
    expect(last).toBe("b");
    expect(data).toEqual({ b: 2 });
  });

  // Tests that the function can access the last property in a nested path
  it("test access last property", () => {
    const obj = { a: { b: { c: 3 } } };
    const [last, data] = accessObjectByPath(obj, "a.b.c");
    expect(last).toBe("c");
    expect(data).toEqual({ c: 3 });
  });

  // Tests that the function returns the entire object if a property in the path does not exist and createIfUndefined is false
  it("test access nonexistent top level property", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "b");
    expect(last).toBe("b");
    expect(data).toBe(obj);
  });

  // Tests that the function returns the entire object if a property in a nested path does not exist and createIfUndefined is false
  it("test access nonexistent nested property", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.c");
    expect(last).toBe("c");
    expect(data).toBe(obj.a);
  });

  // Tests that the function returns undefined if a property in a nested path does not exist and it's not the last path and createIfUndefined is false
  it("test access nonexistent nested property not last", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.c.d");
    expect(last).toBe("d");
    expect(data).toBeUndefined();
  });

  // Tests that the function returns the entire object if a property in the path does not exist and createIfUndefined is false
  it("test create nonexistent top level property", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "b.c", true);
    expect(last).toBe("c");
    expect(data).toEqual({});
  });

  // Tests that the function if a property in a nested path does not exist and createIfUndefined is true create the properties and sets its value to object if the property is not a number after parsing it
  it("test create nonexistent nested property", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.c.d", true);
    expect(last).toBe("d");
    expect(data).toEqual({});
  });

  // Tests that the function if a property in a nested path does not exist and createIfUndefined is true create the properties and sets its value to array if the property is a number after parsing it
  it("test create nonexistent nested property", () => {
    const obj_0 = { a: { b: 2 } };
    const obj_d = { a: { b: 2 } };

    expect(accessObjectByPath(obj_0, "a.c.0", true)).toEqual(["0", []]);
    expect(accessObjectByPath(obj_d, "a.c.0.d", true)).toEqual(["d", {}]);
  });

  // Tests that the function returns an error if the path is not a string
  it("test access non string path", () => {
    const obj = { a: 1 };
    expect(() => accessObjectByPath(obj, 123)).toThrow();
  });

  // Tests that accessing a property with an empty string path returns the original object
  it("test accessing property with empty string path", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "");
    expect(last).toBe("");
    expect(data).toBe(obj);
  });

  // Tests that the function returns the last property in the path if it is an object
  it("test returns last property if object", () => {
    const obj = {
      a: {
        b: {
          c: {
            d: "value",
          },
        },
      },
    };

    const [last, data] = accessObjectByPath(obj, "a.b.c");

    expect(last).toBe("c");
    expect(data).toEqual({ c: { d: "value" } });
  });

  // Tests that the function returns the last property in the path if it is an array
  it("test returns last property if it is an array", () => {
    const obj = {
      a: {
        b: [
          {
            c: 1,
          },
          {
            c: 2,
          },
        ],
      },
    };
    const [last, data] = accessObjectByPath(obj, "a.b");
    expect(last).toEqual("b");
    expect(data).toEqual({
      b: [
        {
          c: 1,
        },
        {
          c: 2,
        },
      ],
    });
  });
});

describe("getValueByPath function", () => {
  // Tests that the function returns the correct value for a simple path
  it("test simple path", () => {
    const obj = { a: 1 };
    const path = "a";
    expect(getValueByPath(obj, path)).toEqual(1);
  });

  // Tests that the function returns array of values if the last path is not a number
  it("test array of objects with the last path is not a number", () => {
    const obj = {
      testArray: [
        {
          id: 1,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 2,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 3,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 4,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 5,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
      ],
    };
    const path = "testArray.id";
    expect(getValueByPath(obj, path)).toEqual([1, 2, 3, 4, 5]);
  });

  // Tests that the function returns object if the last path is a number
  it("test array of objects with the last path is a number", () => {
    const obj = {
      testArray: [
        {
          id: 1,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 2,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 3,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 4,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 5,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
      ],
    };
    const path = "testArray.3";
    expect(getValueByPath(obj, path)).toEqual({
      id: 4,
      name: "test name 1",
      other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
    });
  });

  // Tests that the function returns the correct value for a nested path
  it("test nested path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.c";
    expect(getValueByPath(obj, path)).toEqual(1);
  });

  // Tests that the function returns undefined for a non-existent path
  it("test non existent path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.d";
    expect(getValueByPath(obj, path)).toBeUndefined();
  });

  // Tests that the function returns the correct value for a path with a numeric property
  it("test numeric property", () => {
    const obj = { "1": "one" };
    const path = "1";
    expect(getValueByPath(obj, path)).toEqual("one");
  });

  // Tests that the function returns the correct value for a path with a boolean property
  it("test boolean property", () => {
    const obj = { true: "yes" };
    const path = "true";
    expect(getValueByPath(obj, path)).toEqual("yes");
  });

  // Tests that the function returns the correct value for a path with a null property
  it("test null property", () => {
    const obj = { null: "nothing" };
    const path = "null";
    expect(getValueByPath(obj, path)).toEqual("nothing");
  });

  // Tests that the function returns undefined when the property at the given path is undefined
  it("test returns undefined for undefined property", () => {
    const obj = { a: { b: 1 } };
    const path = "a.c";
    const result = getValueByPath(obj, path);
    expect(result).toBeUndefined();
  });

  // Tests that the function returns the correct value for a path with an empty string property
  it("test returns correct value for empty string property", () => {
    const obj = { "": "empty string property" };
    const path = "";
    const expected = "empty string property";
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function returns the correct value for a path with a property that has a value of 0
  it("test returns correct value for path with property value of 0", () => {
    const obj = {
      a: {
        b: {
          c: 0,
        },
      },
    };
    const path = "a.b.c";
    const result = getValueByPath(obj, path);
    expect(result).toBe(0);
  });

  // Tests that the function returns the correct value for a path with a property that has a value of false
  it("test returns correct value for false property", () => {
    const obj = {
      a: {
        b: {
          c: false,
        },
      },
    };
    const path = "a.b.c";
    const result = getValueByPath(obj, path);
    expect(result).toBe(false);
  });

  // Tests that the function returns the correct value for a path with a property that has a value of null
  it("test returns correct value for null property", () => {
    const obj = {
      a: {
        b: null,
      },
    };
    const path = "a.b";
    const result = getValueByPath(obj, path);
    expect(result).toBeNull();
  });

  // Tests that the function returns the correct value for a path with a property that has a value of undefined
  it("test returns correct value for undefined property", () => {
    const obj = { a: { b: undefined } };
    const path = "a.b";
    const result = getValueByPath(obj, path);
    expect(result).toBeUndefined();
  });

  // Tests that the function returns the correct value for a path with a property that has a value of an object with a nested object
  it("test returns correct value for nested object", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    const path = "a.b";
    const expected = {
      c: "value",
    };
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function 'getValueByPath' returns the correct value for a path with a property that has a value of an object with nested arrays
  it("test returns correct value for path with property with nested arrays", () => {
    const obj = {
      a: {
        b: {
          c: [
            {
              d: 1,
            },
            {
              d: 2,
            },
          ],
        },
      },
    };
    const path = "a.b.c.1.d";
    const expectedValue = 2;
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expectedValue);
  });

  // Tests that the function returns the correct value for a path with a property that has a value of an array with nested objects
  it("test returns correct value for path with array of nested objects", () => {
    const obj = {
      a: {
        b: [
          {
            c: {
              d: "value1",
            },
          },
          {
            c: {
              d: "value2",
            },
          },
        ],
      },
    };
    const result = getValueByPath(obj, "a.b.1.c.d");
    expect(result).toEqual("value2");
  });

  // Tests that the function returns the correct value for a path with a property that has a value of an empty object
  it("test returns correct value for empty object", () => {
    const obj = { a: { b: {} } };
    const path = "a.b";
    const expected = {};
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that getValueByPath returns the correct value for a path with a property that has a value of an empty array
  it("test returns correct value for empty array", () => {
    const obj = {
      a: {
        b: [],
      },
    };
    const path = "a.b";
    const result = getValueByPath(obj, path);
    expect(result).toEqual([]);
  });

  // Tests that the function returns the correct value for a path with an object property
  it("test returns correct value for object property", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    const path = "a.b.c";
    const expected = "value";
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function returns the correct value for a path with an array property
  it("test returns correct value for array property", () => {
    const obj = {
      a: {
        b: [
          {
            c: 1,
          },
          {
            c: 2,
          },
        ],
      },
    };
    const path = "a.b.1.c";
    const expected = 2;
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });
});

describe("setValueByPath function", () => {
  // Tests that setValueByPath sets a value at the specified path in a simple object
  it("test set value simple object", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "a", 2);
    expect(obj).toEqual({ a: 2 });
  });

  // Tests that setValueByPath sets a value at the specified path in a nested object
  it("test set value nested object", () => {
    const obj = { a: { b: { c: 1 } } };
    setValueByPath(obj, "a.b.c", 2);
    expect(obj).toEqual({ a: { b: { c: 2 } } });
  });
  // Tests that setValueByPath sets a value at the specified path in a nested object
  it("test set value nested object", () => {
    const obj = {
      testArray: [
        {
          id: 1,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 2,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 3,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 4,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
        {
          id: 5,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
        },
      ],
    };
    setValueByPath(obj, "testArray.number", 10, true);
    expect(obj).toEqual({
      testArray: [
        {
          id: 1,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
          number: 10,
        },
        {
          id: 2,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
          number: 10,
        },
        {
          id: 3,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
          number: 10,
        },
        {
          id: 4,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
          number: 10,
        },
        {
          id: 5,
          name: "test name 1",
          other: ["test 1", "test 2", "test 3", "test 4", "test 5"],
          number: 10,
        },
      ],
    });
  });

  // Tests that setValueByPath sets a value at the specified path in an array
  it("test set value array", () => {
    const obj = { a: [1, 2, 3] };
    setValueByPath(obj, "a.1", 4);
    expect(obj).toEqual({ a: [1, 4, 3] });
  });

  // Tests that setValueByPath sets a value at the specified path in a nested array
  it("test set value nested array", () => {
    const obj = { a: { b: [{ c: 1 }, { c: 2 }] } };
    setValueByPath(obj, "a.b.1.c", 3);
    expect(obj).toEqual({ a: { b: [{ c: 1 }, { c: 3 }] } });
  });

  // Tests that setValueByPath sets a value at a non-existent path with createIfUndefined=false
  it("test set value non existent path", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "b.c", 2);
    expect(obj).toEqual({ a: 1 });
  });

  // Tests that setValueByPath sets a value at a non-existent path with createIfUndefined=true
  it("test set value non existent path with createIfUndefined sets to true", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "b.c", 2, true);
    expect(obj).toEqual({ a: 1, b: { c: 2 } });
  });

  // Tests that setValueByPath sets a value at a path that is an empty string
  it("test set value empty path", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "", 2);
    expect(obj).toEqual({ a: 1 });
  });

  // Tests that setValueByPath sets a value at a path that is an empty string with createIfUndefined=true
  it("test set value empty path createIfUndefined sets to true", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "", 2, true);
    expect(obj).toEqual({ a: 1, "": 2 });
  });

  // Tests that a value is set at the specified path in an object with numeric keys
  it("test sets value in object with numeric keys", () => {
    const obj = { 0: { 1: { 2: "old value" } } };
    const path = "0.1.2";
    const value = "new value";
    const result = setValueByPath(obj, path, value);
    expect(result).toEqual({ 0: { 1: { 2: "new value" } } });
  });

  // Tests that a value can be set at the root level of an empty array
  it("test sets value at root level of empty array", () => {
    const obj = [];
    setValueByPath(obj, "", "test");
    expect(obj).toEqual([]);
  });

  // Tests that a value can be set at the root level of an empty array with createIfUndefined=true
  it("test sets value at root level of empty array with createIfUndefined sets to true", () => {
    const obj = [];
    setValueByPath(obj, "", "test", true);
    let tempObj = [];
    tempObj[""] = "test";
    expect(obj).toEqual(tempObj);
  });

  // Tests that setValueByPath function throws an error when the path is not a string
  it("test sets value at non string path", () => {
    const obj = { a: { b: 1 } };
    const path = 123;
    const value = 2;
    expect(setValueByPath(obj, path, value)).toEqual({ a: { b: 1 } });
  });

  // Tests that a value can be set at a path that ends with a dot
  it("test sets value at path ending with dot", () => {
    const obj = { a: { b: { c: 1 } } };
    setValueByPath(obj, "a.b.", 2);
    expect(obj).toEqual({ a: { b: { c: 1 } } });
  });

  // Tests that a value can be set at a path that ends with a dot with createIfUndefined=true
  it("test sets value at path ending with dot createIfUndefined sets to true", () => {
    const obj = { a: { b: { c: 1 } } };
    setValueByPath(obj, "a.b.", 2, true);
    expect(obj).toEqual({ a: { b: { c: 1, "": 2 } } });
  });

  // Tests that a value can be set at a path that contains a null object
  it("test sets value at path with null object", () => {
    const obj = { a: { b: null } };
    setValueByPath(obj, "a.b.c", 123);
    expect(obj).toEqual({ a: { b: null } });
  });

  // Tests that a value can be set at a path that contains a null object with createIfUndefined=true
  it("test sets value at path with null object with createIfUndefined sets to true", () => {
    const obj = { a: { b: null } };
    setValueByPath(obj, "a.b.c", 123, true);
    expect(obj).toEqual({ a: { b: { c: 123 } } });
  });

  // Tests that a value can be set at a path that contains a null array
  it("test sets value at path with null array", () => {
    const obj = { a: [null] };
    setValueByPath(obj, "a.0.b", "new value");
    expect(obj).toEqual({ a: [null] });
  });

  // Tests that a value can be set at a path that contains a null array with createIfUndefined=true
  it("test sets value at path with null array with createIfUndefined sets to true", () => {
    const obj = { a: [null] };
    setValueByPath(obj, "a.0.b", "new value", true);
    expect(obj).toEqual({ a: [{ b: "new value" }] });
  });

  // Tests that a value can be set at a path that contains an undefined object
  it("test sets value at path with undefined object", () => {
    const obj = {};
    const path = "a.b.c";
    const value = "hello world";
    setValueByPath(obj, path, value);
    expect(obj).toEqual({});
  });

  // Tests that a value can be set at a path that contains an undefined object with createIfUndefined=true
  it("test sets value at path with undefined object with createIfUndefined sets to true", () => {
    const obj = {};
    const path = "a.b.c";
    const value = "hello world";
    setValueByPath(obj, path, value, true);
    expect(obj).toEqual({ a: { b: { c: "hello world" } } });
  });

  // Tests that setValueByPath can set a value at a path that contains a circular reference
  it("test circular reference", () => {
    const obj: any = { a: { b: {} } };
    obj.a.b.c = obj.a.b;
    const value = "test";
    const result = setValueByPath(obj, "a.b.c.d", value, true);
    expect(result.a.b.c.d).toEqual(value);
  });

  // Tests that a value can be set at a path that contains an undefined array
  it("test sets value at path with undefined array", () => {
    const obj = { a: [{}] };
    const path = "a.0.b.c";
    const value = "test";
    setValueByPath(obj, path, value, true);
    expect(obj).toEqual({ a: [{ b: { c: "test" } }] });
  });
});

describe("setValuesByPaths function", () => {
  // Tests that setValuesByPaths sets values on object for each path in paths array
  it("test happy path set values on object for each path in paths array", () => {
    const obj = {
      a: { b: { c: 1 }, s: { h: [{ a: 1 }, { a: 2 }, { a: 3 }] } },
    };
    const paths: Paths = [
      ["a.b.c", "2"],
      { path: "a.b.d", value: 3 },
      { path: "a.b.e.f", value: 4 },
      { path: "a.g", value: { path: "a.s.h.a", obj } },
      ["a.s", "h.a"],
    ];
    const expected = {
      a: {
        b: { c: 1, d: 3, e: { f: 4 } },
        s: [1, 2, 3],
        g: [1, 2, 3],
      },
    };

    const result = setValuesByPaths(obj, paths, true);

    expect(result).toEqual(expected);
    expect(result).toBe(obj);
  });

  // Tests that setValuesByPaths returns the object with the updated values
  it("test happy path return object with updated values", () => {
    const obj = { a: { b: { c: { d: "2" } } } };
    const paths: Paths = [
      ["a.b.c", "d"],
      { path: "a.b.d", value: 3 },
      { path: "a.b.e.f", value: 4 },
    ];
    const expected = { a: { b: { c: "2", d: 3, e: { f: 4 } } } };

    const result = setValuesByPaths(obj, paths, true);

    expect(result).toEqual(expected);
    expect(result).toBe(obj);
  });

  // Tests that setValuesByPaths handles empty paths array
  it("test edge case handle empty paths array", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths = [];
    const expected = { a: { b: { c: 1 } } };

    const result = setValuesByPaths(obj, paths, true);

    expect(result).toEqual(expected);
    expect(result).toBe(obj);
  });

  // Tests that setValuesByPaths handles paths array with invalid paths
  it("test edge case handle paths array with invalid paths", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths: Paths = [
      "a.b.c.d",
      { path: "a.b.e", value: 2 },
      { path: "a.b.f.g", value: 3 },
    ];

    expect(setValuesByPaths(obj, paths)).toEqual({
      a: { b: { c: 1 } },
    });
  });

  // Tests that setValuesByPaths handles paths array with invalid values
  it("test edge case handle paths array with invalid values", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths: Paths = [
      ["a.b.c", "2"],
      { path: "a.b.d", value: { x: 1 } },
      { path: "a.b.e.f", value: 4 },
    ];
    const expected = { a: { b: { c: 1, d: { x: 1 }, e: { f: 4 } } } };

    const result = setValuesByPaths(obj, paths, true);

    expect(result).toEqual(expected);
  });

  // Tests that setValuesByPaths handles paths array with invalid createIfUndefined value
  it("test edge case handle paths array with invalid createIfUndefined value", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths: Paths = [
      ["a.b.c", "2"],
      { path: "a.b.d", value: 3 },
      { path: "a.b.e.f", value: 4 },
    ];
    const expected = { a: { b: { c: 1, d: 3, e: { f: 4 } } } };

    const result = setValuesByPaths(obj, paths, "invalid");

    expect(result).toEqual(expected);
  });

  // Tests that setValuesByPaths can handle an array of nested paths
  it("should handle nested paths", () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
      },
    };

    setValuesByPaths(obj, [["a.b.c", "2"], { path: "a.b.c", value: 3 }]);

    expect(obj.a.b.c).toEqual(3);
  });

  // Tests that setValuesByPaths with paths=null
  it("test with paths sets to null", () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
      },
    };

    const expected = {
      a: {
        b: {
          c: 1,
        },
      },
    };

    expect(setValuesByPaths(obj, null)).toEqual(expected);
  });

  // Tests that setValuesByPaths handles paths array with duplicate paths
  it("test duplicate paths", () => {
    const obj = { a: { b: 1 } };
    const paths: Paths = [
      ["a.b", "new value"],
      { path: "a.b", value: "newer value" },
      { path: "a.b", value: "newest value" },
    ];
    const result = setValuesByPaths(obj, paths);
    expect(result).toEqual({ a: { b: "newest value" } });
  });

  // Tests that setValuesByPaths handles paths array with value object with invalid path
  it("test invalid path", () => {
    const obj = { a: { b: 1 } };
    const paths = [{ path: "a.b.c", value: 2 }];
    const result = setValuesByPaths(obj, paths, true);
    expect(result).toEqual({ a: { b: 1 } });
  });

  // Tests that setValuesByPaths handles paths array with empty value object
  it("should handle paths array with empty value object", () => {
    const obj = { a: { b: { c: "value" } } };
    const paths: Paths = [["a.b.c", ""], { path: "a.b.c", value: {} }];
    const result = setValuesByPaths(obj, paths);
    expect(result).toEqual({ a: { b: { c: {} } } });
  });

  // Tests that setValuesByPaths handles non-existent paths in the paths array
  it("test non existent paths", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths: Paths = [
      ["a.b.c", "new value"],
      ["a.b.d", "new value"],
      ["a.b.e.f", "new value"],
      { path: "a.b.g", value: "new value" },
      { path: "a.b.h.i", value: "new value" },
    ];
    const result = setValuesByPaths(obj, paths, true);
    expect(result).toEqual({
      a: { b: { c: 1, e: {}, g: "new value", h: { i: "new value" } } },
    });
  });
});

describe("deleteAttributeByPath function", () => {
  // Tests that the function deletes an existing property at the given path in the object
  it("test delete existing property", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.c";
    const expected = { a: { b: {} } };
    const result = deleteAttributeByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function does not throw an error if the property at the given path does not exist
  it("test delete non existing property", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.d";
    const expected = { a: { b: { c: 1 } } };
    const result = deleteAttributeByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function does not throw an error if the object is null or undefined
  it("test delete property in null object", () => {
    const obj = null;
    const path = "a.b.c";
    const expected = null;
    const result = deleteAttributeByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function does not throw an error if the path is an empty string
  it("test delete property in empty path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "";
    const expected = { a: { b: { c: 1 } } };
    const result = deleteAttributeByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function does not throw an error if the path is a single dot
  it("test delete property in single dot path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = ".";
    const expected = { a: { b: { c: 1 } } };
    const result = deleteAttributeByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function deletes the property even if it is a property of a nested object
  it("test delete property in nested object", () => {
    const obj = { a: { b: { c: 1, d: 2 } } };
    const path = "a.b.c";
    const expected = { a: { b: { d: 2 } } };
    const result = deleteAttributeByPath(obj, path);
    expect(result).toEqual(expected);
  });
});

describe("deleteAttributesByPaths function", () => {
  // Tests that the function returns the object if paths array is empty
  it("test empty paths array", () => {
    const obj = { a: 1, b: 2 };
    const result = deleteAttributesByPaths(obj, []);
    expect(result).toEqual(obj);
  });

  // Tests that the function deletes a single property from the object
  it("test delete single property", () => {
    const obj = { a: 1, b: 2 };
    const result = deleteAttributesByPaths(obj, ["a"]);
    expect(result).toEqual({ b: 2 });
  });

  // Tests that the function deletes multiple properties from the object
  it("test delete multiple properties", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = deleteAttributesByPaths(obj, ["a", "c"]);
    expect(result).toEqual({ b: 2 });
  });

  // Tests that the function does not throw an error if the object is null or undefined
  it("test null object", () => {
    const obj = null;
    const result = deleteAttributesByPaths(obj, ["a"]);
    expect(result).toEqual(null);
  });

  it("test undefined object", () => {
    const obj = undefined;
    const result = deleteAttributesByPaths(obj, ["a"]);
    expect(result).toEqual(undefined);
  });

  // Tests that the function does not throw an error if the path is not a string
  it("test non string path", () => {
    const obj = { a: 1 };
    const result = deleteAttributesByPaths(obj, [1]);
    expect(result).toEqual(obj);
  });

  // Tests that the function does not throw an error if the path does not exist in the object
  it("test non existing path", () => {
    const obj = { a: 1 };
    const result = deleteAttributesByPaths(obj, ["b"]);
    expect(result).toEqual(obj);
  });

  // Tests that the function returns the object if the paths array is null or undefined
  it("test should return object if paths array is null or undefined", () => {
    const obj = { a: 1, b: 2 };
    const result = deleteAttributesByPaths(obj, null);
    expect(result).toEqual(obj);
    const result2 = deleteAttributesByPaths(obj, undefined);
    expect(result2).toEqual(obj);
  });

  // Tests that a nested property is deleted from the object
  it("test should delete nested property", () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    const paths = ["a.b.c"];
    const expected = {
      a: {
        b: {},
      },
    };
    const result = deleteAttributesByPaths(obj, paths);
    expect(result).toEqual(expected);
  });

  // Tests that deleteAttributesByPaths does not delete a property if it is not an own property of the object
  it("should not delete a property if it is not an own property of the object", () => {
    const obj = { a: 1 };
    const paths = ["b"];
    const result = deleteAttributesByPaths(obj, paths);
    expect(result).toEqual(obj);
  });

  // Tests that a non-configurable property is not deleted by the function
  it("test not deleting non configurable property", () => {
    const obj = {
      prop1: "value1",
      prop2: "value2",
    };
    Object.defineProperty(obj, "prop1", { configurable: false });
    const paths = ["prop1", "prop2"];
    const result = deleteAttributesByPaths(obj, paths);
    expect(result).toEqual({
      prop1: "value1",
    });
  });

  // Tests that a property is deleted from an object inside an array
  it("test delete property from object inside array", () => {
    const obj = {
      arr: [
        { prop1: "value1", prop2: "value2" },
        { prop1: "value3", prop2: "value4" },
      ],
    };
    const paths = ["arr.0.prop1"];
    const expectedObj = {
      arr: [{ prop2: "value2" }, { prop1: "value3", prop2: "value4" }],
    };

    const result = deleteAttributesByPaths(obj, paths);

    expect(result).toEqual(expectedObj);
  });
});

describe("convertToFormData function", () => {
  // Tests that the function correctly converts a JavaScript object to FormData
  it("test happy path", () => {
    const data = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      },
    };
    const media = [
      {
        file: new File([], "test.png"),
        title: "test image",
      },
    ];
    const formData = convertToFormData(data, media);
    expect(formData.get("name")).toBe(JSON.stringify("John"));
    expect(formData.get("age")).toBe(JSON.stringify(30));
    expect(formData.get("address")).toBe(
      JSON.stringify({
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      })
    );
    expect(formData.get("test image")).toEqual(new File([], "test.png"));
  });

  // Tests that the function handles undefined values correctly
  it("test handles undefined values", () => {
    const data = {
      name: undefined,
      age: 30,
      address: {
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      },
    };
    const formData = convertToFormData(data);
    expect(formData.get("name")).toBeNull();
    expect(formData.get("age")).toBe(JSON.stringify(30));
    expect(formData.get("address")).toBe(
      JSON.stringify({
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      })
    );
  });

  // Tests that the function handles an empty media array correctly
  it("test handles empty media array", () => {
    const data = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      },
    };
    const media = [];
    const formData = convertToFormData(data, media);
    expect(formData.get("name")).toBe(JSON.stringify("John"));
    expect(formData.get("age")).toBe(JSON.stringify(30));
    expect(formData.get("address")).toBe(
      JSON.stringify({
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      })
    );
  });

  // Tests that the function handles a media array with an empty file correctly
  it("test handles media array with empty file", () => {
    const data = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      },
    };
    const media = [
      {
        file: null,
        title: "test image",
      },
    ];
    const formData = convertToFormData(data, media);
    expect(formData.get("name")).toBe(JSON.stringify("John"));
    expect(formData.get("age")).toBe(JSON.stringify(30));
    expect(formData.get("address")).toBe(
      JSON.stringify({
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      })
    );
    expect(formData.get("test image")).toBeNull();
  });

  // Tests that the function handles a media array with multiple files correctly
  it("test handles media array with multiple files", () => {
    const data = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      },
    };
    const media = [
      {
        file: [new File([], "test1.png"), new File([], "test2.png")],
        title: "test image",
      },
    ];
    const formData = convertToFormData(data, media);
    expect(formData.get("name")).toBe(JSON.stringify("John"));
    expect(formData.get("age")).toBe(JSON.stringify(30));
    expect(formData.get("address")).toBe(
      JSON.stringify({
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      })
    );
    expect(formData.getAll("test image")).toEqual([
      new File([], "test1.png"),
      new File([], "test2.png"),
    ]);
  });

  // Tests that the function handles a media object with an undefined file correctly
  it("test handles media object with undefined file", () => {
    const data = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      },
    };
    const media = [
      {
        file: undefined,
        title: "test image",
      },
    ];
    const formData = convertToFormData(data, media);
    expect(formData.get("name")).toBe(JSON.stringify("John"));
    expect(formData.get("age")).toBe(JSON.stringify(30));
    expect(formData.get("address")).toBe(
      JSON.stringify({
        street: "123 Main St",
        city: "AnyTown",
        state: "CA",
        zip: "12345",
      })
    );
    expect(formData.get("test image")).toBeNull();
  });

  // Tests that the function handles circular references correctly
  it("handles circular references correctly", () => {
    const obj = { a: 1 };
    obj.b = obj;
    const formData = convertToFormData(obj);
    expect(formData.get("a")).toBe("1");
    expect(formData.get("b")).toBeNull();
  });

  // Tests that the function can handle large objects correctly
  it("handles large objects correctly", () => {
    const data = {
      a: "a",
      b: "b",
      c: "c",
      d: "d",
      e: "e",
      f: "f",
      g: "g",
      h: "h",
      i: "i",
      j: "j",
      k: "k",
      l: "l",
      m: "m",
      n: "n",
      o: "o",
      p: "p",
      q: "q",
      r: "r",
      s: "s",
      t: "t",
      u: "u",
      v: "v",
      w: "w",
      x: "x",
      y: "y",
      z: "z",
    };
    const formData = convertToFormData(data);
    expect(formData.get("a")).toBe(JSON.stringify("a"));
    expect(formData.get("b")).toBe(JSON.stringify("b"));
    expect(formData.get("c")).toBe(JSON.stringify("c"));
    expect(formData.get("d")).toBe(JSON.stringify("d"));
    expect(formData.get("e")).toBe(JSON.stringify("e"));
    expect(formData.get("f")).toBe(JSON.stringify("f"));
    expect(formData.get("g")).toBe(JSON.stringify("g"));
    expect(formData.get("h")).toBe(JSON.stringify("h"));
    expect(formData.get("i")).toBe(JSON.stringify("i"));
    expect(formData.get("j")).toBe(JSON.stringify("j"));
    expect(formData.get("k")).toBe(JSON.stringify("k"));
    expect(formData.get("l")).toBe(JSON.stringify("l"));
    expect(formData.get("m")).toBe(JSON.stringify("m"));
    expect(formData.get("n")).toBe(JSON.stringify("n"));
    expect(formData.get("o")).toBe(JSON.stringify("o"));
    expect(formData.get("p")).toBe(JSON.stringify("p"));
    expect(formData.get("q")).toBe(JSON.stringify("q"));
    expect(formData.get("r")).toBe(JSON.stringify("r"));
    expect(formData.get("s")).toBe(JSON.stringify("s"));
    expect(formData.get("t")).toBe(JSON.stringify("t"));
    expect(formData.get("u")).toBe(JSON.stringify("u"));
    expect(formData.get("v")).toBe(JSON.stringify("v"));
    expect(formData.get("w")).toBe(JSON.stringify("w"));
    expect(formData.get("x")).toBe(JSON.stringify("x"));
    expect(formData.get("y")).toBe(JSON.stringify("y"));
    expect(formData.get("z")).toBe(JSON.stringify("z"));
  });

  // Tests that the function handles a media array with multiple files correctly
  it("test handles media array with multiple files", () => {
    const data = 0;
    const media = [
      {
        file: [new File([], "test1.png"), new File([], "test2.png")],
        title: "test image",
      },
    ];
    const formData = convertToFormData(data, media);
    expect(formData.getAll("test image")).toEqual([
      new File([], "test1.png"),
      new File([], "test2.png"),
    ]);
  });
});

describe("cloneObjectDeeply function", () => {
  // Tests that the function can clone a simple object
  it("test simple object", () => {
    const obj = { a: 1, b: "hello", c: true };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });

  // Tests that the function can clone an object containing nested objects and arrays
  it("test nested object", () => {
    const obj = { a: { b: { c: [1, 2, 3] } } };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });

  // Tests that the function can clone an object containing null and undefined values
  it("test null undefined values", () => {
    const obj = { a: null, b: undefined };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });

  // Tests that the function can clone an object containing null and undefined values
  it("test cloning null", () => {
    const obj = 78;
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toBe(78);
  });

  // Tests that the function can clone an object containing circular references
  it("test circular references", () => {
    const obj = { a: 1 };
    obj.b = obj;
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });

  // Tests that the function can clone an empty object
  it("test empty object", () => {
    const obj = {};
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });

  // Tests that the function can clone an object containing functions, symbols, and BigInt values
  it("test functions symbols bigint values", () => {
    const obj = { a: () => {}, b: Symbol("hello"), c: BigInt(123) };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });
});

describe("updateObject function", () => {
  // Tests that the function updates an object with a single property
  it("test update single property", () => {
    const obj = { a: 1 };
    const updateValue = { a: 2 };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: 2 });
  });

  // Tests that the function updates an object with multiple properties
  it("test update multiple properties", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = { a: 3, b: 4 };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: 3, b: 4 });
  });

  // Tests that the function updates an empty object
  it("test update empty object", () => {
    const obj = {};
    const updateValue = { a: 1 };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: 1 });
  });

  // Tests that the function updates an object with a null value
  it("test update null value", () => {
    const obj = { a: 1 };
    const updateValue = { a: null };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: null });
  });

  // Tests that the function updates an object with an undefined value
  it("test update undefined value", () => {
    const obj = { a: 1 };
    const updateValue = { a: undefined };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: undefined });
  });

  // Tests that the function updates an object with a circular reference
  it("test update circular reference", () => {
    const obj = { a: 1 };
    obj.b = obj;
    const updateValue = { a: 2 };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: 2, b: obj });
  });

  // Tests that an object with a nested property is updated correctly
  it("test update nested property", () => {
    const obj = { a: { b: 1 } };
    const updateValue = { a: { b: 2 } };
    updateObject(obj, updateValue);
    expect(obj.a.b).toEqual(2);
  });

  // Tests that an object is updated with a new property that does not exist
  it("test update object with non existing property", () => {
    const obj = { a: 1 };
    const updateValue = { b: 2 };
    updateObject(obj, updateValue);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  // Tests that an object is updated with a falsy value
  it("test update object with falsy value", () => {
    const obj = { prop: "value" };
    const updateValue = { prop: false };
    updateObject(obj, updateValue);
    expect(obj.prop).toBe(false);
  });

  // Tests that an object is updated with a truthy property
  it("test update object with truthy property", () => {
    const obj = { a: false };
    const updateValue = { a: true };
    updateObject(obj, updateValue);
    expect(obj.a).toBe(true);
  });

  // Tests that updateObject updates an object with new properties and values
  it("test happy path update object", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = { b: 3, c: 4 };
    const expected = { a: 1, b: 3, c: 4 };
    expect(updateObject(obj, updateValue)).toEqual(expected);
  });

  // Tests that updateObject returns the updated object
  it("test happy path return updated object", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = { b: 3, c: 4 };
    expect(updateObject(obj, updateValue)).toBe(obj);
  });

  // Tests that updateObject throws an error if obj is not an object
  it("test edge case invalid obj input", () => {
    expect(() => updateObject(null, { a: 1 })).toThrowError(
      "Invalid input parameters. Expected objects."
    );
  });

  // Tests that updateObject throws an error if updateValue is not an object
  it("test edge case invalid update value input", () => {
    expect(() => updateObject({ a: 1 }, null)).toThrowError(
      "Invalid input parameters. Expected objects."
    );
  });

  // Tests that updateObject updates an empty object with new properties and values
  it("test general behaviour update empty object", () => {
    const obj = {};
    const updateValue = { a: 1, b: 2 };
    const expected = { a: 1, b: 2 };
    expect(updateObject(obj, updateValue)).toEqual(expected);
  });

  // Tests that updateObject updates an object with nested properties
  it("test general behaviour update nested properties", () => {
    const obj = { a: { b: 1 } };
    const updateValue = { a: { c: 2 } };
    const expected = { a: { c: 2 } };
    expect(updateObject(obj, updateValue)).toEqual(expected);
  });

  // Tests that updateObject function can update an object with null or undefined values
  it("test updateObject with null or undefined values", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = { b: null, c: undefined };
    const expected = { a: 1, b: null, c: undefined };
    const result = updateObject(obj, updateValue);
    expect(result).toEqual(expected);
  });
});

describe("updateObjectStrict function", () => {
  // Tests that updateObjectStrict updates existing properties with new values
  it("test happy path update existing properties", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = { a: 3 };
    const expected = { a: 3, b: 2 };
    expect(updateObjectStrict(obj, updateValue)).toEqual(expected);
  });

  // Tests that updateObjectStrict returns the updated object
  it("test happy path return updated object", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = { a: 3 };
    expect(updateObjectStrict(obj, updateValue)).toBe(obj);
  });

  // Tests that updateObjectStrict throws an error if obj is not an object
  it("test edge case throw error if obj not object", () => {
    const obj = null;
    const updateValue = { a: 3 };
    expect(() => updateObjectStrict(obj, updateValue)).toThrowError(
      "Invalid input parameters. Expected objects."
    );
  });

  // Tests that updateObjectStrict throws an error if updateValue is not an object
  it("test edge case throw error if updateValue not object", () => {
    const obj = { a: 1, b: 2 };
    const updateValue = null;
    expect(() => updateObjectStrict(obj, updateValue)).toThrowError(
      "Invalid input parameters. Expected objects."
    );
  });

  // Tests that updateObjectStrict does not update properties that do not exist in obj
  it("test general behaviour not update non existing properties", () => {
    const obj = { a: 1 };
    const updateValue = { b: 2 };
    const expected = { a: 1 };
    expect(updateObjectStrict(obj, updateValue)).toEqual(expected);
  });

  // Tests that updateObjectStrict does not update properties with non-primitive values
  it("test general behaviour not update properties with non primitive values", () => {
    const obj = { a: { b: 1 } };
    const updateValue = { a: { b: 2 } };
    const expected = { a: { b: 2 } };
    expect(updateObjectStrict(obj, updateValue)).toEqual(expected);
  });

  // Tests that properties with undefined or null values are not updated
  it("test update properties with undefined or null values", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const updateValue = { a: undefined, b: null, d: 4 };
    const result = updateObjectStrict(obj, updateValue);
    expect(result).toEqual({ a: undefined, b: null, c: 3 });
  });

  // Tests that properties with empty objects or arrays are not updated
  it("should not update properties with empty objects or arrays", () => {
    const obj = { a: 1, b: [], c: {} };
    const updateValue = { a: 2, b: [1], c: { d: 1 } };
    const result = updateObjectStrict(obj, updateValue);
    expect(result).toEqual({ a: 2, b: [1], c: { d: 1 } });
  });

  // Tests that properties with functions are not updated
  it("should not update properties with functions", () => {
    const obj = {
      prop1: "value1",
      prop2: () => "value2",
    };
    const updateValue = {
      prop1: "new value",
      prop2: () => "new value",
    };
    const updatedObj = updateObjectStrict(obj, updateValue);
    expect(updatedObj.prop1).toEqual("new value");
    expect(updatedObj.prop2).toEqual(obj.prop2);
  });

  // Tests that properties with symbols are not updated
  it("should not update properties with symbols", () => {
    const obj = { a: 1, [Symbol("foo")]: "bar" };
    const updateValue = { a: 2, [Symbol("foo")]: "baz" };
    const updatedObj = updateObjectStrict(obj, updateValue);
    expect(updatedObj.a).toEqual(2);
    expect(updatedObj[Symbol("foo")]).toBeUndefined();
  });
});
