import { Component } from "react";
import { connect } from "react-redux";
import { addItem, setCurrency } from "../actions";
import { Link } from "react-router-dom";

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.product = {};
    this.addToCart = this.addToCart.bind(this);
    this.state = {
      des_tag: {},
      image:""
    };
    this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
    this.handleImageClick=this.handleImageClick.bind(this)
  }
  checkAmountInCurrency(item) {
    //check currency in prices attribute of product
    const price = item.prices.filter(
      (price) => price.currency.symbol == this.props.currency
    );
    return price[0];
  }
  handleImageClick(e){
    this.setState({image:e.target.src})
    console.log(this.state.image)
  }
  addToCart = (e) => {
    //check if item is already in cart
    if (this.notInCart(this.product.id)) {
      //dispatch to reducer
      this.props.addItem(this.product);
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
    this.setState({
      des_tag: window.document.getElementsByClassName("description")[0],
      image:this.product.gallery[0]
    });
    
  }
  render() {
    this.id = window.location.pathname.split("/")[2];
    this.product = this.props.products.find((item) => item.id == this.id);
    return (
      <div className="product-container">
        <div className="product-thumbnails">
          {this.product.gallery.map((image) => {
            return <div className="thumbnail-1" >
              <img
                className="product-details-image"
                src={image}
                alt={this.product.name}
                onClick={this.handleImageClick}
              />
            </div>;
          })}
        </div>
        <div className="product">
          <img
            className="product-details-image"
            src={this.state.image}
            alt={this.product.name}
          />
        </div>
        <div className="product-details">
          <div className="product-name">
            <p>
              <strong>{this.product.name}</strong>
            </p>
          </div>
          <div className="attributes">
            {
              // some attributes are empty
              this.product.attributes.length > 0
                ? this.product.attributes.map((attribute) => {
                    return attribute.type == "text" ? (
                      <div className="attribute">
                        {[
                          <div className="attribute-name">
                            {attribute.name}
                          </div>,
                        ].concat(
                          attribute.items.map((item) => {
                            return (
                              <div
                                className="attribute-item"
                                key={item.value}
                                value={item.value}
                              >
                                {item.value}
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div className="attribute">
                        {[
                          <div className="attribute-name">
                            {attribute.name}
                          </div>,
                        ].concat(
                          attribute.items.map((item) => {
                            return (
                              <div
                                className="attribute-item"
                                key={item.value}
                                style={{ backgroundColor: item.value }}
                                value={item.value}
                              ></div>
                            );
                          })
                        )}
                      </div>
                    );
                  })
                : ""
            }
          </div>
          <div className="price">
            <p>
              <strong>PRICE: </strong>
              {this.props.currency}
              {this.checkAmountInCurrency(this.product).amount}
            </p>
          </div>
          <Link to={"/cart"}>
            <button onClick={this.addToCart}>ADD TO CART</button>
          </Link>
          <div className="description">
            {(this.state.des_tag.innerHTML = this.product.description)}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.items,
    products: state.dataState.allCategories.categories[0].products,
    currency: state.currencyState.currency,
  };
};
const actionCreators = {
  addItem,
  setCurrency,
};
export default connect(mapStateToProps, actionCreators)(ProductPage);
