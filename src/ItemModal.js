import React from 'react';
import { Modal, Button, Label } from 'semantic-ui-react';

import stylesheet from './css/ItemModal.module.css';

class ItemModal extends React.Component {

  renderTags = () => {
    let ret = []
    this.props.tags.forEach((tag, i) => {
      if (!tag.hidden) {
        ret.push(
          <Label key={i} as='a' className={stylesheet.content__tag} href={`?tags=${tag.name}`} content={tag.name} basic color='blue' />
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
              <p>{this.props.description ? this.props.description : 'No description.'}</p>
              <h4>Creator</h4>
              <p>{this.props.creator ? this.props.creator : 'Anonymous'}</p>
              <h4>Tags</h4>
              <p className={stylesheet.content__tag__wrapper}>{this.renderTags()}</p>
              <h4>View</h4>
              <p><Button as='a' href={this.props.mazeNotepadUrl} target='_blank' primary>Open in Maze Notepad</Button></p>
            </div>
            <div>
              <img src={this.props.image} alt='Preview' />
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
};

export default ItemModal;