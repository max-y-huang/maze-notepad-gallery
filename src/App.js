import React from 'react';
import { Header, Button, Input, Loader } from 'semantic-ui-react';
import Thumbnail from './Thumbnail';
import axios from 'axios';
import queryString from 'query-string';

import stylesheet from './css/App.module.css';
import logo from './imgs/logo192.png';

import urls from './utils/urls';

class App extends React.Component {

  searchBarValue = '';

  constructor(props) {
    super(props);
    this.state = {
      itemData: [],
      totalItemCount: 0,
      pagesLoaded: 0,
      loadingPage: false,
      requestLoadNextPageScrollFlag: 0
    };
    this.resultsRef = React.createRef();
    this.loadNextPage__scrollOffset = 0;
    this.itemsPerPage = 20;
    this.searchBarValue = this.getUrlData()['tags'];
  }

  getUrlData = () => {
    return queryString.parse(window.location.search);
  }

  searchBarOnChange = (e) => {
    this.searchBarValue = e.target.value;
  }
  searchBarOnKeyUp = (e) => {
    if (e.keyCode === 13) {  // Enter key pressed.
      e.preventDefault();
      this.searchTags();
    }
  }

  searchTags = () => {
    window.open(`?tags=${this.searchBarValue ? this.searchBarValue : ''}`, '_self');
  }

  loadNextPage = () => {
    // Keep track of scroll location to preserve scroll.
    this.loadNextPage__scrollOffset = this.resultsRef.current.scrollTop;
    this.setState({ loadingPage: true });

    let urlData = queryString.stringify({
      ...this.getUrlData(),
      ...{
        'page': this.state.pagesLoaded + 1,
        'page-size': this.itemsPerPage
      }
    });
    axios.get(`${urls.mazeNotepadApi}/maze/get?${urlData}`).then(res => {
      this.setState((state) => ({
        itemData: [ ...state.itemData, ...res.data['result']['items'] ],
        totalItemCount: res.data['result']['total-count'],
        pagesLoaded: state.pagesLoaded + 1,
        loadingPage: false,
        requestLoadNextPageScrollFlag: Date.now()
      }));
    });
  }

  componentDidMount() {
    this.loadNextPage();
  }

  componentDidUpdate(prevProps, prevState) {
    // Scroll to previous spot after loadNextPage() is called.
    // Preserves scroll when loading new page.
    if (prevState.requestLoadNextPageScrollFlag !== this.state.requestLoadNextPageScrollFlag) {
      this.resultsRef.current.scrollTo(0, this.loadNextPage__scrollOffset);
    }
  }

  renderBody = () => {
    if (this.state.loadingPage) {
      return (
        <Loader active size='massive' />
      );
    }

    return (
      <>
        <div className={stylesheet.wrapper__body__header}>
          <Header as='h2'>Search results ({this.state.totalItemCount} mazes found):</Header>
        </div>
        <div ref={this.resultsRef} className={stylesheet.wrapper__body__results}>
          <div className={stylesheet.wrapper__body__results__items}>
            {this.renderItems()}
          </div>
          {this.renderMoreItemsButton()}
        </div>
      </>
    );
  }

  renderItems = () => {
    if (this.state.itemData.length === 0) {
      return (
        <p>No mazes found.</p>
      );
    }

    return this.state.itemData.map((item, i) => {
      let mazeNotepadUrl = `${urls.mazeNotepadJs}?maze=${item['maze-file-name']}`;
      let imageUrl       = `${urls.s3Bucket}/images/${item['image-file-name']}`;
      return (
        <Thumbnail
          key={i}
          title={item['name']}
          mazeNotepadUrl={mazeNotepadUrl}
          imageUrl={imageUrl}
          tags={item['tags']}
          description={item['description']}
          creator={item['creator']}
        />
      );
    });
  }

  renderMoreItemsButton = () => {
    if (this.state.totalItemCount <= this.state.pagesLoaded * this.itemsPerPage) {  // Reached the last page.
      return null;
    }
    return (
      <Button content='Show more' onClick={this.loadNextPage} primary fluid />
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__title}>
          <Header as='h1' className={stylesheet.wrapper__title__text}>
            <img src={logo} className={stylesheet.wrapper__title__text__logo} alt='Logo' />
            Maze Gallery
          </Header>
          <div className={stylesheet.wrapper__title__search}>
            <Input
              onChange={this.searchBarOnChange}
              onKeyUp={this.searchBarOnKeyUp}
              action={{ icon: 'search', secondary: true, onClick: this.searchTags }}
              defaultValue={this.getUrlData()['tags']}
              placeholder='Search by name and tags...'
              fluid
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={stylesheet.wrapper__body}>
            {this.renderBody()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
