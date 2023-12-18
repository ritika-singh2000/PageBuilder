// PageBuilder.js

import React, { useState, useEffect } from "react";
import "./PageBuilder.css";

const Sidebar = ({ onDragStart }) => {
  return (
    <div className="sidebar">
      <div
        className="sidebar-item"
        draggable
        onDragStart={(e) => onDragStart(e, "label")}
      >
        Label
      </div>
      <div
        className="sidebar-item"
        draggable
        onDragStart={(e) => onDragStart(e, "input")}
      >
        Input
      </div>
      <div
        className="sidebar-item"
        draggable
        onDragStart={(e) => onDragStart(e, "button")}
      >
        Button
      </div>
    </div>
  );
};

const Page = ({
  components,
  onDrop,
  onDragOver,
  onElementClick,
  selectedElementIndex,
}) => {
  return (
    <div className="page" onDrop={onDrop} onDragOver={onDragOver}>
      {components.map((component, index) => (
        <div
          key={index}
          className={`page-item ${
            index === selectedElementIndex ? "selected" : ""
          }`}
          onClick={() => onElementClick(index)}
        >
          {component}
        </div>
      ))}
    </div>
  );
};

const ConfigurationModal = ({
  configurations,
  modalVisible,
  onClose,
  onSaveChanges,
  onInputChange,
}) => {
  return (
    modalVisible && (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-heading ">
            <h2>Edit Configuration </h2>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <label className="label-content">
            <div>Name</div>
            <input
              className="config-val"
              type="text"
              name="name"
              placeholder="This is a label"
              value={configurations.name}
              onChange={onInputChange}
            />
          </label>
          <label className="label-content">
            <div>X</div>
            <input
              className="config-val"
              type="text"
              name="x"
              value={configurations.x}
              onChange={onInputChange}
            />
          </label>
          <label className="label-content">
            <div>Y</div>
            <input
              className="config-val"
              type="text"
              name="y"
              value={configurations.y}
              onChange={onInputChange}
            />
          </label>
          <label className="label-content">
            <div>Font Size</div>
            <input
              className="config-val"
              type="text"
              name="fontSize"
              value={configurations.fontSize}
              onChange={onInputChange}
            />
          </label>
          <label className="label-content">
            <div>Font Weight</div>
            <input
              className="config-val"
              type="text"
              name="fontWeight"
              value={configurations.fontWeight}
              onChange={onInputChange}
            />
          </label>
          <button className="save-btn" onClick={onSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    )
  );
};

const PageBuilder = () => {
  const [components, setComponents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [configurations, setConfigurations] = useState({
    name: "",
    fontSize: "16px",
    fontWeight: "normal",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // Load configurations from local storage on component mount
    const savedConfigurations = JSON.parse(
      localStorage.getItem("configurations")
    );
    if (savedConfigurations) {
      setConfigurations(savedConfigurations);
    }
  }, []);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("text/plain", type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    let component;

    switch (type) {
      case "label":
        component = <label key={components.length}>Label</label>;
        break;
      case "input":
        component = (
          <input key={components.length} type="text" placeholder="Input" />
        );
        break;
      case "button":
        component = <button key={components.length}>Button</button>;
        break;
      default:
        return;
    }

    setModalVisible(true);
    setConfigurations({
      name: "",
      fontSize: "16px",
      fontWeight: "normal",
      x: e.clientX,
      y: e.clientY,
    });
    setComponents([...components, component]);
    setSelectedElementIndex(components.length);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleElementClick = (index) => {
    setSelectedElementIndex(index);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSaveChanges = () => {
    setComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];
      const updatedComponent = React.cloneElement(
        updatedComponents[selectedElementIndex],
        {
          style: {
            position: "absolute",
            left: configurations.x + "px",
            top: configurations.y + "px",
            fontSize: configurations.fontSize,
            fontWeight: configurations.fontWeight,
          },
        }
      );

      updatedComponents[selectedElementIndex] = updatedComponent;

      // Save configurations to local storage
      localStorage.setItem("configurations", JSON.stringify(configurations));

      return updatedComponents;
    });

    setModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfigurations({
      ...configurations,
      [name]: value,
    });
  };

  return (
    <div className="page-builder">
      <Sidebar onDragStart={handleDragStart} />
      <Page
        components={components}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onElementClick={handleElementClick}
        selectedElementIndex={selectedElementIndex}
      />
      <ConfigurationModal
        configurations={configurations}
        modalVisible={modalVisible}
        onClose={handleModalClose}
        onSaveChanges={handleSaveChanges}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default PageBuilder;
