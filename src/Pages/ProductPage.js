import { Component } from "react";
import { connect } from "react-redux";
import { addItem, setCurrency } from "../actions";
import { Link } from "react-router-dom";

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      des_tag: {},
      image: "",
      attributes_no: 0,
    };
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
    this.id = window.location.pathname.split("/")[2];
    this.cartProduct.product = this.props.products.find((item) => item.id == this.id);
    this.addToCart = this.addToCart.bind(this);
    this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.selectTextAttribute = this.selectTextAttribute.bind(this);
    this.selectColorAttribute=this.selectColorAttribute.bind(this);
    this.getAttributesCount = this.getAttributesCount.bind(this);

  }
  getAttributesCount() {
    this.setState({
      attributes_no: this.cartProduct.product.attributes.length,
    });
  }
  selectColorAttribute(attribute_name, item, index) {
    // if no attribute has been selected
    if(this.cartProduct.orderProduct.attributes.length==0){
      this.cartProduct.orderProduct.attributes.push({[attribute_name]: item.value});
    } 
    // if an attribute has already been selected, check if attribute name exits,
    //if so replace else add new selected attribute value
   else{
      const found_attribute=this.cartProduct.orderProduct.attributes.find(attribute=>Object.keys(attribute)==attribute_name);
      found_attribute ? found_attribute[attribute_name]=item.value:
      this.cartProduct.orderProduct.attributes.push({[attribute_name]: item.value});

    }
    console.log("orderProduct attribute",this.cartProduct.orderProduct.attributes)
    const all_values=document.querySelectorAll(".color-item")
    all_values.forEach(each_value=>{
      //if another item has its border colored, clear
      if(each_value.tabIndex!=index){
        each_value.style.border=""
      }
    })

  }
  selectTextAttribute(attribute_name, item, index) {
      // if no attribute has been selected
    if(this.cartProduct.orderProduct.attributes.length==0){
      this.cartProduct.orderProduct.attributes.push({[attribute_name]: item.value});
    } 
    // if an attribute has already been selected, check if attribute name exits,
    //if so replace else add new selected attribute value
   else{
      const found_attribute=this.cartProduct.orderProduct.attributes.find(attribute=>Object.keys(attribute)==attribute_name);
      found_attribute ? found_attribute[attribute_name]=item.value:
      this.cartProduct.orderProduct.attributes.push({[attribute_name]: item.value});

    }
    console.log("orderProduct attribute",this.cartProduct.orderProduct.attributes)
    //this will highlight the attributes
    const all_values=document.querySelectorAll(".text-item")
    all_values.forEach(each_value=>{
      //if another item has its background colored, clear, and set font back to black
      if(each_value.tabIndex!=index){
        each_value.style.backgroundColor=""
        each_value.style.color="black" 
      }
    })

  }

  checkAmountInCurrency(item) {
    //check currency in prices attribute of product
    const price = item.prices.filter(
      (price) => price.currency.symbol == this.props.currency
    );
    return price[0];
  }
  handleImageClick(e) {
    this.setState({ image: e.target.src });
  }
  addToCart = (e) => {
    if(this.cartProduct.product.attributes.length ==this.cartProduct.orderProduct.attributes.length){
      if (this.notInCart(this.cartProduct.product.id)) {
        //check if item is already in cart
        //dispatch to reducer
        this.cartProduct.orderProduct.qty=1;
        //populate order item properties
        this.cartProduct.orderProduct.name = this.cartProduct.product.name;
        this.cartProduct.orderProduct.brand = this.cartProduct.product.brand;
        this.cartProduct.orderProduct.price = this.checkAmountInCurrency(this.cartProduct.product).amount;
        this.cartProduct.orderProduct.currency = this.props.currency;
        this.cartProduct.orderProduct.id = this.cartProduct.product.id;
        this.cartProduct.orderProduct.image = this.cartProduct.product.gallery[0];
        //add to cart
        this.props.addItem(this.cartProduct);
        
      } 
      else {
        return;
      }
    }
      
      
  };
  notInCart(id) {
    const cartOldItem = this.props.cartItems.find((item) => item.id == id);
    const orderOldItem = this.props.orderItems.find((item) => item.id == id);
    if (cartOldItem == undefined && orderOldItem==undefined) {
      return true;
    } else return false;
  }
  componentDidMount() {
    this.setState({
      des_tag: window.document.getElementsByClassName("description")[0],
      image: this.cartProduct.product.gallery[0],
    });
    this.getAttributesCount();
  }
  render() {
    return (
      <div className="product-container">
        <div className="product-thumbnails">
          {this.cartProduct.product.gallery.map((image, index) => {
            return (
              <div key={index} className="thumbnail-1">
                <img
                  className="product-details-image"
                  src={image}
                  alt={this.cartProduct.product.name}
                  onClick={this.handleImageClick}
                />
              </div>
            );
          })}
        </div>
        <div className="product">
          <img
            className="product-details-image"
            src={this.state.image}
            alt={this.cartProduct.product.name}
          />
        </div>
        <div className="product-details">
          <div className="product-name">
            <p>
              <strong>{this.cartProduct.product.name}</strong>
            </p>
          </div>
          <div className="attributes">
            {
              // some attributes are empty
              this.cartProduct.product.attributes.length > 0
                ? this.cartProduct.product.attributes.map(
                    (attribute, index) => {
                      return attribute.type == "text" ? (
                        <div key={index} className="attribute">
                          {[<div className="attribute-name">{attribute.name}</div>]
                          .concat(attribute.items.map((item, index) => {
                              return (
                                <div className="text-item"key={item.value} tabIndex={index} onClick={(e) => {
                                    e.target.style.backgroundColor="black" 
                                    e.target.style.color="white" 
                                    this.selectTextAttribute(attribute.name, item, index);
                                  }}>{item.value}</div>);
                            })
                          )}</div>)
                         : (<div key={index} className="attribute">
                          {[<div className="attribute-name">{attribute.name} </div>]
                          .concat(
                            attribute.items.map((item, index) => {
                              return (
                                <div
                                  key={item.value}
                                  className="color-item"
                                  tabIndex={index}
                                  style={{ backgroundColor: item.value }}
                                  onClick={(e) => {
                                    e.target.style.border="2px solid #83BD77" 
                                    this.selectColorAttribute(attribute.name, item,index);
                                  }}
                                ></div>
                              );
                            })
                          )}
                        </div>
                      );
                    }
                  )
                : ""
            }
          </div>
          <div className="price">
            <p>
              <strong>PRICE: </strong>
              {this.props.currency}
              {this.checkAmountInCurrency(this.cartProduct.product).amount}
            </p>
          </div>
          <Link to={"/cart"}>
            <button onClick={this.addToCart}>ADD TO CART</button>
          </Link>
          <div className="description">
            {
              
               (this.state.des_tag.innerHTML=this.cartProduct.product.description)
            }
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.items,
    orderItems: state.cart.orderItems,
    products: state.dataState.allCategories.categories[0].products,
    currency: state.currencyState.currency,
  };
};
const actionCreators = {
  addItem,
  setCurrency,
};
export default connect(mapStateToProps, actionCreators)(ProductPage);
