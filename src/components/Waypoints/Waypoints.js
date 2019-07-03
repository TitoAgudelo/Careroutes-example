import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import { connect } from 'react-redux';

import actions from './../../actions';

import './Waypoints.scss';


const reorder = (list, startIndex, endIndex) => {
  const [first, ...result] = Array.from(list);
  const [last] = result.splice(result.length - 1 , 1);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return [first, ...result, last];
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 16,
  margin: `0 0 8px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

class Waypoints extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waypoints: props.waypoints,
      routeId: props.routeId
    };

    this.setDate = this.setDate.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.removeRider = this.removeRider.bind(this);
  }

  setDate(date) {
    const resultDate = moment(date).format('LT');
    return resultDate;
  }

  onDragEnd(result) {
    console.log(result);
    if (!result.destination) {
      return;
    }

    const {
      source: { index: sourceIndex },
      destination: { index: destinationIndex },
    } = result;
    const { waypoints, routeId } = this.state;
    const waypoint = waypoints[sourceIndex + 1];

    this.props.moveWaypoint(waypoint.id, destinationIndex + 1, routeId);

    const items = reorder(
      waypoints,
      sourceIndex,
      destinationIndex,
    );

    this.setState({
      waypoints: items
    });
  }

  removeRider(riderId, routeId) {
    this.props.removeRider(riderId, routeId)
  }

  render() {
    const { waypoints, routeId } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              className="waypoints"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <ul className="waypoints-list">
                {waypoints.map((way, index) => {
                  if (index === 0 || index === waypoints.length - 1) {
                    return (
                      <li className="waypoints-list-item" key={way.id}>
                        <div className="waypoints-list-item-wrapper">
                          <span className="waypoints-list-item-type">{way.type === 'stopover' ? 'stop' : way.type }</span>
                          <span className="waypoints-list-item-time">{this.setDate(way.estimatedTimeWindow.start)}</span>
                          <span className="waypoints-list-item-location">{way.location.addressLine1}</span>
                          {(way.type !== 'start' && way.type !== 'end') && <span className="waypoints-list-item-drag"><i className="fas fa-arrows-alt-v"></i></span>
                          }
                        </div>
                        {way.actions.length > 0 && (<ul className="waypoints-actions">
                          {way.actions.map(action => {
                            return (
                                <li className="waypoints-actions-item" key={action.id}>
                                  <div className="waypoints-actions-wrapper">
                                    <span className="waypoints-actions-item-type" style={{backgroundColor: action.type === 'pickup' ? '#BAFFB7' : '#FFB7B7' }}>{action.type}</span>
                                    <span className="waypoints-actions-item-name">{action.trip.client.name}</span>
                                    <span className="waypoints-actions-item-place">{action.place.title}</span>
                                    <span className="waypoints-actions-item-bask">
                                      <i className="fas fa-trash-alt"></i>
                                    </span>
                                  </div>
                                </li>
                              )
                            })
                          }
                        </ul>
                        )}
                      </li>
                    );
                  }

                  return (
                    <Draggable key={way.id} draggableId={way.id} index={index-1}>
                      {(provided, snapshot) => (
                        <li
                          className="waypoints-list-item"
                          key={way.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div className="waypoints-list-item-wrapper">
                            <span className="waypoints-list-item-type">{way.type === 'stopover' ? 'stop' : way.type }</span>
                            <span className="waypoints-list-item-time">{this.setDate(way.estimatedTimeWindow.start)}</span>
                            <span className="waypoints-list-item-location">{way.location.addressLine1}</span>
                            {(way.type !== 'start' && way.type !== 'end') && <span className="waypoints-list-item-drag"><i className="fas fa-arrows-alt-v"></i></span>
                            }
                          </div>
                          {way.actions.length > 0 && (<ul className="waypoints-actions">
                            {way.actions.map(action => {
                              return (
                                  <li className="waypoints-actions-item" key={action.id}>
                                    <div className="waypoints-actions-wrapper">
                                      <span className="waypoints-actions-item-type" style={{backgroundColor: action.type === 'pickup' ? '#BAFFB7' : '#FFB7B7' }}>{action.type}</span>
                                      <span className="waypoints-actions-item-name">{action.trip.client.name}</span>
                                      <span className="waypoints-actions-item-place">{action.place.title}</span>
                                      <span className="waypoints-actions-item-bask">
                                        <i className="fas fa-trash-alt" onClick={() => this.removeRider(action.rideId, routeId)}></i>
                                      </span>
                                    </div>
                                  </li>
                                )
                              })
                            }
                          </ul>
                          )}
                        </li>
                      )}
                    </Draggable>
                  )
                })}
              </ul>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

const mapStateToProps = (state) => ({
  route: state.route,
})

export default connect(mapStateToProps, actions)(Waypoints);
