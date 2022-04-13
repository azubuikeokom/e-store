import { Component } from "react";
import { products } from "./data";
import Header, { Footer, Main } from "./components";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import "./App.css";
import CartPage from "./Pages/CartPage";
import ProductPage from "./Pages/ProductPage";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: products,
    };
  }
  render() {
    return (
      <Router>
        <>
          <Header />
         <Routes>
          <Route path="/products/:id" element={<ProductPage/>}/>
          <Route  path="/cart" element={<CartPage/>}/>
          <Route path="/" exact={true} element={<Main products={this.state.products} />} />
         </Routes> 
          <Footer />
        </>
      </Router>
    );
  }
}

export default App;
