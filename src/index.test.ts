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
  accessObjectByPath,
} from "./index";

describe("accessObjectByPath_function", () => {
  // Tests that the function can access a property that exists at the top level of the object
  it("test_access_top_level_property", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "a");
    expect(last).toBe("a");
    expect(data).toBe(obj);
  });

  // Tests that the function can access a property that exists at a nested level of the object
  it("test_access_nested_property", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.b");
    expect(last).toBe("b");
    expect(data).toEqual({ b: 2 });
  });

  // Tests that the function can access the last property in a nested path
  it("test_access_last_property", () => {
    const obj = { a: { b: { c: 3 } } };
    const [last, data] = accessObjectByPath(obj, "a.b.c");
    expect(last).toBe("c");
    expect(data).toEqual({ c: 3 });
  });

  // Tests that the function returns the entire object if a property in the path does not exist and createIfUndefined is false
  it("test_access_nonexistent_top_level_property", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "b");
    expect(last).toBe("b");
    expect(data).toBe(obj);
  });

  // Tests that the function returns the entire object if a property in a nested path does not exist and createIfUndefined is false
  it("test_access_nonexistent_nested_property", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.c");
    expect(last).toBe("c");
    expect(data).toBe(obj.a);
  });

  // Tests that the function returns undefined if a property in a nested path does not exist and it's not the last path and createIfUndefined is false
  it("test_access_nonexistent_nested_property_not_last", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.c.d");
    expect(last).toBe("d");
    expect(data).toBeUndefined();
  });

  // Tests that the function returns the entire object if a property in the path does not exist and createIfUndefined is false
  it("test_create_nonexistent_top_level_property", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "b.c", true);
    expect(last).toBe("c");
    expect(data).toEqual({});
  });

  // Tests that the function returns the entire object if a property in a nested path does not exist and createIfUndefined is false
  it("test_create_nonexistent_nested_property", () => {
    const obj = { a: { b: 2 } };
    const [last, data] = accessObjectByPath(obj, "a.c.d", true);
    expect(last).toBe("d");
    expect(data).toEqual({});
  });

  // Tests that the function returns an error if the path is not a string
  it("test_access_non_string_path", () => {
    const obj = { a: 1 };
    expect(() => accessObjectByPath(obj, 123)).toThrow();
  });

  // Tests that accessing a property with an empty string path returns the original object
  it("test_accessing_property_with_empty_string_path", () => {
    const obj = { a: 1 };
    const [last, data] = accessObjectByPath(obj, "");
    expect(last).toBe("");
    expect(data).toBe(obj);
  });

  // Tests that the function returns the last property in the path if it is an object
  it("test_returns_last_property_if_object", () => {
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
  it("test_returns_last_property_if_it_is_an_array", () => {
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

describe("getValueByPath_function", () => {
  // Tests that the function returns the correct value for a simple path
  it("test_simple_path", () => {
    const obj = { a: 1 };
    const path = "a";
    expect(getValueByPath(obj, path)).toEqual(1);
  });

  // Tests that the function returns the correct value for a nested path
  it("test_nested_path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.c";
    expect(getValueByPath(obj, path)).toEqual(1);
  });

  // Tests that the function returns undefined for a non-existent path
  it("test_non_existent_path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.d";
    expect(getValueByPath(obj, path)).toBeUndefined();
  });

  // Tests that the function returns the correct value for a path with a numeric property
  it("test_numeric_property", () => {
    const obj = { "1": "one" };
    const path = "1";
    expect(getValueByPath(obj, path)).toEqual("one");
  });

  // Tests that the function returns the correct value for a path with a boolean property
  it("test_boolean_property", () => {
    const obj = { true: "yes" };
    const path = "true";
    expect(getValueByPath(obj, path)).toEqual("yes");
  });

  // Tests that the function returns the correct value for a path with a null property
  it("test_null_property", () => {
    const obj = { null: "nothing" };
    const path = "null";
    expect(getValueByPath(obj, path)).toEqual("nothing");
  });

  // Tests that the function returns undefined when the property at the given path is undefined
  it("test_returns_undefined_for_undefined_property", () => {
    const obj = { a: { b: 1 } };
    const path = "a.c";
    const result = getValueByPath(obj, path);
    expect(result).toBeUndefined();
  });

  // Tests that the function returns the correct value for a path with an empty string property
  it("test_returns_correct_value_for_empty_string_property", () => {
    const obj = { "": "empty string property" };
    const path = "";
    const expected = "empty string property";
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that the function returns the correct value for a path with a property that has a value of 0
  it("test_returns_correct_value_for_path_with_property_value_of_0", () => {
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
  it("test_returns_correct_value_for_false_property", () => {
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
  it("test_returns_correct_value_for_null_property", () => {
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
  it("test_returns_correct_value_for_undefined_property", () => {
    const obj = { a: { b: undefined } };
    const path = "a.b";
    const result = getValueByPath(obj, path);
    expect(result).toBeUndefined();
  });

  // Tests that the function returns the correct value for a path with a property that has a value of an object with a nested object
  it("test_returns_correct_value_for_nested_object", () => {
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
  it("test_returns_correct_value_for_path_with_property_with_nested_arrays", () => {
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
  it("test_returns_correct_value_for_path_with_array_of_nested_objects", () => {
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
  it("test_returns_correct_value_for_empty_object", () => {
    const obj = { a: { b: {} } };
    const path = "a.b";
    const expected = {};
    const result = getValueByPath(obj, path);
    expect(result).toEqual(expected);
  });

  // Tests that getValueByPath returns the correct value for a path with a property that has a value of an empty array
  it("test_returns_correct_value_for_empty_array", () => {
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
  it("test_returns_correct_value_for_object_property", () => {
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
  it("test_returns_correct_value_for_array_property", () => {
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
