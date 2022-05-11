import {PureComponent} from "react";
import Product from "../components/product";

class AllTabPage extends PureComponent {
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
  export default AllTabPage;