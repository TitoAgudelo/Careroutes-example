import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"
// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"

import actions from './../../actions'
import { history } from './../../helpers/history'
import Pagination from './../../components/Pagination/Pagination'
import SwitchField from './../../components/SwitchField/SwitchField'
import Modal from './../../components/Modal/Modal'
import Loading from './../../components/Loading/Loading'
import SetShapeOnMapField from '../../components/SetShapeOnMapField/SetShapeOnMapField';

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Restricted.style'
import './RestrictedAreas.scss'

class RestrictedAreasContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      regionId: 0,
      regions: [],
      isActive: true,
      isLoading: true,
      bounds: {
        topLeft: {
          lat: 40.758896,
          lng: -73.985130,
        },
        bottomRight: {
          lat: 48.758896,
          lng: -78.985130,
        }
      },
      isOpen: false,
      submitted: false,
      currentArea: {},
      currentSearch: '',
      restrictedAreas: [],
      restrictedAreasFilter: [],
      errors: { },
      suggestion: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleToggleActive = this.handleToggleActive.bind(this)
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadRegions(loadProps)
    this.props.loadRestrictedAreas(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.area.areas.length !== this.state.restrictedAreas.length) {
      this.setState({
        restrictedAreas: [ ...nextProps.area.areas ],
      })
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: nextProps.region.regions })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({
        currentSearch: nextProps.user.searchField
      })
      this.filterAreas(nextProps.user.searchField)
    }

    if (nextProps.area.sucessAdded && !this.props.area.sucessAdded) {
      this.toggleModal()
    }

    const { isLoading, restrictedAreas, regions } = this.state;
    if (isLoading && restrictedAreas.length && regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetAreas(true)
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
    history.push('/restricted-areas/' + id)
  }

  submitCreateArea = () => {
    console.log('on fire')
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { name, description, regionId, isActive, bounds } = this.state

    if (name && description && regionId > 0 && isActive && bounds ) {
      const formProps = { name: name, isActive: isActive, description: description, regionId: regionId, bounds: bounds }
      this.props.createRestrcitedArea(formProps)
    }
  }

  filterAreas(currentSearch) {
    const { restrictedAreas } = this.state

    let restrictedAreasFilter = []

    restrictedAreasFilter = restrictedAreas.filter(area => {
      return area.name.indexOf(currentSearch.toLowerCase()) !== -1
    })

    this.setState({
      restrictedAreasFilter: restrictedAreasFilter
    })
  }

  render() {
    const { errorMessage } = this.props.area
    const { searchField } = this.props.user
    const { name, description, regionId, regions, isActive, submitted, restrictedAreas, restrictedAreasFilter, isLoading } = this.state

    let data = []

    if (restrictedAreasFilter && restrictedAreasFilter.length > 0) {
      data = [ ...restrictedAreasFilter ]
    } else {
      data = [ ...restrictedAreas ]
    }

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Description <i className="fas fa-angle-down"></i></span>),
        accessor: 'description',
        Cell: props => <span className='description'>{props.value}</span>,
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
      <section className="section-restricted">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-restricted-head">
                  <h1 className="section-restricted-head-title">Restricted Areas</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Restricted Area</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { restrictedAreas.length && regions.length ? (
                  <ReactTable
                    style={tableStyle}
                    getTheadThProps={(state, rowInfo, column) => { return { style: headTableThStyle } }}
                    getTheadTrProps={(state, rowInfo, column) => { return { style: headTableTrStyle } }}
                    getTheadProps={(state, rowInfo, column) => { return { style: headTableStyle } }}
                    getTdProps={(state, rowInfo, column) => { return { style: bodyTableTdStyle } }}
                    getTrGroupProps={(state, rowInfo, column, instance) => { return {
                      style: bodyTrGroupStyle,
                      onClick: (e) => {
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

                {regions && regions.length > 0 && <Modal title="Add New Restricted Area" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateArea} onSubmit={this.handleSubmit}>
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
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Description</label>
                      </div>
                      <div className="care-form-group-item">
                        <textarea type="text" placeholder="Enter" className="care-form-group-item-field" name="description" value={description} onChange={this.handleChange} required></textarea>
                        {submitted && !description &&
                          <div className="help-block">Description is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Region</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={regionId} name="regionId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a region</option>
                          { regions && regions.length > 0 ? (
                              regions.map(region => {
                                return (
                                  <option key={ region.id } value={ region.id }>{ region.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Regions</option>
                            )
                          }
                        </select>
                        {submitted && (!regionId || regionId === '0') &&
                          <div className="help-block">Region is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Bounds</label>
                      </div>
                      <div className="care-form-group-item">
                        <SetShapeOnMapField />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <SwitchField label="Active" id="activeToggle" onAction={this.handleToggleActive} isChecked={isActive ? isActive : false} />
                    </div>
                  </form>
                </Modal> }
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

RestrictedAreasContainer.propTypes = {
  loadRestrictedAreas: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  area: state.area,
  region: state.region,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(RestrictedAreasContainer))
