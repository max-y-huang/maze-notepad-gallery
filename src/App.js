import React from 'react';
import { Image, Header, Modal, Icon, Button, Table, Label } from 'semantic-ui-react';

import stylesheet from './css/App.module.css';

function App() {
  return (
    <div className={stylesheet.wrapper}>
      <Item title='Maze 1' />
      <Item title='Maze 2' />
      <Item title='Maze 3' />
      <Item title='Maze 4' />
      <Item title='Maze 5' />
      <Item title='Maze 6' />
      <Item title='Maze 7' />
      <Item title='Maze 8' />
    </div>
  );
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
          <div className={stylesheet.itemCard__image__wrapper}>
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
                    <a href='#'>max-y-huang</a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Tag(s)</Table.Cell>
                  <Table.Cell>
                    <Label.Group>
                      <Label as='a' href='#' content='Tag_1' />
                      <Label as='a' href='#' content='Tag_2' />
                    </Label.Group>
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
