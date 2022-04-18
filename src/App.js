import { Component } from "react";
import  { WrappedHeader,Footer, WrappedMain } from "./components";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import "./App.css";
import CartPage from "./Pages/CartPage";
import ProductPage from "./Pages/ProductPage";



class App extends Component {
  render() {
    return (
      <Router>
        <>
          <WrappedHeader/>
         <Routes>
          <Route path="/products/:id" element={<ProductPage/>}/>
          <Route  path="/cart" element={<CartPage/>}/>
          <Route path="/" exact={true} element={<WrappedMain  />} />
         </Routes> 
          
        </>
      </Router>
    );
  }
}

export default App;
