import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
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
              const orderItem=this.props.orderItems.find(orderItem=>orderItem.id==item.id)
              return <ListItem item={item} checkAmountInCurrency={this.checkAmountInCurrency}
              removeItem={this.removeItem}  increment={this.increment} reRender={this.reRender}
               currency={this.props.currency}  orderItem={orderItem}
              decrement={this.decrement} orderItems={this.props.orderItems} renderQty={this.props.renderQty}/>;
            })}
          </div>
        </div>
        <div className="cart-check-out">
          <div>
            <span className="cart-total-row-name">Tax: </span>
            <span className="cart-total-row-value">{this.props.currency}15 </span>
          </div>
          <div>
            <span className="cart-total-row-name">Qty:{
              this.props.orderItems.reduce((total_qty,current_order_item)=>{
                return total_qty+=current_order_item.qty;
              },0)
            }</span>
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
        <div className="overly-checkout">
          <Link to={"/cart"}>
          <button className="view-bag">VIEW BAG</button>
          </Link>
          <button className="overlay-order-btn">CHECK OUT</button>
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
      max_slide:0,
      slide_count:0
    };
    this.prevSlide=this.prevSlide.bind(this)
    this.nextSlide=this.nextSlide.bind(this)
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.setState_id = this.setState_id.bind(this);
    this.selectTextAttribute = this.selectTextAttribute.bind(this);
    this.selectColorAttribute=this.selectColorAttribute.bind(this)
  }
  prevSlide(e){
    if(this.state.slide_count!=0){
      this.setState({slide_count:this.state.slide_count-1})
     } 
     
  }
  nextSlide(e){
   if(this.state.max_slide!=this.state.slide_count){
    this.setState({slide_count:this.state.slide_count+1})
   } 
   
   
  }
  increment(id) {
    this.props.orderItems.map((item) => {
      if (item.id == id) {
        item.qty += 1;
        this.setState({qty:item.qty})
      }
      return item;
    }
    );
    this.props.reRender()
    this.props.renderQty()
  }
  decrement(id) {
    this.props.orderItems.map((item) => {
      if (item.id == id) {
        if (item.qty > 1) {
          item.qty -= 1;
          this.setState({qty:item.qty})
        }
      }
      return item;
    });
    this.props.reRender()
    this.props.renderQty()
  }
  setState_id(item_id) {
    this.setState({ cartItem_id: item_id });
  }

  selectColorAttribute(attribute_name, item, index) {
      //iterate over all order items
      this.props.orderItems.map((order_item) => {
      //check if cart-item's id is same with order-items id
      if (this.state.cartItem_id == order_item.id) {
        //find attribute name and replace value
        const found_attribute=order_item.attributes.find(attribute=>Object.keys(attribute)==attribute_name);
        found_attribute[attribute_name]=item.value;  
       }
       return order_item;
      })
  

    console.log("orderProduct attribute",this.props.orderItems)
    const all_values=document.querySelectorAll(".color-item")
    all_values.forEach(each_value=>{
      //if another item has its border colored, clear
      if(each_value.tabIndex!=index){
        each_value.style.border=""
      }
    })

  }
  selectTextAttribute(attribute_name, item, index) {
      //iterate over all order items
      this.props.orderItems.map((order_item) => {
        //check if cart-item's id is same with order-items id
        if (this.state.cartItem_id == order_item.id) {
          //find attribute name and replace value
          const found_attribute=order_item.attributes.find(attribute=>Object.keys(attribute)==attribute_name);
          found_attribute[attribute_name]=item.value;  
         }
         return order_item;
        })
    
  
      console.log("orderProduct attribute",this.props.orderItems)
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
componentDidMount(){
  this.setState({max_slide:this.props.item.gallery.length-1})
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
            {this.props.currency} {
            this.props.orderItem.price=this.props.checkAmountInCurrency(this.props.item).amount
            }
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
                                  this.selectTextAttribute(attribute.name, item,index);
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
                                  this.selectColorAttribute(attribute.name, item,index);
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
