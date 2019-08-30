import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Feed from './Feed';

export default class NhsFeed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            pagination: {
                page: 1,
                per_page: 5,
                total_pages: 0,
            },
            filters: {
                job_type: {
                    title: 'Contract Type',
                    isSet: false,
                    options: {},
                },
                job_staff_group: {
                    title: 'Sector',
                    isSet: false,
                    options: {},
                },
                job_employer: {
                    title: 'Employer',
                    isSet: false,
                    options: {},
                },
            },
            items: [],
            feed: [],
        };

        this.onFiltersChange = this.onFiltersChange.bind(this);
    }

    fetchJson(url, options) {
        let headers = { 'Content-Type': 'application/json' };
        if (options && options.headers) {
            headers = {...options.headers, headers};

            delete options.headers;
        }

        return fetch(url, Object.assign({
            credentials: 'same-origin',
            headers: headers,
        }, options))
            .then(this.checkStatus)
            .then((response) => (
                response.text()
                    .then((text) => (text ? JSON.parse(text) : ''))
            ));
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 400) {
            return response;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error
    }

    componentDidMount() {
        this.fetchJson(this.props.feed.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: 'action=' + this.props.feed.action + '&_wpnonce=' + this.props.feed.nonce.custom_nonce + '&feed=' + this.props.feed.feed,
        }).then((json) => {
            const feed = json.vacancy_details;

            const filters = this.setFilterOptions(feed),
                { pagination } = this.state,
                { vacancies, total_pages } = this.paginate(feed, pagination.page, pagination.per_page);

            pagination.total_pages = total_pages;
            this.setState({
                loaded: true,
                pagination: pagination,
                filters: filters,
                items: vacancies,
                feed: feed,
            });
        }).catch((e) => {
            console.log(e);
        });
    }

    setFilterOptions(feed) {
        let filters = this.state.filters;

        // formData = new FormData(event.target.form);

        Object.entries(filters).map(([name, filter]) => {
            let options = filter.options;

            // Object.entries(options).map(([key, option]) => (
            //     options[key] = formData.getAll(name).includes(key)
            // ));

            // set all options to false
            feed.map((item) => {
                options[item[name]] = {
                    checked: false,
                    show: true,
                };
            });

            const ordered = {};
            Object.keys(options).sort().forEach(function(key) {
                ordered[key] = options[key];
            });

            filters[name].options = ordered;
        });

        return filters;
    }

    paginate(items, page, per_page) {
        const total_pages = Math.ceil(items.length / per_page),
            offset = (page - 1) * per_page;
        return {
            total_pages: total_pages,
            vacancies: items.slice(offset).slice(0, per_page),
        };
    }

    onFiltersChange(name, option, value) {
        let filtersChanged = false,
            { filters, pagination, feed } = this.state;

        // filter or paginate
        if (name === 'pagination') {
            pagination[option] = value;
        } else {
            filtersChanged = true;
            filters[name]['options'][option].checked = value;
            filters[name]['isSet'] = Object.entries(filters[name].options).reduce((set, optionMeta) => {
                const [value, checked] = optionMeta;
                return set || checked.checked;
            }, false);
        }

        // are any filters set?
        const isSet = Object.entries(filters).reduce((set, filterMeta) => {
            const [filterName, filter] = filterMeta;
            return set || filter.isSet;
        }, false);

        const filteredVacancies = isSet ? feed.filter((item) => {
            let found = null;
            found = Object.entries(filters).reduce((found, filterMeta) => {
                const [filterName, filter] = filterMeta;
                if(!filter.isSet) {
                    return found;
                }
                const inFilter = Object.entries(filter.options).reduce((found, optionMeta) => {
                    const [value, checked] = optionMeta;
                    return found || (checked.checked && item[filterName] === value);
                }, false);
                return found === null ? inFilter : found && inFilter;
            }, found);
            return found;
        }) : feed;

        // paginate results / reset pages when filters change
        if(filtersChanged){
            pagination.page = 1;
        }
        const { vacancies, total_pages } = this.paginate(filteredVacancies, pagination.page, pagination.per_page);
        pagination.total_pages = total_pages;

        // set everything
        this.setState({
            pagination: pagination,
            filters: filters,
            items: vacancies,
        });
    }

    render() {
        // render empty before feed is loaded for the spinner to show
        if(!this.state.loaded) {
            return null;
        } else {
            return (
                <Feed
                    {...this.state}
                    onFiltersChange={this.onFiltersChange}
                />
            );
        }
    }
}

NhsFeed.propTypes = {
    feed: PropTypes.object.isRequired,
};
