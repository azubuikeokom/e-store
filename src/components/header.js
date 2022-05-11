import { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchData, setCurrency, addItem } from "../actions";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        symbol: "",
        cart_display: true,
      };
      this.onSelectChange = this.onSelectChange.bind(this);
      this.showOverLayCart = this.showOverLayCart.bind(this);
      this.selectTab = this.selectTab.bind(this);
    }
    selectTab(e) {
      if (e.target.id == "all") {
        e.target.style.borderBottom = "1px solid #4E944F";
        document.getElementById("tech").style.borderBottom = "";
        document.getElementById("clothes").style.borderBottom = "";
      }
      if (e.target.id == "tech") {
        e.target.style.borderBottom = "1px solid #4E944F";
        document.getElementById("all").style.borderBottom = "";
        document.getElementById("clothes").style.borderBottom = "";
      }
      if (e.target.id == "clothes") {
        e.target.style.borderBottom = "1px solid #4E944F";
        document.getElementById("tech").style.borderBottom = "";
        document.getElementById("all").style.borderBottom = "";
      }
      //sets parent state's name value
      this.props.showTab(e.target.id);
    }
    onSelectChange(e) {
      this.setState({ symbol: e.target.value });
    }
    showOverLayCart() {
      
        if (this.state.cart_display) {
          if(this.props.orderItems.length>0){
            const cartOverlay = document.querySelector(".cart-overlay-container");
            cartOverlay.style.display = "block";
            this.setState({ cart_display: false });
            this.props.showViewBag(true)
          }
        } else {
          const cartOverlay = document.querySelector(".cart-overlay-container");
          cartOverlay.style.display = "none";
          this.setState({ cart_display: true });
          this.props.showViewBag(false)
        }
      
      
    }
    //dispatch action here to avoid sending the default state value
    componentDidUpdate(prevProps, prevState) {
      //test to avoid infinite loop
      if (prevState.symbol != this.state.symbol) {
        this.props.setCurrency(this.state.symbol);
      }
    }
    componentDidMount() {
      document.getElementById("all").style.borderBottom = "1px solid #4E944F";
    }
    render() {
      return (
        <header>
          <div className="logo">
            <nav>
              <ul>
                <li>
                  <Link to={"/"}>
                    <input type={"button"} className="tab-link" id="all" value={"ALL"} onClick={this.selectTab}></input>
                  </Link>
                </li>
                <li>
                  <Link to={"/"}>
                    <input type={"button"} className="tab-link" id="tech" value={"TECH"} onClick={this.selectTab}></input>
                  </Link> 
                </li>
                <li>
                <Link to={"/"}>
                  <input type={"button"} className="tab-link" id="clothes" value={"CLOTHES"} onClick={this.selectTab}></input>
                </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <img src="/svg3.png" alt="logo" />
          </div>
          <div className="nav">
            <select value={this.state.symbol} onChange={this.onSelectChange} className="currency-switcher">
              <option value={"$"}>$ USD</option>
              <option value={"£"}>£ GBP</option>
              <option value={"A$"}>A$ AUD</option>
              <option value={"¥"}>¥ JPY</option>
              <option value={"₽"}>₽ RUB</option>
            </select>
            <div className="cart" onClick={this.showOverLayCart}>
              <div className="cart-logo">
                <Link to={""}>
                  <img className="cart-logo" src="/cart_image.png" alt="cart-logo" />
                </Link>
              </div>
              <div className="cart-item-number">{this.props.orderItems.length == 1 && this.props.qty == 0 ? 1 : this.props.qty}</div>
            </div>
          </div>
        </header>
      );
    }
  }

  const actionCreators = {
    fetchData,
    setCurrency,
    addItem,
  };
  const mapStateToProps1 = (state) => {
    //to be passed to wrapped Header props
    return {
      cartItems: state.cart.items,
      orderItems: state.cart.orderItems,
    };
  };
  const headerComponet = connect(mapStateToProps1, actionCreators);
  export const WrappedHeader = headerComponet(Header);
  