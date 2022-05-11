import { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SearchCategoryName from "./search";
import AllTabPage from "../tabcomponents/allTabPage";
import TechTabPage from "../tabcomponents/techTabPage";
import ClothesPage from "../tabcomponents/clothesTabPage";
import { fetchData, setCurrency, addItem } from "../actions";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import ClothesTabPage from "../tabcomponents/clothesTabPage";


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultCategory: {},
      current: {},
      loading: true,
      searching: false,
      techCategory: {},
      clothesCategory: {},
      testTab: "",
    };
    this.updateCurrentCategory = this.updateCurrentCategory.bind(this);
    this.findTechCategory = this.findTechCategory.bind(this);
    this.findClothesCategory = this.findClothesCategory.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.defaultCategory != this.state.defaultCategory) {
      this.findClothesCategory("clothes");
      this.findTechCategory("tech");
    }
  }
  findTechCategory(term) {
    //found category array is returned
    const category = this.state.defaultCategory.categories.filter((category) => {
      return category.name == term;
    });
    this.setState({ techCategory: category[0] });
  }
  findClothesCategory(term) {
    //found category array is returned
    const category = this.state.defaultCategory.categories.filter((category) => {
      return category.name == term;
    });
    this.setState({ clothesCategory: category[0] });
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
    this.props.showTab("all");
  }
  render() {
    console.log(this.state.current);
    return this.state.loading ? (
      <p>Loading...</p>
    ) : (
      <div className="container">
        <SearchCategoryName allCategories={this.state.defaultCategory} updateCategory={this.updateCurrentCategory} />
        <AllTabPage
          current={this.state.current}
          currency={this.props.currency}
          orderItems={this.props.orderItems}
          cartItems={this.props.cartItems}
          addItem={this.props.addItem}
          renderQty={this.props.renderQty}
          tabName={this.props.tabName}
        />
        <TechTabPage
          current={this.state.techCategory}
          currency={this.props.currency}
          orderItems={this.props.orderItems}
          cartItems={this.props.cartItems}
          addItem={this.props.addItem}
          renderQty={this.props.renderQty}
          tabName={this.props.tabName}
        />
        <ClothesTabPage
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
const actionCreators = {
  fetchData,
  setCurrency,
  addItem,
};

const mapStateToProps2 = (state) => {
  return {
    category_state: state.dataState,
    currency: state.currencyState.currency,
    cartItems: state.cart.items,
    orderItems: state.cart.orderItems,
  };
};
const mainComponet = connect(mapStateToProps2, actionCreators);
export const WrappedMain = mainComponet(Main);
