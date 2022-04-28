import { Component } from "react";
import  { WrappedHeader,Footer, WrappedMain } from "./components";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import "./App.css";
import CartPage from "./Pages/CartPage";
import ProductPage from "./Pages/ProductPage";
import Cart from "./Pages/CartPage";
import { connect } from "react-redux";



class App extends Component {
  constructor(props){
    super(props)
    this.state={
      qty:0,
      tabName:""
    }
    this.renderQty=this.renderQty.bind(this)
    this.showTab=this.showTab.bind(this)
  }
  
  showTab(name){
    this.setState({tabName:name})
  }
  //sends qty to header to be re-rendered on update of state when method is called
  renderQty(){
    this.setState({qty:this.props.orderItems.reduce((total_qty,current_order_item)=>{
      return total_qty+=current_order_item.qty;
    },0)})
  }

  render() {
    return (
      <Router>
        <>
          <WrappedHeader qty={this.state.qty} showTab={this.showTab}/>
          <div className="cart-overlay-container">
          <div className="cart-overlay">
            <Cart renderQty={this.renderQty}/>
          </div>
        </div>
         <Routes>
          <Route path="/products/:id" element={<ProductPage/>}/>
          <Route  path="/cart" element={<CartPage  renderQty={this.renderQty}/>}/>
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
