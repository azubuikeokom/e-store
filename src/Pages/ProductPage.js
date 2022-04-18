import { Component } from "react";
import { connect } from "react-redux";
import { addItem } from "../actions";
import { Link } from "react-router-dom";

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.product={};
    this.addToCart = this.addToCart.bind(this);
  
  }

  addToCart = (e) => {
    //check if item is already in cart
    if (this.notInCart(this.product.id)) {
      //dispatch to reducer
      this.props.addItem(this.product);
    } else {
      return;
    }
  };
  notInCart(id) {
    const oldItem = this.props.cartItems.find((item) => item.id == id);
    if (oldItem == undefined) {
      return true;
    } else return false;
  }
  render() {
    this.id = window.location.pathname.split("/")[2];
    this.product = this.props.products.find((item) => item.id == this.id);
    console.log(this.props.cartItems)
    return (
      <div className="product-container">
        <div className="product-thumbnails">
          <div className="thumbnail-1">
            <img className="product-details-image" src={this.product.gallery[0]} alt={this.product.name}/>
          </div>
          <div className="thumbnail-2">
            <img className="product-details-image" src={this.product.gallery[0]} alt={this.product.name}/>
          </div>
          <div className="thumbnail-3">
            <img className="product-details-image" src={this.product.gallery[0]} alt={this.product.name}/>
          </div>
        </div>
        <div className="product">
          <img className="product-details-image" src={this.product.gallery[0]} alt={this.product.name}/>
        </div>
        <div className="product-details">
          <div className="product-name">
            <p><strong>{this.product.name}</strong></p>
          </div>
          <div className="sizes">
            <p><strong>SIZE:</strong></p>
            <ul>
              <li>XL</li>
              <li>S</li>
              <li>M</li>
              <li>L</li>
            </ul>
          </div>
          <div className="price">
            <p>PRICE:</p>
          </div>
          <Link to={"/cart"}>
            <button onClick={this.addToCart}>ADD TO CART</button>
          </Link>
          <div className="further-info">
            {this.product.description}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { 
    cartItems: state.cart.items,
    products:state.dataState.allCategories.categories[0].products
   };
};
const actionCreators = {
  addItem,
};
export default connect(mapStateToProps, actionCreators)(ProductPage);
