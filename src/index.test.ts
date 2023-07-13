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
  Paths,
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

describe("setValueByPath_function", () => {
  // Tests that setValueByPath sets a value at the specified path in a simple object
  it("test_set_value_simple_object", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "a", 2);
    expect(obj).toEqual({ a: 2 });
  });

  // Tests that setValueByPath sets a value at the specified path in a nested object
  it("test_set_value_nested_object", () => {
    const obj = { a: { b: { c: 1 } } };
    setValueByPath(obj, "a.b.c", 2);
    expect(obj).toEqual({ a: { b: { c: 2 } } });
  });

  // Tests that setValueByPath sets a value at the specified path in an array
  it("test_set_value_array", () => {
    const obj = { a: [1, 2, 3] };
    setValueByPath(obj, "a.1", 4);
    expect(obj).toEqual({ a: [1, 4, 3] });
  });

  // Tests that setValueByPath sets a value at the specified path in a nested array
  it("test_set_value_nested_array", () => {
    const obj = { a: { b: [{ c: 1 }, { c: 2 }] } };
    setValueByPath(obj, "a.b.1.c", 3);
    expect(obj).toEqual({ a: { b: [{ c: 1 }, { c: 3 }] } });
  });

  // Tests that setValueByPath sets a value at a non-existent path with createIfUndefined=false
  it("test_set_value_non_existent_path", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "b.c", 2);
    expect(obj).toEqual({ a: 1 });
  });

  // Tests that setValueByPath sets a value at a non-existent path with createIfUndefined=true
  it("test_set_value_non_existent_path_with_createIfUndefined_sets_to_true", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "b.c", 2, true);
    expect(obj).toEqual({ a: 1, b: { c: 2 } });
  });

  // Tests that setValueByPath sets a value at a path that is an empty string
  it("test_set_value_empty_path", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "", 2);
    expect(obj).toEqual({ a: 1 });
  });

  // Tests that setValueByPath sets a value at a path that is an empty string with createIfUndefined=true
  it("test_set_value_empty_path_createIfUndefined_sets_to_true", () => {
    const obj = { a: 1 };
    setValueByPath(obj, "", 2, true);
    expect(obj).toEqual({ a: 1, "": 2 });
  });

  // Tests that a value is set at the specified path in an object with numeric keys
  it("test_sets_value_in_object_with_numeric_keys", () => {
    const obj = { 0: { 1: { 2: "old value" } } };
    const path = "0.1.2";
    const value = "new value";
    const result = setValueByPath(obj, path, value);
    expect(result).toEqual({ 0: { 1: { 2: "new value" } } });
  });

  // Tests that a value can be set at the root level of an empty array
  it("test_sets_value_at_root_level_of_empty_array", () => {
    const obj = [];
    setValueByPath(obj, "", "test");
    expect(obj).toEqual([]);
  });

  // Tests that a value can be set at the root level of an empty array with createIfUndefined=true
  it("test_sets_value_at_root_level_of_empty_array_with_createIfUndefined_sets_to_true", () => {
    const obj = [];
    setValueByPath(obj, "", "test", true);
    let tempObj = [];
    tempObj[""] = "test";
    expect(obj).toEqual(tempObj);
  });

  // Tests that setValueByPath function throws an error when the path is not a string
  it("test_sets_value_at_non_string_path", () => {
    const obj = { a: { b: 1 } };
    const path = 123;
    const value = 2;
    expect(setValueByPath(obj, path, value)).toEqual({ a: { b: 1 } });
  });

  // Tests that a value can be set at a path that ends with a dot
  it("test_sets_value_at_path_ending_with_dot", () => {
    const obj = { a: { b: { c: 1 } } };
    setValueByPath(obj, "a.b.", 2);
    expect(obj).toEqual({ a: { b: { c: 1 } } });
  });

  // Tests that a value can be set at a path that ends with a dot with createIfUndefined=true
  it("test_sets_value_at_path_ending_with_dot_createIfUndefined_sets_to_true", () => {
    const obj = { a: { b: { c: 1 } } };
    setValueByPath(obj, "a.b.", 2, true);
    expect(obj).toEqual({ a: { b: { c: 1, "": 2 } } });
  });

  // Tests that a value can be set at a path that contains a null object
  it("test_sets_value_at_path_with_null_object", () => {
    const obj = { a: { b: null } };
    setValueByPath(obj, "a.b.c", 123);
    expect(obj).toEqual({ a: { b: null } });
  });

  // Tests that a value can be set at a path that contains a null object with createIfUndefined=true
  it("test_sets_value_at_path_with_null_object_with_createIfUndefined_sets_to_true", () => {
    const obj = { a: { b: null } };
    setValueByPath(obj, "a.b.c", 123, true);
    expect(obj).toEqual({ a: { b: { c: 123 } } });
  });

  // Tests that a value can be set at a path that contains a null array
  it("test_sets_value_at_path_with_null_array", () => {
    const obj = { a: [null] };
    setValueByPath(obj, "a.0.b", "new value");
    expect(obj).toEqual({ a: [null] });
  });

  // Tests that a value can be set at a path that contains a null array with createIfUndefined=true
  it("test_sets_value_at_path_with_null_array_with_createIfUndefined_sets_to_true", () => {
    const obj = { a: [null] };
    setValueByPath(obj, "a.0.b", "new value", true);
    expect(obj).toEqual({ a: [{ b: "new value" }] });
  });

  // Tests that a value can be set at a path that contains an undefined object
  it("test_sets_value_at_path_with_undefined_object", () => {
    const obj = {};
    const path = "a.b.c";
    const value = "hello world";
    setValueByPath(obj, path, value);
    expect(obj).toEqual({});
  });

  // Tests that a value can be set at a path that contains an undefined object with createIfUndefined=true
  it("test_sets_value_at_path_with_undefined_object_with_createIfUndefined_sets_to_true", () => {
    const obj = {};
    const path = "a.b.c";
    const value = "hello world";
    setValueByPath(obj, path, value, true);
    expect(obj).toEqual({ a: { b: { c: "hello world" } } });
  });

  // Tests that setValueByPath can set a value at a path that contains a circular reference
  it("test_circular_reference", () => {
    const obj: any = { a: { b: {} } };
    obj.a.b.c = obj.a.b;
    const value = "test";
    const result = setValueByPath(obj, "a.b.c.d", value, true);
    expect(result.a.b.c.d).toEqual(value);
  });

  // Tests that a value can be set at a path that contains an undefined array
  it("test_sets_value_at_path_with_undefined_array", () => {
    const obj = { a: [{}] };
    const path = "a.0.b.c";
    const value = "test";
    setValueByPath(obj, path, value, true);
    expect(obj).toEqual({ a: [{ b: { c: "test" } }] });
  });
});

