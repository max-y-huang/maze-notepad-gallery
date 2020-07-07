import React from 'react';
import { Header, Modal, Icon, Button, Table, Label, Input, Loader } from 'semantic-ui-react';
import axios from 'axios';
import queryString from 'query-string';

import stylesheet from './css/App.module.css';
import itemImage__placeholder from './imgs/item__placeholder.png';

import urls from './utils/urls';

class App extends React.Component {

  searchBarValue = '';

  constructor(props) {
    super(props);
    this.state = {
      itemData: [],
      totalItemCount: 0,
      pagesLoaded: 0,
      loadingPage: false
    };
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
        loadingPage: false
      }));
    });
  }

  componentDidMount() {
    this.loadNextPage();
  }

  renderItems = () => {
    if (this.state.loadingPage) {
      return (
        <Loader active size='massive' />
      );
    }
    if (this.state.itemData.length === 0) {
      return (
        <p>No mazes found.</p>
      );
    }

    return this.state.itemData.map((item, i) => {
      let mazeNotepadUrl = `${urls.mazeNotepadJs}?maze=${item['maze-file-name']}`;
      let imageUrl       = `${urls.s3Bucket}/images/${item['image-file-name']}`;
      return (
        <Item
          key={i}
          title={item['name']}
          mazeNotepadUrl={mazeNotepadUrl}
          imageUrl={imageUrl}
          tags={item['tags']}
        />
      );
    });
  }

  renderMoreItemsButton = () => {
    if (this.state.loadingPage) {
      return null;
    }
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
        <Header>Search</Header>
        <div className={stylesheet.wrapper__search}>
          <Input
            onChange={this.searchBarOnChange}
            onKeyUp={this.searchBarOnKeyUp}
            action={{ icon: 'search', primary: true, onClick: this.clickFunc }}
            defaultValue={this.getUrlData()['tags']}
            placeholder='Search by name and tags...'
            fluid
          />
        </div>
        <Header>Results</Header>
        <div className={stylesheet.wrapper__results}>
          <div className={stylesheet.wrapper__results__items}>
            {this.renderItems()}
          </div>
          {this.renderMoreItemsButton()}
        </div>
      </div>
    );
  }
}

class Item extends React.Component {

  state = {
    modalOpen: false,
    image: null,
  };

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  setImage = () => {
    axios.get(this.props.imageUrl).then(res => {
      if (res.status && res.status === 200) {
        this.setState({ image: this.props.imageUrl });
      }
      else {
        this.setState({ image: itemImage__placeholder });
      }
    }).catch(err => {
      this.setState({ image: itemImage__placeholder });
    });
  }

  getImage = () => {
    if (!this.state.image) {
      return (
        <Loader active />
      );
    }
    return this.state.image;
  }

  componentDidMount() {
    this.setImage();
  }

  renderThumbnail = () => {
    if (!this.state.image) {
      return (
        <Loader active />
      );
    }
    return (
      <img src={this.state.image} alt='Thumbnail' />
    );
  }

  renderTags = () => {
    let ret = []
    this.props.tags.forEach((tag, i) => {
      if (!tag.hidden) {
        ret.push(
          <Label key={i} as='a' href={`?tags=${tag.name}`} content={tag.name} basic />
        );
      }
    });
    return ret;
  }

  render() {

    return (
      <>
        <div className={stylesheet.itemCard}>
          <div className={stylesheet.itemCard__image} onClick={() => this.openModal()}>
            <div>
              {this.renderThumbnail()}
            </div>
          </div>
          <Header className={stylesheet.itemCard__header} onClick={() => this.openModal()}>
            {this.props.title}
          </Header>
        </div>
        <Modal open={this.state.modalOpen}>
          <Modal.Header>{this.props.title}</Modal.Header>
          <Modal.Content scrolling>
            <Table celled definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Tag(s)</Table.Cell>
                  <Table.Cell>
                    {this.renderTags()}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Button as='a' href={this.props.mazeNotepadUrl} target='_blank' primary fluid>Open in Maze Notepad</Button>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => this.closeModal()}>
              <Icon name='close' /> Close
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  };
}

export default App;
