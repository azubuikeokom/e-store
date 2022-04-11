import { Component } from "react";
import { connect} from "react-redux";
import { products } from "../data";
import { addItem} from "../actions";
import { Link } from "react-router-dom";

 class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.id = 0;
    this.product = {};
    this.addToCart = this.addToCart.bind(this);
    
  }

  addToCart = (e) => {
    //check if item is already in cart
    if(this.notInCart(this.product.id)){
      //dispatch to reducer
      this.props.addItem(this.product);
    }else{
      return;
    }

  };
  notInCart(id){
    const oldItem=this.props.cartItems.find(item=>item.id==id)
    if(oldItem==undefined){
      return true;
    }else
    return false;
  }
  render() {
    this.id = window.location.pathname.split("/")[2];
    this.product = products.find((item) => item.id == this.id);
    let keys=new Array(this.product.count_in_stock).keys();
    const options=[]
    for ( let x of keys) {
      options.push(<option>{x}</option>)
    }
    return (
      <div className="product-container">
        <div className="product-card">
          <img
            className="image"
            src={this.product.image}
            alt={this.product.name}
          />
          <div>{this.product.name}</div>
          <div>{this.product.brand}</div>
          <div>${this.product.price}</div>
          <select>{options}</select>
        </div>
        <Link to={"/cart"}>
          <button className="add-to-cart" onClick={this.addToCart}>
            Add To Cart
          </button>
        </Link>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { cartItems: state.items };
};
const actionCreators={
  addItem,
}
export default connect(mapStateToProps,actionCreators)(ProductPage);
