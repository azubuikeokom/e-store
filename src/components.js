import { Component } from "react";
import {Link} from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <header>
        <div className="logo">
          <Link to={"/"}><span className="logo-s">S</span>candiweb</Link>
          
        </div>
        <div className="nav">
          <div className="login">Login</div>
          <div className="cart">Cart</div>
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
export { Header, Footer, Main };
