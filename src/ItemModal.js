import React from 'react';
import { Modal, Button, Label } from 'semantic-ui-react';

import stylesheet from './css/ItemModal.module.css';

class ItemModal extends React.Component {

  renderTags = () => {
    let ret = []
    this.props.tags.forEach((tag, i) => {
      if (!tag.hidden) {
        ret.push(
          <Label key={i} as='a' href={`?tags=${tag.name}`} content={tag.name} basic color='blue' />
        );
      }
    });
    return ret;
  }

  render() {
    return(
      <Modal open={this.props.open} closeIcon onClose={this.props.closeFunc}>
        <Modal.Header>{this.props.title}</Modal.Header>
        <Modal.Content scrolling>
          <div className={stylesheet.content}>
            <div>
              <h4>Description</h4>
              <p>DECRIPTION HERE</p>
              <h4>Tags</h4>
                {this.renderTags()}
              <h4>View</h4>
              <Button as='a' href={this.props.mazeNotepadUrl} target='_blank' primary>Open in Maze Notepad</Button>
            </div>
            <img src={this.props.image} alt='Preview' />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
};

export default ItemModal;