import { Component } from "react";
import { connect } from "react-redux";
import { removeItem, setCurrency } from "../actions";

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: 0,
      cartItem_id: 0,
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.setState_id = this.setState_id.bind(this);
    this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
    this.selectAttribute = this.selectAttribute.bind(this);
    this.totalCost=this.totalCost.bind(this);
  }
  setState_id(item_id) {
    this.setState({ cartItem_id: item_id });
  }
  selectAttribute(attribute_name, item) {
    //iterate over all order items
    this.props.orderItems.map((order_item) => {
      //check if cart-item's id is same with order-items id
      if (this.state.cartItem_id == order_item.id) {
        order_item.attributes.map((attrib) => {
          if (attribute_name in attrib) {
            attrib[attribute_name] = item.value;
          }
        });
      }
      return order_item;
    });
  }
  checkAmountInCurrency(item) {
    //check currency in prices attribute of product
    const price = item.prices.filter(
      (price) => price.currency.symbol == this.props.currency
    );
    return price[0];
  }

  increment() {
    this.setState({ qty: this.state.qty + 1 });
  }
  decrement() {
    if (this.state.qty > 0) {
      this.setState({ qty: this.state.qty - 1 });
    }
  }
  totalCost(total, currentItem) {
    return (total += currentItem.price * currentItem.qty);
  }
  removeItem(id) {
    this.props.removeItem(id);
  }
  render() {
    console.log(this.props.cartItems);
    console.log(this.props.orderItems);
    return (
      <div className="cart-page">
        <h1>CART</h1>
        <div className="cart-container">
          <div className="cart-list">
            {this.props.cartItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className="cart-item"
                  onMouseEnter={(e) => {
                    this.setState_id(item.id);
                  }}
                >
                  <div className="details">
                    <div className="details-name">
                      <strong>{item.name}</strong>
                    </div>
                    <div className="details-price">
                      {this.props.currency}{" "}
                      {this.checkAmountInCurrency(item).amount}
                    </div>
                    <div className="attributes">
                      {
                        // some attributes are empty
                        item.attributes.length > 0
                          ? item.attributes.map((attribute) => {
                              return attribute.type == "text" ? (
                                <div className="attribute">
                                  {[
                                    <div className="attribute-name">
                                      {attribute.name}
                                    </div>,
                                  ].concat(
                                    attribute.items.map((item, index) => {
                                      return (
                                        <div
                                          className="text-item"
                                          key={item.value}
                                          tabIndex={index}
                                          onClick={(e) => {
                                            this.selectAttribute(
                                              attribute.name,
                                              item
                                            );
                                          }}
                                        >
                                          {item.value}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              ) : (
                                <div className="attribute">
                                  {[
                                    <div className="attribute-name">
                                      {attribute.name}
                                    </div>,
                                  ].concat(
                                    attribute.items.map((item, index) => {
                                      return (
                                        <div
                                          key={item.value}
                                          className="color-item"
                                          tabIndex={index}
                                          style={{
                                            backgroundColor: item.value,
                                          }}
                                          onClick={(e) => {
                                            this.selectAttribute(
                                              attribute.name,
                                              item
                                            );
                                          }}
                                        ></div>
                                      );
                                    })
                                  )}
                                </div>
                              );
                            })
                          : ""
                      }
                    </div>
                  </div>
                  <div className="product-image-qty">
                    <div className="product-qty">
                      <button onClick={this.increment}>+</button>
                      <div>{this.state.qty}</div>
                      <button onClick={this.decrement}>-</button>
                    </div>
                    <div className="product-image-div">
                      <img src={item.gallery[0]} alt={item.name} />
                    </div>
                    <div
                      className="remove-btn"
                      onClick={() => {
                        this.removeItem(item.id);
                      }}
                    >
                      <div>X</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="cart-check-out">
          <div>
            <span className="cart-total-row-name">Tax: </span>
            <span className="cart-total-row-value">{this.props.currency} </span>
          </div>
          <div>
            <span className="cart-total-row-name">Qty:</span>
            <span className="cart-total-row-value"></span>
          </div>
          <div>
            <span className="cart-total-row-name">Total: </span>
            <span className="cart-total-row-value">
              {this.props.currency}{this.props.orderItems.reduce(this.totalCost,0)
            }
            </span>
          </div>
          <button className="order-btn">ORDER</button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.items,
    orderItems: state.cart.orderItems,
    currency: state.currencyState.currency,
  };
};
const actionCreators = {
  removeItem,
  setCurrency,
};

export default connect(mapStateToProps, actionCreators)(CartPage);
