import {
  addItem,
  deleteItem,
  getAllItems,
  updateItem,
} from "../db/menu-item-accessor.mjs";
import { MenuItem } from "../entity/menu-item.mjs";

/**
 * Handles a request to perform an action on the dataset.
 *
 * @param {string} action - the action to perform: one of LIST, ADD, UPDATE, DELETE
 * @param {MenuItem} content - the object to be added, updated, or deleted; null for LIST requests.
 * @returns {Promise<object>} - resolves to: an object containing three fields: statusCode, err, data.
 *                              As per convention, only one of err or data will be populated.
 */
async function processRequest(action, content) {
  let resp = null;

  try {
    switch (action) {
      case "LIST": {
        let items = await getAllItems();
        let menuItems = items.map((item) => new MenuItem(item));
        resp = {
          statusCode: 200,
          err: null,
          data: menuItems,
        };
      }
      case "ADD": {
        if (!content) {
          resp = {
            statusCode: 400,
            err: "Please enter required information.",
            data: null,
          };
        } else {
          let item = await addItem(content);
          resp = {
            statusCode: 201,
            err: null,
            data: item,
          };
        }
      }
      case "UPDATE": {
        if (!content || !content.id) {
          resp = {
            statusCode: 400,
            err: "You must include an ID for the update.",
            data: null,
          };
        } else {
          let item = await updateItem(content);
          resp = {
            statusCode: 200,
            err: null,
            data: item,
          };
        }
      }
      case "DELETE": {
        if (!content || !content.id) {
          resp = {
            statusCode: 400,
            err: "You must include an ID for the delete.",
            data: null,
          };
        } else {
          let item = await deleteItem(content.id);
          resp = {
            statusCode: 200,
            err: null,
            data: item,
          };
        }
      }
      default: {
        resp = {
          statusCode: 400,
          err: "Something went wrong.",
          data: null,
        };
      }
    }
  } catch (err) {
    resp = {
      statusCode: 500,
      err: err.message,
      data: null,
    };
  }

  return resp;
}

export { processRequest };
