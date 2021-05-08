import React from 'react';
import { Header, Loader } from 'semantic-ui-react';
import ItemModal from './ItemModal';
import axios from 'axios';

import stylesheet from './css/Thumbnail.module.css';

import itemImage__placeholder from './imgs/item__placeholder.png';

class Thumbnail extends React.Component {

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

  render() {

    return (
      <>
        <div className={stylesheet.wrapper} onClick={() => this.openModal()}>
          <div className={stylesheet.wrapper__image}>
            <div>
              {this.renderThumbnail()}
            </div>
          </div>
          <Header as='h4' className={stylesheet.wrapper__header}>
            {this.props.title}
          </Header>
        </div>
        <ItemModal
          open={this.state.modalOpen}
          closeFunc={this.closeModal}
          title={this.props.title}
          mazeNotepadUrl={this.props.mazeNotepadUrl}
          image={this.state.image}
          tags={this.props.tags}
        />
      </>
    );
  };
}

export default Thumbnail;