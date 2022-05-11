import {PureComponent} from "react";
import {Link} from "react-router-dom";

class Product extends PureComponent {
    constructor(props) {
      super(props);
      this.cartProduct = {
        product: {},
        orderProduct: {
          attributes: [],
          price: 0,
          name: "",
          brand: "",
          id: "",
          image: "",
          currency: "",
          qty: 0,
        },
      };
  
      this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
      this.selectTextAttribute = this.selectTextAttribute.bind(this);
      this.selectColorAttribute = this.selectColorAttribute.bind(this);
      this.addToCart = this.addToCart.bind(this);
      this.notInCart = this.notInCart.bind(this);
      this.closeAttribbute = this.closeAttribbute.bind(this);
    }
    selectColorAttribute(attribute_name, item, index) {
      // if no attribute has been selected
      if (this.cartProduct.orderProduct.attributes.length == 0) {
        this.cartProduct.orderProduct.attributes.push({
          [attribute_name]: item.value,
        });
      }
      // if an attribute has already been selected, check if attribute name exits,
      //if so replace else add new selected attribute value
      else {
        const found_attribute = this.cartProduct.orderProduct.attributes.find((attribute) => Object.keys(attribute) == attribute_name);
        found_attribute
          ? (found_attribute[attribute_name] = item.value)
          : this.cartProduct.orderProduct.attributes.push({
              [attribute_name]: item.value,
            });
      }
      console.log("orderProduct ", this.cartProduct.orderProduct);
      const all_values = document.querySelectorAll(".color-item");
      all_values.forEach((each_value) => {
        //if another item has its border colored, clear
        if (each_value.tabIndex != index) {
          each_value.style.border = "";
        }
      });
    }
    selectTextAttribute(attribute_name, item, index) {
      // if no attribute has been selected
      if (this.cartProduct.orderProduct.attributes.length == 0) {
        this.cartProduct.orderProduct.attributes.push({
          [attribute_name]: item.value,
        });
      }
      // if an attribute has already been selected, check if attribute name exits,
      //if so replace else add new selected attribute value
      else {
        const found_attribute = this.cartProduct.orderProduct.attributes.find((attribute) => Object.keys(attribute) == attribute_name);
        found_attribute
          ? (found_attribute[attribute_name] = item.value)
          : this.cartProduct.orderProduct.attributes.push({
              [attribute_name]: item.value,
            });
      }
      console.log("orderProduct ", this.cartProduct.orderProduct);
      //this will highlight the attributes
      const all_values = document.querySelectorAll(".text-item");
      all_values.forEach((each_value) => {
        //if another item has its background colored, clear, and set font back to black
        if (each_value.tabIndex != index) {
          each_value.style.backgroundColor = "";
          each_value.style.color = "black";
        }
      });
    }
  
    checkAmountInCurrency(item) {
      //check currency in prices attribute of product
      const price = item.prices.filter((price) => price.currency.symbol == this.props.currency);
      return price[0];
    }
  
    closeAttribbute(id) {
      document.querySelector(`#${id}`).style.display = "none";
    }
    addToCart(item) {
      this.cartProduct.product = item;
      //check if attributes of item  matches the original fetched from appollo server
      if (this.cartProduct.product.attributes.length == this.cartProduct.orderProduct.attributes.length) {
        //check if item is already in cart
        if (this.notInCart(this.cartProduct.product.id)) {
          //set initial quantity to 1
          this.cartProduct.orderProduct.qty = 1;
          //populate order item properties
          this.cartProduct.orderProduct.name = this.cartProduct.product.name;
          this.cartProduct.orderProduct.brand = this.cartProduct.product.brand;
          this.cartProduct.orderProduct.price = this.checkAmountInCurrency(this.cartProduct.product).amount;
          this.cartProduct.orderProduct.currency = this.props.currency;
          this.cartProduct.orderProduct.id = this.cartProduct.product.id;
          this.cartProduct.orderProduct.image = this.cartProduct.product.gallery[0];
          //add to cart
          this.props.addItem(this.cartProduct);
          //this renders the header cart logo count value
          this.props.renderQty(this.props.orderItems);
        } else {
          return;
        }
      } else {
        document.querySelector(`#${item.id}`).style.display = "block";
      }
    }
    notInCart(id) {
      const cartOldItem = this.props.cartItems.find((item) => item.id == id);
      const orderOldItem = this.props.orderItems.find((item) => item.id == id);
      if (cartOldItem == undefined && orderOldItem == undefined) {
        return true;
      } else return false;
    }
    render() {
      return (
        <div key={this.props.item.id} className="product-card">
          <Link to={`/products/${this.props.item.id}`}>
            <img src={this.props.item.gallery[0]} alt={this.props.item.name} className="image" />
          </Link>
          <div id={this.props.item.id} className="hidden-attributes">
            <div
              className="close-attribute"
              onClick={() => {
                this.closeAttribbute(this.props.item.id);
              }}
            >
              x
            </div>
            {
              // some attributes are empty
              this.props.item.attributes.length > 0
                ? this.props.item.attributes.map((attribute, index) => {
                    return attribute.type == "text" ? (
                      <div key={index} className="attribute">
                        {[<div className="attribute-name">{attribute.name}</div>].concat(
                          attribute.items.map((item, index) => {
                            return (
                              <div
                                key={item.value}
                                className="text-item"
                                tabIndex={index}
                                onClick={(e) => {
                                  e.target.style.backgroundColor = "black";
                                  e.target.style.color = "white";
                                  this.selectTextAttribute(attribute.name, item, index);
                                }}
                              >
                                {item.value}
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div key={index} className="attribute">
                        {[<div className="attribute-name">{attribute.name} </div>].concat(
                          attribute.items.map((item, index) => {
                            return (
                              <div
                                key={item.value}
                                className="color-item"
                                tabIndex={index}
                                style={{ backgroundColor: item.value }}
                                onClick={(e) => {
                                  e.target.style.border = "2px solid #83BD77";
                                  this.selectColorAttribute(attribute.name, item, index);
                                }}
                              ></div>
                            );
                          })
                        )}{" "}
                      </div>
                    );
                  })
                : ""
            }
          </div>
          <div>
            <strong>{this.props.item.name}</strong>
          </div>
          <div>
            <strong>Price: </strong> {this.props.currency}
            {this.checkAmountInCurrency(this.props.item).amount}
          </div>
          <div
            className="add-to-cart-button"
            onClick={(e) => {
              this.addToCart(this.props.item);
            }}
          >
            <img src="/cart_image.png" alt="add-to-cart-button" />
          </div>
          {this.props.item.inStock ? "" : <div className="out_of_stock">OUT OF STOCK</div>}
        </div>
      );
    }
  }
  export default Product;