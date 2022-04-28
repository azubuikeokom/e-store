import { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchData, setCurrency, addItem } from "./actions";
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

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultCategory: {},
      current: {},
      loading: true,
      searching: false,
      techCategory:{},
      clothesCategory:{},
      testTab:""
    };
    this.updateCurrentCategory = this.updateCurrentCategory.bind(this);
    this.findTechCategory=this.findTechCategory.bind(this)
    this.findClothesCategory=this.findClothesCategory.bind(this)
  }
  componentDidUpdate(prevProps,prevState){
    if(prevState.defaultCategory!=this.state.defaultCategory){
      this.findClothesCategory("clothes")
      this.findTechCategory("tech")
    }
  }
  findTechCategory(term) {
    //found category array is returned
    const category = this.state.defaultCategory.categories.filter((category) => {
      return category.name == term;
    });
    this.setState({techCategory:category[0]})
   
  }
  findClothesCategory(term) {
    //found category array is returned
    const category = this.state.defaultCategory.categories.filter((category) => {
      return category.name == term;
    });
    this.setState({clothesCategory:category[0]})
   
  }
  updateCurrentCategory(category) {
    this.setState({ current: category });
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
                  items {
                    value
                    displayValue
                    id
                  }
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        //dispatch action to category reducer
        this.props.fetchData(result.data);
        const { allCategories, loading } = this.props.category_state;
        this.setState({
          defaultCategory: allCategories,
          loading: loading,
          current: allCategories.categories[0],
         
        });
      });
      this.props.showTab("all")
     
  }
  render() {
    console.log(this.state.current);
    return this.state.loading ? (
      <p>Loading...</p>
    ) : (
      <div className="container">
        <SearchCategoryName allCategories={this.state.defaultCategory} updateCategory={this.updateCurrentCategory} />       
          <All
            current={this.state.current}
            currency={this.props.currency}
            orderItems={this.props.orderItems}
            cartItems={this.props.cartItems}
            addItem={this.props.addItem}
            renderQty={this.props.renderQty}
            tabName={this.props.tabName}
          />
          <Tech
            current={this.state.techCategory}
            currency={this.props.currency}
            orderItems={this.props.orderItems}
            cartItems={this.props.cartItems}
            addItem={this.props.addItem}
            renderQty={this.props.renderQty}
            tabName={this.props.tabName}                      
          />    
          <Clothes
            current={this.state.clothesCategory}
            currency={this.props.currency}
            orderItems={this.props.orderItems}
            cartItems={this.props.cartItems}
            addItem={this.props.addItem}
            renderQty={this.props.renderQty}
            tabName={this.props.tabName}                      
          />    
      </div>
    );
  }
}
class Product extends Component {
  constructor(props) {
    super(props);
    this.cartProduct = {
      product: {},
      orderProduct: {
        attributes: [],
        price: 0,
        name: "",
        brand: "",
        id: "",
        image: "",
        currency: "",
        qty: 0,
      },
    };

    this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
    this.selectTextAttribute = this.selectTextAttribute.bind(this);
    this.selectColorAttribute = this.selectColorAttribute.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.notInCart = this.notInCart.bind(this);
    this.closeAttribbute = this.closeAttribbute.bind(this);
  }
  selectColorAttribute(attribute_name, item, index) {
    // if no attribute has been selected
    if (this.cartProduct.orderProduct.attributes.length == 0) {
      this.cartProduct.orderProduct.attributes.push({
        [attribute_name]: item.value,
      });
    }
    // if an attribute has already been selected, check if attribute name exits,
    //if so replace else add new selected attribute value
    else {
      const found_attribute = this.cartProduct.orderProduct.attributes.find((attribute) => Object.keys(attribute) == attribute_name);
      found_attribute
        ? (found_attribute[attribute_name] = item.value)
        : this.cartProduct.orderProduct.attributes.push({
            [attribute_name]: item.value,
          });
    }
    console.log("orderProduct ", this.cartProduct.orderProduct);
    const all_values = document.querySelectorAll(".color-item");
    all_values.forEach((each_value) => {
      //if another item has its border colored, clear
      if (each_value.tabIndex != index) {
        each_value.style.border = "";
      }
    });
  }
  selectTextAttribute(attribute_name, item, index) {
    // if no attribute has been selected
    if (this.cartProduct.orderProduct.attributes.length == 0) {
      this.cartProduct.orderProduct.attributes.push({
        [attribute_name]: item.value,
      });
    }
    // if an attribute has already been selected, check if attribute name exits,
    //if so replace else add new selected attribute value
    else {
      const found_attribute = this.cartProduct.orderProduct.attributes.find((attribute) => Object.keys(attribute) == attribute_name);
      found_attribute
        ? (found_attribute[attribute_name] = item.value)
        : this.cartProduct.orderProduct.attributes.push({
            [attribute_name]: item.value,
          });
    }
    console.log("orderProduct ", this.cartProduct.orderProduct);
    //this will highlight the attributes
    const all_values = document.querySelectorAll(".text-item");
    all_values.forEach((each_value) => {
      //if another item has its background colored, clear, and set font back to black
      if (each_value.tabIndex != index) {
        each_value.style.backgroundColor = "";
        each_value.style.color = "black";
      }
    });
  }

