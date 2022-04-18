import { Component } from "react";
import { connect } from "react-redux";
import { removeItem } from "../actions";

class CartPage extends Component {
  constructor(props) {
    super(props);
  
  }

  render() {
    return (
      <div className="cart-page">
         <h1>CART</h1>
        <div className="cart-container">
          <div className="cart-list">
            {this.props.cartItems.map((item) => {
              return (
                <div key={item.id} className="cart-item">
                  <div className="details">
                    <div className="details-name">
                      <strong>{item.name}</strong>
                    </div>
                    <div className="details-price">$ {item.prices[0].amount}</div>
                    <div className="details-sizes">
                     <div>S</div>
                     <div>M</div>
                    </div>
                  </div>
                  <div className="product-image-qty">
                    <div className="product-qty">
                      <button>+</button>
                      <div>1</div>
                      <button>-</button>
                    </div>
                    <div className="product-image-div">
                      <img src={item.gallery[0]} alt={item.name}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { cartItems: state.cart.items };
};
const actionCreators = {
  removeItem,
};

export default connect(mapStateToProps, actionCreators)(CartPage);
