import {PureComponent} from "react";

class ListItem extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        qty: 1,
        //mouse enter return cart item id
        cartItem_id: 0,
        max_slide: 0,
        slide_count: 0,
      };
      this.prevSlide = this.prevSlide.bind(this);
      this.nextSlide = this.nextSlide.bind(this);
      this.increment = this.increment.bind(this);
      this.decrement = this.decrement.bind(this);
      this.setState_id = this.setState_id.bind(this);
      this.selectTextAttribute = this.selectTextAttribute.bind(this);
      this.selectColorAttribute = this.selectColorAttribute.bind(this);
    }
    prevSlide(e) {
      if (this.state.slide_count != 0) {
        this.setState({ slide_count: this.state.slide_count - 1 });
      }
    }
    nextSlide(e) {
      if (this.state.max_slide != this.state.slide_count) {
        this.setState({ slide_count: this.state.slide_count + 1 });
      }
    }
    increment(id) {
      this.props.orderItems.map((item) => {
        if (item.id == id) {
          item.qty += 1;
          this.setState({ qty: item.qty });
        }
        return item;
      });
      this.props.reRender();
      this.props.renderQty(this.props.orderItems);
    }
    decrement(id) {
      this.props.orderItems.map((item) => {
        if (item.id == id) {
          if (item.qty > 1) {
            item.qty -= 1;
            this.setState({ qty: item.qty });
          }
        }
        return item;
      });
      this.props.reRender();
      this.props.renderQty(this.props.orderItems);
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
          const found_attribute = order_item.attributes.find((attribute) => Object.keys(attribute) == attribute_name);
          found_attribute[attribute_name] = item.value;
        }
        return order_item;
      });
      const all_values = document.querySelectorAll(".color-item");
      all_values.forEach((each_value) => {
        //if another item has its border colored, clear
        if (each_value.tabIndex != index) {
          each_value.style.border = "";
        }
      });
    }
    selectTextAttribute(attribute_name, item, index) {
      // iterate over all order items
      this.props.orderItems.map((order_item) => {
        //check if cart-item's id is same with order-items id
        if (this.state.cartItem_id == order_item.id) {
          //find attribute name and replace value
          const found_attribute = order_item.attributes.find((attribute) => Object.keys(attribute) == attribute_name);
          found_attribute[attribute_name] = item.value;
        }
        return order_item;
      });
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
    componentDidMount() {
      this.setState({ max_slide: this.props.item.gallery.length - 1 });
    }
    render() {
      return (
        <div
          key={this.props.item.id}
          className="cart-item"
          onMouseEnter={(e) => {
            this.setState_id(this.props.item.id)
          }}>
          <div className="details">
            <div className="details-name">
              <strong>{this.props.item.name}</strong>
            </div>
            <div className="details-price">
              {this.props.currency} {(this.props.orderItem.price = this.props.checkAmountInCurrency(this.props.item).amount)}
            </div>
            <div className="attributes">
              {
                // some attributes are empty
                this.props.item.attributes.length > 0
                  ? this.props.item.attributes.map((attribute) => {
                      return attribute.type == "text" ? (
                        <div className="attribute">
                          {[<div className="attribute-name">{attribute.name}</div>].concat(
                            attribute.items.map((item, index) => {
                              return (
                                <div
                                  className="text-item"
                                  key={item.value}
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
                        <div className="attribute">
                          {[<div className="attribute-name">{attribute.name}</div>].concat(
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
                  this.increment(this.props.item.id);
                }}
              >
                +
              </button>
              <div>{this.state.qty}</div>
              <button
                onClick={(e) => {
                  this.decrement(this.props.item.id);
                }}
              >
                -
              </button>
            </div>
            <div className="product-image-div">
              <div className="slides-container">
                {this.props.item.gallery.map((image, index) => {
                  return (
                    <div className="slide">
                      <img src={image} alt={this.props.item.name} style={{ transform: `translateX(${(index - this.state.slide_count) * 100}%)` }} />
                    </div>
                  );
                })}
                <button className="btn btn-prev" onClick={this.prevSlide}>
                  {"<"}
                </button>
                <button className="btn btn-next" onClick={this.nextSlide}>
                  {">"}
                </button>
              </div>
            </div>
            <div
              className="remove-btn"
              onClick={() => {
                this.props.removeItem(this.props.item.id);
              }}
            >
              <div>X</div>
            </div>
          </div>
        </div>
      );
    }
  }
  export default ListItem;