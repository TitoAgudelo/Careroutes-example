import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"

import actions from './../../../actions'
import { history } from './../../../helpers/history'
import Pagination from './../../../components/Pagination/Pagination'
import SwitchField from './../../../components/SwitchField/SwitchField'
import Modal from './../../../components/Modal/Modal'
import Loading from './../../../components/Loading/Loading'

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Capacities.style'
import './Capacities.scss'

class CapacitiesContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      isActive: true,
      isLoading: true,
      isOpen: false,
      submitted: false,
      currentCapacity: {},
      currentSearch: '',
      capacities: [],
      capacitiesFilter: [],
      errors: { },
      suggestion: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleToggleActive = this.handleToggleActive.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadVehiclesCapacities(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.capacity.capacities.length !== this.props.capacity.capacities.length) {
      this.setState({
        capacities: [ ...nextProps.capacity.capacities ],
        isLoading: false,
      })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({
        currentSearch: nextProps.user.searchField
      })
      this.filterCapacities(nextProps.user.searchField)
    }

    if (nextProps.capacity.sucessAdded && !this.props.capacity.sucessAdded) {
      this.toggleModal()
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetVehiclesCapacities(true)
    this.props.setSearchField('')
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('')
      this.props.errorMessage('')
    }

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  goToDetail(id) {
    history.push('/vehicle-capacities/' + id)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  goBack() {
    history.push('/vehicles/')
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { name, isActive } = this.state

    if (name && isActive) {
      const formProps = { name: name, isActive: isActive }
      this.props.createVehicleCapacity(formProps)
    }
  }

  filterCapacities(currentSearch) {
    const { capacities } = this.state

    let capacitiesFilter = []

    capacitiesFilter = capacities.filter(area => {
      return area.name.indexOf(currentSearch.toLowerCase()) !== -1
    })

    this.setState({
      capacitiesFilter
    })
  }

  render() {
    const { errorMessage } = this.props.capacity
    const { searchField } = this.props.user
    const { name, isActive, submitted, capacities, capacitiesFilter, isLoading } = this.state

    let data = []

    if (capacitiesFilter && capacitiesFilter.length > 0) {
      data = [ ...capacitiesFilter ]
    } else {
      data = [ ...capacities ]
    }

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Active <i className="fas fa-angle-down"></i></span>),
        accessor: 'isActive',
        Cell: props => <span className='active'>{props.value ? 'Active' : 'Inactive'}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-capacities">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <span className="model-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                </div>
                <div className="section-capacities-head">
                  <h1 className="section-capacities-head-title">Vehicle Capacities</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Vehicle Capacity</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { capacities.length > 0 ? (
                  <ReactTable
                    style={tableStyle}
                    getTheadThProps={() => { return { style: headTableThStyle } }}
                    getTheadTrProps={() => { return { style: headTableTrStyle } }}
                    getTheadProps={() => { return { style: headTableStyle } }}
                    getTdProps={() => { return { style: bodyTableTdStyle } }}
                    getTrGroupProps={(state, rowInfo, column, instance) => { return {
                      style: bodyTrGroupStyle,
                      onClick: () => {
                        const id = rowInfo.original.id || null
                        if (id) { this.goToDetail(id) }
                      }
                    } }}
                    PaginationComponent={Pagination}
                    data={data}
                    columns={columns}
                    defaultPageSize={5}
                    pageSize={data.length > 7 ? 7 : data.length}
                    showPageSizeOptions={false}
                    showPageJump={true}
                  />
                ) : null }

                <Modal title="Add New Capacity" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateCapacity} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Name</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="name" value={name} onChange={this.handleChange} required />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <SwitchField label="Active" id="activeToggle" onAction={this.handleToggleActive} isChecked={isActive ? isActive : false} />
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

CapacitiesContainer.propTypes = {
  loadVehiclesCapacities: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  capacity: state.capacity,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(CapacitiesContainer))
