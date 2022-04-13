import { Component } from "react";
import { connect } from "react-redux";
import { removeItem } from "../actions";

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.removeItem = this.removeItem.bind(this);
    this.costReduce = this.costReduce.bind(this);
  }
  removeItem = (id) => {
    this.props.removeItem(id);
  };
  costReduce = (total, currentItem) => {
    return (total += currentItem.price * currentItem.qty);
  };

  render() {
    return (
      <div className="cart-page">
         <h1>Cart Page</h1>
        <div className="cart-container">
          <div className="cart-list">
            {this.props.cartItems.map((item) => {
              return (
                <div key={item.id} className="cart-item">
                  <div>
                    <img className="image" src={item.image} alt={item.name} />
                    <div>{item.brand}</div>
                    <div>${item.price}</div>
                  </div>
                  <div>
                    <button
                      className="remove-from-cart"
                      key={item.id}
                      onClick={() => this.removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-checkout ">
            <div className="cart-total">
              Total ${" "}
              <span><strong>{this.props.cartItems.reduce(this.costReduce, 0)}</strong></span>
            </div>
            <button className="checkout-button">Procced to Checkout</button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { cartItems: state.items };
};
const actionCreators = {
  removeItem,
};

export default connect(mapStateToProps, actionCreators)(CartPage);
