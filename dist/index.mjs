// src/index.ts
function getValueByPath(obj, path) {
  if (!obj)
    return obj;
  let [first, ...rest] = path.split(".");
  if (rest.length) {
    if (obj[first] instanceof Array && isNaN(+rest[0])) {
      return obj[first].map((d) => getValueByPath(d, rest.join(".")));
    } else {
      return getValueByPath(obj[first], rest.join("."));
    }
  } else {
    return obj[first];
  }
}
function setValueByPath(obj, path, value = {}) {
  var _a;
  if (obj && typeof obj == "object" && path) {
    let [first, ...rest] = path.split(".");
    if (rest.length) {
      if (obj[first] === void 0) {
        obj[first] = isNaN(+rest[0]) ? {} : [];
      } else {
        if (obj[first] instanceof Array && isNaN(+rest[0])) {
          obj[first].forEach(
            (val) => setValueByPath(val, rest.join("."), value)
          );
        } else {
          setValueByPath(obj[first], rest.join("."), value);
        }
      }
    } else {
      if (obj[first] instanceof Array) {
        obj[first] = obj[first].map((d) => {
          if ((value == null ? void 0 : value.value) !== void 0) {
            return value == null ? void 0 : value.value;
          }
          return getValueByPath((value == null ? void 0 : value.obj) || d, (value == null ? void 0 : value.path) || "");
        });
      } else {
        if ((value == null ? void 0 : value.value) != void 0) {
          obj[first] = value == null ? void 0 : value.value;
        } else {
          obj[first] = (_a = getValueByPath((value == null ? void 0 : value.obj) || obj[first], (value == null ? void 0 : value.path) || "")) != null ? _a : obj[first];
        }
      }
    }
  }
  return obj;
}
function setValuesByPaths(obj, paths) {
  paths.forEach((p) => {
    if (p instanceof Array) {
      setValueByPath(obj, p[0], { path: p[1] || "" });
    } else {
      setValueByPath(obj, p.path, p.value);
    }
  });
  return obj;
}
function convertToFormData(data, media) {
  let formData = new FormData();
  for (let key of Object.keys(data)) {
    if (data[key] !== void 0) {
      formData.set(key, JSON.stringify(data[key]));
    }
  }
  if (media == null ? void 0 : media.length) {
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
function cloneObject(obj) {
  return !obj ? obj : JSON.parse(JSON.stringify(obj));
}
function updateObject(obj, val) {
  Object.keys(val || {}).forEach((k) => {
    obj[k] = val[k];
  });
}
function updateObjectStrict(obj, val) {
  Object.keys(val || {}).forEach((k) => {
    if (obj.hasOwnProperty(k)) {
      if (typeof obj[k] == "object" && !(obj[k] instanceof Array)) {
        updateObjectStrict(obj[k], val[k]);
      } else {
        obj[k] = val[k];
      }
    }
  });
}
function deleteAttributeByPath(obj, path) {
  if (!(obj && path))
    return obj;
  let [first, ...rest] = path.split(".");
  if (rest.length) {
    if (obj[first] instanceof Array) {
      if (isNaN(+rest[0])) {
        obj[first].forEach(
          (d) => deleteAttributeByPath(d, rest.join("."))
        );
      } else {
        deleteAttributeByPath(obj[first][+rest[0]], rest.slice(1).join("."));
      }
    } else {
      deleteAttributeByPath(obj[first], rest.join("."));
    }
  } else {
    delete obj[first];
  }
  return obj;
}
function deleteAttributesByPaths(obj, paths) {
  paths.forEach((p) => deleteAttributeByPath(obj, p));
}
export {
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
