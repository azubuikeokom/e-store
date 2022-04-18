import { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchData,setCurency,addItem } from "./actions";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

class Header extends Component {
  constructor(props){
    super(props);
    this.state={
      symbol:""
    }
    this.onSelectChange=this.onSelectChange.bind(this)
   
  }
  onSelectChange(e){
    this.setState({symbol:e.target.value}) 
    
  }
  //dispatch action here to avoid sending the default state value 
  componentDidUpdate(prevProps,prevState){
    //test to avoid infinite loop
    if(prevState.symbol!=this.state.symbol){
      this.props.setCurency(this.state.symbol)
    }
  }
  render() {
    return (
      <header>
        <div className="logo">
          <nav>
            <ul>
              <li>MEN</li>
              <li>WOMEN</li>
              <li>KIDS</li>
            </ul>
          </nav>
        </div>
        <div>
          <img src="/svg3.png" alt="logo"/>
        </div>
        <div className="nav">          
          <select value={this.state.symbol} onChange={this.onSelectChange} className="currency-switcher">
            <option value={"$"}>$ USD</option>
            <option value={"£"}>£ GBP</option>
            <option value={"A$"}>A$ AUD</option>
            <option value={"¥"}>¥ JPY</option>
            <option value={"₽"}>₽ RUB</option>
          </select>
          <div className="cart">
            <div className="cart-logo">
              <Link to={"/cart"}>
                <img
                  className="cart-logo"
                  src="/cart_image.png"
                  alt="cart-logo"
                />
              </Link>
            </div>
            <div className="cart-overlay">{this.props.cartItems.length}</div>
          </div>
        </div>
        <div className="mini-cart">
          <div className="cart-container-mini">
            <div className="cart-list-mini">
              {this.props.cartItems.map((item) => {
                return (
                  <div key={item.id} className="cart-item">
                    <div className="details">
                      <div className="details-name">
                        <strong>{item.name}</strong>
                      </div>
                      <div className="details-price">
                        $ {item.prices[0].amount}
                      </div>
                      <div className="details-sizes">
                        <div>S</div>
                        <div>M</div>
                      </div>
                    </div>
                    <div className="product-image-qty">
                      <div className="product-qty">
                        <button>+</button>
                        <div>1</div>
                        <button>-</button>
                      </div>
                      <div className="product-image-div">
                        <img src={item.gallery[0]} alt={item.name} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-total">
              <div><strong>Total</strong></div><div><strong>$xxxx</strong></div>
            </div>
            <div className="cart-view-checkout">
              <div className="view-bag">VIEW BAG</div>
              <div className="checkout">CHECK OUT</div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultCategory: {},
      current: {},
      loading: true,
      searching: false,
    };
    this.updateCurrentCategory = this.updateCurrentCategory.bind(this);
    this.currencyCheck=this.currencyCheck.bind(this);
    this.addToCart=this.addToCart.bind(this);
    this.notInCart=this.notInCart.bind(this)
  }
  currencyCheck(item){
    //check currency in prices attribute of product
   const price=item.prices.filter(price=>
      price.currency.symbol==this.props.currency
    )
    return price[0];
  }
  updateCurrentCategory(category) {
    this.setState({ current: category });
  }
  addToCart (item) {
    //check if item is already in cart
    if (this.notInCart(item.id)) {
      //dispatch to reducer
      this.props.addItem(item);
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
  componentDidMount() {
    const client = new ApolloClient({
      uri: "http://localhost:4000/",
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql`
          query GETALLCATEGORIES {
            categories {
              name
              products {
                id
                name
                inStock
                gallery
                description
                category
                brand
                prices {
                  currency {
                    label
                    symbol
                  }
                  amount
                }
                attributes {
                  name
                  type
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        //dispatch action to add data to store
        this.props.fetchData(result.data);
        const { allCategories, loading } = this.props.category_state;
        this.setState({
          defaultCategory: allCategories,
          loading: loading,
          current: allCategories.categories[0],
        });
      });
  }
  render() 
  {
    console.log(this.state.current)
    console.log(`Main received ${this.props.currency}`)
    return this.state.loading ? (
      <p>Loading...</p>
    ) : (
      <div className="container">
        <SearchCategoryName
          allCategories={this.state.defaultCategory}
          updateCategory={this.updateCurrentCategory}
        />
        <div className="products">
          {this.state.current.products.map((item) => {
            return (
              <div key={item.id} className="product-card">
                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.gallery[0]}
                    alt={item.name}
                    className="image"
                  />
                </Link>
                <div>{item.name}</div>
                <div>{this.props.currency}{this.currencyCheck(item).amount}</div>
                <div className="add-to-cart-button" onClick={()=>{this.addToCart(item)}}>
                  <img src="/cart_image.png" alt="add-to-cart-button" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

class SearchCategoryName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.findCategory = this.findCategory.bind(this);
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
    
  }
  //search for category entered in search field
  findCategory(term) {
    const category = this.props.allCategories.categories.filter((category) => {
      return category.name == term;
    });
    //save found category in store's state's currentCategory
    //storefoundCategory is pased down from Main as props
    if (category.length > 0) {
      this.props.updateCategory(category[0]);
    } else {
      this.props.updateCategory(this.props.allCategories.categories[0]);
    }
  }
  //dispatch here to prevent the default state's value from being sent over to the dispatch function
  //that way we only send over what we enter
  componentDidUpdate(prevProps,prevState){
    if(prevState.value!=this.state.value){
      this.findCategory(this.state.value);
    }
  }
  render() {
    return (
      <input
        className="category-search"
        placeholder="Category Name"
        value={this.state.value}
        onChange={this.handleChange}
      ></input>
    );
  }
}

const actionCreators = {
  fetchData,
  setCurency,
  addItem
};
const mapStateToProps1 = (state) => {
  //to be passed to wrapped Header props
  return { cartItems: state.cart.items };
};
const mapStateToProps2 = (state) => {
  return {
    category_state: state.dataState,
    currency:state.currencyState.currency,
    cartItems: state.cart.items
  };
};
const headerComponet = connect(mapStateToProps1,actionCreators);
const mainComponet = connect(mapStateToProps2, actionCreators);
export const WrappedHeader = headerComponet(Header);
export const WrappedMain = mainComponet(Main);

