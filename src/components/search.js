import {PureComponent} from "react";

class SearchCategoryName extends PureComponent {
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
  export default SearchCategoryName;