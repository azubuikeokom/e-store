import { Component } from "react";
import { connect } from "react-redux";
import { removeItem, setCurrency } from "../actions";

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.reRender=this.reRender.bind(this)
    this.removeItem = this.removeItem.bind(this);
    this.checkAmountInCurrency = this.checkAmountInCurrency.bind(this);
    this.totalCost = this.totalCost.bind(this);
    
  }
  reRender(){
    this.setState({})
  }
  checkAmountInCurrency(item) {
    //check currency in prices attribute of product
    const price = item.prices.filter(
      (price) => price.currency.symbol == this.props.currency
    );
    
    return price[0];

  }

  
  totalCost(total, currentItem) {
    return total += currentItem.price * currentItem.qty
  }
  removeItem(id) {
    this.props.removeItem(id);
  }
  render() {
    console.log("global cart items", this.props.cartItems);
    console.log("order items", this.props.orderItems);
    
    return (
      <div className="cart-page">
        <h1>CART</h1>
        <div className="cart-container">
          <div className="cart-list">
            {this.props.cartItems.map((item) => {
              return <ListItem item={item} checkAmountInCurrency={this.checkAmountInCurrency}
              removeItem={this.removeItem}  increment={this.increment} reRender={this.reRender}
              decrement={this.decrement} orderItems={this.props.orderItems}/>;
            })}
          </div>
        </div>
        <div className="cart-check-out">
          <div>
            <span className="cart-total-row-name">Tax: </span>
            <span className="cart-total-row-value">{this.props.currency} </span>
          </div>
          <div>
            <span className="cart-total-row-name">Qty:</span>
            <span className="cart-total-row-value"></span>
          </div>
          <div>
            <span className="cart-total-row-name">Total: </span>
            <span className="cart-total-row-value">
              {this.props.currency}
              {this.props.orderItems.reduce(this.totalCost, 0)}
            </span>
          </div>
          <button className="order-btn">ORDER</button>
        </div>
      </div>
    );
  }
}
class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: 1,
      //mouse enter return cart item id
      cartItem_id: 0,
      slide_count:0
    };
    this.prevSlide=this.prevSlide.bind(this)
    this.nextSlide=this.nextSlide.bind(this)
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.selectAttribute = this.selectAttribute.bind(this);
    this.setState_id = this.setState_id.bind(this);
  }
  prevSlide(e){
    
   this.setState({slide_count:this.state.slide_count-1})
  }
  nextSlide(e){
   this.setState({slide_count:this.state.slide_count+1})
   
  }
  increment(id) {
    this.props.orderItems.map((item) => {
      if (item.id == id) {
        item.qty += 1;
        this.setState({qty:item.qty})
        console.log(item.qty);
      }
    });
    this.props.reRender()
  }
  decrement(id) {
    this.props.orderItems.map((item) => {
      if (item.id == id) {
        if (item.qty > 1) {
          item.qty -= 1;
          this.setState({qty:item.qty})
          console.log(item.qty);
        }
      }
    });
    this.props.reRender()
  }
  setState_id(item_id) {
    this.setState({ cartItem_id: item_id });
  }
  selectAttribute(attribute_name, item) {
    //iterate over all order items
    this.props.orderItems.map((order_item) => {
      //check if cart-item's id is same with order-items id
      if (this.state.cartItem_id == order_item.id) {
        order_item.attributes.map((attrib) => {
          if (attribute_name in attrib) {
            attrib[attribute_name] = item.value;
          }
        });
      }
      return order_item;
    });
  }

  render() {
    return (
      <div
        key={this.props.item.id}
        className="cart-item"
        onMouseEnter={(e) => {
          this.setState_id(this.props.item.id);
        }}>
        <div className="details">
          <div className="details-name">
            <strong>{this.props.item.name}</strong>
          </div>
          <div className="details-price">
            {this.props.currency} {this.props.checkAmountInCurrency(this.props.item).amount}
          </div>
          <div className="attributes">
            {
              // some attributes are empty
              this.props.item.attributes.length > 0
                ? this.props.item.attributes.map((attribute) => {
                    return attribute.type == "text" ? (
                      <div className="attribute">
                        {[
                          <div className="attribute-name">{attribute.name}</div>
                        ].concat(attribute.items.map((item, index) => {
                            return (
                              <div
                                className="text-item"
                                key={item.value}
                                tabIndex={index}
                                onClick={(e) => {
                                  this.selectAttribute(attribute.name, item);
                                }}>{item.value}</div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div className="attribute">{[
                          <div className="attribute-name">{attribute.name}</div>]
                          .concat(attribute.items.map((item, index) => {
                            return (
                              <div
                                key={item.value}
                                className="color-item"
                                tabIndex={index}
                                style={{ backgroundColor: item.value }}
                                onClick={(e) => {
                                  this.selectAttribute(attribute.name, item);
                                }}></div>
                            );
                          })
                        )}
                      </div>
                    );
                  })
                : ""
            }
          </div>
        </div>
        <div className="product-image-qty">
          <div className="product-qty">
            <button
              onClick={(e) => {
                this.increment(this.props.item.id) }}>+</button>
            <div>{this.state.qty}</div>
            <button onClick={(e) => { this.decrement(this.props.item.id) }}>-</button>
          </div>
          <div className="product-image-div">
            <div className="slides-container">
              {
              this.props.item.gallery.map((image,index)=>{
                return(<div className="slide" >
                    <img src={image} alt={this.props.item.name} style={{transform:`translateX(${(index-this.state.slide_count)*100}%)`}} />
                </div>)
              })
              }
              <button className="btn btn-prev" onClick={this.prevSlide}>{"<"}</button>
              <button className="btn btn-next" onClick={this.nextSlide}>{">"}</button>
            </div>
          </div>
          <div className="remove-btn" onClick={() => {this.props.removeItem(this.props.item.id)}}>
            <div>X</div>
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
    currency: state.currencyState.currency,
  };
};
const actionCreators = {
  removeItem,
  setCurrency,
};

export default connect(mapStateToProps, actionCreators)(CartPage);
