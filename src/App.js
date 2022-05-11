import { PureComponent } from "react";
import { WrappedMain } from "./components/main";
import { WrappedHeader } from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/CartPage";
import { connect } from "react-redux";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qty: 0,
      tabName: "",
      cartClicked:false
    };
    this.renderQty = this.renderQty.bind(this);
    this.showTab = this.showTab.bind(this);
    this.showViewBag=this.showViewBag.bind(this)
  }
  showViewBag(clicked){
    this.setState({cartClicked:clicked})
  }
  showTab(name) {
    this.setState({ tabName: name });
  }
  //sends qty to header to be re-rendered on update of state when method is called
  renderQty(orderItems) {
    this.setState({
      qty: orderItems.reduce((total_qty, current_order_item) => {
        return (total_qty += current_order_item.qty);
      }, 0)
    });
 
  }
 

  render() {
    return (
      <Router>
        <>
          <WrappedHeader qty={this.state.qty} showTab={this.showTab} showViewBag={this.showViewBag} />
          <div className="cart-overlay-container">
            <div className="cart-overlay">
              <Cart renderQty={this.renderQty} cartClicked={this.state.cartClicked} />
            </div>
          </div>
          <Routes>
            <Route path="/products/:id" element={<ProductPage renderQty={this.renderQty}/>} />
            <Route path="/cart" element={<CartPage renderQty={this.renderQty} />} />
            <Route path="/" exact={true} element={<WrappedMain renderQty={this.renderQty} tabName={this.state.tabName} showTab={this.showTab} />} />
          </Routes>
        </>
      </Router>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.items,
    orderItems: state.cart.orderItems,
  };
};
export default connect(mapStateToProps)(App);