  checkAmountInCurrency(item) {
    //check currency in prices attribute of product
    const price = item.prices.filter((price) => price.currency.symbol == this.props.currency);
    return price[0];
  }

  closeAttribbute(id) {
    document.querySelector(`#${id}`).style.display = "none";
  }
  addToCart(item) {
    this.cartProduct.product = item;
    //check if attributes of item  matches the original fetched from appollo server
    if (this.cartProduct.product.attributes.length == this.cartProduct.orderProduct.attributes.length) {
      //check if item is already in cart
      if (this.notInCart(this.cartProduct.product.id)) {
        //set initial quantity to 1
        this.cartProduct.orderProduct.qty = 1;
        //populate order item properties
        this.cartProduct.orderProduct.name = this.cartProduct.product.name;
        this.cartProduct.orderProduct.brand = this.cartProduct.product.brand;
        this.cartProduct.orderProduct.price = this.checkAmountInCurrency(this.cartProduct.product).amount;
        this.cartProduct.orderProduct.currency = this.props.currency;
        this.cartProduct.orderProduct.id = this.cartProduct.product.id;
        this.cartProduct.orderProduct.image = this.cartProduct.product.gallery[0];
        //add to cart
        this.props.addItem(this.cartProduct);
        //this renders the header cart logo count value
        this.props.renderQty(this.props.orderItems);
      } else {
        return;
      }
    } else {
      document.querySelector(`#${item.id}`).style.display = "block";
    }
  }
  notInCart(id) {
    const cartOldItem = this.props.cartItems.find((item) => item.id == id);
    const orderOldItem = this.props.orderItems.find((item) => item.id == id);
    if (cartOldItem == undefined && orderOldItem == undefined) {
      return true;
    } else return false;
  }
  render() {
    return (
      <div key={this.props.item.id} className="product-card">
        <Link to={`/products/${this.props.item.id}`}>
          <img src={this.props.item.gallery[0]} alt={this.props.item.name} className="image" />
        </Link>
        <div id={this.props.item.id} className="hidden-attributes">
          <div
            className="close-attribute"
            onClick={() => {
              this.closeAttribbute(this.props.item.id);
            }}
          >
            x
          </div>
          {
            // some attributes are empty
            this.props.item.attributes.length > 0
              ? this.props.item.attributes.map((attribute, index) => {
                  return attribute.type == "text" ? (
                    <div key={index} className="attribute">
                      {[<div className="attribute-name">{attribute.name}</div>].concat(
                        attribute.items.map((item, index) => {
                          return (
                            <div
                              key={item.value}
                              className="text-item"
                              tabIndex={index}
                              onClick={(e) => {
                                e.target.style.backgroundColor = "black";
                                e.target.style.color = "white";
                                this.selectTextAttribute(attribute.name, item, index);
                              }}
                            >
                              {item.value}
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    <div key={index} className="attribute">
                      {[<div className="attribute-name">{attribute.name} </div>].concat(
                        attribute.items.map((item, index) => {
                          return (
                            <div
                              key={item.value}
                              className="color-item"
                              tabIndex={index}
                              style={{ backgroundColor: item.value }}
                              onClick={(e) => {
                                e.target.style.border = "2px solid #83BD77";
                                this.selectColorAttribute(attribute.name, item, index);
                              }}
                            ></div>
                          );
                        })
                      )}{" "}
                    </div>
                  );
                })
              : ""
          }
        </div>
        <div>
          <strong>{this.props.item.name}</strong>
        </div>
        <div>
          <strong>Price: </strong> {this.props.currency}
          {this.checkAmountInCurrency(this.props.item).amount}
        </div>
        <div
          className="add-to-cart-button"
          onClick={(e) => {
            this.addToCart(this.props.item);
          }}
        >
          <img src="/cart_image.png" alt="add-to-cart-button" />
        </div>
        {this.props.item.inStock ? "" : <div className="out_of_stock">OUT OF STOCK</div>}
      </div>
    );
  }
}
class All extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultName: "all",
    };
  }
  render() {
    return this.props.tabName == "all" ? (
      <div className="all-products">
        {this.props.current.products.map((item) => {
          return (
            <Product
              item={item}
              currency={this.props.currency}
              orderItems={this.props.orderItems}
              cartItems={this.props.cartItems}
              addItem={this.props.addItem}
              renderQty={this.props.renderQty}
            />
          );
        })}
      </div>
    ) : (
      null
    );
  }
}
class Tech extends Component {
  
  render() {
    return this.props.tabName == "tech" ? (
      <div className="all-products">
        {this.props.current.products.map((item) => {
          return (
            <Product
              item={item}
              currency={this.props.currency}
              orderItems={this.props.orderItems}
              cartItems={this.props.cartItems}
              addItem={this.props.addItem}
              renderQty={this.props.renderQty}
            />
          );
        })}
      </div>
    ) : (
      null
    );
  }
}
class Clothes extends Component {

  render() {
    return this.props.tabName == "clothes" ? (
      <div className="all-products">
        {this.props.current.products.map((item) => {
          return (
            <Product
              item={item}
              currency={this.props.currency}
              orderItems={this.props.orderItems}
              cartItems={this.props.cartItems}
              addItem={this.props.addItem}
              renderQty={this.props.renderQty}
            />
          );
        })}
      </div>
    ) : (
      null
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
  //search for category name entered in search field
  findCategory(term) {
    //found category array is returned
    const category = this.props.allCategories.categories.filter((category) => {
      return category.name == term;
    });
    if (category.length > 0) {
      this.props.updateCategory(category[0]);
    } else {
      this.props.updateCategory(this.props.allCategories.categories[0]);
    }
  }
  //dispatch here to prevent the default state's value from being sent over to the dispatch function
  //that way we only send over what we enter
  componentDidUpdate(prevProps, prevState) {
    if (prevState.value != this.state.value) {
      this.findCategory(this.state.value);
    }
  }
  render() {
    return <input className="category-search" placeholder="Category Name" value={this.state.value} onChange={this.handleChange}></input>;
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
const mapStateToProps2 = (state) => {
  return {
    category_state: state.dataState,
    currency: state.currencyState.currency,
    cartItems: state.cart.items,
    orderItems: state.cart.orderItems,
  };
};
const headerComponet = connect(mapStateToProps1, actionCreators);
const mainComponet = connect(mapStateToProps2, actionCreators);
export const WrappedHeader = headerComponet(Header);
export const WrappedMain = mainComponet(Main);
