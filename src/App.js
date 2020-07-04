import React from 'react';
import { Image, Header, Modal, Icon, Button, Table, Label, Pagination, Input } from 'semantic-ui-react';
import axios from 'axios';
import queryString from 'query-string';

import stylesheet from './css/App.module.css';

import urls from './utils/urls';

class App extends React.Component {

  searchBarValue = '';

  constructor(props) {
    super(props);
    this.state = {
      itemData: null
    };
  }

  searchBarOnChange = (e) => {
    this.searchBarValue = e.target.value;
  }
  searchBarOnKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.searchTags();
    }
  }

  searchTags = () => {
    window.open(`?tags=${this.searchBarValue}`, '_self');
  }

  getData = () => {
    axios.get(`${urls.mazeNotepadApi}/maze/get${window.location.search}`).then(res => {
      this.setState({ itemData: res.data.result });
    });
  }

  componentDidMount() {
    this.getData();
  }

  renderItems = () => {
    if (!this.state.itemData || !this.state.itemData[0]) {
      return (
        <p>No mazes found.</p>
      );
    }

    return this.state.itemData.map((item, i) => {
      let mazeNotepadUrl = `${urls.mazeNotepadJs}?maze=${item['maze-file-name']}`;
      let imageUrl       = `${urls.mazeNotepadApi}/uploads/${item['image-file-name']}`;
      return (
        <Item
          key={i}
          title={item['name']}
          mazeNotepadUrl={mazeNotepadUrl}
          imageUrl={imageUrl}
          tags={item['tags']} />
      );
    });
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
            defaultValue={queryString.parse(window.location.search)['tags']}
            placeholder='Search for tags and creators'
            fluid
          />
        </div>
        <Header>Results</Header>
        <div className={stylesheet.wrapper__results}>
          {this.renderItems()}
        </div>
        <div className={stylesheet.wrapper__pagination}>
          <Pagination defaultActivePage={1} totalPages={10} />
        </div>
      </div>
    );
  }
}

class Item extends React.Component {

  state = {
    modalOpen: false
  };

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  renderTags = () => {
    return this.props.tags.map((tag, i) => {
      return <Label key={i} as='a' href={`?tags=${tag}`} content={tag} basic />
    });
  }

  render() {

    return (
      <>
        <div className={stylesheet.itemCard}>
          <div className={stylesheet.itemCard__image} onClick={() => this.openModal()}>
            <div>
              <img src={this.props.imageUrl} alt='Thumbnail' />
            </div>
          </div>
          <Header className={stylesheet.itemCard__header} onClick={() => this.openModal()}>
            {this.props.title}
          </Header>
        </div>
        <Modal open={this.state.modalOpen}>
          <Modal.Header>{this.props.title}</Modal.Header>
          <Modal.Content scrolling>
            <Image target='_blank' src={this.props.imageUrl} fluid />
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
