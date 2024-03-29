import React, { Component } from 'react';
import { storeProducts } from './DataFruite';

const ProductContext = React.createContext();


class ProductProvider extends Component {
  state = {
    products: storeProducts,
    detailProduct: false,
    cart: [],
    modelOpen: true,
    modalProduct: storeProducts,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
  };

  componentDidMount() {
    this.setProducts();
  }
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts }
    });
  };

  getItemById = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  handleDetail = id => {
    const product = this.getItemById(id);
    this.setState(() => {
      return { detailProduct: product };
    })
  };

  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItemById(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(() => {
      return {
        product: tempProducts, cart: [...this.state.cart,
          product]
      };
    },
      () => {
        this.addTotals();
      }
    )
  };

  openModal = id => {
    const product = this.getItemById(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true }
    })
  };
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    let product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(() => {
      return {
        cart: [...tempCart],
      }
    }, () => {
      this.addTotals();
    }
    );
  };
  decrement = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    let product = tempCart[index];
    product.count = product.count - 1;
    product.total = product.count * product.price;

    this.setState(() => {
      return {
        cart: [...tempCart],
      }
    }, () => {
      this.addTotals();
      if (product.count === 0) {
        this.removeItem(id);
      }
    }
    );
  };
  removeItem = (id) => {
    let tempProducts = [...this.state.products]
    let tempCart = [...this.state.cart]

    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(this.getItemById(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts],
      }
    },
      () => {
        this.addTotals(); 
      } 
    ); 
  }; 
  clearCart = () => {
    console.log('clear the cart');
    this.setState(() => {
      return { cart: [] };
    }, () => {
      this.setProducts();
      this.addTotals()
    });
  }
  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total,
      }
    })
  }

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart,
      }}>
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };