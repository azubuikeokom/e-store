import { Component } from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";

class Header extends Component {
  constructor(props){
    super(props);
    this.state={
      itemsNumber:0
    }
   
  }
  numberOfCartItems(){
    // this.setState({itemsNumber:this.props.cartItems.length})
  }
 
  render() {
    return (
      <header>
        <div className="logo">
          <Link to={"/"}>
            <span className="logo-s">S</span>candiweb
          </Link>
        </div>
        <div className="nav">
          <div className="login">Login</div>
          <div className="cart">
            <div className="cart-logo">
              <Link to={"/cart"}>
                <img className="cart-logo" src="/cart_image.png" alt="cart-logo"/>
              </Link>
            </div>
            <div className="cart-overlay">{this.props.cartItems.length}</div>
          </div>
        </div>
      </header>
    );
  }
}
class Footer extends Component {
  render() {
    return (
      <footer>
        <div>All Rights Reserved</div>
      </footer>
    );
  }
}
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
    };
  }
  render() {
    return (
      <div className="container">
        <div className="products">
          {this.state.products.map((item) => {
            return (
              <div key={item.id} className="product-card">
                <Link to={`/products/${item.id}`}>
                  <img src={item.image} alt={item.name} className="image" />
                </Link>

                <div>{item.name}</div>
                <div>${item.price}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
  //to be passed to wrapped Header props
  return {cartItems:state.items}
}
export default connect(mapStateToProps)(Header);
export { Footer, Main };
