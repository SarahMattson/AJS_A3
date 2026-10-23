/**
 * Class to represent an item on a restaurant menu.
 */
class MenuItem {
  #id;
  #category;
  #description;
  #price;
  #vegetarian;

  constructor(id, category, description, price, vegetarian) {
    this.#id = id;
    this.#category = category;
    this.#description = description;
    this.#price = price;
    this.#vegetarian = vegetarian;
  }

  get id() {
    return this.#id;
  }

  get category() {
    return this.#category;
  }

  get description() {
    return this.#description;
  }

  get price() {
    return this.#price;
  }

  get vegetarian() {
    return this.#vegetarian;
  }

  formatItem() {
    return `${this.id}, ${this.#description}: $${this.price}`;
  }

  toJSON() {
    return {
      id: this.id,
      category: this.category,
      description: this.description,
      price: this.price,
      vegetarian: this.vegetarian,
    };
  }
}

export { MenuItem };
