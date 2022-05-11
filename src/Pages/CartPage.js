import { PureComponent } from "react";
import { Link } from "react-router-dom";
import ListItem from "../components/listItem";
import { connect } from "react-redux";
import {removeItem,setCurrency} from "../actions";

class CartPage extends PureComponent {
  constructor(props) {
    super(props);
    this.reRender = this.reRender.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
    this.totalCost = this.totalCost.bind(this);
    this.closeOverlayCart = this.closeOverlayCart.bind(this);
  }
  closeOverlayCart() {
    const overlay_cart = document.querySelector(".cart-overlay-container");
    overlay_cart.style.display = "none";
  }
  reRender() {
    this.setState({});
  }
  checkAmountInCurrency(item) {
    //check currency in prices attribute of product
    const price = item.prices.filter((price) => price.currency.symbol == this.props.currency);

    return price[0];
  }

  totalCost(total, currentItem) {
    return (total += currentItem.price * currentItem.qty);
  }
  removeItem(id) {
    this.props.removeItem(id);
  }
  render() {
    this.props.renderQty(this.props.orderItems);

    return (
      <div className="cart-page">
        <h1>CART</h1>
        <div className="cart-container">
          <div className="cart-list">
            {this.props.cartItems.map((item) => {
              const orderItem = this.props.orderItems.find((orderItem) => orderItem.id == item.id);
              return (
                <ListItem
                  item={item}
                  checkAmountInCurrency={this.checkAmountInCurrency}
                  removeItem={this.removeItem}
                  increment={this.increment}
                  reRender={this.reRender}
                  currency={this.props.currency}
                  orderItem={orderItem}
                  decrement={this.decrement}
                  orderItems={this.props.orderItems}
                  renderQty={this.props.renderQty}
                />
              );
            })}
          </div>
        </div>
        <div className="cart-check-out">
          <div>
            <span className="cart-total-row-name">Tax: </span>
            <span className="cart-total-row-value">
              {this.props.currency}
              {this.props.orderItems.length > 0 ? 15 : ""}
            </span>
          </div>
          <div>
            <span className="cart-total-row-name">
              Qty:
              {this.props.orderItems.reduce((total_qty, current_order_item) => {
                return (total_qty += current_order_item.qty);
              }, 0)}
            </span>
            <span className="cart-total-row-value"></span>
          </div>
          <div>
            <span className="cart-total-row-name">Total: </span>
            <span className="cart-total-row-value">
              {this.props.currency}
              {this.props.orderItems.reduce(this.totalCost, 0)}
            </span>
          </div>
          {this.props.cartClicked ? (
            <div className="overly-checkout">
              <Link to={"/cart"}>
                <button className="view-bag" onClick={this.closeOverlayCart}>
                  VIEW BAG
                </button>
              </Link>
              <button className="overlay-order-btn">CHECK OUT</button>
            </div>
          ) : (
            <button className="order-btn">ORDER</button>
          )}
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
