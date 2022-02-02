// simulate getting products from DataBase
import React from 'react';
import axios from 'axios';
import { Card, Accordion, Button, Row, Col, Image, Input } from
'react-bootstrap';


const products = [
    { name: "Apples", country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbage", country: "USA", cost: 1, instock: 8 },
  ];
  
  const products2 = [
    { name2: "Apples", country2: "Spain", cost2: 4, instock2: 3 },
    { name2: "Oranges", country2: "Spain", cost2: 4, instock2: 3 },
    { name2: "Beans", country2: "USA", cost2: 2, instock2: 5 },
    { name2: "Cabbage", country2: "USA", cost2: 1, instock2: 8 },
  ];
  
  //=========Cart=============
  const Cart = (props) => {
    
    let data = props.location.data ? props.location.data : products;
  
    console.log(`data:${JSON.stringify(data)}`);
  
    return <Accordion defaultActiveKey="0">{list}</Accordion>;
  };
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
    console.log(`useDataApi called`);
    useEffect(() => {
      console.log("useEffect Called");
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          console.log("FETCH FROM URl");
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  const Products = (props) => {
    const [items, setItems] = React.useState(products);
    const [item2, setItem2] = React.useState(products2);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    
    //  Fetch Data
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("http://localhost:1337/products");
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "http://localhost:1337/products",
      {
        data: [],
      }
    );
    console.log(`Rendering Products ${JSON.stringify(data)}`);
    // Fetch Data
    const addToCart = (e) => {
      let name = e.target.name;
      let item = items.filter((item) => item.name === name);
      //>if the item is not instock do nothing
      if (item[0].instock === 0) return;
      //> otherwise
      item[0].instock = item[0].instock - 1;
      console.log(`add to Cart ${JSON.stringify(item)}`);
      setCart([...cart, ...item]);
      //doFetch(query);
    };
    const deleteCartItem = (delIndex) => {
      // this is the index in the cart not in the Product List
      let newCart = cart.filter((item, i) => delIndex = i);
      let target = cart.filter((item, index) => delIndex === index);
      let newItems = items.map((item, index) => {
        if (item.name === target[0].name) item.instock = item.instock + 1;
        return item;
      });
      setCart(newCart);
      setItems(newItems);
    };
  //> gets the images from stock. add to database.
  
    const photos = [
      "../components/images/apple.png",
      "../components/images/orange.png",
      "../components/images/beans.png",
      "../components/images/cabbage.png",
    ];
  
    let list = items.map((item, index) => {
      // let n = index + 1049;
      // let url = "https://picsum.photos/id/" + n + "/50/50";
  
  //< modified the items into bootstrap card
  
      return (
        <>
          <div key={index} className="card">
            <Image className="card-img-top" src={photos[index % 4]}></Image>
            <div className="card-body">
              <h4 className="card-title">{item.name} </h4>
              <h6>Origin: {item.country} </h6>
              <h4>Price: ${item.cost}</h4>
              <h6>
                Availabe: <span>{item.instock} </span>
              </h6>
              <Button
                variant="secondary"
                name={item.name}
                stock={item.instock}
                type="submit"
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </>
      );
    });
  
    //< boot strap card for the second product list
    //> gets random images from web link, should be from strapi database as new product list
    let list2 = items.map((item2, index) => {
      let n = index + 867;
      let url = "https://picsum.photos/" + n
  
      return (
        <>
          <div key={index} className="card">
            <Image className="card-img-top" src={url}></Image>
            <div className="card-body">
              <h4 className="card-title">{item2.name2} </h4>
              <h6>Origin: {item2.country2} </h6>
              <h4>Price: ${item2.cost2}</h4>
              <h6>
                Availabe: <span>{item2.instock2} </span>
              </h6>
              <Button
                variant="secondary"
                name={item2.name2}
                stock={item2.instock2}
                type="submit"
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </>
      );
    });
  
    let cartList = cart.map((item, index) => {
      return (
        <Card key={index} className="shoppingCart">
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
              {item.name}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse
            onClick={() => deleteCartItem(index)}
            eventKey={1 + index}
          >
            <Card.Body>
              $ {item.cost} from {item.country}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    });
  
    let finalList = () => {
      let total = checkOut();
      let final = cart.map((item, index) => {
        return (
          <div key={index} index={index}>
            {item.name}
          </div>
        );
      });
      return { final, total };
    };
    const reset = () => {};
  
    const checkOut = () => {
      let costs = cart.map((item) => item.cost);
      const reducer = (accum, current) => accum + current;
      let newTotal = costs.reduce(reducer, 0);
      console.log(`total updated to ${newTotal}`);
      return newTotal;
    };
  
    // TODO: implement the restockProducts function
    const restockProducts = (url) => {
      doFetch(url);
      let newItem = data.map((item) => {
        let { name, country, cost, instock } = item;
        return { name, country, cost, instock };
      });
      setItems([...item, ...newItem]);
    };
  
    return (
      <div className="display">
        <Row>
          <Col>
            <h1 style={{ color: "red" }}>ON SALE NOW</h1>
            <ul style={{ listStyleType: "none" }}>{list2}</ul>
          </Col>
          <Col>
            <h1>Product List</h1>
            <ul style={{ listStyleType: "none" }}>{list}</ul>
          </Col>
          <Col>
            <h1>Shopping Cart</h1>
            <Accordion>{cartList}</Accordion>
          </Col>
          <Col>
            <h1>CheckOut </h1>
            <Button
              className="checkOut"
              variant="secondary"
              onClick={checkOut}
              onSubmit={() => setTotal(0)}
            >
              CheckOut $ {finalList().total}
            </Button>
            <div> {finalList().total > 0 && finalList().final} </div>
          </Col>
        </Row>
  
        <Row>
          <form
            onSubmit={(event) => {
              restockProducts(`http://localhost:1337/${query}`);
              console.log(`Restock called on ${query}`);
              event.preventDefault();
              console.log("🎈 data fetched from Strapi");
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">ReStock Products</button>
          </form>
        </Row>
      </div>
    );
  };

  export default Products;
