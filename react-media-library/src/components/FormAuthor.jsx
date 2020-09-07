import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { isEmpty } from "lodash";

import { useInput } from ".";
import {
  addAuthorOnServer,
  editAuthorOnServer,
} from "../actions/actions-types";

let initial = "";

export const FormAuthor = ({ ...author }) => {
  const {
    id: currentId,
    name: currentName,
    bio: currentBio,
    shop_name: currentShopName,
    books: currentBooks,
  } = author;

  const dispatch = useDispatch();

  const [books, setBooks] = useState([]);
  const [redirect, setRedirect] = useState(false);

  // Input type text for name
  if (currentName !== undefined) initial = currentName;

  const { value: name, reset: resetName, bind: bindName } = useInput({
    initialValue: initial,
  });

  // Input type text for bio
  if (currentBio !== undefined) initial = currentBio;
  else initial = "";

  const { value: bio, reset: resetBio, bind: bindBio } = useInput({
    initialValue: initial,
  });

  if (currentShopName !== undefined) {
    initial = currentShopName;
  }

  // select for shop name
  if (currentShopName === "fnac") initial = currentShopName;
  else if (currentShopName === "eyrolles") initial = currentShopName;
  else if (currentShopName === "eyrolles") initial = currentShopName;

  const {
    value: shopName,
    reset: resetShopName,
    bind: bindShopName,
  } = useInput({
    initialValue: initial,
  });

  useEffect(() => {
    if (currentBooks !== undefined) setBooks(currentBooks);
  }, []);

  // Input type text for book
  const { value: book, reset: resetBook, bind: bindBook } = useInput({
    initialValue: "",
  });

  // function for add new book on array books
  const addBooks = () => {
    const newBooks = [...books, book];

    setBooks(newBooks);

    resetBook();
  };

  const addAuthor = () => {
    // verify input entries
    entriesVerify();

    if (errors === "") {
      // create random id
      const alea = Math.random().toString();

      // structure the data
      const newAuthor = {
        id: alea,
        name,
        bio,
        shop_name: shopName,
        books: books,
      };

      // reset the value of all input
      resetValue();

      // method post for add a new author on server
      dispatch(addAuthorOnServer(newAuthor));

      // and redirect to home
      setRedirect(true);
    }
  };

  const editAuthor = () => {
    // verify input entries
    entriesVerify();

    if (errors === "") {
      // structure the data
      const editAuthor = {
        id: currentId,
        name,
        bio,
        shop_name: shopName,
        books: books,
      };

      // reset the value of all input
      resetValue();

      // method  for edit an  author on server
      dispatch(editAuthorOnServer(editAuthor, currentId));

      // and redirect to home
      setRedirect(true);
    }
  };

  const [errors, setErrors] = useState("");

  const verify = (value) => {
    if (typeof value !== "string" && value === "") {
      setErrors("entries need to be a string and null value is not allowed");
    }
  };

  const entriesVerify = () => {
    verify(name);
    verify(bio);
    verify(shopName);
    verify(book);
  };

  const resetValue = () => {
    resetName();
    resetBio();
    resetBook();
    setBooks([]);
    resetShopName();
  };

  return (
    <Wrapper>
      {redirect && <Redirect from="/addAuthor" to="/" />}
      <form onSubmit={(e) => e.preventDefault()}>
        {/* start error */}
        {errors !== "" && <p>{errors}</p>}
        {/* end error */}

        {/* input text for name */}
        <label htmlFor="name">name : </label>
        <input type="text" {...bindName} value={name} name="name" />
        {/* end name */}

        {/* input text for bio */}
        <label htmlFor="bio">biography : </label>
        <input type="text" {...bindBio} value={bio} name="bio" />
        {/* end bio */}

        {/* select for shop name */}
        <label htmlFor="shopName">shop name : </label>
        <select {...bindShopName} name="shopName">
          <option value="fnac">fnac</option>

          <option value="eyrolles">eyrolles</option>

          <option value="gibert jeune">gibert jeune</option>
        </select>
        {/* end select */}

        {/* Input and list for book */}
        <div className="overflow">
          <label htmlFor="book">book : </label>
          <input type="text" {...bindBook} value={book} name="book" />
          <button
            className="btn float-right w-25"
            onClick={() => {
              addBooks();
            }}
          >
            add book
          </button>
          {books.length > 0 && (
            <ul className="float-left w-50">
              {books.map((book, i) => {
                return <li key={i}>{book}</li>;
              })}
            </ul>
          )}
        </div>
        {isEmpty(author) ? (
          <button className="btn" onClick={() => addAuthor()}>
            add new author
          </button>
        ) : (
          <button className="btn" onClick={() => editAuthor()}>
            edit author
          </button>
        )}
        {/* end  book */}
      </form>
    </Wrapper>
  );
};

FormAuthor.protoTypes = {
  author: PropTypes.object,
  optionalObjectOf: PropTypes.objectOf(PropTypes.string),
};

const Wrapper = styled.section`
  form {
    width: 90%;
    margin: 4rem auto 2rem auto;
  }
  label,
  li {
    letter-spacing: 0.1rem;
  }

  ul {
    padding: 1rem 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  input,
  select {
    display: block;
    width: 100%;
    padding: 0.5rem 0;
    margin-top: 0.3rem;
    margin-bottom: 1rem;
    border: 2px solid transparent;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
  }
`;
