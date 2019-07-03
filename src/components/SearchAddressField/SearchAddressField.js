import React, { Component } from 'react';

import placeSearch from '../../lib/mapquest/place-search'
import '../../lib/mapquest/place-search.css'

const API_KEY = 'UVYdA0BrYk4WtCC6qtGRseGaJ6qLsgyE'

class SearchAddressField extends Component {
    static defaultProps = {
        id: 'place-search-input',
        placeholder: 'Search address...',
    }

    componentDidMount() {
        this.searchField = placeSearch({
            key: API_KEY,
            container: document.querySelector(`#${this.props.id}`),
        })

        this.searchField.on('change', this.props.onChange)
    }

    render() {
        return (
            <input
                className={this.props.className}
                defaultValue={this.props.defaultValue}
                id={this.props.id}
                placeholder={this.props.placeholder}
                type="search"
            />
        );
    }
}

export default SearchAddressField