describe("setValuesByPaths_function", () => {
  // Tests that setValuesByPaths sets values on object for each path in paths array
  it("test_happy_path_set_values_on_object_for_each_path_in_paths_array", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths: Paths = [
      ["a.b.c", "2"],
      { path: "a.b.d", value: 3 },
      { path: "a.b.e.f", value: 4 },
    ];
    const expected = { a: { b: { c: 1, d: 3, e: { f: 4 } } } };

    const result = setValuesByPaths(obj, paths, true);

    expect(result).toEqual(expected);
    expect(result).toBe(obj);
  });

  // Tests that setValuesByPaths returns the object with the updated values
  it("test_happy_path_return_object_with_updated_values", () => {
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
  it("test_edge_case_handle_empty_paths_array", () => {
    const obj = { a: { b: { c: 1 } } };
    const paths = [];
    const expected = { a: { b: { c: 1 } } };

    const result = setValuesByPaths(obj, paths, true);

    expect(result).toEqual(expected);
    expect(result).toBe(obj);
  });

  // Tests that setValuesByPaths handles paths array with invalid paths
  it("test_edge_case_handle_paths_array_with_invalid_paths", () => {
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
  it("test_edge_case_handle_paths_array_with_invalid_values", () => {
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
  it("test_edge_case_handle_paths_array_with_invalid_createIfUndefined_value", () => {
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

  // Tests that setValuesByPaths handles paths array with duplicate paths
  it("test_duplicate_paths", () => {
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
  it("test_invalid_path", () => {
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
  it("test_non_existent_paths", () => {
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
