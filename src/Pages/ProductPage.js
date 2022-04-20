import { Component } from "react";
import { connect } from "react-redux";
import { addItem,setCurrency } from "../actions";
import { Link } from "react-router-dom";

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.product={};
    this.addToCart = this.addToCart.bind(this);
    this.state={
      des_tag:{}
    }
    this.checkAmountInCurrency=this.checkAmountInCurrency.bind(this)
  }
  checkAmountInCurrency(item){
    //check currency in prices attribute of product
   const price=item.prices.filter(price=>
      price.currency.symbol==this.props.currency
    )
    return price[0];
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
  componentDidMount(){
    this.setState({des_tag:window.document.getElementsByClassName("description")[0]})
    
  }
  render() {
    
   
    this.id = window.location.pathname.split("/")[2];
    this.product = this.props.products.find((item) => item.id == this.id);
    console.log("cart",this.props.cartItems)
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
            <p><strong>PRICE: </strong>{this.props.currency}{this.checkAmountInCurrency(this.product).amount}</p>
          </div>
          <Link to={"/cart"}>
            <button onClick={this.addToCart}>ADD TO CART</button>
          </Link>
          <div className="description">
            {
             this.state.des_tag.innerHTML=this.product.description
            }
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { 
    cartItems: state.cart.items,
    products:state.dataState.allCategories.categories[0].products,
    currency:state.currencyState.currency
   };
};
const actionCreators = {
  addItem,
  setCurrency 
};
export default connect(mapStateToProps, actionCreators)(ProductPage);
