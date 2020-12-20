import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';

class ProfilePic extends Component {

    constructor(props){
        super(props);
        this.state={
            visible :false,
            imagesArray: [props.pic1,props.pic2,props.pic3,props.pic4]
        };
    };

    showModal = () => {
        this.setState(
        {visible: true,});
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };


    render(){
        const imageMapper = this.state.imagesArray.map((image,index) => {
            return (
                <img src={image} alt="Preview"
                onClick={() => this.props.handleImageChange(image,index)}/>
            )
        })
    return (
        <div className="ProfilePic">
            <Button type="primary" onClick={this.showModal} disabled={this.props.disabled}>
                Pic Avatar if no gravatar
            </Button>
            <Modal
                title="Profile Pic Avatar"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                {imageMapper}
            </Modal>{" "}
        </div>
    );
    }
}

export default ProfilePic;