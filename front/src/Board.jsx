import React, { useEffect, useRef, useState } from "react";
import Muuri from "muuri";
import confetti from "canvas-confetti";
import "./styles.css";

const Board = () => {
  const muuriRef = useRef(null);
  const [netflixOrderIndex, setNetflixOrderIndex] = useState(0);
  const [netflixButtonText, setNetflixButtonText] = useState("Netflix");
  const [currentColors, setCurrentColors] = useState([]);
  const [predictions, setPredictions] = useState({
    drama: 0,
    action: 0,
    thriller: 0,
  });
  const [classPrediction, setClassPrediction] = useState(" ");
  const [classificationClicked, setClassificationClicked] = useState(false);
  const [regressionClicked, setRegressionClicked] = useState(false);

  const netflixOrders = [
    {
      order: [
        "orange",
        "green",
        "violet",
        "red",
        "yellow",
        "blue",
        "white",
        "pink",
      ],
      name: "Classic Detective Story",
    },
    {
      order: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "violet",
        "pink",
        "white",
      ],
      name: "The Rainbow Order",
    },
    {
      order: [
        "green",
        "violet",
        "red",
        "orange",
        "yellow",
        "blue",
        "white",
        "pink",
      ],
      name: "Orange Is the New Black",
    },
    {
      order: [
        "pink",
        "violet",
        "green",
        "yellow",
        "orange",
        "blue",
        "white",
        "red",
      ],
      name: "The Usual Suspects",
    },
  ];

  useEffect(() => {
    const dragContainer = document.querySelector(".drag-container");
    const itemContainers = [].slice.call(
      document.querySelectorAll(".board-column-content")
    );
    const columnGrids = [];
    let boardGrid;

    if (!dragContainer || itemContainers.length === 0) {
      console.error("Drag container or item containers are missing.");
      return;
    }

    itemContainers.forEach((container) => {
      const grid = new Muuri(container, {
        items: ".board-item",
        dragEnabled: true,
        dragSort: () => columnGrids,
        dragContainer: dragContainer,
        dragAutoScroll: {
          targets: (item) => [
            { element: window, priority: 0 },
            { element: item.getGrid().getElement().parentNode, priority: 1 },
          ],
        },
      })

        .on("dragInit", (item) => {
          const element = item.getElement();
          element.style.width = `${item.getWidth()}px`;
          element.style.height = `${item.getHeight()}px`;
        })
        .on("dragReleaseEnd", (item) => {
          const element = item.getElement();
          element.style.width = "";
          element.style.height = "";
          item.getGrid().refreshItems([item]);
        })

        .on("layoutStart", () => {
          boardGrid.refreshItems().layout();
        });

      columnGrids.push(grid);
    });

    boardGrid = new Muuri(".board", {
      dragEnabled: true,
      dragHandle: ".board-column-header",
    });

    muuriRef.current = columnGrids[0];
    updateCurrentColors();
  }, []);

  const updateCurrentColors = () => {
    if (!muuriRef.current) return;
    const grid = muuriRef.current;
    const items = grid.getItems();
    const colors = items.map((item) => item.getElement().id);
    setCurrentColors(colors);
    return colors ;
  };

  const shuffleItems = () => {
    if (!muuriRef.current) return;

    const grid = muuriRef.current;

    setNetflixButtonText("Netflix");

    const items = grid.getItems();
    const shuffled = items
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);

    grid.sort(shuffled);
    updateCurrentColors();
  };

  const sortChronological = () => {
    if (!muuriRef.current) return;

    const grid = muuriRef.current;

    setNetflixButtonText("Netflix");

    const order = [
      "violet",
      "green",
      "yellow",
      "orange",
      "blue",
      "white",
      "red",
      "pink",
    ];

    grid.sort((itemA, itemB) => {
      const idA = itemA.getElement().id;
      const idB = itemB.getElement().id;
      return order.indexOf(idA) - order.indexOf(idB);
    });
    updateCurrentColors();
  };

  const netflixSort = () => {
    const nextIndex = (netflixOrderIndex + 1) % netflixOrders.length;
    setNetflixOrderIndex(nextIndex);
    setNetflixButtonText(`Netflix: ${netflixOrders[nextIndex].name}`);
    sortItems(netflixOrders[nextIndex].order);
  };

  const sortItems = (order) => {
    if (!muuriRef.current) return;

    const grid = muuriRef.current;

    grid.sort((itemA, itemB) => {
      const idA = itemA.getElement().id;
      const idB = itemB.getElement().id;
      return order.indexOf(idA) - order.indexOf(idB);
    });
    updateCurrentColors();
  };

  const handleRegression = async () => {
    var color = updateCurrentColors();
    setClassificationClicked(false);
    setRegressionClicked(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    try {
      const response = await fetch("http://localhost:8000/save-regression", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: color }),
      });

      if (!response.ok) {
        throw new Error("Failed to process order");
      }

      const data = await response.json();
      console.log("Server Response:", data);

      setPredictions(data.prediction);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order");
    }
  };

  const handleClassification = async () => {
    var color = updateCurrentColors();
    setRegressionClicked(false);
    setClassificationClicked(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    try {
      const response = await fetch(
        "http://localhost:8000/save-classification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order: color }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process order");
      }

      const data = await response.json();
      console.log("Server Response:", data);

      const label = data.prediction[0];
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
      setClassPrediction(capitalizedLabel);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order");
    }
  };

  return (
    <div>
      <div className="drag-container"></div>

      <div className="board">
        <div className="board-column todo">
          <div className="board-column-container">
            <div className="board-column-header">Select your order</div>
            <div className="board-column-content-wrapper">
              <div className="board-column-content">
                <div id="yellow" className="board-item">
                  <div className="board-item-content">
                    <span>Yellow</span>
                  </div>
                </div>
                <div id="green" className="board-item">
                  <div className="board-item-content">
                    <span>Green</span>
                  </div>
                </div>
                <div id="blue" className="board-item">
                  <div className="board-item-content">
                    <span>Blue</span>
                  </div>
                </div>
                <div id="orange" className="board-item">
                  <div className="board-item-content">
                    <span>Orange</span>
                  </div>
                </div>
                <div id="violet" className="board-item">
                  <div className="board-item-content">
                    <span>Violet</span>
                  </div>
                </div>
                <div id="red" className="board-item">
                  <div className="board-item-content">
                    <span>Red</span>
                  </div>
                </div>
                <div id="pink" className="board-item">
                  <div className="board-item-content">
                    <span>Pink</span>
                  </div>
                </div>
                <div id="white" className="board-item">
                  <div className="board-item-content">
                    <span>White</span>
                  </div>
                </div>
              </div>

              <div className="button-container">
                <p>Some suggested orders </p>
                <div className="button-row">
                  <button className="random-button" onClick={shuffleItems}>
                    Random
                  </button>
                  <button className="sort-button" onClick={sortChronological}>
                    Chronological
                  </button>
                  <button className="netflix-button" onClick={netflixSort}>
                    {netflixButtonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-buttons-container">
        <button
          className="btn-classification"
          onClick={handleClassification}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Classification
        </button>
        <button
          className="btn-prediction"
          onClick={handleRegression}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Regression
        </button>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Corresponding Colors
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {regressionClicked ? (
              <div className="percentage-container">
                {(() => {
                  const { drama, action, thriller } = predictions;
                  const percentages = { drama, action, thriller };

                  const capitalize = (str) =>
                    str.charAt(0).toUpperCase() + str.slice(1);

                  const maxKey = Object.keys(percentages).reduce((a, b) =>
                    percentages[a] > percentages[b] ? a : b
                  );
                  const otherKeys = Object.keys(percentages).filter(
                    (key) => key !== maxKey
                  );
                  const orderedKeys = [otherKeys[0], maxKey, otherKeys[1]];

                  return orderedKeys.map((key) => (
                    <div
                      key={key}
                      className={`percentage-circle ${
                        key === maxKey ? "large" : "small"
                      }`}
                    >
                      {capitalize(key)}: {percentages[key]}
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <></>
            )}

            {classificationClicked ? (
              <div className="percentage-container">
                {(() => {
                  return (
                    <div className={`percentage-circle large`}>
                      {classPrediction}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <></>
            )}

            <div className="modal-body hearts-container">
              {currentColors.map((color, index) => (
                <div key={index}>
                  {color === "yellow"
                    ? "💛"
                    : color === "green"
                    ? "💚"
                    : color === "blue"
                    ? "💙"
                    : color === "orange"
                    ? "🧡"
                    : color === "violet"
                    ? "💜"
                    : color === "red"
                    ? "❤️"
                    : color === "pink"
                    ? "🩷"
                    : "🤍"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
