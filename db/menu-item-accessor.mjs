/**
 * Data Accessor for Mongo.
 *
 * @module MenuItemAccessor
 */
import * as Constants from "../utils/constants.mjs";
import { ConnectionManager } from "./connection-manager.mjs";
import { MenuItem } from "../entity/menu-item.mjs";

export {
  getAllItems,
  getItemByID,
  itemExists,
  deleteItem,
  addItem,
  updateItem,
};

/**
 * Gets all the items.
 *
 * @example
 * let items = await getAllItems();
 * @throws {Error} if a database error occurs
 * @returns {Promise<array<MenuItem>>} resolves to: an array of MenuItem objects (empty if there are none)
 */
async function getAllItems() {
  try {
    let client = await ConnectionManager.getConnection();
    let collection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    let objects = await collection.find({}).toArray();

    // 'objects' is an array of objects, but they're not instances of MenuItem.
    let items = [];
    objects.forEach((obj) => {
      let temp = new MenuItem(
        obj.id,
        obj.category,
        obj.description,
        obj.price,
        obj.vegetarian,
      );
      items.push(temp);
    });

    return items;
  } catch (err) {
    throw new Error("Could not complete getAllItems!\n" + err);
  } finally {
    await ConnectionManager.closeConnection();
  }
} // end function

/**
 * Determines if a MenuItem object exists in the database.
 *
 * @param {MenuItem} - the object to find
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item exists; false otherwise
 */
async function itemExists(item) {
  try {
    let client = await ConnectionManager.getConnection();
    let connection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    let itemToFind = await getItemByID(item.id);
    if (itemToFind == null) {
      return false;
    }
    return true;
  } catch (err) {
    throw new Error("Item does not exist!");
  } finally {
    await ConnectionManager.closeConnection();
  }
} // end function

/**
 * Gets the object with the specified ID.
 *
 * @param {number} itemID - the ID of the object to return
 * @throws {Error} if a database error occurs
 * @returns {Promise<MenuItem>} resolves to: the matching MenuItem object; or null if the object doesn't exist
 */
async function getItemByID(itemID) {
  try {
    let client = await ConnectionManager.getConnection();
    let connection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    let items = await getAllItems();
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemID) {
        return items[i];
      }
    }
    return null;
  } catch (err) {
    throw new Error("Cannot get item by id!");
  } finally {
    await ConnectionManager.closeConnection();
  }
} // end function

/**
 * Adds the specified item (if it doesn't already exist).
 *
 * @param {MenuItem} item - the item to add
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was added; false if the item already exists.
 */
async function addItem(item) {
  try {
    let doesExist = await itemExists(item);
    if (doesExist) {
      return false;
    }
    let client = await ConnectionManager.getConnection();
    let collection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    await collection.insertOne(item.toJSON());
    return true;
  } catch (err) {
    throw new Error("Cannot add item!");
  } finally {
    await ConnectionManager.closeConnection();
  }
} // end function

/**
 * Deletes the specified item (if it exists).
 *
 * @param {MenuItem} item - the item to delete
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was deleted; false if the item doesn't exist.
 */
async function deleteItem(item) {
  try {
    let doesExist = await itemExists(item);
    if (!doesExist) {
      return false;
    }
    let client = await ConnectionManager.getConnection();
    let collection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    await collection.deleteOne({ id: item.id });
    return true;
  } catch (err) {
    throw new Error("Item can't be deleted.");
  } finally {
    await ConnectionManager.closeConnection();
  }
} // end function

/**
 * Updates the specified item (if it exists).
 *
 * @param {MenuItem} item - the item to update
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was updated; false if the item doesn't exist.
 */
async function updateItem(item) {
  try {
    let doesExist = await itemExists(item);
    if (!doesExist) {
      return false;
    }
    let client = await ConnectionManager.getConnection();
    let collection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    await collection.updateOne({ id: item.id }, { $set: item.toJSON() });
    return true;
  } catch (err) {
    throw new Error("Item can't be updated :(");
  } finally {
    await ConnectionManager.closeConnection();
  }
} // end function
