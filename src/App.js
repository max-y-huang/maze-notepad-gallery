import React from 'react';
import { Image, Header, Modal, Icon, Button, Table, Label, Pagination, Input } from 'semantic-ui-react';

import stylesheet from './css/App.module.css';

class App extends React.Component {
  
  input = '';

  inputFunc = (e, { name, value }) => {
    this.input = value;
  }

  clickFunc = () => {
    alert(JSON.stringify(this.input.split(' ').filter(val => val !== '')));
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <Header>Search</Header>
        <div className={stylesheet.wrapper__search}>
          <Input onChange={this.inputFunc} action={{ icon: 'search', primary: true, onClick: this.clickFunc }} placeholder='Search for tags and creators' fluid />
        </div>
        <Header>Results</Header>
        <div className={stylesheet.wrapper__results}>
          <Item title='Maze 1' />
          <Item title='Maze 2' />
          <Item title='Maze 3' />
          <Item title='Maze 4' />
          <Item title='Maze 5' />
          <Item title='Maze 6' />
          <Item title='Maze 7' />
          <Item title='Maze 8' />
          <Item title='Maze 9' />
          <Item title='Maze 10' />
          <Item title='Maze 11' />
          <Item title='Maze 12' />
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

  render() {

    return (
      <>
        <div className={stylesheet.itemCard} onClick={() => this.openModal()}>
          <div className={stylesheet.itemCard__image}>
            <div>
              <img src='https://picsum.photos/600' alt='Thumbnail' />
            </div>
          </div>
          <Header className={stylesheet.itemCard__header}>
            {this.props.title}
          </Header>
        </div>
        <Modal open={this.state.modalOpen}>
          <Modal.Header>{this.props.title}</Modal.Header>
          <Modal.Content scrolling>
            <Image as ='a' href='https://picsum.photos/600' target='_blank' src='https://picsum.photos/600' fluid />
            <Table celled definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Creator</Table.Cell>
                  <Table.Cell>
                    <a href='/max-y-huang'>max-y-huang</a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Tag(s)</Table.Cell>
                  <Table.Cell>
                    <Label as='a' href='#' content='Tag_1' basic />
                    <Label as='a' href='#' content='Tag_2' basic />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Button as='a' href='https://max-y-huang.github.io/maze-notepad-js' target='_blank' primary fluid>Open in Maze Notepad</Button>
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
